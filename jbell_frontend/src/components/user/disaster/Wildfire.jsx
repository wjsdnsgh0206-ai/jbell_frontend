import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";

/*
  Wildfire 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 산불 메뉴
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 산불 메뉴 컴포넌트로, 현재 산불관련 내용을 표시함. 추후 api연동 필요.
*/

const Wildfire = () => {
  // 현재 선택된 지도 탭 상태
  const [activeTab, setActiveTab] = useState("산불위험지수");

  // 체크박스 상태 관리
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  // 산불 관련 탭 메뉴 구성
  const mapTabs = [
    { id: "산불위험지수", label: "산불위험지수" },
    { id: "발생위치", label: "산불발생위치" },
    { id: "소방시설", label: "주변 소방시설", hasArrow: true },
  ];
 
  const WildfireItems = [
    { id: "shelter", label: "이재민임시시설" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  // 탭 클릭 핸들러 (토글 로직)
  const handleTabClick = (tabId) => {
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  };

  // 체크박스 변경 핸들러
  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-6">
      {/* 왼쪽 & 중앙 콘텐츠 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-6">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          {/* 헤더 섹션 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-body-l-bold sm:text-title-m font-black text-graygray-90 whitespace-nowrap">
                실시간 산불정보
              </h3>
              <span className="shrink-0 text-[10px] sm:text-detail-m px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-orange-600 font-bold leading-none">
                건조주의보 발령 중
              </span>
            </div>
            <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
              2026.01.02 기준
            </p>
          </div>

          {/* 지도 및 내부 사이드바 컨테이너 */}
          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] opacity-50 px-4 text-center select-none">
                Wildfire Map Area
              </span>
            </div>

            {/* 지도 내부 사이드바 */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-36 sm:w-44 flex flex-col gap-1.5 sm:gap-2 z-10">
              {mapTabs.map((tab) => (
                <div key={tab.id} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-xl text-[12px] sm:text-body-m font-black transition-all border
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

                  {/* ID 매칭: "소방시설" 버튼 클릭 시 리스트 노출 */}
                  {tab.id === "소방시설" && activeTab === "소방시설" && (
                    <FacilityCheckGroup
                      items={WildfireItems}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 우측 정보 요약 창 */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-graygray-10 shadow-xl z-10 min-w-[180px] sm:min-w-[200px] animate-in fade-in zoom-in-95">
              <div className="space-y-3">
                <p className="text-[9px] sm:text-[10px] font-black text-graygray-40 uppercase tracking-widest">
                  Fire Risk Summary
                </p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[11px] sm:text-detail-m font-bold text-graygray-60">
                      <span>위험지수</span>
                      <span className="text-orange-600 font-black">
                        65 (높음)
                      </span>
                    </div>
                    <div className="w-full bg-graygray-10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[65%] rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1 border-t border-graygray-5 pt-2.5">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                    <span className="text-detail-l sm:text-body-m font-black text-graygray-80 tabular-nums">
                      최근 화점: <span className="text-red-600">0건</span>
                    </span>
                  </div>

                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[11px] sm:text-detail-m font-black text-center border border-blue-100 shadow-sm">
                    ⚠️ 산불 발생 위험 높음
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-1.5 z-10">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                +
              </button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">
                -
              </button>
            </div>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="산불" />
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-6">
        {/* 날씨 박스 */}
        <div className="py-3 w-[350px] h-[180px] bg-gradient-to-br from-[#62A1E9] to-[#4A90E2] rounded-xl p-6 shadow-1 border border-white/30">
          <WeatherBox />
        </div>

        {/* 재난문자 */}
        <div className="w-[350px] h-[550px] bg-white rounded-xl shadow-1 flex border border-graygray-10 overflow-hidden min-h-[400px]">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default Wildfire;
