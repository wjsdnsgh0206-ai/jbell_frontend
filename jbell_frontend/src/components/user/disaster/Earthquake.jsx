import React, { useState } from "react"; // useState 추가
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const Earthquake = () => {
  // 현재 선택된 지도 모드 상태 (기상특보, 미세먼지 등)
  const [activeTab, setActiveTab] = useState("기상특보");

  const mapTabs = [
    { id: "기상특보", label: "기상특보" },
    { id: "미세먼지", label: "미세먼지" },
    { id: "초미세먼지", label: "초미세먼지" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 왼쪽 & 중앙 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border min-h-[550px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">실시간 지진정보</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 border rounded text-gray-500">
                특보없음
              </span>
            </div>
            <p className="text-xs text-gray-400">2025.12.21 기준</p>
          </div>

          {/* ⚡ 지도 및 내부 사이드바 컨테이너 */}
          <div className="relative h-[450px] bg-slate-50 rounded-xl border overflow-hidden">
            
            {/* 1. 지도 영역 (배경) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-200 uppercase tracking-widest">
                Map Content Area
              </span>
            </div>

            {/* 2. 지도 내부 사이드바 (이미지 스타일) */}
            <div className="absolute top-4 left-4 w-40 flex flex-col gap-2 z-10">
              {mapTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all border
                    ${activeTab === tab.id 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md translate-x-1" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 shadow-sm"
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

            {/* 3. 지도 내부 정보창 (이미지 상단의 수치 표시 영역 - 예시) */}
            {activeTab === "미세먼지" && (
              <div className="absolute top-4 left-[180px] bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm z-10 min-w-[150px]">
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-gray-500">미세먼지</span>
                    <span className="text-xs font-bold text-emerald-500">40ug/m³ 보통</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-gray-500">오존</span>
                    <span className="text-xs font-bold text-emerald-500">0.033ppm 보통</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 지도 우측 하단 컨트롤 (확대/축소 등) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
              <button className="w-8 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">+</button>
              <button className="w-8 h-8 bg-white border border-gray-100 rounded shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50">-</button>
            </div>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border">
          <ActionTipBox type="지진" />
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <WeatherBox />
        </div>

        {/* 재난문자 */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full border border-gray-100/50">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default Earthquake;