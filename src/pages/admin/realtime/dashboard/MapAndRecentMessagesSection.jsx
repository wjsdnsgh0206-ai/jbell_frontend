import React, { useState, useMemo } from "react";
import { Mail, ArrowRight, Bell } from "lucide-react";
import { pressData } from "@/pages/user/openboards/BoardData.js";
import { useNavigate } from "react-router-dom";
// 실제 재난 문자 데이터 임포트
import { initialMessageData } from "./../disasterMessage/DisasterMessageData";

const MapAndRecentMessagesSection = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();

  // 1. 표시할 데이터 연산 로직 (기존 유지)
  const currentDisplayData = useMemo(() => {
    if (activeTab === "news") {
      return [...pressData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(item => ({ 
          id: item.id, 
          title: item.title, 
          time: item.date 
        }));
    }

    return [...initialMessageData]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: `[${item.sender}] ${item.content}`,
        time: item.dateTime
      }));
  }, [activeTab]);

  // 2. 전체 보기 클릭 시 탭에 따른 경로 분기 처리
  const handleViewAll = () => {
    if (activeTab === "messages") {
      // 재난 문자 탭일 때: 재난 문자 이력 관리 페이지로 이동
      navigate("/admin/realtime/disasterMessageList");
    } else {
      // 보도 자료 탭일 때: 보도 자료 관리 페이지로 이동
      navigate("/admin/contents/pressRelList");
    }
  };

  return (
    <section className="flex-1 h-[416px] relative bg-white rounded-xl border border-solid border-gray-200 shadow-sm overflow-hidden min-w-0">
      <nav className="flex w-full h-14 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("messages")} 
          className={`flex-1 font-bold text-[18px] transition-all ${activeTab === "messages" ? "border-b-4 border-slate-800 text-slate-800" : "text-gray-400"}`}
        >
          최근 재난 문자
        </button>
        <button 
          onClick={() => setActiveTab("news")} 
          className={`flex-1 font-bold text-[18px] transition-all ${activeTab === "news" ? "border-b-4 border-slate-800 text-slate-800" : "text-gray-400"}`}
        >
          최근 보도 자료
        </button>
      </nav>

      <div className="p-4 flex flex-col">
        {currentDisplayData.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 border-b border-gray-50 last:border-none hover:bg-slate-50 rounded-lg transition-colors cursor-pointer overflow-hidden"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="bg-slate-100 p-1.5 rounded-full shrink-0">
                {activeTab === "messages" ? (
                  <Mail size={16} className="text-slate-500" />
                ) : (
                  <Bell size={16} className="text-blue-500" />
                )}
              </div>
              <span className="text-[16px] text-[#1d1d1d] font-medium truncate">
                {item.title}
              </span>
            </div>
            <span className="text-gray-400 text-sm whitespace-nowrap ml-2">
              {item.time}
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleViewAll} 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 text-slate-600 font-medium text-sm hover:underline"
      >
        전체 보기 <ArrowRight size={14} />
      </button>
    </section>
  );
};

export default MapAndRecentMessagesSection;