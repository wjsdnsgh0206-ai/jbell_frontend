import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap"; // 공통 지도 엔진 호출

const HeavyRain = () => {
  // 호우 관련 마커 데이터 (예시: 침수 우려 지역이나 현재 호우 주의보 지점)
  const heavyRainData = [
    { lat: 35.8150, lng: 127.1100, title: "하천 범람 주의", content: "강수량 증가로 인한 수위 상승 중" },
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

  const HeavyRainItems = [
    { id: "shelter", label: "이재민임시시설" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => setActiveTab(prev => (prev === tabId ? null : tabId));
  const handleCheck = (key) => setFacilities(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 강수 정보
            </h3>
            <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-center text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 md:w-[80px]">
              특보없음
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">2026.01.09 기준</p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          
          {/* 공통 지도 컴포넌트 적용 */}
          <CommonMap markers={heavyRainData} />

          {/* 좌측 상단: 오버레이 탭 메뉴 */}
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
                
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 lg:static lg:mt-1">
                    <FacilityCheckGroup 
                      items={HeavyRainItems} 
                      facilities={facilities} 
                      onCheck={handleCheck} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 우측 상단/모바일 하단: 실시간 강수량 정보 카드 */}
          <div className="absolute bottom-4 right-4 lg:top-5 lg:right-5 lg:bottom-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl z-10 min-w-[160px]">
            <div className="text-detail-l lg:text-body-m text-gray-800 mb-2">
              시간당 <span className="text-blue-600 font-bold">25.5 mm</span>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-detail-s lg:text-body-s-bold text-center">
              하천 수위 상승 주의
            </div>
          </div>

          {/* 지도 컨트롤 (현재 위치 등) */}
          <div className="absolute bottom-5 right-5 lg:bottom-20 z-20">
            <MapControlBtn />
          </div>
        </div>
      </div>

      {/* 하단 행동요령 */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="호우" />
      </div>
    </div>
  );
};

export default HeavyRain;