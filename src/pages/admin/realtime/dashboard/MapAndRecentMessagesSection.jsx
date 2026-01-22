import React, { useState, useMemo } from "react";
import { Mail, ArrowRight, Bell } from "lucide-react";
import { pressData } from "@/pages/user/openboards/BoardData.js";
import { useNavigate } from "react-router-dom";

const MapAndRecentMessagesSection = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();

  const staticMessages = [
    { id: 1, title: "[행정안전부] 오늘 14:00 폭염경보 발효", time: "10분 전" },
    { id: 2, title: "[기상청] 오늘 15:30 태풍 예보", time: "30분 전" },
    { id: 3, title: "[보건복지부] 코로나19 확진자 안내", time: "1시간 전" },
    { id: 4, title: "[교육부] 학교 운영 방침 변경 공지", time: "1시간 반 전" },
    { id: 5, title: "[환경부] 대기오염 경고 발령", time: "2시간 전" },
  ];

  const currentDisplayData = useMemo(() => {
    if (activeTab === "news") {
      return [...pressData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(item => ({ id: item.id, title: item.title, time: item.date }));
    }
    return staticMessages;
  }, [activeTab]);

  const handleViewAll = () => {
    const path = activeTab === "messages" ? "/userNoticeList" : "/userPressRelList";
    navigate(path);
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
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-slate-100 p-1.5 rounded-full shrink-0">
                {activeTab === "messages" ? <Mail size={16} className="text-slate-500" /> : <Bell size={16} className="text-blue-500" />}
              </div>
              <span className="text-[16px] text-[#1d1d1d] font-medium truncate">{item.title}</span>
            </div>
            <span className="text-gray-400 text-sm whitespace-nowrap ml-2">{item.time}</span>
          </div>
        ))}
      </div>
      <button onClick={handleViewAll} className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-slate-600 font-medium text-sm hover:underline">
        전체 보기 <ArrowRight size={14} />
      </button>
    </section>
  );
};

export default MapAndRecentMessagesSection;