import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useEarthquake from "@/hooks/user/useEarthquake";

const Earthquake = () => {
  const [activeTab, setActiveTab] = useState("지진특보");
  const [facilities, setFacilities] = useState({
    shelter: false,
    hospital: false,
    pharmacy: false,
  });

  const { eqMarkers, fetchEarthquakeData, clearEqMarkers, isLoading } = useEarthquake();

  // 탭 변경 시 데이터 로드 및 초기화
  useEffect(() => {
    if (activeTab === "지진특보") {
      fetchEarthquakeData();
    } else {
      clearEqMarkers();
    }
  }, [activeTab, fetchEarthquakeData, clearEqMarkers]);

  // 지도에 넘겨줄 마커 설정
  const displayMarkers = useMemo(() => {
    if (activeTab === "지진특보") return eqMarkers;
    return [];
  }, [activeTab, eqMarkers]);

  const handleTabClick = (tabId) => setActiveTab((prev) => (prev === tabId ? null : tabId));
  const handleCheck = (key) => setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        
        {/* 상단 헤더: 제목 및 상태 표시 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 지진정보
            </h3>
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 transition-colors ${
              eqMarkers.length > 0 ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
            }`}>
              {isLoading ? "조회 중..." : eqMarkers.length > 0 ? "특보발령" : "특보없음"}
            </span>
          </div>
        </div>

        {/* 지도 및 오버레이 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px]">
          <CommonMap markers={displayMarkers} />

          {/* 🌟 데이터가 없을 때 중앙에 띄울 투명 안내 박스 */}
          {activeTab === "지진특보" && !isLoading && eqMarkers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm px-8 py-5 rounded-2xl border border-gray-200 shadow-xl">
                <p className="text-gray-600 text-sm md:text-base font-semibold text-center">
                  한 달 동안의 지진 특보가 존재하지 않습니다.
                </p>
              </div>
            </div>
          )}
          
          {/* 상단 탭 버튼들 */}
          <div className="absolute top-3 left-0 right-0 px-3 flex gap-2 z-20 overflow-x-auto no-scrollbar">
            {[
              { id: "기상특보", label: "기상특보" }, 
              { id: "지진특보", label: "지진특보" }, 
              { id: "진도정보조회", label: "진도정보조회" }, 
              { id: "재난안전시설", label: "재난안전시설" }
            ].map((tab) => (
              <div key={tab.id} className="relative flex-shrink-0">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 rounded-xl border transition-all font-medium ${
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                      : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {tab.label}
                </button>
                
                {tab.id === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="absolute top-12 left-0 shadow-2xl">
                    <FacilityCheckGroup
                      items={[
                        { id: "shelter", label: "지진옥외대피장소" }, 
                        { id: "hospital", label: "병원" }, 
                        { id: "pharmacy", label: "약국" }
                      ]}
                      facilities={facilities}
                      onCheck={handleCheck}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 우측 하단 컨트롤 버튼 */}
          <div className="absolute bottom-5 right-5 z-20">
            <MapControlBtn />
          </div>
        </div>
      </div>

      {/* 하단 행동요령 박스 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="지진" />
      </div>
    </div>
  );
};

export default Earthquake;