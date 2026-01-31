// src/components/user/disaster/Typhoon.jsx
import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap";
import useTyphoon from "@/hooks/user/useTyphoon";

const Typhoon = () => {
  // useTyphoon에서 경로(typhoonList), 색상(disasterStatus), 특보목록(markers) 모두 가져옴
  const { typhoonList, disasterStatus, markers, isLoading, fetchTyphoonData } = useTyphoon();

  const [activeTab, setActiveTab] = useState("태풍경로도");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  // 시설 체크 항목 정의
  const facilityItems = useMemo(() => [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], []);

  useEffect(() => {
    fetchTyphoonData();
  }, [fetchTyphoonData]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* 상단 지도 영역 박스 */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 태풍정보
            </h3>
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 ${
              markers.length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
            }`}>
              {markers.length > 0 ? "특보 발효중" : "특보없음"}
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">
            {new Date().toISOString().slice(0, 10).replace(/-/g, ".")} 기준
          </p>
        </div>

        {/* 지도 컨테이너 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          <CommonMap 
            markers={activeTab === "태풍경로도" ? typhoonList : markers} 
            regionStatus={disasterStatus} 
          />

          {/* 1. 재난안전시설 탭일 때 시설 체크 그룹 표시 */}
          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[115px] lg:left-[180px] z-30 scale-[0.75] md:scale-100 origin-left">
              <FacilityCheckGroup
                items={facilityItems}
                facilities={facilities}
                onCheck={handleCheck}
              />
            </div>
          )}

          {/* 2. 왼쪽 탭 메뉴 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[150px]">
            {["태풍특보", "태풍경로도", "재난안전시설"].map((tab) => (
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

          {/* 3. 태풍특보 클릭 시 지도 우측에 나타나는 목록형 div */}
          {activeTab === "태풍특보" && markers.length > 0 && (
            <div className="absolute top-5 right-5 z-30 w-56 lg:w-64 max-h-[80%] bg-white/90 backdrop-blur shadow-xl rounded-2xl border border-gray-200 overflow-y-auto p-4 animate-in fade-in slide-in-from-right-5 duration-300">
              <h4 className="text-body-s-bold lg:text-body-m-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                실시간 특보 현황
              </h4>
              <div className="flex flex-col gap-2">
                {markers.map((item) => (
                  <div key={item.id} className="p-3 bg-white/50 rounded-lg border border-gray-100 shadow-sm hover:bg-white transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-sm lg:text-base">{item.region}</span>
                      <span className={`text-[10px] lg:text-[11px] px-2 py-0.5 rounded-full text-white font-bold`} style={{ backgroundColor: item.color }}>
                        {item.level}
                      </span>
                    </div>
                    <p className="text-[10px] lg:text-[11px] text-gray-500">발효: {item.startTime}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 행동요령 영역 (절대 사라지지 않아!) */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="태풍" />
      </div>
    </div>
  );
};

export default Typhoon;