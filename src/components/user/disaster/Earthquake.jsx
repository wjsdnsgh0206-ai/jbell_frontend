import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";

const Earthquake = () => {
  // 전주시청 좌표 설정
  const JEONJU_CITY_HALL = { lat: 35.8242238, lng: 127.1479532 };

  const [activeTab, setActiveTab] = useState("지진특보");
  const [facilities, setFacilities] = useState({
    shelter: false, hospital: false, pharmacy: false,
  });

  const { 
    eqMarkers, 
    levelMarkers, 
    fetchEarthquakeData, 
    fetchEarthquakeLevel, 
    clearMarkers, 
    isLoading 
  } = useEarthquake();

  useEffect(() => {
    if (activeTab === "지진특보") {
      fetchEarthquakeData();
    } else if (activeTab === "진도정보조회") {
      fetchEarthquakeLevel();
    } else {
      clearMarkers();
    }
  }, [activeTab, fetchEarthquakeData, fetchEarthquakeLevel, clearMarkers]);

  const displayMarkers = useMemo(() => {
    if (activeTab === "지진특보") return eqMarkers;
    if (activeTab === "진도정보조회") return levelMarkers;
    return [];
  }, [activeTab, eqMarkers, levelMarkers]);

  const handleTabClick = (tabId) => setActiveTab(tabId);
  const handleCheck = (key) => setFacilities(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 지진정보
            </h3>
            
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 transition-colors ${
              isLoading ? "bg-gray-100 text-gray-500" :
              displayMarkers.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
            }`}>
              {isLoading ? "조회 중..." : 
               displayMarkers.length > 0 ? (activeTab === "지진특보" ? "특보발령" : "진도감지") : "특보없음"}
            </span>
          </div>
        </div>

        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px]">
          {/* CommonMap에 중심점(center)과 레벨(level)을 전달.
            컴포넌트 구현에 따라 속성명은 다를 수 있어! 
          */}
          <CommonMap 
            markers={displayMarkers} 
            center={JEONJU_CITY_HALL} 
            level={8} 
          />

          {!isLoading && displayMarkers.length === 0 && (activeTab === "지진특보" || activeTab === "진도정보조회") && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm px-8 py-5 rounded-2xl border border-gray-200 shadow-xl">
                <p className="text-gray-600 text-sm font-semibold text-center">
                  최근 한 달 내 전북 지역 지진 데이터가 없습니다.
                </p>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 left-0 right-0 px-3 flex gap-2 z-20 overflow-x-auto no-scrollbar">
            {["지진특보", "진도정보조회", "재난안전시설"].map((tab) => (
              <div key={tab} className="relative flex-shrink-0">
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 rounded-xl border transition-all font-medium ${
                    activeTab === tab 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                      : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {tab}
                </button>
                {tab === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 shadow-2xl">
                    <FacilityCheckGroup
                      items={[{ id: "shelter", label: "대피소" }, { id: "hospital", label: "병원" }, { id: "pharmacy", label: "약국" }]}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-5 right-5 z-20">
            <MapControlBtn />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="지진" />
      </div>
    </div>
  );
};

export default Earthquake;