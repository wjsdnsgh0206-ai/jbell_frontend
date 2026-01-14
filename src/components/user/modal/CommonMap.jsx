import React, { useState, useEffect } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

const CommonMap = ({ markers = [], center, level, selectedMarker }) => {
  // 현재 열려있는 마커의 고유 ID 저장
  const [openMarkerId, setOpenMarkerId] = useState(null);

  // 리스트에서 항목 선택 시 해당 마커만 열리도록 설정
  useEffect(() => {
    if (selectedMarker) {
      // 위도, 경도, 시간을 조합해서 아주 유니크한 ID 생성
      const markerId = `marker-${selectedMarker.lat}-${selectedMarker.lng}-${selectedMarker.time}`;
      setOpenMarkerId(markerId);
    }
  }, [selectedMarker]);

  return (
    <Map
      center={center || { lat: 35.8242, lng: 127.1480 }}
      level={level || 8}
      style={{ width: "100%", height: "100%" }}
    >
      {markers.map((m, index) => {
        // 각 마커만의 고유 ID
        const markerId = `marker-${m.lat}-${m.lng}-${m.time}`;
        const isOpened = openMarkerId === markerId;

        return (
          <React.Fragment key={markerId}>
            <MapMarker
              position={{ lat: m.lat, lng: m.lng }}
              // 마커 클릭 시 해당 ID만 상태에 저장
              onClick={() => setOpenMarkerId(markerId)}
            />

            {/* 해당 마커의 ID와 openMarkerId가 일치할 때만 띄움 */}
            {isOpened && (
              <CustomOverlayMap 
                position={{ lat: m.lat, lng: m.lng }} 
                // [수정] yAnchor를 1.3 정도로 높여서 마커보다 위로 띄움 (1이 마커 하단 기준)
                yAnchor={1.3} 
                xAnchor={0.5}
              >
                <div className="relative z-50 transition-all duration-200">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xl min-w-[200px]">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-blue-600 truncate pr-2">
                        {m.title}
                      </h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setOpenMarkerId(null); // 닫기 버튼 클릭 시 초기화
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div 
                      className="text-[12px] text-gray-600 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: m.content }}
                    />
                    
                    {/* 말풍선 꼬리 */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
                  </div>
                </div>
              </CustomOverlayMap>
            )}
          </React.Fragment>
        );
      })}
    </Map>
  );
};

export default CommonMap;