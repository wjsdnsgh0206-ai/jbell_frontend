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
  const [allDisasters, setAllDisasters] = useState([]); // 재난 발생 데이터 상태 추가

  // 1. 데이터 로드 (재난 발생 API 추가)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgRes, warningRes, disasterRes] = await Promise.all([
          axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages"),
          axios.get("http://localhost:8080/api/disaster/dashboard/weatherWarnings"),
          // 재난 발생 리스트 API 호출
          axios.get("http://localhost:8080/api/disaster/fetch/weather-list?type=3")
        ]);

        setAllMessages(msgRes.data?.data || msgRes.data || []);
        setAllWarnings(warningRes.data?.data || warningRes.data || []);
        setAllDisasters(disasterRes.data?.data || disasterRes.data || []);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, []);

  // 2. 시간 파싱 공통 함수 (데이터마다 다른 날짜 형식을 Date 객체로 변환)
  const parseDate = (dateVal) => {
    if (!dateVal) return null;
    if (typeof dateVal === 'string' && dateVal.includes('/')) {
      return new Date(dateVal.replace(/\//g, '-'));
    }
    const s = String(dateVal);
    if (s.length >= 8) {
      // YYYYMMDDHHmm 또는 YYYY-MM-DD... 대응
      const formatted = s.includes('-') ? s : `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}T${s.substring(8, 10) || '00'}:${s.substring(10, 12) || '00'}:00`;
      return new Date(formatted);
    }
    return null;
  };

  // 3. 증감 및 필터링 로직 계산 함수
  const getStatInfo = (data, dateField) => {
    const now = new Date();
    
    // 현재 선택된 범위의 시간(ms) 계산
    const rangeMs = {
      "최근 24시간": 24, "1일": 24, "3일": 72, "7일": 168, "30일": 720
    }[timeRange] * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;

    // 현재 범위 데이터 필터링
    const currentItems = data.filter(item => {
      const itemDate = parseDate(item[dateField]);
      return itemDate && (now - itemDate) <= rangeMs;
    });

    // 비교 대상(기준일로부터 7일 전 동일 기간) 데이터 필터링
    const prevRangeStart = rangeMs + (7 * 24 * 60 * 60 * 1000); // 현재 범위 끝 + 7일
    const prevItems = data.filter(item => {
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

  // 필터링된 결과값들
  const disasterStats = useMemo(() => getStatInfo(allDisasters, 'tmFc'), [allDisasters, timeRange]);
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
    <div className="relative w-full h-[950px] overflow-hidden mx-auto border border-gray-100 font-sans">
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