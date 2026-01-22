import React from "react";
import { QuickMenu } from "@/components/admin/realtime/QuickMenu";
import { MessageBoard } from "@/components/admin/realtime/MessageBoard";
import { TimeFilter } from "@/components/admin/realtime/TimeFilter";
import { SummaryStats } from "@/components/admin/realtime/SummaryStats";
import { Map as MapIcon, Plus, Minus } from "lucide-react";

export const RealTimeDashboard = () => {
  const mapMarkers = [
    { id: 1, top: "128px", left: "152px", color: "#FF4842", type: "주의(특보)" },
    { id: 2, top: "315px", left: "464px", color: "#FF4842", type: "주의(특보)" },
    { id: 3, top: "110px", left: "454px", color: "#1890FF", type: "위급(재난)" },
  ];

  const legendItems = [
    { id: 1, color: "#1890FF", label: "위급(재난)" },
    { id: 2, color: "#FF4842", label: "주의(특보)" },
  ];

  return (
    <div className="relative w-full h-[1080px] mx-auto bg-[#F9FAFB] overflow-hidden">
      <div className="absolute top-[54px] left-[51px]">
        <h1 className="text-[32px] font-bold text-[#1d1d1d]">실시간 모니터링</h1>
        <p className="text-gray-500 mt-1">전국 재난 상황 및 기상 특보를 실시간으로 확인합니다.</p>
      </div>

      <TimeFilter />

{/* 추가된 통계 박스 섹션 */}
      <SummaryStats />

      {/* 2. 지도 영역 */}
      <section className="absolute w-[735px] h-[416px] top-[266px] left-[50px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* 지도 배경 (패턴이나 연한 색상) */}
        <div className="absolute inset-0 bg-[#f0f4f8] flex items-center justify-center opacity-50">
          <MapIcon size={120} className="text-gray-200" />
        </div>

        {/* 지도 마커 */}
        {mapMarkers.map((marker) => (
          <div key={marker.id} className="absolute z-10" style={{ top: marker.top, left: marker.left }}>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full animate-ping opacity-20" style={{ backgroundColor: marker.color }} />
              <div className="relative w-5 h-5 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125 cursor-pointer" style={{ backgroundColor: marker.color }} />
            </div>
          </div>
        ))}

        {/* 지도 줌 컨트롤 */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 shadow-sm">
          <button className="w-8 h-8 bg-white border border-gray-200 rounded-t-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold">+</button>
          <button className="w-8 h-8 bg-white border border-gray-200 rounded-b-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 font-bold">-</button>
        </div>

        {/* 중앙 텍스트 */}
        <div className="relative z-0 pointer-events-none text-center">
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs mb-1">Interactive Map</p>
          <h2 className="font-bold text-[#1d1d1d] text-lg">기상 특보 발생 현황</h2>
        </div>

        {/* 범례 */}
        <div className="absolute bottom-5 left-5 flex gap-4 p-3 bg-white/80 backdrop-blur rounded-xl border border-white/20 shadow-sm">
          {legendItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-bold text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <MessageBoard />
      <QuickMenu />
    </div>
  );
};


export default RealTimeDashboard;