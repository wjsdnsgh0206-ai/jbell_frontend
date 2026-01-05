import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

/*
  Typhoon 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 산사태 메뉴
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 산사태 메뉴 컴포넌트로, 현재 산사태관련 내용을 표시함. 추후 api연동 필요.
*/

const Typhoon = () => {
  const [activeTab, setActiveTab] = useState("태풍경로");

  const mapTabs = [
    { id: "태풍경로", label: "태풍 이동경로" },
    { id: "강풍반경", label: "강풍/폭풍반경" },
    { id: "기상특보", label: "해역별 특보" },
    { id: "대피시설", label: "항만 대피시설", hasArrow: true },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-body-l-bold sm:text-title-m font-black text-graygray-90 whitespace-nowrap">
                실시간 태풍정보
              </h3>
              <span className="shrink-0 text-[10px] sm:text-detail-m px-3 py-1 bg-red-50 border border-red-100 rounded-full text-red-600 font-bold leading-none">
                태풍 북상 중
              </span>
            </div>
            <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
              2026.01.02 기준
            </p>
          </div>

          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            {/* 배경 지도 영역 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] opacity-50 px-4 text-center select-none">
                Typhoon Path Map Area
              </span>
            </div>

            {/* 좌측 사이드바 메뉴 */}
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
                    <span className="shrink-0 text-[8px] sm:text-[10px] ml-1">
                      ▶
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 우측 정보 요약 창 */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-graygray-10 shadow-xl z-10 min-w-[180px] animate-in fade-in zoom-in-95">
              <div className="space-y-3">
                <p className="text-[9px] sm:text-[10px] font-black text-graygray-40 uppercase tracking-widest">
                  Typhoon Summary
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                    {/* 네가 강조한 그 클래스 그대로 적용 */}
                    <span className="text-detail-l sm:text-body-m font-black text-graygray-80 tabular-nums uppercase">
                      중심기압:{" "}
                      <span className="text-red-600 font-black">965 hPa</span>
                    </span>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[11px] sm:text-detail-m font-black text-center border border-blue-100 shadow-sm">
                    ⚠️ 제1호 태풍 네파탁 (강)
                  </div>
                </div>
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-10">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                +
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                -
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="태풍" />
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

export default Typhoon;
