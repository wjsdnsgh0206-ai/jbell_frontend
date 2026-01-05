import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const Typhoon = () => {
  // 현재 선택된 지도 탭 상태
  const [activeTab, setActiveTab] = useState("태풍경로");

  // 태풍 관련 탭 메뉴 구성
  const mapTabs = [
    { id: "태풍경로", label: "태풍 이동경로" },
    { id: "강풍반경", label: "강풍/폭풍반경" },
    { id: "기상특보", label: "해역별 특보" },
    { id: "대피시설", label: "항만 대피시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 왼쪽 & 중앙 콘텐츠 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">실시간 태풍정보</h3>
              <span className="text-xs px-2 py-0.5 bg-red-50 border border-red-100 rounded text-red-600 font-medium">
                태풍 북상 중
              </span>
            </div>
            <p className="text-xs text-gray-400">2026.01.02 기준</p>
          </div>

          {/* ⚡ 지도 및 내부 사이드바 컨테이너 */}
          <div className="relative h-[450px] bg-slate-50 rounded-xl border overflow-hidden">
            
            {/* 배경: 지도 영역 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-200 uppercase tracking-widest">
                Typhoon Path Map Area
              </span>
            </div>

            {/* 지도 내부 사이드바 (Left Menu) */}
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

            {/* 정보 요약 창 (태풍 상세 정보) */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-gray-100 shadow-md z-10 min-w-[200px]">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1">Typhoon Info</p>
                  <h4 className="text-md font-black text-red-600">제1호 태풍 '네파탁'</h4>
                </div>
                <div className="space-y-1.5 border-t border-gray-100 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">현재위치</span>
                    <span className="font-bold text-gray-800">서귀포 남쪽 300km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">중심기압</span>
                    <span className="font-bold text-gray-800">965 hPa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">최대풍속</span>
                    <span className="font-bold text-red-500">37 m/s (강)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
              <button className="w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-transform">+</button>
              <button className="w-9 h-9 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 active:scale-90 transition-transform">-</button>
            </div>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border">
          <ActionTipBox type="태풍" />
        </div>
      </div>

      {/* 오른쪽 패널 */}
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

export default Typhoon;