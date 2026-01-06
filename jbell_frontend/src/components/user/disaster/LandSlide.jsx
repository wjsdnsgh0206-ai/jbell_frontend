import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";

/*
  LandSlide 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 산사태 메뉴
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 산사태 메뉴 컴포넌트로, 현재 산사태관련 내용을 표시함. 추후 api연동 필요.
*/

const LandSlide = () => {
  // 현재 선택된 지도 탭 상태
  const [activeTab, setActiveTab] = useState("위험등급");

  // [추가] 체크박스 상태 관리
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  // 산사태 관련 탭 메뉴 구성
  const mapTabs = [
    { id: "위험등급", label: "산사태 위험등급" },
    { id: "예보현황", label: "주의보/경보 현황" },
    { id: "대피장소", label: "산사태 대피소", hasArrow: true }, // ID: 대피장소
  ];

  // 산사태 전용 대피 시설 아이템 리스트
  const LandSlideItems = [
    { id: "shelter", label: "산사태대피소" }, 
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  // 탭 클릭 핸들러 (토글 로직)
  const handleTabClick = (tabId) => {
    setActiveTab(prev => (prev === tabId ? null : tabId));
  };

  // 체크박스 변경 핸들러
  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        <div className="bg-white rounded-[24px] p-5 sm:p-8 shadow-1 border border-graygray-10 min-h-[550px]">
          
          {/* 헤더 섹션 */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h3 className="text-body-l-bold sm:text-title-m font-black text-graygray-90 whitespace-nowrap">
                실시간 산사태정보
              </h3>
              <span className="shrink-0 text-[10px] sm:text-detail-m px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 font-bold leading-none">
                실시간 모니터링 중
              </span>
            </div>
            <p className="text-[10px] sm:text-detail-m text-graygray-30 font-medium tabular-nums">
              2026.01.02 기준
            </p>
          </div>

          {/* 지도 및 내부 사이드바 컨테이너 */}
          <div className="relative h-[400px] sm:h-[500px] bg-secondary-5 rounded-2xl border border-graygray-10 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-title-s sm:text-title-l font-black text-graygray-20 uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-50 px-4 text-center select-none">
                Landslide Map Area
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
                      ${activeTab === tab.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-blue shadow-lg translate-x-1" 
                        : "bg-white/95 backdrop-blur-sm text-graygray-60 border-graygray-10 hover:bg-white hover:translate-x-1 shadow-sm"
                      }
                    `}
                  >
                    <span className="truncate">{tab.label}</span>
                    {tab.hasArrow && (
                      <span className={`transition-transform duration-300 ${activeTab === tab.id ? "rotate-90" : ""}`}>
                        <span className="text-[8px] sm:text-[10px]">▶</span>
                      </span>
                    )}
                  </button>

                  {/* [수정] ID 매칭: "대피장소" */}
                  {tab.id === "대피장소" && activeTab === "대피장소" && (
                    <FacilityCheckGroup
                      items={LandSlideItems}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 정보 요약 창 */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-graygray-10 shadow-xl z-10 min-w-[160px] sm:min-w-[200px] animate-in fade-in zoom-in-95">
              <div className="space-y-3">
                <p className="text-[9px] sm:text-[10px] font-black text-graygray-40 uppercase tracking-widest">Landslide Risk</p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                      <span className="text-detail-l sm:text-body-m font-bold text-graygray-80">완산구</span>
                    </div>
                    <span className="text-detail-l sm:text-body-m font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">주의</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span className="text-detail-l sm:text-body-m font-bold text-graygray-80">덕진구</span>
                    </div>
                    <span className="text-detail-l sm:text-body-m font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">보통</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 컨트롤 버튼 */}
            <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col gap-1.5 z-10">
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">+</button>
              <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-graygray-10 rounded-xl shadow-1 flex items-center justify-center text-lg sm:text-xl font-bold text-graygray-60 hover:text-blue-600 transition-all active:scale-90">-</button>
            </div>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox type="산사태" />
        </div>
      </div>

      {/* 우측 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-8">
     <div className="bg-gradient-to-br from-[#62A1E9] to-[#4A90E2] rounded-[24px] p-6 shadow-1 border border-white/30">
          <WeatherBox />
        </div>
        <div className="bg-white rounded-[24px] shadow-1 flex flex-col h-full border border-graygray-10 overflow-hidden min-h-[400px]">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default LandSlide;