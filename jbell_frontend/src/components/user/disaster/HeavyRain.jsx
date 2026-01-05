import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

/*
  HeavyRain 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 호우 메뉴
  > 컴포넌트 설명 : 실시간 강수량, 침수 위험 지역, 기상 특보 등 호우 관련 정보를 표시.
*/

const HeavyRain = () => {
  const [activeTab, setActiveTab] = useState("강수레이더");

  const mapTabs = [
    { id: "강수레이더", label: "실시간 강수레이더" },
    { id: "침수위험", label: "침수 위험지역" },
    { id: "댐수위", label: "주요 댐/하천 수위" },
    { id: "대피소", label: "주변 대피시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-body-l-bold sm:text-title-m font-black text-graygray-90 whitespace-nowrap">
                실시간 강수 정보
              </h3>
              <span className="shrink-0 text-[10px] sm:text-detail-m px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-black leading-none">
                호우주의보 발령 중
              </span>
            </div>
            <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
              2026.01.05 기준
            </p>
          </div>

          {/* 지도 영역 */}
          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] opacity-50 px-4 text-center select-none">
                Rainfall Radar Map
              </span>
            </div>

            {/* 좌측 사이드바 */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-36 sm:w-44 flex flex-col gap-1.5 sm:gap-2 z-10">
              {mapTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl text-[12px] sm:text-body-m font-black transition-all border
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-blue shadow-lg translate-x-1"
                        : "bg-white/95 backdrop-blur-sm text-graygray-60 border-graygray-10 hover:bg-white hover:translate-x-1 shadow-sm"
                    }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.hasArrow && (
                    <span className="shrink-0 text-[8px] sm:text-[10px] ml-1">▶</span>
                  )}
                </button>
              ))}
            </div>

            {/* 우측 정보 요약 창 (호우 전용 데이터) */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-graygray-10 shadow-xl z-10 min-w-[180px]">
              <div className="space-y-3">
                <p className="text-[9px] sm:text-[10px] font-black text-graygray-40 uppercase tracking-widest">
                  Rainfall Summary
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                    <span className="text-detail-l sm:text-body-m font-black text-graygray-80 tabular-nums uppercase">
                      시간당 강수량:{" "}
                      <span className="text-blue-600 font-black">25.5 mm</span>
                    </span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[11px] sm:text-detail-m font-black text-center border border-blue-100 shadow-sm">
                    🌊 인근 하천 수위 상승 주의
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 행동요령 (호우 타입 적용) */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="호우" />
        </div>
      </div>

      {/* === 우측 패널 - 날씨 & 재난문자 === */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-6 shadow-1 border border-graygray-10">
          <WeatherBox />
        </div>
        <div className="bg-white rounded-[24px] shadow-1 border border-graygray-10 overflow-hidden min-h-[400px]">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default HeavyRain;