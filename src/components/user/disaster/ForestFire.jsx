"use no memo";

import React, { useState, useEffect, useMemo } from "react";
import { X, AlertCircle } from "lucide-react";
import ActionTipBox from "../modal/ActionTipBox";
import FacilityCheckGroup from "../modal/FacilityCheckGroup";
import CommonMap from "@/components/user/modal/CommonMap";
import useForestFire from "@/hooks/user/useForestFire";

const ForestFire = () => {
  const { fireData, fetchFireData, isFireLoading } = useForestFire();
  const [activeTab, setActiveTab] = useState("실시간 산불정보");
  const [facilities, setFacilities] = useState({
    shelter: false,
    hospital: false,
    pharmacy: false,
  });

  const tabs = ["실시간 산불정보", "산불위험예보", "재난안전시설"];

  useEffect(() => {
    fetchFireData();
  }, [fetchFireData]);

  const handleCheck = (key) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  const WildfireItems = useMemo(() => [
    { id: "shelter", label: "대피소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], []);

  // 상황판 데이터를 안전하게 가져오는 로직 (건드리지 않음)
  const displayData = useMemo(() => {
    if (!fireData) return null;
    return Array.isArray(fireData) ? fireData[0] : fireData;
  }, [fireData]);

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

          {/* 좌측 탭 버튼 */}
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

          {/* 📌 [실시간 산불정보] 상황판 추가 - 기존 디자인에 맞춰 복구 */}
          {activeTab === "실시간 산불정보" && displayData && (
            <div className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 w-[320px] md:w-[360px] p-6 rounded-[28px] bg-white shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-600 font-bold uppercase">산불위험지수</span>
                      <span className={`text-heading-l font-bold ${getFireStatus(displayData.meanavg).text}`}>
                        {displayData.meanavg || 0}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getFireStatus(displayData.meanavg).color}`}>
                      {getFireStatus(displayData.meanavg).label}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "최고", val: displayData.maxi, color: "text-red-600" },
                      { label: "최저", val: displayData.mini, color: "text-green-700" },
                      { label: "편차", val: displayData.std, color: "text-gray-800" },
                    ].map((i) => (
                      <div key={i.label} className="bg-slate-50 rounded-xl py-3 border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold">{i.label}</p>
                        <p className={`text-base font-bold ${i.color}`}>{i.val || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}

          {/* 📌 [산불위험예보] 네가 수정한 디자인 절대 고정 */}
          {activeTab === "산불위험예보" && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setActiveTab("실시간 산불정보")} />
              
              <div className="relative bg-white w-full max-w-5xl h-[100%] mt-2 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-300">
                
                <div className="px-8 py-3 border-b border-gray-100 flex justify-between items-start bg-white">
                    <h4 className="text-[16px] font-bold text-gray-900">산불 위험 예보 목록</h4>
                  <button 
                    onClick={() => setActiveTab("실시간 산불정보")} 
                    className="group p-1.5 bg-gray-50 hover:bg-gray-900 rounded-xl transition-all shadow-sm"
                  >
                    <X size={21} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-gray-50/30 custom-scrollbar">
                  {isFireLoading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">데이터 로딩 중...</div>
                  ) : Array.isArray(fireData) && fireData.length > 0 ? (
                    fireData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                          <AlertCircle className="text-orange-500" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">진행중</span>
                            <span className="text-[12px] text-gray-400 font-medium">
                              {item.fireStartTime?.replace('T', ' ').substring(0, 16) || "시간 정보 없음"}
                            </span>
                          </div>
                          <h5 className="text-[17px] font-bold text-gray-800 leading-tight">
                            [산불위험] {item.fireLocVillage || "전북 일부"} 인근 산불 위험 예보
                          </h5>
                          <p className="text-sm text-gray-500 mt-1">발생 위치: <span className="text-gray-700 font-bold">{item.fireLocVillage}</span></p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                        <AlertCircle size={48} className="mb-3 opacity-20" />
                        <p className="font-medium text-gray-500">조회된 예보 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "재난안전시설" && (
            <div className="absolute top-5 left-[115px] lg:left-[175px] z-30 scale-[0.75] md:scale-100 origin-left">
              <FacilityCheckGroup items={WildfireItems} facilities={facilities} onCheck={handleCheck} />
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