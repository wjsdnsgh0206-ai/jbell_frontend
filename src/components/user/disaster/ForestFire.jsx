import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";

const ForestFire = () => {
  const [activeTab, setActiveTab] = useState("산불위험지수");
  const [facilities, setFacilities] = useState({ shelter: true, hospital: false, pharmacy: false });

  const mapTabs = [
    { id: "산불위험지수", label: "산불위험지수" },
    { id: "발생위치", label: "산불발생위치" },
    { id: "소방시설", label: "주변 소방시설", hasArrow: true },
  ];

  const WildfireItems = [
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
            <h3 className="md:text-body-m lg:text-title-m  text-body-s-bold text-gray-900">실시간 산불정보</h3>
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
          <p className="text-detail-xs md:text-detail-s text-gray-400">2026.01.09 기준</p>
        </div>

        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="absolute top-3 left-0 right-0 px-3 lg:px-0 lg:text-detail-m lg:top-5 lg:left-5 lg:right-auto flex lg:flex-col gap-2 z-20 overflow-x-auto no-scrollbar">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="relative flex flex-col gap-2 flex-shrink-0 lg:flex-shrink">
                <button onClick={() => handleTabClick(tab.id)} className={`flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 lg-px-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100"}`}>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
                {tab.id === "소방시설" && activeTab === "소방시설" && (
                  <div className="absolute top-12 left-0 lg:static lg:mt-1"><FacilityCheckGroup items={WildfireItems} facilities={facilities} onCheck={handleCheck} /></div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 lg:top-5 lg:bottom-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-100 z-10 min-w-[170px]">
            {/* <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Fire Risk</p> */}
            <div className="flex justify-between items-center text-detail-s lg:text-body-m mb-1.5">
              <span>위험지수</span>
              <span className="text-orange-600 text-detail-s lg:text-detail-s-bold">65 (높음)</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-orange-500 h-full w-[65%]" />
            </div>
            <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-detail-s lg:text-body-s text-center">산불 발생 위험 높음</div>
          </div>
          <MapControlBtn />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="산불" />
      </div>
    </div>
  );
};
export default ForestFire;