import React, { useEffect, useRef, useState } from "react";

const CommonMap = ({ markers = [] }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!window.kakao) return;
    const initMap = () => {
      const options = {
        center: new window.kakao.maps.LatLng(35.8242, 127.1480), 
        level: 7,
      };
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);
    };
    if (mapContainer.current) initMap();
  }, []);

  useEffect(() => {
    if (!map || !markers) return;

    markersRef.current.forEach((m) => m.setMap(null));
    if (overlayRef.current) overlayRef.current.setMap(null);
    markersRef.current = [];

    if (markers.length === 0) {
      map.setCenter(new window.kakao.maps.LatLng(35.8242, 127.1480));
      return;
    }

    const bounds = new window.kakao.maps.LatLngBounds();

    const newMarkers = markers.map((m) => {
      const position = new window.kakao.maps.LatLng(m.lat, m.lng);
      const marker = new window.kakao.maps.Marker({ position, map });
      
      bounds.extend(position);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (overlayRef.current) overlayRef.current.setMap(null);

        const content = `
          <div style="padding:12px; background:white; border-radius:12px; border:1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width:180px; position:relative; bottom:55px; transform:translateX(-50%); z-index:100;">
            <div style="font-weight:700; font-size:14px; color:#111827; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.title}</div>
            <div style="font-size:11px; color:#6b7280; line-height:1.4; word-break:break-all;">${m.content}</div>
            <div style="position:absolute; bottom:-8px; left:50%; margin-left:-8px; border-top:8px solid white; border-left:8px solid transparent; border-right:8px solid transparent;"></div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          content: content,
          position: position,
          yAnchor: 1 
        });

        overlay.setMap(map);
        overlayRef.current = overlay;
        map.panTo(position); 
      });

      return marker;
    });

    markersRef.current = newMarkers;

    if (markers.length > 0) {
      map.setBounds(bounds);
    }
    
  }, [map, markers]);

  return <div ref={mapContainer} className="w-full h-full min-h-[inherit]" />;
};

export default CommonMap;