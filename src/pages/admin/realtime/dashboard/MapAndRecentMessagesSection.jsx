import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { pressData } from "@/pages/user/openboards/BoardData.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MapAndRecentMessagesSection = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [disasterMessages, setDisasterMessages] = useState([]); // 실제 데이터 담을 상태
  const navigate = useNavigate();

  // 1. 재난 문자 데이터 페칭
  useEffect(() => {
    const fetchDisasterMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/disaster/message-list");
        const rawData = response.data?.data || [];
        
        const now = new Date();
        const todayStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

        const formatted = rawData.slice(0, 5).map(item => ({
          id: item.sn,
          title: `[${item.emrgStepNm}] ${item.msgCn}`,
          time: item.crtDt ? item.crtDt.substring(0, 16) : "",
          isToday: item.crtDt ? item.crtDt.startsWith(todayStr) : false
        }));
        
        setDisasterMessages(formatted);
      } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
      }
    };

    fetchDisasterMessages();
  }, []);

  // 2. 표시할 데이터 연산 로직
  const currentDisplayData = useMemo(() => {
    if (activeTab === "news") {
      return [...pressData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(item => ({ 
          id: item.id, 
          title: item.title, 
          time: item.date,
          isToday: false // 보도자료는 일단 제외 (필요시 추가)
        }));
    }
    return disasterMessages;
  }, [activeTab, disasterMessages]);

  const handleViewAll = () => {
    if (activeTab === "messages") {
      navigate("/admin/realtime/disasterMessageList");
    } else {
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
            <div className="flex items-center gap-2 overflow-hidden">
              {/* 아이콘 제거됨 */}
              <span className="text-[16px] text-[#1d1d1d] font-medium truncate">
                {item.title}
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {/* 오늘 데이터면 NEW 텍스트 표시 */}
              {item.isToday && (
                <span className="text-red-500 font-bold text-xs">NEW</span>
              )}
              <span className="text-gray-400 text-sm whitespace-nowrap">
                {item.time}
              </span>
            </div>
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