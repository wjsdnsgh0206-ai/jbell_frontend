import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";
import useShelter from "@/hooks/user/useShelter";

const Earthquake = () => {
  const {
    eqMarkers,
    fetchEarthquakeData,
    clearMarkers,
    isLoading,
    getMapCenter,
    selectedMarker,
  } = useEarthquake();

  // 대피소 관련 훅 추가
  const { shelterMarkers, fetchShelters, setShelterMarkers } = useShelter();

  const [activeTab, setActiveTab] = useState("지진발생정보");
  const tabs = ["지진발생정보", "대피소"];

  // 탭 변경 시 데이터 로딩 로직
  useEffect(() => {
    if (activeTab === "지진발생정보") {
      // 대피소 데이터 초기화 후 지진 데이터 로드
      setShelterMarkers([]);
      fetchEarthquakeData();
    } else if (activeTab === "대피소") {
      // 지진 마커 초기화 후 지진옥외대피소 데이터 로드
      clearMarkers();
      fetchShelters("EARTHQUAKE_SHELTER");
    }
  }, [
    activeTab,
    fetchEarthquakeData,
    clearMarkers,
    fetchShelters,
    setShelterMarkers,
  ]);

  // 1. 탭에 따른 지도 중심점 결정 로직 추가
  const mapCenter = useMemo(() => {
    if (activeTab === "대피소") {
      // 대피소 클릭 시 전주시청 좌표 반환
      return { lat: 35.82422, lng: 127.14795 };
    }
    // 지진발생정보일 때는 기존 훅에서 제공하는 중심점 사용
    return getMapCenter(activeTab);
  }, [activeTab, getMapCenter]);

  // 2. 탭에 따른 지도 확대 레벨 결정 로직 추가
  const mapLevel = useMemo(() => {
    // 대피소 탭일 때는 전주시청 위주로 크게 보기 위해 레벨 5로 설정 (낮을수록 확대)
    return activeTab === "대피소" ? 5 : 8;
  }, [activeTab]);

  // 현재 탭에 따라 지도에 표시할 마커 결정
  const displayMarkers = useMemo(() => {
    const data = activeTab === "지진발생정보" ? eqMarkers : shelterMarkers;
    // // console.log("지도에 전달되는 최종 markers:", data);
    return data;
  }, [activeTab, eqMarkers, shelterMarkers]);

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h3 className="font-bold text-gray-900 text-[16px] md:text-[20px]">
            실시간 지진정보
          </h3>
          <span
            className={`rounded-xl font-bold text-[10px] px-2.5 py-1 ${displayMarkers.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}
          >
            {isLoading
              ? "조회 중..."
              : displayMarkers.length > 0
                ? "정보발령"
                : "정보없음"}
          </span>
        </div>

        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          <CommonMap
            markers={displayMarkers}
            center={mapCenter} // 새로 만든 mapCenter 전달
            level={mapLevel}   // 새로 만든 mapLevel 전달
            // 대피소 탭일 때는 선택된 지진 마커 강조 해제
            selectedMarker={
              activeTab === "지진발생정보" ? selectedMarker : null
            }
          />

          {!isLoading &&
            displayMarkers.length === 0 &&
            activeTab === "지진발생정보" && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pl-[120px] lg:pl-[180px]">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-lg mx-4 pointer-events-auto">
                  <p className="text-gray-600 text-[11px] md:text-sm font-semibold text-center">
                    최근 발생한 지진이 없습니다.
                  </p>
                </div>
              </div>
            )}

          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[140px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-center px-2 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-[11px] font-bold lg:text-body-m transition-all border shadow-md ${
                  activeTab === tab
                    ? "bg-blue-600 text-white border-blue-600 translate-x-1"
                    : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0 mb-0 lg:mb-0 shadow-sm">
        <ActionTipBox type="지진" />
      </div>
    </div>
  );
};

export default Earthquake;