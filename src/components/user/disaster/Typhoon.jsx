import React, { useState, useEffect, useMemo } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap";
import useTyphoon from "@/hooks/user/useTyphoon";

const Typhoon = () => {
  const { disasterStatus, isLoading, fetchTyphoonData } = useTyphoon();

  const [activeTab, setActiveTab] = useState("태풍경로도");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  // 탭 구성 정의
  const tabs = useMemo(() => [
    { id: "태풍특보", label: "태풍 특보" },
    { id: "태풍경로도", label: "태풍경로도" },
    { id: "재난안전시설", label: "재난안전시설" },
  ], []);

  const typhoonItems = useMemo(() => [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], []);

  // 1. 초기 데이터 로드
  useEffect(() => {
    fetchTyphoonData();
  }, [fetchTyphoonData]);

  // // 2. 탭 전환 핸들링 (대피소 자동 체크 로직 포함)
  // useEffect(() => {
  //   if (activeTab === "재난안전시설") {
  //     setFacilities({ shelter: true, hospital: false, pharmacy: false });
  //   }
  // }, [activeTab]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 태풍정보
            </h3>
            <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 ${
              Object.keys(disasterStatus).length > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
            }`}>
              {Object.keys(disasterStatus).length > 0 ? "특보 발효중" : "특보없음"}
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400">
            {new Date().toISOString().slice(0, 10).replace(/-/g, ".")} 기준
          </p>
        </div>

        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[400px] lg:min-h-0">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-50">로딩 중...</div>
          ) : (
            <CommonMap markers={[]} regionStatus={disasterStatus} />
          )}

          {/* ✅ 개선: 체크박스 그룹을 버튼 루프 밖으로 독립 배치 */}
          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[115px] lg:left-[180px] z-30 
                            scale-[0.75] md:scale-100 origin-left">
              <FacilityCheckGroup
                items={typhoonItems}
                facilities={facilities}
                onCheck={handleCheck}
              />
            </div>
          )}

          {/* ✅ 개선: 탭 버튼 매핑 수정 (tab.id, tab.label 활용) */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[150px]">
            {tabs.map((tab) => (
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
      </div>

      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 flex-shrink-0">
        <ActionTipBox type="태풍" />
      </div>
    </div>
  );
};

export default Typhoon;