import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
/*
  HeavyRain 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 호우 메뉴
  > 컴포넌트 설명 : 실시간 강수량, 침수 위험 지역, 기상 특보 등 호우 관련 정보를 표시.
*/

const HeavyRain = () => {
  const [activeTab, setActiveTab] = useState("침수흔적도");

  // 체크박스 상태 관리
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const mapTabs = [
    { id: "침수흔적도", label: "침수흔적도" },
    { id: "수방시설물", label: "수방시설물" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true }, 
  ];

  // 재난안전시설 탭 데이터
  const HeavyRainItems = [
    { id: "shelter", label: "이재민임시시설" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  // 탭 클릭 핸들러 (다시 누르면 닫힘)
  const handleTabClick = (tabId) => {
    setActiveTab(prev => (prev === tabId ? null : tabId));
  };

  // 체크박스 핸들러
  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* === 상단 지도 섹션 (높이가 유연하게 늘어남) === */}
      <div className="bg-white rounded-xl p-5 shadow-1 border border-graygray-10 flex-1 flex flex-col min-h-0">
        {/* 헤더 섹션 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-1 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap pb-2">
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

        {/* 지도 영역 (flex-1로 남은 높이를 모두 차지) */}
        <div className="relative flex-1 bg-secondary-5 rounded-xl border border-graygray-10 overflow-hidden shadow-inner min-h-[300px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] opacity-50 px-4 text-center select-none">
              Rainfall Radar Map
            </span>
          </div>

          {/* 좌측 사이드바 */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-36 sm:w-44 flex flex-col gap-1.5 sm:gap-2 z-10">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl text-[12px] sm:text-body-m font-black transition-all border
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-blue shadow-lg translate-x-1"
                        : "bg-white/95 backdrop-blur-sm text-graygray-60 border-graygray-10 hover:bg-white hover:translate-x-1 shadow-sm"
                    }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.hasArrow && (
                    <span className={`transition-transform duration-300 ${activeTab === tab.id ? "rotate-90" : ""}`}>
                      <span className="text-[8px] sm:text-[10px]">▶</span>
                    </span>
                  )}
                </button>

                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <FacilityCheckGroup
                    items={HeavyRainItems}
                    facilities={facilities}
                    onCheck={handleCheck}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 우측 정보 요약 창 */}
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
                    시간당 강수량: <span className="text-blue-600 font-black">25.5 mm</span>
                  </span>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[11px] sm:text-detail-m font-black text-center border border-blue-100 shadow-sm">
                  🌊 인근 하천 수위 상승 주의
                </div>
              </div>
            </div>
          </div>

          {/* 줌 버튼 */}
          <MapControlBtn/>
        </div>
      </div>

      {/* === 하단 행동요령 박스 === */}
      <div className="bg-white rounded-xl p-6 shadow-1 border border-graygray-10 flex-shrink-0">
        <ActionTipBox type="호우" />
      </div>
    </div>
  );
};

export default HeavyRain;