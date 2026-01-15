import React, { useState, useEffect } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useLandSlide from "@/hooks/user/useLandSlide";

const LandSlide = () => {
  const { lsMarkers, isLoading, fetchLandSlideData } = useLandSlide();
  const [activeTab, setActiveTab] = useState("위험예보");
  const [selectedInfo, setSelectedInfo] = useState(null); 
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  useEffect(() => {
    if (activeTab === "위험예보") {
      fetchLandSlideData();
    }
  }, [activeTab, fetchLandSlideData]);

  const handleTabClick = (tabId) => {
    setActiveTab(prev => (prev === tabId ? null : tabId));
    setSelectedInfo(null); 
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0 shadow-sm">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 산사태정보
            </h3>
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 transition-colors ${
              lsMarkers.length > 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
            }`}>
              {lsMarkers.length > 0 ? "특보발생" : "특보없음"}
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400 font-medium">2026.01.14 기준</p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[450px]">
          
          <CommonMap 
            markers={activeTab === "위험예보" ? lsMarkers : []} 
            onMarkerClick={(marker) => setSelectedInfo(marker.info)}
          />

          {/* [마커 클릭 상세 정보 카드] */}
          {selectedInfo && (
            <div className="absolute top-4 right-4 z-40 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-5 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    위험예보: {selectedInfo.grade}
                  </span>
                  <h4 className="text-gray-900 font-bold text-lg mt-1">{selectedInfo.name}</h4>
                </div>
                <button onClick={() => setSelectedInfo(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 text-xs mt-0.5">📍</span>
                  <p className="text-gray-600 text-xs leading-relaxed">{selectedInfo.address}</p>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">지정 대피소</span>
                    <span className="text-gray-900 font-bold">{selectedInfo.shelter}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-blue-100 pt-2">
                    <span className="text-gray-500 font-medium">비상 연락처</span>
                    <span className="text-blue-600 font-bold">{selectedInfo.tel}</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 flex justify-between">
                  <span>발생일: {selectedInfo.date}</span>
                  <span>코드: {selectedInfo.gradeCode}</span>
                </div>

                <button 
                  className="w-full py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  onClick={() => alert(selectedInfo.desc)}
                >
                  상세 행동요령 확인
                </button>
              </div>
            </div>
          )}

          {/* 데이터 없음 안내 */}
          {!isLoading && activeTab === "위험예보" && lsMarkers.length === 0 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-lg mx-4">
                <p className="text-gray-600 text-sm font-semibold text-center">
                  최근 7일간 전북 지역의 산사태 위험 데이터가 없습니다.
                </p>
              </div>
            </div>
          )}

          {/* 탭 메뉴 */}
          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
            {["위험예보", "주의보/경보 현황", "재난안전시설"].map((label) => (
              <button
                key={label}
                onClick={() => handleTabClick(label)}
                className={`px-5 py-3 rounded-xl text-body-m-bold border transition-all ${
                  activeTab === label ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white/95 text-gray-600 border-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <ActionTipBox type="산사태" />
      </div>
    </div>
  );
};

export default LandSlide;