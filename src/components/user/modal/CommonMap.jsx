// import React, { useEffect, useRef, useState } from "react";

// const CommonMap = ({ markers = [], center, level = 4 }) => {
//   const mapContainer = useRef(null);
//   const [map, setMap] = useState(null);

//   useEffect(() => {
//     if (!window.kakao) return;

//     // 1. 지도 생성
//     const container = mapContainer.current;
//     const options = {
//       center: center ? new window.kakao.maps.LatLng(center.lat, center.lng) : new window.kakao.maps.LatLng(35.8242, 127.1480),
//       level: level,
//     };
//     const kakaoMap = new window.kakao.maps.Map(container, options);
//     setMap(kakaoMap);

//     // 2. 리사이즈 대응
//     const handleResize = () => kakaoMap.relayout();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [center, level]); // center나 level이 바뀌면 지도 재설정

//   // 3. 마커 업데이트 로직 (markers 데이터가 바뀔 때마다 실행)
//   useEffect(() => {
//     if (!map || !markers.length) return;

//     markers.forEach((pos) => {
//       const marker = new window.kakao.maps.Marker({
//         map: map,
//         position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
//         title: pos.title,
//       });

//       // 클릭 이벤트 등 추가 가능
//       if (pos.content) {
//         const infowindow = new window.kakao.maps.InfoWindow({
//           content: `<div style="padding:5px;">${pos.content}</div>`
//         });
//         window.kakao.maps.event.addListener(marker, 'click', () => {
//           infowindow.open(map, marker);
//         });
//       }
//     });
//   }, [map, markers]);

//   return <div ref={mapContainer} className="w-full h-full" />;
// };

// export default CommonMap;


// CommonMap.jsx (예시)
import React, { useEffect, useRef, useState } from "react";

const CommonMap = ({ markers = [], center = null }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao) return;
    const options = {
      center: new window.kakao.maps.LatLng(35.8242, 127.1480),
      level: 4,
    };
    const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
    setMap(kakaoMap);
  }, []);

  // 마커 업데이트
  useEffect(() => {
    if (!map || !markers.length) return;
    markers.forEach((m) => {
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(m.lat, m.lng),
      });
    });
  }, [map, markers]);

  // ★ 추가: 외부에서 center 값이 들어오면 해당 위치로 이동
  useEffect(() => {
    if (!map || !center) return;
    const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
    map.panTo(moveLatLon); // 스무스하게 이동 (그냥 이동은 setCenter)
  }, [map, center]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default CommonMap;

