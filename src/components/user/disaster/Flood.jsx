import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";

/*
  Flood 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 홍수 메뉴
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 홍수 메뉴 컴포넌트로, 현재 홍수관련 내용을 표시함. 추후 api연동 필요.
*/

const Flood = () => {
  const [activeTab, setActiveTab] = useState("침수흔적도");

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

  const floodItems = [
    { id: "shelter", label: "이재민임시시설" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  };

  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* === 상단 지도 섹션 === */}
      <div className="bg-white rounded-xl p-5 shadow-1 border border-graygray-10 flex-1 flex flex-col min-h-0">
        {/* 타이틀 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-1 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap pb-2">
            <h3 className="text-body-l-bold sm:text-title-m text-graygray-90 whitespace-nowrap">
              실시간 홍수정보
            </h3>
            <span className="shrink-0 text-[10px] sm:text-detail-m px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-bold leading-none">
              실시간 데이터
            </span>
          </div>
          <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
            2026.01.02 기준
          </p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-secondary-5 rounded-xl border border-graygray-10 overflow-hidden shadow-inner min-h-[300px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] opacity-50 px-4 text-center pointer-events-none">
              Flood Map
            </span>
          </div>

          {/* 좌측 탭 */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-36 sm:w-44 flex flex-col gap-2 z-10">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl
                    text-[12px] sm:text-body-m font-black transition-all border
                    ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-blue shadow-lg translate-x-1"
                        : "bg-white/95 backdrop-blur-sm text-graygray-60 border-graygray-10 hover:bg-white hover:translate-x-1 shadow-sm"
                    }
                  `}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.hasArrow && (
                    <span
                      className={`transition-transform duration-300 ${
                        activeTab === tab.id ? "rotate-90" : ""
                      }`}
                    >
                      <span className="text-[8px] sm:text-[10px]">▶</span>
                    </span>
                  )}
                </button>

                {tab.id === "재난안전시설" &&
                  activeTab === "재난안전시설" && (
                    <FacilityCheckGroup
                      items={floodItems}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  )}
              </div>
            ))}
          </div>

          {/* 줌 버튼 */}
          <MapControlBtn/>
        </div>
      </div>

      {/* === 하단 행동요령 === */}
      <div className="bg-white rounded-xl p-6 shadow-1 border border-graygray-10 flex-shrink-0">
        <ActionTipBox type="홍수" />
      </div>
    </div>
  );
};

export default Flood;
