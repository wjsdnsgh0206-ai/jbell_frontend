import React, { useEffect, useRef, useState } from "react";

const CommonMap = ({ markers = [], center = null }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]); // 마커들을 관리할 Ref

  // 1. 지도 초기화
  useEffect(() => {
    if (!window.kakao) {
      console.error("카카오 지도 API가 로드되지 않았어.");
      return;
    }

    const initMap = () => {
      const options = {
        center: new window.kakao.maps.LatLng(35.8242, 127.1480), // 기본 위치 (전주시청)
        level: 4,
      };
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);
    };

    // 지도를 담을 컨테이너가 확실히 있을 때 실행
    if (mapContainer.current) {
      initMap();
    }
  }, []);

  // 2. 마커 표시 및 업데이트
  useEffect(() => {
    if (!map || !markers) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 생성
    const newMarkers = markers.map((m) => {
      const position = new window.kakao.maps.LatLng(m.lat, m.lng);
      const marker = new window.kakao.maps.Marker({
        position: position,
        title: m.title,
      });
      marker.setMap(map);
      return marker;
    });

    markersRef.current = newMarkers;
  }, [map, markers]);

  // 3. 외부에서 center 좌표가 들어올 때 부드럽게 이동 (panTo)
  useEffect(() => {
    if (!map || !center) return;

    const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
    map.panTo(moveLatLon);
  }, [map, center]);

  // 4. ★ 모바일에서 지도가 안 보이는 문제 해결 (relayout) ★
  useEffect(() => {
    if (!map) return;

    // 창 크기가 변할 때 지도를 재정렬해줌
    const handleResize = () => {
      map.relayout();
    };

    window.addEventListener("resize", handleResize);

    // 컴포넌트가 마운트된 직후, 컨테이너 크기를 다시 계산하도록 딜레이를 줌
    const timer = setTimeout(() => {
      map.relayout();
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [map]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full min-h-[inherit]" 
      style={{ touchAction: "none" }} // 모바일 터치 간섭 방지
    />
  );
};

export default CommonMap;