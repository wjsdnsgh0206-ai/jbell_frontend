import React, { useState, useEffect } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useLandSlide from "@/hooks/user/useLandSlide";

const LandSlide = () => {
  // lsMarkers 대신 lsData 사용
  const { lsData, isLoading, fetchLandSlideData } = useLandSlide();
  const [activeTab, setActiveTab] = useState("위험예보");
  const [facilities, setFacilities] = useState({
    shelter: true,
    hospital: false,
    pharmacy: false,
  });

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    if (activeTab === "위험예보") fetchLandSlideData();
  }, [activeTab, fetchLandSlideData]);

  const LandSlideItems = [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  // 활성 특보 여부 판단
  const hasActiveNotice = lsData.some((item) => item.isActiveWarning);
  
  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6 overflow-hidden">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 lg:gap-3">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">
              실시간 산사태정보
            </h3>
            <span
              className={`rounded-xl font-bold text-[10px] px-2.5 py-1 md:text-detail-s md:px-4 md:py-1.5 transition-colors ${
                hasActiveNotice
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {isLoading
                ? "조회중..."
                : hasActiveNotice
                  ? "특보발생"
                  : "특보없음"}
            </span>
          </div>
          <p className="text-detail-xs md:text-detail-s text-gray-400 font-medium">
            {todayStr} 기준
          </p>
        </div>

        {/* 지도 영역 */}
        <div className="relative flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-0">
          <div className="absolute inset-0 z-0">
            {/* 📌 산사태는 마커를 안 넘기기로 했으므로 빈 배열 전달 */}
            <CommonMap markers={[]} />
          </div>

          {/* 위험예보 리스트 오버레이 */}
          {activeTab === "위험예보" && (
            <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1.5px] p-4 pl-[110px] md:pl-[140px] lg:pl-[180px] overflow-y-auto no-scrollbar">
              <div className="flex flex-col gap-4 max-w-2xl">
                <div
                  className={`bg-white/95 p-3 rounded-xl shadow-md border self-start backdrop-blur-md ${
                    hasActiveNotice ? "border-orange-200" : "border-gray-200"
                  }`}
                >
                  <p
                    className={`text-detail-s-bold flex items-center gap-2 ${
                      hasActiveNotice ? "text-orange-700" : "text-gray-500"
                    }`}
                  >
                    {hasActiveNotice
                      ? "⚠️ 전북 지역 산사태 발령 현황"
                      : "✅ 현재 유효한 산사태 특보가 없습니다."}
                  </p>
                </div>

                {isLoading ? (
                  <div className="h-[200px] flex flex-col items-center justify-center bg-white/50 rounded-2xl backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500 font-medium text-detail-s">
                      데이터 로드 중...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {lsData.length > 0 ? (
                      lsData.map((item) => (
                        <div
                          key={item.id}
                          className={`bg-white p-4 rounded-2xl shadow-lg border-l-4 transition-all ${
                            item.isActiveWarning
                              ? "border-orange-500"
                              : "border-gray-300 opacity-80"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  item.isActiveWarning
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {item.info.grade}
                              </span>
                              <h4 className="text-gray-900 font-bold text-base mt-1">
                                {item.info.name}
                              </h4>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {item.info.date}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                            <span className="text-detail-s text-gray-500">
                              📞 연락처:{" "}
                              <span className="text-gray-800 font-semibold">
                                {item.info.tel}
                              </span>
                            </span>
                            <span
                              className={`text-detail-s font-extrabold ${
                                item.isActiveWarning
                                  ? "text-red-600 animate-pulse"
                                  : "text-blue-500"
                              }`}
                            >
                              {item.info.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white/80 p-10 rounded-2xl text-center border border-dashed border-gray-300">
                        <p className="text-gray-400 text-detail-s">
                          조회된 데이터가 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[115px] lg:left-[180px] z-20 scale-[0.8] md:scale-100 origin-left">
              <FacilityCheckGroup
                items={LandSlideItems}
                facilities={facilities}
                onCheck={handleCheck}
              />
            </div>
          )}

          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-30">
            {["위험예보", "재난안전시설"].map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center justify-center px-3 py-2 lg:px-5 lg:py-3 rounded-2xl text-detail-s lg:text-body-m transition-all border shadow-sm ${
                  activeTab === label
                    ? "bg-blue-600 text-white border-blue-600 translate-x-1"
                    : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex-shrink-0 mb-0">
        <ActionTipBox type="산사태" />
      </div>
    </div>
  );
};

export default LandSlide;