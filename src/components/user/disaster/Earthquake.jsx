import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";

const Earthquake = () => {
  const {
    eqMarkers,
    fetchEarthquakeData,
    clearMarkers,
    isLoading,
    getMapCenter,
    selectedMarker,
  } = useEarthquake();

  const [activeTab, setActiveTab] = useState("지진발생정보");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const EarthquakeItems = useMemo(() => [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], []);

  // 진도정보조회 제거
  const tabs = ["지진발생정보", "재난안전시설"];

  useEffect(() => {
    if (activeTab === "지진발생정보") fetchEarthquakeData();
    else clearMarkers();
  }, [activeTab, fetchEarthquakeData, clearMarkers]);

  const displayMarkers = useMemo(() => {
    if (activeTab === "지진발생정보") return eqMarkers;
    return [];
  }, [activeTab, eqMarkers]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h3 className="font-bold text-gray-900 text-[16px] md:text-[20px]">실시간 지진정보</h3>
          <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 ${displayMarkers.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
            {isLoading ? "조회 중..." : displayMarkers.length > 0 ? "정보발령" : "정보없음"}
          </span>
        </div>

        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          <CommonMap
            markers={displayMarkers}
            center={getMapCenter(activeTab)}
            level={8}
            selectedMarker={activeTab === "지진발생정보" ? selectedMarker : null}
          />

          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[115px] lg:left-[175px] z-30 scale-[0.75] md:scale-100 origin-left">
              <FacilityCheckGroup
                items={EarthquakeItems}
                facilities={facilities}
                onCheck={handleCheck}
              />
            </div>
          )}

          {!isLoading && displayMarkers.length === 0 && activeTab === "지진발생정보" && (
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