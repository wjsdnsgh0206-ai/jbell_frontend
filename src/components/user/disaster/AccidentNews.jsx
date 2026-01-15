import React, { useState, useEffect, useMemo } from "react";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";
import dayjs from "dayjs";

const AccidentNews = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  
  const JEONJU_CITY_HALL = { lat: 35.8242, lng: 127.1480 };
  const [mapCenter, setMapCenter] = useState(JEONJU_CITY_HALL);
  const [mapLevel, setMapLevel] = useState(8); 
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { eqMarkers, levelMarkers, fetchEarthquakeData, fetchEarthquakeLevel, isLoading } = useEarthquake();

  useEffect(() => {
    fetchEarthquakeData();
    fetchEarthquakeLevel();
  }, [fetchEarthquakeData, fetchEarthquakeLevel]);

  const integratedData = useMemo(() => {
    return [...eqMarkers, ...levelMarkers].sort((a, b) => b.time - a.time);
  }, [eqMarkers, levelMarkers]);

  const handleItemClick = (item) => {
    setMapCenter({ lat: item.lat, lng: item.lng });
    setMapLevel(4); 
    setSelectedMarker(item); 
    if (window.innerWidth < 1024) setIsListOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6 lg:h-full">
      {/* 모바일에서는 flex-col이라 위아래로 쌓임. 
         지도(h-[350px]) + 리스트(flex-1) 구조로 잡아서 하단 박스가 밀리지 않게 함 
      */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">
        
        {/* 지도 영역: 모바일 높이를 350px로 살짝 줄여서 리스트 공간 확보 */}
        <div className="w-full h-[350px] lg:h-full lg:flex-1 relative order-first lg:order-last border-b lg:border-b-0 lg:border-l border-gray-100 flex-shrink-0">
          <CommonMap 
            markers={integratedData} 
            center={mapCenter} 
            level={mapLevel}
            selectedMarker={selectedMarker}
          />
        </div>

        {/* 리스트 영역: 모바일에서 최소 높이 확보 및 내부 스크롤 */}
        <div className="w-full lg:w-[320px] flex flex-col bg-slate-50 min-h-[300px] lg:h-full overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white flex-shrink-0">
             <h4 className="text-body-m-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                최근 특보 상황
                <span className="text-red-500 bg-red-50 px-2.5 py-0.5 text-[11px] rounded-full">
                  {integratedData.length}건
                </span>
              </div>
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="py-10 text-center text-gray-400 text-sm italic">정보 로딩 중...</div>
            ) : integratedData.length > 0 ? (
              integratedData.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className={`bg-white border rounded-xl p-4 shadow-sm transition-all group cursor-pointer active:scale-[0.98] ${
                    selectedMarker === item ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === '지진' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type} 특보
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {dayjs(item.time.substring(0, 8)).format('YY.MM.DD')}
                    </span>
                  </div>
                  <h5 className="text-body-m-bold text-gray-900 group-hover:text-blue-600 mb-1 leading-tight text-sm">
                    {item.title}
                  </h5>
                  <div className="flex items-start gap-1.5 text-gray-500">
                    <span className="text-[12px] break-keep font-medium leading-tight">
                      {item.address}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-400 text-sm">기록된 특보가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccidentNews;