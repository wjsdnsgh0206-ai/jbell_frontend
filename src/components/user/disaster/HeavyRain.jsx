import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";

const HeavyRain = () => {
  const [activeTab, setActiveTab] = useState("침수흔적도");
  const [facilities, setFacilities] = useState({ shelter: true, hospital: false, pharmacy: false });

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
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">실시간 강수 정보</h3>
            <span className={`
  rounded-xl font-bold
  bg-[var(--graygray-10)] text-[var(--graygray-50)] text-center
  
  /* 모바일 (기존 유지) */
  text-[10px] px-2.5 py-1 
  
  /* 웹 (PC): 폰트 15px로 키우고 여백 넉넉하게 */
  md:text-detail-s md:px-4 md:py-1.5 md:w-[80px]
`}>
  특보없음
</span>          </div>
          <p className="text-[11px] text-gray-400">2026.01.09 기준</p>
        </div>

        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="absolute top-3 left-0 right-0 px-3 lg:px-0 lg:top-5 lg:left-5 lg:right-auto flex lg:flex-col gap-2 z-20 overflow-x-auto no-scrollbar">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="relative flex flex-col gap-2 flex-shrink-0 lg:flex-shrink">
                      <button onClick={() => handleTabClick(tab.id)} className={`flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 lg-px-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100"}`}>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 lg:static lg:mt-1"><FacilityCheckGroup items={HeavyRainItems} facilities={facilities} onCheck={handleCheck} /></div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 lg:top-5 lg:bottom-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-xl z-10 min-w-[160px]">
            {/* <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rainfall</p> */}
            <div className="text-detail-l lg:text-body-m  text-gray-800 mb-2">시간당 <span className="text-blue-600">25.5 mm</span></div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-detail-s lg:text-body-s text-center">하천 수위 상승 주의</div>
          </div>
          <MapControlBtn />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="호우" />
      </div>
    </div>
  );
};
export default HeavyRain;