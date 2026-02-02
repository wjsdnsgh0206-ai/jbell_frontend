"use no memo";

import React, { useState, useEffect, useMemo } from "react";
import { X, AlertCircle } from "lucide-react";
import ActionTipBox from "../modal/ActionTipBox";
// import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap";
import useForestFire from "@/hooks/user/useForestFire"; // 기존 공공데이터 훅
import useForestFireRisk from "@/hooks/user/useForestFireRisk"; // 새로 만든 DB 데이터 훅

const ForestFire = () => {
  // 1. 공공데이터 예보 훅 (warningData로 명칭 구분)
  const { fireData: warningData, fetchFireData: fetchWarning, isFireLoading } = useForestFire();
  // 2. 백엔드 DB 지수 훅 (riskData로 명칭 구분)
  const { riskData, fetchRiskData, isRiskLoading } = useForestFireRisk();

  const [activeTab, setActiveTab] = useState("실시간 산불정보");
  const [facilities, setFacilities] = useState({
    shelter: false,
    hospital: false,
    pharmacy: false,
  });

  const tabs = ["실시간 산불정보", "산불위험예보", "대피소"];

  useEffect(() => {
    // 컴포넌트 마운트 시 두 데이터 모두 로드
    fetchWarning();
    fetchRiskData();
  }, [fetchWarning, fetchRiskData]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  // 상황판 지수 상태 컬러 로직
  const getFireStatus = (score) => {
    const s = parseInt(score || 0);
    if (s >= 81) return { label: "매우높음", color: "bg-red-500", text: "text-red-600" };
    if (s >= 61) return { label: "높음", color: "bg-orange-500", text: "text-orange-600" };
    if (s >= 41) return { label: "다소높음", color: "bg-yellow-500", text: "text-yellow-600" };
    return { label: "낮음", color: "bg-green-500", text: "text-green-600" };
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full lg:min-h-0 relative">
      <div className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 flex flex-col lg:flex-1 min-h-0 relative">
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <h3 className="md:text-body-m-bold lg:text-title-m text-body-s-bold text-gray-900 font-bold">전북 산불 현황</h3>
        </div>

        <div className="relative w-full h-[280px] md:h-[350px] lg:h-full lg:flex-1 bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
          <CommonMap markers={[]} level={8} />

          <div className="absolute top-5 left-3 lg:left-5 flex flex-col gap-3 z-20 w-[110px] lg:w-[140px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-center px-2 py-2 lg:px-4 text-center lg:py-3 rounded-2xl lg:rounded-xl text-[11px] font-bold lg:text-body-m transition-all border shadow-md ${
                  activeTab === tab ? "bg-blue-600 text-white border-blue-600" : "bg-white/95 text-gray-600 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 📌 [실시간 산불정보] 상황판 - riskData(DB) 사용 */}
          {activeTab === "실시간 산불정보" && (
            <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 w-[320px] md:w-[360px] p-6 rounded-[28px] bg-white shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {riskData ? (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-600 font-bold uppercase">{riskData.doName || riskData.doname || "전북"} 산불위험지수</span>
                      <span className={`text-heading-l font-bold ${getFireStatus(riskData.avgIndex || riskData.avg_index).text}`}>
                        {riskData.avgIndex || riskData.avg_index || 0}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getFireStatus(riskData.avgIndex || riskData.avg_index).color}`}>
                      {getFireStatus(riskData.avgIndex || riskData.avg_index).label}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "최고", val: riskData.maxIndex || riskData.max_index || 0, color: "text-red-600" },
                      { label: "최저", val: riskData.minIndex || riskData.min_index || 0, color: "text-green-700" },
                      { label: "기준일시", val: (riskData.analDate || riskData.anal_date)?.includes(" ") ? (riskData.analDate || riskData.anal_date).split(" ")[1] + "시" : "-", color: "text-gray-800" },
                    ].map((i) => (
                      <div key={i.label} className="bg-slate-50 rounded-xl py-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold">{i.label}</p>
                        <p className={`text-base font-bold ${i.color}`}>{i.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">실시간 지수를 불러오는 중...</div>
              )}
            </div>
          )}

          {/* 📌 [산불위험예보] 리스트 모달 - warningData(공공데이터) 사용 */}
          {activeTab === "산불위험예보" && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setActiveTab("실시간 산불정보")} />
              
              <div className="relative bg-white w-full max-w-5xl h-[100%] mt-2 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="px-8 py-3 border-b border-gray-100 flex justify-between items-start bg-white">
                  <h4 className="text-[16px] font-bold text-gray-900">전북 산불 위험 예보 기록</h4>
                  <button onClick={() => setActiveTab("실시간 산불정보")} className="group p-1.5 bg-gray-50 hover:bg-gray-900 rounded-xl transition-all shadow-sm">
                    <X size={21} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-gray-50/30 custom-scrollbar">
                  {isFireLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">데이터 로딩 중...</div>
                  ) : warningData && warningData.length > 0 ? (
                    warningData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                          <AlertCircle className="text-orange-500" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            {/* 공공데이터 필드는 소문자(avgindex)인 경우가 많음 */}
                            <span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">지수 {item.avgindex || item.avgIndex}</span>
                            <span className="text-[12px] text-gray-400 font-medium">기준: {item.analdate || item.analDate}</span>
                          </div>
                          <h5 className="text-[17px] font-bold text-gray-800 leading-tight">
                            {item.doname || item.doName} 산불 위험 예보
                          </h5>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20 text-center">
                        <AlertCircle size={48} className="mb-3 opacity-20" />
                        <p className="font-medium text-gray-500">조회된 예보 데이터가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <ActionTipBox type="산불" />
      </div>
    </div>
  );
};

export default ForestFire;