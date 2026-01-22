import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap"; 
import useColdWave from "@/hooks/user/useColdWave"; 

const ColdWave = () => {
  const { disasterStatus, markers, isLoading, fetchColdWaveData } = useColdWave();

  const [activeTab, setActiveTab] = useState("한파 특보");
  const [facilities, setFacilities] = useState({
    shelter: false,
    hospital: false,
    pharmacy: false,
  });

  const mapTabs = useMemo(() => [
    { id: "한파 특보", label: "한파 특보" },
    { id: "재난안전시설", label: "재난안전시설" },
  ], []);

  const coldWaveItems = useMemo(() => [
    { id: "shelter", label: "한파쉼터" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], []);

  // 마운트 시 데이터 호출
  useEffect(() => {
    fetchColdWaveData();
  }, [fetchColdWaveData]);

  // ✅ 재난안전시설 탭 클릭 시 '한파쉼터' 자동 체크 로직 추가
  useEffect(() => {
    if (activeTab === "재난안전시설") {
      setFacilities({ shelter: true, hospital: false, pharmacy: false });
    }
  }, [activeTab]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900 font-bold">
              실시간 한파정보
            </h3>
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 ${
              Object.keys(disasterStatus).length > 0 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
            }`}>
              {Object.keys(disasterStatus).length > 0 ? "특보 발효중" : "특보없음"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-detail-xs md:text-detail-s text-gray-400">
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

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-50">
              <span className="animate-pulse font-bold text-blue-500">실시간 데이터 수신 중...</span>
            </div>
          ) : (
            <CommonMap markers={markers} regionStatus={disasterStatus} />
          )}

          {/* ✅ 1. 체크박스 그룹: 다른 페이지와 동일하게 버튼 우측 독립 배치 */}
          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[128px] lg:left-[180px] z-30 
                            scale-[0.75] md:scale-100 origin-left">
              <FacilityCheckGroup
                items={coldWaveItems}
                facilities={facilities}
                onCheck={handleCheck}
              />
            </div>
          )}

          {/* ✅ 2. 좌측 사이드 탭 버튼: 가로 스크롤 제거하고 세로 배치 통일 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[140px]">
            {mapTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-center px-2 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-[11px] font-bold lg:text-body-m transition-all border shadow-md ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-blue-600 translate-x-1"
                    : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🔍 개발용 데이터 로그 뷰어 (필요 없으면 삭제해도 무방해!) */}
        <div className="mt-4 p-4 bg-gray-900 rounded-lg overflow-auto max-h-[100px] border-l-4 border-green-500">
          <pre className="text-white text-[10px] font-mono leading-relaxed">
            {JSON.stringify(disasterStatus, null, 2)}
          </pre>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ActionTipBox type="한파" />
      </div>
    </div>
  );
};

export default ColdWave;