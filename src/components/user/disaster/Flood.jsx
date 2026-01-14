import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap"; 
import FloodGeometryMap from "@/components/user/modal/FloodGeometryMap";
import { useSluiceData } from "@/hooks/user/useSluiceData";

const Flood = () => {
  const [activeTab, setActiveTab] = useState("침수흔적도");
  const [facilities, setFacilities] = useState({ 
    shelter: true, 
    hospital: false, 
    pharmacy: false 
  });

  const { damData, loading, fetchDamData } = useSluiceData();

  const mapTabs = [
    { id: "침수흔적도", label: "침수흔적도" },
    { id: "수방시설물", label: "수방시설물" },
    { id: "재난안전시설", label: "재난안전시설" },
  ];

  const floodItems = [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "수방시설물") {
      console.log("📍 수방시설물 탭 클릭! 데이터 호출 시작...");
      fetchDamData();
    }
  };

  const handleCheck = (key) => {
    setFacilities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isDangerous = damData.some(dam => parseFloat(dam.storageRate) >= 90);

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 홍수정보
            </h3>
            {damData.length > 0 && (
              <span className={`rounded-xl font-bold text-center text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 md:w-[80px] transition-colors ${
                isDangerous ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
              }`}>
                {isDangerous ? "위험" : "정상"}
              </span>
            )}
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">
            {damData.length > 0 ? `${damData[0].time} 기준` : "지역별 상세 정보를 확인하세요"}
          </p>
        </div>

        {/* 지도 및 오버레이 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          
          {/* 1. 배경 지도 */}
          <div className="absolute inset-0 z-0">
            {activeTab === "침수흔적도" ? (
              <FloodGeometryMap />
            ) : (
              <CommonMap markers={[]} /> 
            )}
          </div>

          {/* 2. 수방시설물 카드 오버레이 (탭과 겹치지 않게 여백 조정) */}
          {activeTab === "수방시설물" && (
            <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[2px] p-4 pl-[120px] lg:pl-[180px] overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-4 max-w-4xl">
                <div className="bg-white/95 p-3 rounded-xl shadow-md border border-blue-200 self-start backdrop-blur-md">
                  <p className="text-detail-s-bold text-blue-700 flex items-center gap-2">
                    <span className="animate-pulse">🌊</span> 전북 및 전국 주요 댐 현황
                  </p>
                </div>

                {loading ? (
                  <div className="h-[200px] flex flex-col items-center justify-center bg-white/50 rounded-2xl">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 font-medium text-detail-s">데이터 로딩 중...</p>
                  </div>
                ) : damData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {damData.map((dam, index) => (
                      <div 
                        key={`dam-${dam.damCode}-${index}`} 
                        className={`bg-white p-5 rounded-2xl shadow-xl border-2 transition-all ${
                          dam.region === '전북' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              {dam.region === '전북' && <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">전북</span>}
                              <h4 className="text-body-m-bold text-gray-900">{dam.name}</h4>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">{dam.damCode}</span>
                          </div>
                          <div className="text-right">
                             <span className={`text-[11px] px-2 py-1 rounded-lg font-bold inline-block ${
                              parseFloat(dam.storageRate) >= 90 ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                            }`}>
                              저수율 {dam.storageRate}%
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-4">
                          <div className="flex justify-between items-center text-detail-s p-2 bg-slate-50 rounded-lg">
                            <span className="text-gray-500">현재수위</span>
                            <span className="font-semibold text-gray-900">{dam.waterLevel} EL.m</span>
                          </div>
                          <div className="flex justify-between items-center text-detail-s p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-blue-700 font-bold">현재 방류량</span>
                            <span className="font-bold text-blue-700">{dam.discharge} ㎥/sec</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center bg-white/80 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-detail-s">조회된 수문 데이터가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. 재난안전시설 체크박스 (탭 우측으로 배치) */}
          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[120px] lg:left-[180px] z-20">
              <FacilityCheckGroup 
                items={floodItems} 
                facilities={facilities} 
                onCheck={handleCheck} 
              />
            </div>
          )}

          {/* 4. 좌측 사이드 탭 버튼 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-30">
            {mapTabs.map((tab, idx) => (
              <button 
                key={`tab-${tab.id}-${idx}`}
                onClick={() => handleTabClick(tab.id)} 
                className={`w-[100px] lg:w-[140px] px-2 py-3 lg:py-4 rounded-xl text-detail-s-bold lg:text-body-m-bold transition-all border shadow-lg ${
                  activeTab === tab.id 
                  ? "bg-blue-600 text-white border-blue-700 translate-x-1" 
                  : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 5. 우측 하단 줌 컨트롤 */}
          <div className="absolute bottom-5 right-5 z-20">
            <MapControlBtn />
          </div>
        </div>
      </div>

      {/* 하단 행동요령 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0 mb-10 lg:mb-0">
        <ActionTipBox type="호우·홍수" />
      </div>
    </div>
  );
};

export default Flood;