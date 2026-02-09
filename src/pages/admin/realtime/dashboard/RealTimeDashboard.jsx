"use no memo";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  CloudRain,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DisasterSummarySection from "@/pages/admin/realtime/dashboard/DisasterSummarySection";
import TimeRangeSelectorSection from "@/pages/admin/realtime/dashboard/TimeRangeSelectorSection";
import FrequentlyUsedMenuSection from "@/pages/admin/realtime/dashboard/FrequentlyUsedMenuSection";
import MapAndRecentMessagesSection from "@/pages/admin/realtime/dashboard/MapAndRecentMessagesSection";

export const RealTimeDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("최근 24시간");
  const [allMessages, setAllMessages] = useState([]);
  const [allWarnings, setAllWarnings] = useState([]);
  const [allDisasters, setAllDisasters] = useState([]); 
  const [allPress, setAllPress] = useState([]); // ✅ 보도자료 상태 추가
useEffect(() => {
  const fetchData = async () => {
    try {
      const config = { params: { limit: 1000 } };

      const [msgRes, warningRes, coldRes, fireRes, eqRes, pressRes] = await Promise.all([
        axios.get("/api/disaster/dashboard/disasterMessages", config),
        axios.get("/api/disaster/dashboard/weatherWarnings", config),
        axios.get("/api/disaster/fetch/weather-list?type=3", config),
        axios.get("/api/disaster/fetch/forest-fire-list", config),
        axios.get("/api/disaster/fetch/earthquake-list", config),
        axios.get("/api/press", config),
      ]);

      console.log("rrrr", msgRes);

      const getListData = (res) => res.data?.list || res.data?.data || res.data || [];

      setAllMessages(getListData(msgRes));
      setAllWarnings(getListData(warningRes));
      
      const pressList = getListData(pressRes);

      setAllPress(pressList);

      // 재난 데이터 통합
      const coldData = getListData(coldRes);
      const fireData = getListData(fireRes);
      const eqData = getListData(eqRes);

      setAllDisasters([...coldData, ...fireData, ...eqData]);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };
  fetchData();
}, []);
  // ... (parseDate, getStatInfo 함수는 기존과 동일) ...
  const parseDate = (dateVal) => {
    if (!dateVal) return null;
    let s = String(dateVal);
    if (s.includes("T")) return new Date(s);
    if (s.includes("/") || (s.includes("-") && s.length > 10)) {
      return new Date(s.replace(/\//g, "-"));
    }
    if (s.length >= 8) {
      const formatted = `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}T${s.substring(8, 10) || "00"}:${s.substring(10, 12) || "00"}:00`;
      return new Date(formatted);
    }
    return null;
  };

  const getStatInfo = (data, dateField) => {
    const now = new Date();
    const rangeMs = {
      "최근 24시간": 24, "1일": 24, "3일": 72, "7일": 168, "30일": 720,
    }[timeRange] * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;

    const currentItems = data.filter((item) => {
      const itemDate = parseDate(item[dateField]);
      return itemDate && now - itemDate <= rangeMs;
    });

    const prevItems = data.filter((item) => {
      const itemDate = parseDate(item[dateField]);
      if (!itemDate) return false;
      const diff = now - itemDate;
      return diff > rangeMs && diff <= rangeMs * 2;
    });

    const diff = currentItems.length - prevItems.length;
    return {
      count: currentItems.length,
      diff: Math.abs(diff),
      type: diff >= 0 ? "up" : "down",
    };
  };

  const disasterStats = useMemo(() => ({
    count: allDisasters.length,
    diff: 0,
    type: "up"
  }), [allDisasters]);

  // ✅ 보도자료 통계: 재난 발생과 마찬가지로 시간 상관없이 전체 개수 사용
  const pressStats = useMemo(() => ({
    count: allPress.length,
    diff: 0,
    type: "up"
  }), [allPress]);

  const messageStats = useMemo(() => getStatInfo(allMessages, "CRT_DT"), [allMessages, timeRange]);
  const warningStats = useMemo(() => getStatInfo(allWarnings, "PRSNTN_TM"), [allWarnings, timeRange]);

  const handleStatCardClick = (path) => {
    if (!path) return;
    navigate(path);
  };

  const statCards = [
    {
      id: "disaster",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      bg: "bg-red-50",
      title: "재난 발생",
      count: `${disasterStats.count}건`,
      statType: disasterStats.type,
      statValue: "-",
      statColor: "text-red-600",
      path: "/admin/realtime/disasterManagementList",
    },
    {
      id: "weather",
      icon: <CloudRain className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
      title: "기상 특보",
      count: `${warningStats.count}건`,
      statType: warningStats.type,
      statValue: warningStats.diff,
      statColor: warningStats.type === "up" ? "text-red-600" : "text-blue-600",
      path: "/admin/realtime/weatherNewsList",
    },
    {
      id: "message",
      icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50",
      title: "재난 문자",
      count: `${messageStats.count}건`,
      statType: messageStats.type,
      statValue: messageStats.diff,
      statColor: messageStats.type === "up" ? "text-red-600" : "text-blue-600",
      path: "/admin/realtime/disasterMessageList",
    },
    {
      id: "news",
      icon: <FileText className="w-6 h-6 text-slate-600" />,
      bg: "bg-slate-100",
      title: "보도 자료",
      count: `${pressStats.count}건`, // ✅ 실제 API 건수 연결
      statType: "up",
      statValue: "-", // ✅ 전체 데이터이므로 대시 처리
      statColor: "text-slate-600",
      path: "/admin/contents/pressRelList",
    },
  ];

  return (
    <div className="relative w-full h-[950px] overflow-hidden mx-auto border border-gray-100 font-sans bg-white">
      <header className="absolute top-[35px] left-[50px] right-[50px] flex items-center justify-between font-bold text-[#1d1d1d] tracking-tight">
        <h1 className="text-[36px]">대시보드</h1>
        <TimeRangeSelectorSection selected={timeRange} setSelected={setTimeRange} />
      </header>

      <section className="absolute top-[108px] left-[50px] right-[50px] flex justify-between gap-4">
        {statCards.map((card) => (
          <article
            key={card.id}
            onClick={() => handleStatCardClick(card.path)}
            className="flex-1 h-32 flex items-center gap-5 p-6 bg-white rounded-xl border border-solid border-gray-200 shadow-sm hover:shadow-md transition-shadow relative min-w-0 cursor-pointer"
          >
            <div className={`${card.bg} p-4 rounded-xl flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h3 className="font-semibold text-gray-500 text-[15px] whitespace-nowrap">{card.title}</h3>
              <p className="font-bold text-[#1d1d1d] text-[24px]">{card.count}</p>
            </div>
            <div className="absolute top-4 right-5 flex items-center gap-1">
              {card.statType === "up" ? (
                <TrendingUp size={14} className={card.statColor} />
              ) : (
                <TrendingDown size={14} className={card.statColor} />
              )}
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