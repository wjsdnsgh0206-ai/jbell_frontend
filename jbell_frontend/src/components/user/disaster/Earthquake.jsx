import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";

const Earthquake = () => {
  const [activeTab, setActiveTab] = useState("기상특보");
  
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const mapTabs = [
    { id: "기상특보", label: "기상특보" },
    { id: "지진특보", label: "지진특보" },
    { id: "진도정보조회", label: "진도정보조회" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  // 재난안전시설 탭 데이터
  const EarthquakeItems = [
    { id: "shelter", label: "지진옥외대피장소" }, 
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(prev => (prev === tabId ? null : tabId));
  };

  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-body-l-bold sm:text-title-m font-black text-graygray-90 whitespace-nowrap">
                실시간 지진정보
              </h3>
              <span className="shrink-0 text-[10px] sm:text-detail-m px-2.5 py-1 bg-secondary-5 border border-graygray-10 rounded-full text-graygray-50 font-bold leading-none">
                특보없음
              </span>
            </div>
            <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
              2026.01.02 기준
            </p>
          </div>

          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-50 px-4 text-center">
                Earthquake Map
              </span>
            </div>

            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-36 sm:w-48 flex flex-col gap-2 z-10">
              {mapTabs.map((tab) => (
                <div key={tab.id} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl text-[12px] sm:text-body-m font-black transition-all border
                      ${activeTab === tab.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-blue shadow-lg translate-x-1" 
                        : "bg-white/95 backdrop-blur-sm text-graygray-60 border-graygray-10 hover:bg-white hover:translate-x-1 shadow-sm"
                      }
                    `}
                  >
                    <span className="truncate">{tab.label}</span>
                    {tab.hasArrow && (
                      <span className={`transition-transform duration-300 ${activeTab === tab.id ? "rotate-90" : ""}`}>
                        <span className="text-[8px] sm:text-[10px]">▶</span>
                      </span>
                    )}
                  </button>

                  {/* 분리된 체크박스 컴포넌트 적용 */}
                  {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                    <FacilityCheckGroup 
                      items={EarthquakeItems}
                      facilities={facilities} 
                      onCheck={handleCheck} 
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-1.5 z-10">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">+</button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">-</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="지진" />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-8">
     <div className="bg-gradient-to-br from-[#62A1E9] to-[#4A90E2] rounded-[24px] p-6 shadow-1 border border-white/30">
          <WeatherBox />
        </div>
        <div className="bg-white rounded-[24px] shadow-1 flex flex-col h-full border border-graygray-10 overflow-hidden min-h-[400px]">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default Earthquake;