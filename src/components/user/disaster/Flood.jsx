import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap"; // 공통 지도 컴포넌트 임포트

const Flood = () => {
  // 홍수 관련 마커 데이터 (예시: 침수 위험 지역이나 수위 관측소 등)
  const floodData = [
    { lat: 35.8400, lng: 127.1200, title: "침수 위험 지역", content: "최근 집중호우 시 침수 발생 구역" },
  ];

  const [activeTab, setActiveTab] = useState("침수흔적도");
  const [facilities, setFacilities] = useState({ 
    shelter: true, 
    hospital: false, 
    pharmacy: false 
  });

  const mapTabs = [
    { id: "침수흔적도", label: "침수흔적도" },
    { id: "수방시설물", label: "수방시설물" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  const floodItems = [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => setActiveTab(prev => (prev === tabId ? null : tabId));
  const handleCheck = (key) => setFacilities(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 홍수정보
            </h3>
            <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-center text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 md:w-[80px]">
              특보없음
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">2026.01.09 기준</p>
        </div>

        {/* 지도 컨테이너 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          
          {/* 공통 지도 컴포넌트: markers에 홍수 데이터를 넘겨줌 */}
          <CommonMap markers={floodData} />

          {/* 지도 위 오버레이 UI (탭) */}
          <div className="absolute top-3 left-0 right-0 px-3 lg:px-0 lg:top-5 lg:left-5 lg:right-auto flex lg:flex-col gap-2 z-20 overflow-x-auto no-scrollbar">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="relative flex flex-col gap-2 flex-shrink-0 lg:flex-shrink">
                <button 
                  onClick={() => handleTabClick(tab.id)} 
                  className={`flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border ${
                    activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100"
                  }`}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
                
                {/* 재난안전시설 드롭다운 (시설 체크박스 그룹) */}
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 lg:static lg:mt-1">
                    <FacilityCheckGroup 
                      items={floodItems} 
                      facilities={facilities} 
                      onCheck={handleCheck} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 지도 컨트롤 버튼 (우측 하단) */}
          <div className="absolute bottom-5 right-5 z-20">
            <MapControlBtn />
          </div>
        </div>
      </div>

      {/* 하단 행동요령 박스 */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="홍수" />
      </div>
    </div>
  );
};

export default Flood;