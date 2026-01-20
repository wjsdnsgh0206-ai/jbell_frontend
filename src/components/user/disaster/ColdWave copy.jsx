// src/components/user/disaster/ColdWave.jsx
import React, { useState, useEffect } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap"; // 공통 지도 엔진, 지도 컴포넌트 가정
import useColdWave from "@/hooks/user/useColdWave"; // Hook 임포트

const ColdWave = () => {
  // Hook 사용: 로직은 다 저기에 숨겨져 있음
  const { disasterStatus, isLoading, fetchColdWaveData } = useColdWave();

  const [activeTab, setActiveTab] = useState("한파경로도");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const mapTabs = [
    { id: "한파 특보", label: "한파 특보" },
    { id: "재난안전시설", label: "재난안전시설", hasArrow: true },
  ];

  const coldWaveItems = [
    { id: "shelter", label: "한파쉼터" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  // 컴포넌트 마운트 시 데이터 호출
  useEffect(() => {
    fetchColdWaveData();
  }, [fetchColdWaveData]);

  // 데이터 변경 시마다 콘솔에 상세 로그 출력
  useEffect(() => {
    if (Object.keys(disasterStatus).length > 0) {
      console.log("❄️ [한파 탭] 실시간 매핑 데이터 확인:");
      console.table(disasterStatus); // 테이블 형태로 예쁘게 출력
    }
  }, [disasterStatus]);

  const handleTabClick = (tabId) =>
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 한파정보
            </h3>
            {/* 특보 현황 배지 */}
            {Object.keys(disasterStatus).length > 0 ? (
               <span className="rounded-xl font-bold bg-red-100 text-red-600 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5">
                 특보 발효중
               </span>
            ) : (
               <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5">
                 특보없음
               </span>
            )}
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">
             {/* 오늘 날짜 표시 */}
             {new Date().toISOString().slice(0, 10).replace(/-/g, '.')} 기준
          </p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-50">
              로딩 중...
            </div>
          ) : (
            <CommonMap 
              markers={[]} // 한파 경로 마커가 있다면 여기에 (지금은 없음)
              regionStatus={disasterStatus} // ★ 핵심: 지역별 색상 데이터 전달
            />
          )}

          {/* 상단 탭 메뉴 (모바일 가로스크롤 / PC 세로) */}
          <div className="absolute top-3 left-0 right-0 px-3 lg:px-0 lg:top-5 lg:left-5 lg:right-auto flex lg:flex-col gap-2 z-20 overflow-x-auto no-scrollbar">
            {mapTabs.map((tab) => (
              <div key={tab.id} className="relative flex flex-col gap-2 flex-shrink-0 lg:flex-shrink">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border
                    ${activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white/95 backdrop-blur-md border-gray-100 text-gray-600 hover:bg-white"
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

                {/* 재난안전시설 체크박스 그룹 */}
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 lg:static lg:mt-1">
                    <FacilityCheckGroup
                      items={coldWaveItems}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 행동요령 */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="한파" />
      </div>
    </div>
  );
};

export default ColdWave;