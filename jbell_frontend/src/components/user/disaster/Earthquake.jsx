import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const Earthquake = () => {
  const [activeTab, setActiveTab] = useState("기상특보");

  const mapTabs = [
    { id: "기상특보", label: "기상특보" },
    { id: "미세먼지", label: "미세먼지" },
    { id: "초미세먼지", label: "초미세먼지" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">실시간 지진정보</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 border rounded text-gray-500 font-medium">
                특보없음
              </span>
            </div>
            <p className="text-xs text-gray-400">2026.01.02 기준</p>
          </div>

          {/* ⚡ 지도 컨테이너 */}
          <div className="relative h-[450px] bg-slate-50 rounded-xl border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-200 uppercase tracking-widest">
                Earthquake Map Area
              </span>
            </div>

            {/* 왼쪽 사이드바 메뉴 (규격 통일) */}
            <div className="absolute top-4 left-4 w-44 flex flex-col gap-2 z-10">
              {mapTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] font-black transition-all border
                    ${activeTab === tab.id 
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg translate-x-1" 
                      : "bg-white/95 backdrop-blur-sm text-gray-600 border-gray-200 hover:bg-white hover:translate-x-0.5 shadow-sm"
                    }
                  `}
                >
                  {tab.label}
                  {tab.hasArrow && (
                    <span className={`text-[10px] ${activeTab === tab.id ? "text-white" : "text-gray-400"}`}>
                      ▶
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ⚡ 우측 정보창 (태풍 페이지와 동일한 p-5, min-w-[200px] 규격 적용) */}
            {(activeTab === "미세먼지" || activeTab === "초미세먼지") && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-gray-100 shadow-md z-10 min-w-[200px]">
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1">Air Quality Info</p>
                    <h4 className="text-md font-black text-emerald-600">대기질 현황: 보통</h4>
                  </div>
                  <div className="space-y-1.5 border-t border-gray-100 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">미세먼지</span>
                      <span className="font-bold text-gray-800">40 μg/m³</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">초미세먼지</span>
                      <span className="font-bold text-gray-800">18 μg/m³</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">오존농도</span>
                      <span className="font-bold text-emerald-500">0.033 ppm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 지도 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
              <button className="w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-transform">+</button>
              <button className="w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-transform">-</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border">
          <ActionTipBox type="지진" />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <WeatherBox />
        </div>
        <div className="bg-white rounded-2xl shadow-sm flex flex-col h-full border border-gray-100 overflow-hidden">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default Earthquake;