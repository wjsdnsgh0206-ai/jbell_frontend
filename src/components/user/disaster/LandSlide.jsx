import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";

/*
  LandSlide 컴포넌트
  - PC: 세로형 사이드 탭 메뉴 구조 유지
  - 모바일: 상단 가로 칩(Chip) + 하단 요약창 레이아웃
*/

const LandSlide = () => {
  const [activeTab, setActiveTab] = useState("위험등급");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const mapTabs = [
    { id: "위험등급", label: "산사태 위험등급" },
    { id: "예보현황", label: "주의보/경보 현황" },
    { id: "대피장소", label: "산사태 대피소", hasArrow: true },
  ];

  const LandSlideItems = [
    { id: "shelter", label: "산사태대피소" }, 
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(prev => (prev === tabId ? null : tabId));
  };

  const handleCheck = (key) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* === 상단 지도 섹션 === */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 산사태정보
            </h3>
            <span className={`
  rounded-xl font-bold
  bg-[var(--graygray-10)] text-[var(--graygray-50)] text-center
  
  /* 모바일 (기존 유지) */
  text-[10px] px-2.5 py-1 
  
  /* 웹 (PC): 폰트 15px로 키우고 여백 넉넉하게 */
  md:text-detail-s md:px-4 md:py-1.5 md:w-[80px]
`}>
  특보없음
</span>
          </div>
          <p className="text-[11px] lg:text-detail-m text-gray-400 font-medium">
            2026.01.09 기준
          </p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          
          {/* [1] 탭 메뉴: 모바일(상단 가로 스크롤) / PC(좌측 세로) */}
          <div className="absolute top-3 left-0 right-0 px-3 lg:px-0 lg:top-5 lg:left-5 lg:right-auto flex lg:flex-col gap-2 z-20 overflow-x-auto no-scrollbar">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="relative flex flex-col gap-2 flex-shrink-0 lg:flex-shrink">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 lg-px-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border
                    ${activeTab === tab.id 
                      ? "bg-blue-600 text-white border-blue-600 " 
                      : "bg-white/95 backdrop-blur-md border-gray-100 hover:bg-white"
                    }
                  `}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.hasArrow && (
                    <span className={`hidden lg:block ml-2 transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`}>
                      <span className="text-[10px]">▶</span>
                    </span>
                  )}
                </button>

                {/* 대피장소 체크박스 그룹: 모바일은 버튼 바로 아래 띄우기 */}
                {tab.id === "대피장소" && activeTab === "대피장소" && (
                  <div className="absolute top-12 left-0 lg:static lg:top-auto lg:left-auto lg:mt-1">
                    <FacilityCheckGroup
                      items={LandSlideItems}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* [2] 정보 요약 창: 모바일은 우측 하단, PC는 우측 상단 */}
          <div className="absolute bottom-4 right-4 lg:top-5 lg:bottom-auto bg-white/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl border border-gray-100 shadow-xl z-10 min-w-[150px] lg:min-w-[200px]">
            {/* <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Risk Level</p> */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-detail-l lg:text-body-m text-gray-700">전주시 완산구</span>
                <span className="text-detail-s lg:text-detail-s-bold text-orange-600">주의</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-detail-l lg:text-body-m text-gray-700">전주시 덕진구</span>
                <span className="text-detail-s lg:text-detail-s-bold text-emerald-600">보통</span>
              </div>
            </div>
          </div>

          {/* [3] 지도 컨트롤 버튼 */}
          <div className="absolute bottom-4 left-4 z-10">
            <MapControlBtn />
          </div>

          {/* 지도 배경 플레이스홀더 */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100">
             <span className="text-gray-300 font-black tracking-widest opacity-40 text-xl">LANDSLIDE MAP</span>
          </div>
        </div>
      </div>

      {/* === 하단 행동요령 박스 === */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="산사태" />
      </div>
    </div>
  );
};

export default LandSlide;