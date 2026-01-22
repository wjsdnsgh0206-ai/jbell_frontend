import React from 'react';
import { 
  AlertTriangle, 
  CloudRain,
  FileText, 
  Map as MapIcon,
  MessageSquare, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

import DisasterSummarySection from './DisasterSummarySection';
import TimeRangeSelectorSection from './TimeRangeSelectorSection';
import FrequentlyUsedMenuSection from './FrequentlyUsedMenuSection';

// --- 메인 대시보드 컴포넌트 ---
export const RealTimeDashboard = () => {
  // 통계 카드 데이터 정리
  const statCards = [
    {
      id: "disaster",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      bg: "bg-red-50",
      title: "재난 발생",
      count: "12건",
      statType: "up",
      statValue: "2",
      statColor: "text-red-600",
      leftPosition: "left-[50px]",
    },
    {
      id: "weather",
      icon: <CloudRain className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      title: "기상 특보",
      count: "8건",
      statType: "down",
      statValue: "2",
      statColor: "text-blue-600",
      leftPosition: "left-[433px]",
    },
    {
      id: "message",
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50",
      title: "재난 문자",
      count: "45건",
      statType: "up",
      statValue: "4",
      statColor: "text-red-600",
      leftPosition: "left-[815px]",
    },
    {
      id: "news",
      icon: <FileText className="w-6 h-6 text-slate-600" />,
      bg: "bg-slate-100",
      title: "보도 자료",
      count: "128건",
      statType: "up",
      statValue: "12",
      statColor: "text-red-600",
      leftPosition: "left-[1197px]",
    },
  ];

  return (
    <div className="relative w-[1600px] h-[950px] overflow-hidden mx-auto border border-gray-100 font-sans">
      {/* 타이틀 영역 */}
      <header className="absolute top-[35px] left-[50px] w-[1210px] font-bold text-[#1d1d1d] text-[36px] tracking-tight">
        대시보드
      </header>
      <TimeRangeSelectorSection />
      {/* 1. 상단 통계 카드 섹션 */}
      <section className="absolute top-[108px] left-0 w-full">
        {statCards.map((card) => (
          <article
            key={card.id}
            className={`w-[352px] h-32 top-0 ${card.leftPosition} flex items-center gap-5 p-6 absolute bg-white rounded-xl border border-solid border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* 아이콘 박스 */}
            <div className={`${card.bg} p-4 rounded-xl flex items-center justify-center`}>
              {card.icon}
            </div>

            {/* 텍스트 정보 */}
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-gray-500 text-[15px]">
                {card.title}
              </h3>
              <p className="font-bold text-[#1d1d1d] text-[24px]">{card.count}</p>
            </div>

            {/* 증감 표시 (우측 상단) */}
            <div className="absolute top-4 right-5 flex items-center gap-1">
              {card.statType === "up" ? (
                <TrendingUp size={14} className={card.statColor} />
              ) : (
                <TrendingDown size={14} className={card.statColor} />
              )}
              <span className={`font-bold text-[13px] ${card.statColor}`}>
                {card.statValue}
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* 2. 중간 왼쪽: 재난 요약 지도 */}
      <DisasterSummarySection />

      {/* 3. 중간 오른쪽: 최근 문자/뉴스 탭 */}
      <MapAndRecentMessagesSection />

      {/* 4. 하단: 자주찾는 메뉴 */}
      <FrequentlyUsedMenuSection />
    </div>
  );
};

export default RealTimeDashboard;