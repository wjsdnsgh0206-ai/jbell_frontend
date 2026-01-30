import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { pressData } from "@/pages/user/openboards/BoardData.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MapAndRecentMessagesSection = ({ timeRange }) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [disasterMessages, setDisasterMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisasterMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages");
        const rawData = response.data?.data || response.data || [];
        setDisasterMessages(rawData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchDisasterMessages();
  }, []);

  // 시간 필터링 헬퍼 함수
  const filterByTime = (dateStr, range) => {
    if (!dateStr) return false;
    const itemDate = new Date(dateStr.replace(/\//g, '-'));
    const now = new Date();
    const diffHours = (now - itemDate) / (1000 * 60 * 60);

    if (range === "최근 24시간" || range === "1일") return diffHours <= 24;
    if (range === "3일") return diffHours <= 72;
    if (range === "7일") return diffHours <= 168;
    if (range === "30일") return diffHours <= 720;
    return true;
  };

  const currentDisplayData = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    if (activeTab === "news") {
      return [...pressData]
        .filter(item => filterByTime(item.date, timeRange))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(item => ({ id: item.id, title: item.title, time: item.date, isToday: item.date?.startsWith(todayStr.replace(/\//g, '-')) }));
    }

    return disasterMessages
      .filter(item => filterByTime(item.crtDt, timeRange))
      .slice(0, 5)
      .map(item => ({
        id: item.sn,
        title: `[${item.emrgStepNm}] ${item.msgCn}`,
        time: item.crtDt?.substring(0, 16),
        isToday: item.crtDt?.startsWith(todayStr)
      }));
  }, [activeTab, disasterMessages, timeRange]);

  const handleViewAll = () => {
    navigate(activeTab === "messages" ? "/admin/realtime/disasterMessageList" : "/admin/contents/pressRelList");
  };

  return (
    <section className="flex-1 h-[416px] relative bg-white rounded-xl border border-solid border-gray-200 shadow-sm overflow-hidden min-w-0">
      <nav className="flex w-full h-14 border-b border-gray-200">
        <button onClick={() => setActiveTab("messages")} className={`flex-1 font-bold text-[18px] transition-all ${activeTab === "messages" ? "border-b-4 border-slate-800 text-slate-800" : "text-gray-400"}`}>최근 재난 문자</button>
        <button onClick={() => setActiveTab("news")} className={`flex-1 font-bold text-[18px] transition-all ${activeTab === "news" ? "border-b-4 border-slate-800 text-slate-800" : "text-gray-400"}`}>최근 보도 자료</button>
      </nav>
      <div className="p-4 flex flex-col">
        {currentDisplayData.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-none hover:bg-slate-50 rounded-lg transition-colors cursor-pointer overflow-hidden">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[16px] text-[#1d1d1d] font-medium truncate">{item.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {item.isToday && <span className="text-red-500 font-bold text-xs">NEW</span>}
              <span className="text-gray-400 text-sm whitespace-nowrap">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleViewAll} className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-slate-600 font-medium text-sm hover:underline">전체 보기 <ArrowRight size={14} /></button>
    </section>
  );
};

export default MapAndRecentMessagesSection;