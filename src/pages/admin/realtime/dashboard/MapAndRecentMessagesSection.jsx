import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { pressService } from '@/services/api'; // 백엔드와 통신하는 서비스 임포트

const MapAndRecentMessagesSection = ({ timeRange }) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [disasterMessages, setDisasterMessages] = useState([]);
  const [pressRels, setPressRels] = useState([]); // 백엔드에서 가져온 보도자료 저장
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 재난문자 가져오기 (기존 방식)
    const fetchDisasterMessages = async () => {
      try {
        const response = await axios.get("/api/disaster/dashboard/disasterMessages");
        const rawData = response.data?.list || response.data || [];
        setDisasterMessages(rawData);
      } catch (error) {
        console.error("재난문자 로드 실패:", error);
      }
    };

    // 2. 보도자료 가져오기 (AdminPressRelList에서 썼던 방식 그대로)
    const fetchPressRels = async () => {
      try {
        // 백엔드 DB에 저장된 목록을 가져오기 위해 서비스 호출
        // 대시보드용이니까 최근 데이터 위주로 가져오게 설정
        const response = await pressService.getPressList({ offset: 0, limit: 20 });
        if (response) {
          setPressRels(response);
        }
      } catch (error) {
        console.error("보도자료 DB 로드 실패:", error);
      }
    };

    fetchDisasterMessages();
    fetchPressRels();
  }, []);

  // 시간 필터링 함수
  const filterByTime = (dateStr, range) => {
    if (!dateStr) return false;
    const normalizedDate = dateStr.replace('T', ' ').replace(/\//g, '-');
    const itemDate = new Date(normalizedDate);
    if (isNaN(itemDate.getTime())) return false;

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
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (activeTab === "news") {
      // 보도자료: 백엔드 DB에서 온 pressRels 사용
      return pressRels
        .filter(item => filterByTime(item.createdAt, timeRange))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(item => ({ 
          id: item.contentId, 
          title: item.title, 
          time: item.createdAt?.split('T')[0], 
          isToday: item.createdAt?.startsWith(todayStr) 
        }));
    }

    // 재난문자
    return disasterMessages
      .filter(item => filterByTime(item.crtDt, timeRange))
      .slice(0, 5)
      .map(item => ({
        id: item.sn,
        title: `[${item.emrgStepNm}] ${item.msgCn}`,
        time: item.crtDt?.substring(0, 16).replace(/\//g, '-'),
        isToday: item.crtDt?.replace(/\//g, '-').startsWith(todayStr)
      }));
  }, [activeTab, disasterMessages, pressRels, timeRange]);

  const handleViewAll = () => {
    navigate(activeTab === "messages" ? "/admin/realtime/disasterMessageList" : "/admin/contents/pressRelList");
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

      <div className="p-4 flex flex-col h-[280px]">
        {currentDisplayData.length > 0 ? (
          currentDisplayData.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 border-b border-gray-50 last:border-none hover:bg-slate-50 rounded-lg transition-colors cursor-pointer overflow-hidden"
              onClick={() => {
                // 클릭 시 상세 페이지 이동 (필요하면)
                if(activeTab === "news") navigate(`/admin/contents/pressRelDetail/${item.id}`);
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[16px] text-[#1d1d1d] font-medium truncate">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {item.isToday && <span className="text-red-500 font-bold text-xs">NEW</span>}
                <span className="text-gray-400 text-sm whitespace-nowrap">{item.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-2">
            <Info size={32} className="opacity-20" />
            <p className="text-[15px]">
              {timeRange} 내에 등록된 {activeTab === "messages" ? "재난 문자가" : "보도 자료가"} 없습니다.
            </p>
          </div>
        )}
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