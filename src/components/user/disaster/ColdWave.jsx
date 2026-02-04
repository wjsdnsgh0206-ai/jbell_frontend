import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
// import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap"; 
import useColdWave from "@/hooks/user/useColdWave"; 
import useShelter from "@/hooks/user/useShelter"; // 대피소 훅 추가
import WeatherWarningBox from "@/components/user/modal/WeatherWarningBox"; // 👈 추가 확인!



const ColdWave = () => {
  // ✅ 실시간 한파 데이터 로직이 담긴 전용 Hook
  const { disasterStatus, markers: waveMarkers, isLoading, fetchColdWaveData } = useColdWave();
  const { shelterMarkers, fetchShelters, setShelterMarkers } = useShelter();

  const [activeTab, setActiveTab] = useState("한파 특보");

  const mapTabs = ["한파 특보", "대피소"];

  // ✅ 탭 변경 시 데이터 로딩 로직
  useEffect(() => {
    if (activeTab === "한파 특보") {
      setShelterMarkers([]); // 탭 이동 시 마커 초기화
      fetchColdWaveData();
    } else if (activeTab === "대피소") {
      // 한파 시에는 한파 쉼터 데이터 호출
      fetchShelters("COLD_SHELTER");
    }
  }, [activeTab, fetchColdWaveData, fetchShelters, setShelterMarkers]);

  // ✅ 1. 탭에 따른 지도 중심점 결정
  const mapCenter = useMemo(() => {
    return { lat: 35.82422, lng: 127.14795 };
  }, []);

  // ✅ 2. 탭에 따른 지도 확대 레벨 결정
  const mapLevel = useMemo(() => {
    return activeTab === "대피소" ? 5 : 8;
  }, [activeTab]);

  // ✅ 3. 현재 탭에 따라 표시할 마커 결정
  const displayMarkers = useMemo(() => {
    return activeTab === "대피소" ? shelterMarkers : waveMarkers;
  }, [activeTab, shelterMarkers, waveMarkers]);

  // ✅ [로그 체크]
  useEffect(() => {
    if (displayMarkers && displayMarkers.length > 0) {
      console.log("📍 지도에 표시될 마커 데이터:", displayMarkers);
    }
  }, [displayMarkers]);

  const handleTabClick = (tabId) =>
    setActiveTab((prev) => (prev === tabId ? null : tabId));

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0 shadow-sm">
        
        {/* 헤더 섹션 - 지진 페이지 스타일 적용 */}
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-[16px] md:text-[20px]">
              실시간 한파정보
            </h3>
            {/* 특보 발효 중일 때만 파란색 배지 노출 */}
            {Object.keys(disasterStatus).length > 0 ? (
               <span className="rounded-xl font-bold bg-blue-100 text-blue-600 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 transition-colors">
                 특보 발효중
               </span>
            ) : (
               <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 transition-colors">
                 특보없음
               </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <p className="hidden md:block text-detail-xs md:text-detail-s text-gray-400 font-medium">
              {new Date().toISOString().slice(0, 10).replace(/-/g, '.')} 기준
            </p>
            <button 
              onClick={() => fetchColdWaveData()} 
              className="px-2 py-1 border border-gray-300 rounded text-detail-s text-blue-600 hover:bg-gray-50 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 지도 영역 - 지진 페이지의 h-[280px] md:h-[350px] 반응형 높이 구조 적용 */}
        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          {isLoading && activeTab === "한파 특보" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-50">
              <span className="animate-pulse font-bold text-blue-500">실시간 데이터 수신 중...</span>
            </div>
          ) : (
            <>
              {/* 데이터가 없을 때 안내 문구 - 지진 페이지 위치 로직 적용 */}
              {activeTab === "한파 특보" && Object.keys(disasterStatus).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pl-[120px] lg:pl-[180px]">
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-lg mx-4 pointer-events-auto">
                    <p className="text-gray-600 text-[11px] md:text-sm font-semibold text-center">
                      현재 발효 중인 한파 특보가 없습니다.
                    </p>
                  </div>
                </div>
              )}
              <CommonMap 
                markers={displayMarkers} 
                regionStatus={activeTab === "대피소" ? null : disasterStatus} 
                center={mapCenter}
                level={mapLevel}
              />
            </>
          )}

          {/* 탭 버튼 - 지진 페이지의 고정 너비 및 위치 로직 적용 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[140px]">
            {mapTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  w-full flex items-center justify-center px-2 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-[11px] font-bold lg:text-body-m transition-all border shadow-md
                  ${activeTab === tab
                      ? "bg-blue-600 text-white border-blue-600 translate-x-1"
                      : "bg-white/95 backdrop-blur-md border-gray-100 text-gray-600 hover:bg-white"
                  }
                `}
              >
                <span className="whitespace-nowrap">{tab}</span>
              </button>
            ))}
          </div>
        </div>


      </div>
      {/* 하단 팁박스 - 지진 페이지와 동일한 마진 구조 적용 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-shrink-0">
        <ActionTipBox type="한파" />
      </div>
    </div>
  );
};

export default ColdWave;