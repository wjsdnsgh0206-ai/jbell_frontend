import React from "react";
import { AlertTriangle, CloudRain, FileText, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import DisasterSummarySection from "./DisasterSummarySection";
import TimeRangeSelectorSection from "./TimeRangeSelectorSection";
import FrequentlyUsedMenuSection from "./FrequentlyUsedMenuSection";
import MapAndRecentMessagesSection from "./MapAndRecentMessagesSection";

export const RealTimeDashboard = () => {
  const statCards = [
    { id: "disaster", icon: <AlertTriangle className="w-6 h-6 text-red-600" />, bg: "bg-red-50", title: "재난 발생", count: "12건", statType: "up", statValue: "2", statColor: "text-red-600" },
    { id: "weather", icon: <CloudRain className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50", title: "기상 특보", count: "8건", statType: "down", statValue: "2", statColor: "text-blue-600" },
    { id: "message", icon: <MessageSquare className="w-6 h-6 text-amber-500" />, bg: "bg-amber-50", title: "재난 문자", count: "45건", statType: "up", statValue: "4", statColor: "text-red-600" },
    { id: "news", icon: <FileText className="w-6 h-6 text-slate-600" />, bg: "bg-slate-100", title: "보도 자료", count: "128건", statType: "up", statValue: "12", statColor: "text-red-600" },
  ];

  return (
    <div className="relative w-full h-[950px] overflow-hidden mx-auto border border-gray-100 font-sans">
      <header className="absolute top-[35px] left-[50px] right-[50px] flex items-center justify-between font-bold text-[#1d1d1d] tracking-tight">
        <h1 className="text-[36px]">대시보드</h1>
        <TimeRangeSelectorSection />
      </header>

      {/* 1. 상단 통계 카드 - 고정너비 제거 및 반응형 설정 */}
      <section className="absolute top-[108px] left-[50px] right-[50px] flex justify-between gap-4">
        {statCards.map((card) => (
          <article key={card.id} className="flex-1 h-32 flex items-center gap-5 p-6 bg-white rounded-xl border border-solid border-gray-200 shadow-sm hover:shadow-md transition-shadow relative min-w-0">
            <div className={`${card.bg} p-4 rounded-xl flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h3 className="font-semibold text-gray-500 text-[15px] whitespace-nowrap">{card.title}</h3>
              <p className="font-bold text-[#1d1d1d] text-[24px]">{card.count}</p>
            </div>
            <div className="absolute top-4 right-5 flex items-center gap-1">
              {card.statType === "up" ? <TrendingUp size={14} className={card.statColor} /> : <TrendingDown size={14} className={card.statColor} />}
              <span className={`font-bold text-[13px] ${card.statColor}`}>{card.statValue}</span>
            </div>
          </article>
        ))}
      </section>

      {/* 중간 영역 컨테이너 - 이 부분이 핵심 (왼쪽 지도와 오른쪽 탭을 감쌈) */}
      <div className="absolute top-[266px] left-[50px] right-[50px] flex gap-4">
        <DisasterSummarySection />
        <MapAndRecentMessagesSection />
      </div>

      <FrequentlyUsedMenuSection />
    </div>
  );
};

export default RealTimeDashboard;