import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pressService, disasterApi } from "@/services/api";

const MapAndRecentMessagesSection = ({ timeRange }) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [disasterMessages, setDisasterMessages] = useState([]);
  const [pressRels, setPressRels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [disasterRes, pressRes] = await Promise.all([
          disasterApi.getDisasterMessages(),
          pressService.getPressList({ offset: 0, limit: 20 }),
        ]);

        // 재난문자 매핑
        const rawDisaster = disasterRes?.list || [];
        setDisasterMessages(
          rawDisaster.map(item => ({
            id: item.id ?? item.ID ?? item.sn,
            category: item.EMRG_STEP_NM || item.emrgStepNm || "안전안내",
            content: item.MSG_CN || item.msgCn || "",
            dateTime: item.CRT_DT || item.crtDt || "",
          }))
        );

        // 보도자료 매핑
        const rawPress = Array.isArray(pressRes)
          ? pressRes
          : pressRes?.list || [];

        setPressRels(
          rawPress.map(item => ({
            ...item,
            id: item.contentId,
          }))
        );
      } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // 시간 필터
  const filterByTime = (dateStr, range) => {
    if (!dateStr || range === "전체" || !range) return true;
    const normalizedDate = dateStr.replaceAll("/", "-").replace("T", " ");
    const itemDate = new Date(normalizedDate);
    if (isNaN(itemDate.getTime())) return true;
    const diffHours = (new Date() - itemDate) / (1000 * 60 * 60);

    if (range === "최근 24시간" || range === "1일") return diffHours <= 24;
    if (range === "3일") return diffHours <= 72;
    if (range === "7일") return diffHours <= 168;
    if (range === "30일") return diffHours <= 720;
    return true;
  };

  const currentDisplayData = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (activeTab === "news") {
      return pressRels
        .filter(item => filterByTime(item.createdAt, timeRange))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          title: item.title,
          time: item.createdAt?.split("T")[0],
          isToday: item.createdAt?.startsWith(todayStr),
        }));
    }

    return disasterMessages
      .filter(item => filterByTime(item.dateTime, timeRange))
      .sort(
        (a, b) =>
          new Date(b.dateTime.replaceAll("/", "-")) -
          new Date(a.dateTime.replaceAll("/", "-"))
      )
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: `[${item.category}] ${item.content}`,
        time: item.dateTime?.substring(0, 16).replaceAll("/", "-"),
        isToday: item.dateTime?.replaceAll("/", "-").startsWith(todayStr),
      }));
  }, [activeTab, disasterMessages, pressRels, timeRange]);

  const handleViewAll = () => {
    navigate(
      activeTab === "messages"
        ? "/admin/realtime/disasterMessageList"
        : "/admin/contents/pressRelList"
    );
  };

  return (
    <section className="flex-1 h-[416px] relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-w-0">
      {/* 상단 탭 메뉴: 로딩과 상관없이 항상 노출 */}
      <nav className="flex w-full h-14 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex-1 font-bold text-[18px] ${
            activeTab === "messages"
              ? "border-b-4 border-slate-800 text-slate-800"
              : "text-gray-400"
          }`}
        >
          최근 재난 문자
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className={`flex-1 font-bold text-[18px] ${
            activeTab === "news"
              ? "border-b-4 border-slate-800 text-slate-800"
              : "text-gray-400"
          }`}
        >
          최근 보도 자료
        </button>
      </nav>

      {/* 리스트 영역: 데이터에 따라 로딩/리스트/빈화면 처리 */}
      <div className="p-4 flex flex-col h-[300px]">
        {loading ? (
          <LoadingSkeleton />
        ) : currentDisplayData.length > 0 ? (
          currentDisplayData.map(item => (
            <div
              key={`${activeTab}-${item.id}`}
              className="flex items-center justify-between p-3 border-b border-gray-50 last:border-none hover:bg-slate-50 rounded-lg cursor-pointer"
              onClick={() => {
                if (activeTab === "news") {
                  navigate(`/admin/contents/pressRelDetail/${item.id}`);
                } else {
                  navigate(`/admin/realtime/disasterMessageDetail/${item.id}`);
                }
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <span className="text-[15px] font-medium truncate">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {item.isToday && (
                  <span className="text-red-500 font-bold text-[10px] px-1 bg-red-50 rounded">
                    NEW
                  </span>
                )}
                <span className="text-gray-400 text-sm whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-2">
            <Info size={32} className="opacity-20" />
            <p className="text-[14px]">{timeRange} 내 데이터가 없습니다.</p>
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

const LoadingSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {/* 리스트 아이템 5개 형태의 스켈레톤 */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50">
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
    ))}
  </div>
);

export default MapAndRecentMessagesSection;