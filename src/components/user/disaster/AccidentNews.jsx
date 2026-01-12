import React, { useState } from "react";
import CommonMap from "@/components/user/modal/CommonMap";

const AccidentNews = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 35.8242, lng: 127.1480 });

  const accidentData = [
    { id: 1, lat: 35.8242, lng: 127.1480, title: "전주시청 부근 화재", time: "16:10", status: "화재 진압중" },
    { id: 2, lat: 35.8441, lng: 127.1298, title: "전북대 인근 교통사고", time: "15:45", status: "처리중" },
    { id: 3, lat: 35.8175, lng: 127.1105, title: "서신동 사거리 통제", time: "15:20", status: "우회 필요" },
  ];

  const handleItemClick = (item) => {
    setMapCenter({ lat: item.lat, lng: item.lng });
    // 클릭 시 리스트 접기 (지도를 더 잘 보이게 함)
    if (window.innerWidth < 1024) setIsListOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6 lg:h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">
        
        {/* 1. 지도 영역: 모바일에서 위로 가도록 order-first 유지, 높이값 명시 */}
        {/* <div className="flex-1 min-h-[350px] md:min-h-[450px] lg:min-h-0 relative order-first lg:order-last border-b lg:border-b-0 lg:border-l border-gray-100">
          <CommonMap markers={accidentData} center={mapCenter} />
        </div> */}


{/* 지도 영역: min-h를 반드시 주어야 모바일에서 보임 */}
<div className="flex-1 min-h-[400px] lg:min-h-0 relative order-first lg:order-last border-b lg:border-b-0 lg:border-l border-gray-100">
  <CommonMap markers={accidentData} center={mapCenter} />
</div>


        {/* 2. 리스트 영역 (아코디언 구조) */}
        <div className="w-full lg:w-[320px] flex flex-col bg-slate-50 lg:h-full transition-all duration-300">
          {/* 아코디언 헤더 (클릭 시 열고 닫기) */}
          <div 
            className="p-4 md:p-5 border-b border-gray-100 bg-white flex-shrink-0 cursor-pointer lg:cursor-default"
            onClick={() => setIsListOpen(!isListOpen)}
          >
             <h4 className="text-body-m-bold md:text-body-l-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                실시간 상황 
                <span className="text-red-500 bg-red-50 px-2.5 py-0.5 text-detail-s rounded-full">{accidentData.length}건</span>
              </div>
              {/* 모바일용 화살표 아이콘 */}
              <svg
                className={`w-5 h-5 text-gray-400 lg:hidden transition-transform duration-300 ${isListOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
          </div>

          {/* 아코디언 내용 영역 */}
          <div className={`
            flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar transition-all duration-300
            ${isListOpen ? "max-h-[400px] opacity-100 visible" : "max-h-0 lg:max-h-none opacity-0 lg:opacity-100 invisible lg:visible"}
          `}>
            {accidentData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-blue-400 transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-detail-s md:text-detail:m text-gray-400">2026.01.09 {item.time}</span>
                </div>
                <h5 className="text-body-s md:text-body-m-bold text-gray-900 group-hover:text-blue-600 font-bold">
                  {item.title}
                </h5>
                <div className="mt-2.5 flex items-center text-detail-s md:text-detail-m-body  text-red-600">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 animate-pulse" />
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccidentNews;