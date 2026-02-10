import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import CommonMap from "@/components/user/modal/CommonMap";
import useTyphoon from "@/hooks/user/useTyphoon";
import useShelter from "@/hooks/user/useShelter"; // 대피소 훅 추가

const Typhoon = () => {
  const { typhoonList, disasterStatus, markers, isLoading, fetchTyphoonData } = useTyphoon();
  // 대피소 관련 훅 추가
  const { shelterMarkers, fetchShelters, setShelterMarkers } = useShelter();

  const [activeTab, setActiveTab] = useState("태풍특보");

  // 영향권 판단 기준 (전북도청 좌표)
  const JEONBUK_OFFICE = { lat: 35.8202, lng: 127.1088 };

  const mapTabs = [
    // { id: "태풍특보", label: "태풍특보" },
    { id: "태풍특보", label: "태풍특보" },
    { id: "대피소", label: "대피소" },
  ];

  // 탭 변경 및 데이터 로딩 로직
  useEffect(() => {
    if (activeTab === "대피소") {
      // 태풍 시에는 수해/민방위 대피소가 중요하므로 해당 타입 호출
      fetchShelters("CIVIL_DEFENSE_DISASTER");
    } else {
      setShelterMarkers([]); // 다른 탭으로 이동 시 대피소 마커 초기화
      fetchTyphoonData();
    }
  }, [activeTab, fetchTyphoonData, fetchShelters, setShelterMarkers]);

  // 1. 최근 한 달 태풍 리스트 필터링
  const recentMonthTyphoonList = useMemo(() => {
    const ONE_MONTH_AGO = new Date();
    ONE_MONTH_AGO.setDate(ONE_MONTH_AGO.getDate() - 30);

    return typhoonList
      .filter((tp) => {
        const dt = tp.typhoonAnalysisDatetime;
        if (!dt || dt.length < 8) return false;
        
        const analysisDate = new Date(
          `${dt.substring(0, 4)}-${dt.substring(4, 6)}-${dt.substring(6, 8)}T${dt.substring(8, 10)}:00:00`
        );
        return analysisDate >= ONE_MONTH_AGO;
      })
      .map((tp) => {
        const R = 6371;
        const dLat = (tp.typhoonLat - JEONBUK_OFFICE.lat) * (Math.PI / 180);
        const dLon = (tp.typhoonLon - JEONBUK_OFFICE.lng) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(JEONBUK_OFFICE.lat * (Math.PI / 180)) * Math.cos(tp.typhoonLat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...tp,
          isJeonbukAffected: distance < 500,
        };
      });
  }, [typhoonList]);

  // 2. 탭에 따른 지도 중심점 결정
  const mapCenter = useMemo(() => {
    if (activeTab === "대피소") {
      return { lat: 35.82422, lng: 127.14795 }; // 전주시청 중심
    }
    return JEONBUK_OFFICE;
  }, [activeTab]);

  // 3. 탭에 따른 지도 확대 레벨 결정
  const mapLevel = useMemo(() => {
    if (activeTab === "대피소") return 5;
    if (activeTab === "태풍특보") return 11; // 경로도는 더 넓게
    return 8;
  }, [activeTab]);

  // 4. 현재 탭에 따라 표시할 마커 결정
  const displayMarkers = useMemo(() => {
    if (activeTab === "대피소") return shelterMarkers;
    if (activeTab === "태풍특보") {
      return recentMonthTyphoonList.map(t => ({...t, lat: t.typhoonLat, lng: t.typhoonLon}));
    }
    return markers; // 태풍특보 마커
  }, [activeTab, shelterMarkers, recentMonthTyphoonList, markers]);

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 태풍정보
            </h3>
            <span className={`rounded-xl font-bold text-center text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 transition-colors ${
              markers.length > 0 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            }`}>
              {markers.length > 0 ? "특보 발효중" : "정상"}
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">
            {new Date().toISOString().slice(0, 10).replace(/-/g, ".")} 기준
          </p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="absolute inset-0 z-0">
            <CommonMap 
              markers={displayMarkers} 
              center={mapCenter}
              level={mapLevel}
              regionStatus={activeTab === "대피소" ? null : disasterStatus} 
            />
          </div>

          {(activeTab === "태풍특보") && (
            <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[2px] p-4 pl-[120px] lg:pl-[180px] overflow-y-auto no-scrollbar pointer-events-none">
              <div className="flex flex-col gap-4 max-w-4xl pointer-events-auto">
                <div className="bg-white/95 p-3 rounded-xl shadow-md border border-blue-200 self-start backdrop-blur-md">
                  <p className="text-detail-s-bold text-blue-700 flex items-center gap-2">
                    {activeTab === "태풍특보" ? "전북지역 태풍특보 현황" : "최근 한 달 태풍 특보"}
                  </p>
                </div>

                {isLoading ? (
                  <div className="h-[200px] flex flex-col items-center justify-center bg-white/50 rounded-2xl">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 font-medium text-detail-s">데이터 로딩 중...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
                    {activeTab === "태풍특보" && recentMonthTyphoonList.map((tp) => {
                      const isClosed = tp.typhoonActiveYn !== "Y";
                      return (
                        <div key={tp.id} className={`bg-white p-5 rounded-2xl shadow-xl border-2 transition-all hover:scale-[1.01] ${
                          isClosed ? "border-gray-200 opacity-80" : "border-blue-400 ring-4 ring-blue-50"
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-body-m-bold text-gray-900">{tp.typhoonName || "태풍정보"}</h4>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isClosed ? "bg-gray-200 text-gray-500" : "bg-green-100 text-green-600"}`}>
                                  {isClosed ? "소멸/종료" : "진행중"}
                                </span>
                                {tp.isJeonbukAffected && !isClosed && (
                                  <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-bold animate-bounce">전북 영향권</span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium">
                                📅 분석: {tp.typhoonAnalysisDatetime ? 
                                  `${tp.typhoonAnalysisDatetime.substring(4, 6)}.${tp.typhoonAnalysisDatetime.substring(6, 8)} ${tp.typhoonAnalysisDatetime.substring(8, 10)}:00` 
                                  : "정보 없음"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-2 bg-slate-50 rounded-lg border border-gray-100 text-center">
                              <p className="text-[10px] text-gray-400 mb-0.5">위도</p>
                              <p className="text-detail-s-bold text-gray-700">{tp.typhoonLat}°N</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-gray-100 text-center">
                              <p className="text-[10px] text-gray-400 mb-0.5">경도</p>
                              <p className="text-detail-s-bold text-gray-700">{tp.typhoonLon}°E</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {((activeTab === "태풍특보" && markers.length === 0) || 
                      (activeTab === "태풍특보" && recentMonthTyphoonList.length === 0)) && (
                      <div className="col-span-full py-20 bg-white/60 rounded-3xl text-center border-2 border-dashed border-gray-200 flex flex-col items-center gap-3">
                        <p className="text-gray-500 text-detail-s font-medium">
                          {activeTab === "태풍특보" ? "최근 한 달 이내 발생한 태풍 정보가 없습니다." : "현재 발령된 태풍 특보가 없습니다."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 사이드 탭 버튼 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-30">
            {mapTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-3 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-detail-s-bold lg:text-body-m transition-all border shadow-md ${
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
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-shrink-0 shadow-sm">
        <ActionTipBox type="태풍" />
      </div>
    </div>
  );
};

export default Typhoon;