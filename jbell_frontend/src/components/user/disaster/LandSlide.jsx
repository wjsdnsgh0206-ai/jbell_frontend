import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const LandSlide = () => {
  // 현재 선택된 지도 탭 상태
  const [activeTab, setActiveTab] = useState("위험등급");

  // 산사태 관련 탭 메뉴 구성
  const mapTabs = [
    { id: "위험등급", label: "산사태 위험등급" },
    { id: "함수지수", label: "토양 함수지수" },
    { id: "예보현황", label: "주의보/경보 현황" },
    { id: "대피장소", label: "산사태 대피소", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 왼쪽 & 중앙 콘텐츠 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">실시간 산사태정보</h3>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-600 font-medium">
                실시간 모니터링 중
              </span>
            </div>
            <p className="text-xs text-gray-400">2026.01.02 기준</p>
          </div>

          {/* ⚡ 지도 및 내부 사이드바 컨테이너 */}
          <div className="relative h-[450px] bg-slate-50 rounded-xl border overflow-hidden">
            
            {/* 배경: 지도 영역 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-slate-200 uppercase tracking-widest">
                Landslide Map Area
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

            {/* 정보 요약 창 (산사태 특화) */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md z-10 min-w-[180px]">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Landslide Risk</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm font-bold text-gray-700">전주시 완산구: 주의</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-gray-700">전주시 덕진구: 보통</span>
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
          <ActionTipBox type="산사태" />
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

export default LandSlide;