import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

/*
  Earthquake 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 지진 메뉴
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 지진 메뉴 컴포넌트로, 현재 지진관련 내용을 표시함. 추후 api연동 필요.
*/


const Earthquake = () => {
  const [activeTab, setActiveTab] = useState("기상특보");

  const mapTabs = [
    { id: "기상특보", label: "기상특보" },
    { id: "미세먼지", label: "미세먼지" },
    { id: "초미세먼지", label: "초미세먼지" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      {/* 메인 영역 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          
          {/* === 헤더 섹션 - 모바일 뭉개짐 방지 적용 === */}
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

          {/* === 지도 컨테이너 === */}
          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-50 px-4 text-center">
                Earthquake Map
              </span>
            </div>

            {/* === 왼쪽 사이드바 메뉴 === */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-32 sm:w-44 flex flex-col gap-1.5 sm:gap-2 z-10">
              {mapTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                    <span className={`shrink-0 text-[8px] sm:text-[10px] ml-1 ${activeTab === tab.id ? "text-white" : "text-graygray-30"}`}>
                      ▶
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* === 우측 대기질 정보창 === */}
            {(activeTab === "미세먼지" || activeTab === "초미세먼지") && (
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-auto sm:left-auto sm:top-5 sm:right-5 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-graygray-10 shadow-xl z-10 animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-300">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-graygray-40 uppercase tracking-widest mb-0.5 sm:mb-1">Air Quality Index</p>
                    <h4 className="text-body-m-bold sm:text-body-l-bold text-emerald-600">대기질 현황: 보통</h4>
                  </div>
                  <div className="space-y-2 border-t border-graygray-5 pt-3">
                    <div className="flex justify-between items-center text-detail-l sm:text-body-m">
                      <span className="text-graygray-50 font-bold">미세먼지</span>
                      <span className="font-black text-graygray-80 tabular-nums">40 μg/m³</span>
                    </div>
                    <div className="flex justify-between items-center text-detail-l sm:text-body-m">
                      <span className="text-graygray-50 font-bold">초미세먼지</span>
                      <span className="font-black text-graygray-80 tabular-nums">18 μg/m³</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 지도 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-1.5 z-10">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">+</button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">-</button>
            </div>
          </div>
        </div>

        {/* === 행동요령 박스 === */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="지진" />
        </div>
      </div>

      {/* === 우측 패널 - 날씨 & 재난문자 === */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-6 shadow-1 border border-graygray-10">
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