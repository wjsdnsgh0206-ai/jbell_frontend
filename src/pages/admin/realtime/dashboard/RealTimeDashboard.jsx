"use no memo";

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
  const [allDisasters, setAllDisasters] = useState([]); // 통합 재난 발생 데이터

  // 1. 데이터 로드 (한파, 산불, 지진 API 통합 호출)
  // 1. 데이터 로드 부분 수정
useEffect(() => {
  const fetchData = async () => {
    try {
      // 대시보드용 데이터를 충분히 가져오기 위해 limit 파라미터 추가
      const config = { params: { limit: 1000 } };

      const [msgRes, warningRes, coldRes, fireRes, eqRes] = await Promise.all([
        axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages", config),
        axios.get("http://localhost:8080/api/disaster/dashboard/weatherWarnings", config),
        axios.get("http://localhost:8080/api/disaster/fetch/weather-list?type=3", config),
        axios.get("http://localhost:8080/api/disaster/fetch/forest-fire-list", config),
        axios.get("http://localhost:8080/api/disaster/fetch/earthquake-list", config)
      ]);

      // 응답 데이터 추출 (구조에 따라 data.list 또는 data.data 선택)
      const getListData = (res) => res.data?.list || res.data?.data || res.data || [];

      setAllMessages(getListData(msgRes));
      setAllWarnings(getListData(warningRes));

      const coldData = getListData(coldRes).map(d => ({ ...d, unifiedDate: d.tmFc }));
      const fireData = getListData(fireRes).map(d => ({ ...d, unifiedDate: d.fireStartTime }));
      const eqData = getListData(eqRes).map(d => ({ ...d, unifiedDate: d.TM_EQK || d.tmEqk || d.tmFc }));

      setAllDisasters([...coldData, ...fireData, ...eqData]);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };
  fetchData();
}, []);

  // 2. 시간 파싱 공통 함수 (숫자형, 문자열형 날짜 모두 대응)
  const parseDate = (dateVal) => {
    if (!dateVal) return null;
    let s = String(dateVal);
    
    // T가 포함된 ISO 형식 (산불 등)
    if (s.includes('T')) return new Date(s);
    
    // 슬래시나 대시가 포함된 형식
    if (s.includes('/') || (s.includes('-') && s.length > 10)) {
      return new Date(s.replace(/\//g, '-'));
    }

    // 숫자만 있는 형식 (YYYYMMDDHHmm)
    if (s.length >= 8) {
      const formatted = `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}T${s.substring(8, 10) || '00'}:${s.substring(10, 12) || '00'}:00`;
      return new Date(formatted);
    }
    return null;
  };

  // 3. 증감 및 필터링 로직
  const getStatInfo = (data, dateField) => {
    const now = new Date();
    
    const rangeMs = {
      "최근 24시간": 24, "1일": 24, "3일": 72, "7일": 168, "30일": 720
    }[timeRange] * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;

    const currentItems = data.filter(item => {
      const itemDate = parseDate(item[dateField]);
      return itemDate && (now - itemDate) <= rangeMs;
    });

    // 비교 대상 (이전 동일 기간)
    const prevItems = data.filter(item => {
      const itemDate = parseDate(item[dateField]);
      if (!itemDate) return false;
      const diff = now - itemDate;
      return diff > rangeMs && diff <= (rangeMs * 2);
    });

    const diff = currentItems.length - prevItems.length;
    return {
      count: currentItems.length,
      diff: Math.abs(diff),
      type: diff >= 0 ? "up" : "down"
    };
  };

  // 필터링된 결과값들
  const disasterStats = useMemo(() => getStatInfo(allDisasters, 'unifiedDate'), [allDisasters, timeRange]);
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