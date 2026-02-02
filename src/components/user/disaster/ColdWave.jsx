import React, { useState, useEffect } from "react";
import ActionTipBox from "../modal/ActionTipBox";
// import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap"; 
import useColdWave from "@/hooks/user/useColdWave"; 

const ColdWave = () => {
  // ✅ 실시간 한파 데이터 로직이 담긴 전용 Hook
  const { disasterStatus, markers, isLoading, fetchColdWaveData } = useColdWave();

  const [activeTab, setActiveTab] = useState("한파 특보");
  // const [facilities, setFacilities] = useState({
  //   shelter: true,
  //   hospital: false,
  //   pharmacy: false,
  // });

  const mapTabs = [
    { id: "한파 특보", label: "한파 특보" },
    { id: "대피소", label: "대피소", hasArrow: true },
  ];

  // ✅ 마운트 시 데이터 호출
  useEffect(() => {
    fetchColdWaveData();
  }, [fetchColdWaveData]);

  // ✅ [수정] 의존성 배열 에러 방지를 위해 하나씩 체크하도록 분리
  useEffect(() => {
    if (markers.length > 0) {
      console.log("📍 지도에 표시될 마커 데이터:", markers);
    }
  }, [markers]);

  useEffect(() => {
    if (Object.keys(disasterStatus).length > 0) {
      console.log("🎨 지역별 매핑 상태:", disasterStatus);
    }
  }, [disasterStatus]);

  const handleTabClick = (tabId) =>
    setActiveTab((prev) => (prev === tabId ? null : tabId));
  // const handleCheck = (key) =>
  //   setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900 font-bold">
              실시간 한파정보
            </h3>
            {/* 특보 발효 중일 때만 파란색 배지 노출 */}
            {Object.keys(disasterStatus).length > 0 ? (
               <span className="rounded-xl font-bold bg-blue-100 text-blue-600 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5">
                 특보 발효중
               </span>
            ) : (
               <span className="rounded-xl font-bold bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5">
                 특보없음
               </span>
            )}
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
            <>
              {/* 데이터가 없을 때만 안내 문구 표시 */}
              {Object.keys(disasterStatus).length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/80 px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-detail-s font-bold">현재 발효 중인 한파 특보가 없습니다.</p>
                </div>
              )}
              <CommonMap 
                markers={markers} 
                regionStatus={disasterStatus} 
              />
            </>
          )}

          {/* 탭 버튼 */}
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
                  {/* {tab.hasArrow && (
                    <span className={`hidden lg:block ml-2 transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`}>
                      <span className="text-[10px]">▶</span>
                    </span>
                  )} */}
                </button>

              </div>
            ))}
          </div>
        </div>

        {/* 🔍 개발용 데이터 로그 뷰어 */}
        <div className="mt-4 p-4 bg-gray-900 rounded-lg overflow-auto max-h-[200px] border-l-4 border-green-500">
          <p className="text-green-400 text-xs mb-2 font-bold">// 실시간 매핑 결과 (Mapping Table 적용됨)</p>
          <pre className="text-white text-[10px] leading-relaxed">
            {JSON.stringify(disasterStatus, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ColdWave;