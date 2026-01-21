import React, { useState, useEffect } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import MapControlBtn from "@/components/user/modal/MapControlBtn";
import CommonMap from "@/components/user/modal/CommonMap";
import useForestFire from "@/hooks/user/useForestFire";

const ForestFire = () => {
  const { fireData, fetchFireData, isFireLoading } = useForestFire();
  
  const [activeTab, setActiveTab] = useState("산불위험예보");
  const [facilities, setFacilities] = useState({ shelter: true, hospital: false, pharmacy: false });

  useEffect(() => {
    if (activeTab === "산불위험예보") fetchFireData();
  }, [activeTab, fetchFireData]);

  const tabs = ["산불위험예보", "재난안전시설"];
  
  const WildfireItems = [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ];

  const handleCheck = (key) => setFacilities(prev => ({ ...prev, [key]: !prev[key] }));

  const getFireStatus = (score) => {
    const s = parseInt(score || 0);
    if (s >= 81) return { label: "매우높음", color: "bg-red-500", text: "text-red-600" };
    if (s >= 61) return { label: "높음", color: "bg-orange-500", text: "text-orange-600" };
    if (s >= 41) return { label: "다소높음", color: "bg-yellow-500", text: "text-yellow-600" };
    return { label: "낮음", color: "bg-green-500", text: "text-green-600" };
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0">
      
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900">실시간 산불정보</h3>
            {fireData && (
              <span className={`rounded-xl font-bold text-[10px] px-2.5 py-1 ${fireData.meanavg >= 61 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                {isFireLoading ? "조회 중..." : fireData.meanavg >= 61 ? "위험발령" : "정상"}
              </span>
            )}
          </div>
          <p className="text-[11px] md:text-sm text-gray-500 font-medium">
            {fireData?.analdate ? `${fireData.analdate}시 분석` : ""}
          </p>
        </div>

        {/* 지도 컨테이너 */}
        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          
          <CommonMap markers={[]} level={8} />

          {/* 🌑 모바일 지도 오버레이 */}
          {activeTab === "산불위험예보" && (
            <div className="absolute inset-0 bg-black/40 z-10 md:hidden pointer-events-none animate-in fade-in duration-300" />
          )}
          
          {/* ✅ 좌측 사이드 탭 버튼: 위치 및 크기 고정 */}
          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[160px]">
            {tabs.map((tab) => (
              <div key={tab} className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-center px-2 py-2 lg:px-5 text-center lg:py-3 rounded-2xl lg:rounded-xl text-[11px] font-bold lg:text-body-m transition-all border shadow-md ${
                    activeTab === tab 
                      ? "bg-blue-600 text-white border-blue-600 translate-x-1" 
                      : "bg-white/95 backdrop-blur-md text-gray-600 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
                
                {/* 재난안전시설 선택 시 나타나는 필터 박스: 버튼 너비에 맞춰 정렬 */}
                {/* {tab === "재난안전시설" && activeTab === "재난안전시설" && (
                  <div className="animate-in slide-in-from-top-1 fade-in duration-200">
                    <FacilityCheckGroup items={WildfireItems} facilities={facilities} onCheck={handleCheck} />
                  </div>
                )} */}

                
              </div>
            ))}
          </div>

          {/* 📌 산불 상황판 */}
          {activeTab === "산불위험예보" && (
            <div className="absolute z-20 animate-in slide-in-from-right-5 md:slide-in-from-bottom-5 fade-in duration-300
              top-4 bottom-4 right-3 w-[200px] p-4 rounded-2xl bg-white shadow-2xl flex flex-col justify-center
              md:top-auto md:bottom-6 md:right-auto md:left-1/2 md:-translate-x-1/2 md:w-[360px] lg:w-[400px] md:p-6 md:rounded-[28px] md:block
            ">
              {isFireLoading ? (
                <div className="py-4 text-center text-gray-400 text-sm animate-pulse">데이터 분석 중...</div>
              ) : fireData ? (
                <div className="flex flex-col gap-3 md:gap-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 md:pb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] md:text-xs text-blue-600 font-bold uppercase tracking-tight">산불위험정보</span>
                      <span className={`text-title-m md:text-heading-l leading-none mt-0.5 font-bold ${getFireStatus(fireData.meanavg).text}`}>{fireData.meanavg}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-white text-[9px] md:text-xs font-bold shadow-sm ${getFireStatus(fireData.meanavg).color}`}>
                      {getFireStatus(fireData.meanavg).label}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 md:grid-cols-3 md:gap-3">
                    {[
                      { label: "최고", val: fireData.maxi, color: "text-red-600" },
                      { label: "최저", val: fireData.mini, color: "text-green-700" },
                      { label: "편차", val: fireData.std, color: "text-gray-800" }
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-lg py-1.5 md:py-3 text-center border border-gray-100 flex md:flex-col justify-between px-3 md:px-0 items-center">
                        <p className="text-[9px] md:text-xs text-gray-500 font-bold">{item.label}</p>
                        <p className={`text-xs md:text-base font-bold ${item.color}`}>{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-[9px] md:text-xs font-bold text-gray-600 px-0.5">
                      <span>위험도 분포</span>
                      <span className="text-blue-600">안심 {fireData.d1}%</span>
                    </div>
                    <div className="w-full h-1.5 md:h-3 bg-gray-100 rounded-full flex overflow-hidden">
                      <div style={{ width: `${fireData.d1}%` }} className="bg-green-400 h-full" />
                      <div style={{ width: `${fireData.d2}%` }} className="bg-yellow-400 h-full" />
                      <div style={{ width: `${fireData.d3}%` }} className="bg-orange-400 h-full" />
                      <div style={{ width: `${fireData.d4}%` }} className="bg-red-500 h-full" />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* <div className="absolute bottom-4 right-4 z-30 scale-90 md:scale-100">
            <MapControlBtn />
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ActionTipBox type="산불" />
      </div>
    </div>
  );
};

export default ForestFire;