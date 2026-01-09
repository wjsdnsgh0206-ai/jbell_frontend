import React, { useState } from "react";
import CommonMap from "@/components/user/modal/CommonMap";

const AccidentNews = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  
  // ★ 추가: 현재 지도의 중심 좌표를 관리하는 상태
  const [mapCenter, setMapCenter] = useState({ lat: 35.8242, lng: 127.1480 });

  const accidentData = [
    { id: 1, lat: 35.8242, lng: 127.1480, title: "전주시청 부근 화재", time: "16:10", status: "화재 진압중" },
    { id: 2, lat: 35.8441, lng: 127.1298, title: "전북대 인근 교통사고", time: "15:45", status: "처리중" },
    { id: 3, lat: 35.8175, lng: 127.1105, title: "서신동 사거리 통제", time: "15:20", status: "우회 필요" },
  ];

  // ★ 리스트 클릭 핸들러
  const handleItemClick = (item) => {
    setMapCenter({ lat: item.lat, lng: item.lng });
    // 모바일이면 리스트 닫아주기 (선택사항)
    if (window.innerWidth < 1024) setIsListOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6 lg:h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">
        
        {/* 리스트 영역 */}
        <div className="w-full lg:w-[320px] flex flex-col bg-slate-50 lg:h-full transition-all duration-300">
          <div className="p-4 md:p-5 border-b border-gray-100 bg-white flex-shrink-0">
             <h4 className="text-body-m-bold md:text-body-l-bold text-gray-900 flex items-center justify-between">
              실시간 상황 <span className="text-red-500 bg-red-50 px-2 rounded-full">{accidentData.length}건</span>
            </h4>
          </div>

          <div className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar ${isListOpen ? "max-h-[500px]" : "max-h-0 lg:max-h-none"}`}>
            {accidentData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)} // ★ 클릭 시 이동 함수 실행
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] text-gray-400">2026.01.09 {item.time}</span>
                </div>
                <h5 className="text-[14px] md:text-body-s-bold text-gray-900 group-hover:text-blue-600 font-bold">
                  {item.title}
                </h5>
                <div className="mt-2.5 flex items-center text-[11px] font-bold text-red-600">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 animate-pulse" />
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 min-h-[300px] md:min-h-[400px] lg:min-h-0 relative order-first lg:order-last">
          {/* ★ CommonMap에 markers와 현재 클릭된 center를 같이 전달 */}
          <CommonMap markers={accidentData} center={mapCenter} />
        </div>

      </div>
    </div>
  );
};

export default AccidentNews;