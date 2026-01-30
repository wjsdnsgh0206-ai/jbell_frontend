import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, CloudRain, FileText, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
import DisasterSummarySection from "./DisasterSummarySection";
import TimeRangeSelectorSection from "./TimeRangeSelectorSection";
import FrequentlyUsedMenuSection from "./FrequentlyUsedMenuSection";
import MapAndRecentMessagesSection from "./MapAndRecentMessagesSection";

export const RealTimeDashboard = () => {
  const [timeRange, setTimeRange] = useState("최근 24시간");
  const [allMessages, setAllMessages] = useState([]);
  const [allWarnings, setAllWarnings] = useState([]);
  const [allDisasters, setAllDisasters] = useState([]);

  // 1. 데이터 로드 (백엔드 페이징을 무시하도록 limit을 크게 주거나 전체 조회 API 호출)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgRes, warningRes, disasterRes] = await Promise.all([
          axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages"),
          // [수정] 대시보드용은 limit을 크게 주어 전체를 가져오게 하거나, 
          // 백엔드에서 페이징이 없는 엔드포인트를 제공해야 합니다.
          axios.get("http://localhost:8080/api/disaster/dashboard/weatherWarnings?limit=1000"),
          axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages") // 재난 발생 API 경로에 맞게 수정 필요
        ]);

        // [수정] WeatherNewsList의 fetchAdminData 로직과 동일하게 data.data 또는 data.list 확인
        setAllMessages(msgRes.data?.list || msgRes.data?.data || msgRes.data || []);
        
        // 기상특보: WeatherNewsList에서 res.data.data를 사용하므로 동일하게 적용
        const warningData = warningRes.data?.data || warningRes.data?.list || warningRes.data || [];
        setAllWarnings(warningData);

        setAllDisasters(disasterRes.data?.data || disasterRes.data?.list || disasterRes.data || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 2. 시간 파싱 공통 함수
  const parseDate = (dateVal) => {
    if (!dateVal) return null;
    const s = String(dateVal);
    
    // YYYYMMDDHHmm 형식 처리 (202601301530 등)
    if (s.length >= 12 && !s.includes('-') && !s.includes('/')) {
      const formatted = `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}T${s.substring(8, 10)}:${s.substring(10, 12)}:00`;
      return new Date(formatted);
    }
    
    // 기존 처리 (YYYY-MM-DD 등)
    if (typeof dateVal === 'string' && dateVal.includes('/')) {
      return new Date(dateVal.replace(/\//g, '-'));
    }
    if (s.includes('-')) return new Date(s);
    
    return null;
  };

  // 3. 증감 및 필터링 로직
  const getStatInfo = (data, dateField) => {
    const now = new Date();
    
    const rangeMs = {
      "최근 24시간": 24, "1일": 24, "3일": 72, "7일": 168, "30일": 720
    }[timeRange] * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;

    // 데이터가 배열인지 확인
    const safeData = Array.isArray(data) ? data : [];

    const currentItems = safeData.filter(item => {
      const itemDate = parseDate(item[dateField]);
      return itemDate && (now - itemDate) <= rangeMs;
    });

    const prevRangeStart = rangeMs * 2; // 이전 동일 기간 비교를 위해 2배수 설정
    const prevItems = safeData.filter(item => {
      const itemDate = parseDate(item[dateField]);
      if (!itemDate) return false;
      const diff = now - itemDate;
      return diff > rangeMs && diff <= prevRangeStart;
    });

    const diff = currentItems.length - prevItems.length;
    return {
      count: currentItems.length,
      diff: Math.abs(diff),
      type: diff >= 0 ? "up" : "down"
    };
  };

  // 필터링된 결과값 (기상특보는 PRSNTN_TM 필드 사용)
  const disasterStats = useMemo(() => getStatInfo(allDisasters, 'crtDt'), [allDisasters, timeRange]);
  const messageStats = useMemo(() => getStatInfo(allMessages, 'crtDt'), [allMessages, timeRange]);
  const warningStats = useMemo(() => getStatInfo(allWarnings, 'PRSNTN_TM'), [allWarnings, timeRange]);

  const statCards = [
    { 
      id: "disaster", 
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />, 
      bg: "bg-red-50", 
      title: "재난 발생", 
      count: `${disasterStats.count}건`, 
      statType: disasterStats.type, 
      statValue: disasterStats.diff, 
      statColor: disasterStats.type === "up" ? "text-red-600" : "text-blue-600" 
    },
    { 
      id: "weather", 
      icon: <CloudRain className="w-6 h-6 text-blue-600" />, 
      bg: "bg-blue-50", 
      title: "기상 특보", 
      count: `${warningStats.count}건`, 
      statType: warningStats.type, 
      statValue: warningStats.diff, 
      statColor: warningStats.type === "up" ? "text-red-600" : "text-blue-600" 
    },
    { 
      id: "message", 
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />, 
      bg: "bg-amber-50", 
      title: "재난 문자", 
      count: `${messageStats.count}건`, 
      statType: messageStats.type, 
      statValue: messageStats.diff, 
      statColor: messageStats.type === "up" ? "text-red-600" : "text-blue-600" 
    },
    { id: "news", icon: <FileText className="w-6 h-6 text-slate-600" />, bg: "bg-slate-100", title: "보도 자료", count: "128건", statType: "up", statValue: "12", statColor: "text-red-600" },
  ];

  return (
    <div className="relative w-full h-[950px] overflow-hidden mx-auto border border-gray-100 font-sans bg-white">
      <header className="absolute top-[35px] left-[50px] right-[50px] flex items-center justify-between font-bold text-[#1d1d1d] tracking-tight">
        <h1 className="text-[36px]">대시보드</h1>
        <TimeRangeSelectorSection selected={timeRange} setSelected={setTimeRange} />
      </header>

      <section className="absolute top-[108px] left-[50px] right-[50px] flex justify-between gap-4">
        {statCards.map((card) => (
          <article key={card.id} className="flex-1 h-32 flex items-center gap-5 p-6 bg-white rounded-xl border border-solid border-gray-200 shadow-sm hover:shadow-md transition-shadow relative min-w-0">
            <div className={`${card.bg} p-4 rounded-xl flex items-center justify-center shrink-0`}>{card.icon}</div>
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

      <div className="absolute top-[266px] left-[50px] right-[50px] flex gap-4">
        <DisasterSummarySection />
        <MapAndRecentMessagesSection timeRange={timeRange} />
      </div>

      <FrequentlyUsedMenuSection />
    </div>
  );
};

export default RealTimeDashboard;