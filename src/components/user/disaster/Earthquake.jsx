import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";

const Earthquake = () => {
  const JEONJU_CITY_HALL = { lat: 35.8242238, lng: 127.1479532 };
  const [activeTab, setActiveTab] = useState("지진특보");
  const [facilities, setFacilities] = useState({ shelter: false, hospital: false, pharmacy: false });

  const { eqMarkers, levelMarkers, fetchEarthquakeData, fetchEarthquakeLevel, clearMarkers, isLoading } = useEarthquake();

  useEffect(() => {
    if (activeTab === "지진특보") fetchEarthquakeData();
    else if (activeTab === "진도정보조회") fetchEarthquakeLevel();
    else clearMarkers();
  }, [activeTab, fetchEarthquakeData, fetchEarthquakeLevel, clearMarkers]);

  const displayMarkers = useMemo(() => {
    if (activeTab === "지진특보") return eqMarkers;
    if (activeTab === "진도정보조회") return levelMarkers;
    return [];
  }, [activeTab, eqMarkers, levelMarkers]);

  return (
    // 1. 최상위 컨테이너: h-full 대신 min-h-full을 사용하고 overflow를 열어줌
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0">
      
      {/* 지도 카드 영역: flex-shrink-0을 제거하여 유동적으로 변하게 함 */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h3 className="font-bold text-gray-900 text-[16px] md:text-[20px]">실시간 지진정보</h3>
          <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 ${displayMarkers.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"}`}>
            {isLoading ? "조회 중..." : displayMarkers.length > 0 ? "특보발령" : "특보없음"}
          </span>
        </div>

        {/* 2. 지도 높이 수정: 모바일에서 너무 길지 않게 h-[280px]~[300px]로 조정 */}
        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          <CommonMap markers={displayMarkers} center={JEONJU_CITY_HALL} level={8} />
          
          {!isLoading && displayMarkers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-lg mx-4">
                <p className="text-gray-600 text-[11px] md:text-sm font-semibold text-center">
                  최근 전북 지역의 {activeTab} 데이터가 없습니다.
                </p>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-0 right-0 px-3 flex gap-2 z-20 overflow-x-auto no-scrollbar">
            {["지진특보", "진도정보조회", "재난안전시설"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                  activeTab === tab ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 shadow-sm"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 z-20 scale-90 md:scale-100">
            <MapControlBtn />
          </div>
        </div>
      </div>

      {/* 3. 행동요령 박스: 
         - flex-shrink-0을 추가해 절대 높이가 줄어들지 않게 함
         - mb-20을 주어 모바일 하단 여백을 충분히 확보 (짤림 방지)
      */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0 mb-0 lg:mb-0 shadow-sm">
        <ActionTipBox type="지진" />
      </div>
    </div>
  );
};

export default Earthquake;