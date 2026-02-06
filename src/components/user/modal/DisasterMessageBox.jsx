import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * 전북 실시간 재난문자 목록 컴포넌트
 * API로부터 수집된 오늘 날짜의 재난문자를 최신순으로 표시함
 */
const DisasterMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 재난 유형별 Badge 스타일 설정
   * 특정 유형에 맞는 색상을 매핑하고, 없을 경우 DEFAULT 스타일 적용
   */
  const typeMap = {
    // 1순위: 기상 / 자연재해
    호우: { color: "#2563eb", bg: "bg-blue-100", text: "text-blue-700" },
    태풍: { color: "#1d4ed8", bg: "bg-blue-100", text: "text-blue-700" },
    대설: { color: "#3b82f6", bg: "bg-blue-100", text: "text-blue-700" },
    화재: { color: "#dc2626", bg: "bg-red-100", text: "text-red-700" },
    지진: { color: "#b91c1c", bg: "bg-red-100", text: "text-red-700" },
    폭염: { color: "#ea580c", bg: "bg-orange-100", text: "text-orange-700" },
    한파: { color: "#0284c7", bg: "bg-sky-100", text: "text-sky-700" },

    // 2순위: 주의 / 경보
    미세먼지: { color: "#ca8a04", bg: "bg-yellow-100", text: "text-yellow-700" },
    황사: { color: "#a16207", bg: "bg-yellow-100", text: "text-yellow-700" },
    산불: { color: "#f97316", bg: "bg-orange-100", text: "text-orange-700" },
    강풍: { color: "#0ea5e9", bg: "bg-sky-100", text: "text-sky-700" },
    건조: { color: "#fb923c", bg: "bg-orange-100", text: "text-orange-700" },
    산사태: { color: "#92400e", bg: "bg-amber-100", text: "text-amber-700" },
    풍랑: { color: "#0369a1", bg: "bg-sky-100", text: "text-sky-700" },
    안개: { color: "#6b7280", bg: "bg-gray-100", text: "text-gray-600" },

    // 기본값 (위 목록에 없는 경우)
    DEFAULT: { color: "#9ca3af", bg: "bg-gray-100", text: "text-gray-600" },
  };

  /**
   * 서버에서 받은 로우 데이터를 화면 표시용으로 가공하는 함수
   * 필드명 통일, 오늘 날짜 필터링, 최신순 정렬 수행
   */
  const formatData = useCallback((rawData) => {
    const safeData = Array.isArray(rawData) ? rawData : [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    return safeData
      .map((item, index) => {
        const id = item.id || item.ID || item.sn || item.SN;
        const crtDt = item.CRT_DT || item.crtDt || item.crt_dt;
        const msgCn = item.MSG_CN || item.msgCn || item.msg_cn;
        const dstType = item.DST_SE_NM || item.dst_type || item.dstType || item.DST_TYPE;
        const emrgStepNm = item.EMRG_STEP_NM || item.emrgStepNm || "안전안내";

        let fullDateTime = "날짜 정보 없음";
        let isToday = false;

        if (crtDt) {
          const standardizedDt = crtDt.replace(/\//g, "-").replace("T", " ");
          fullDateTime = standardizedDt.substring(0, 16);
          isToday = standardizedDt.startsWith(todayStr);
        }

        return {
          key: id ? `msg-${id}-${index}` : `msg-idx-${index}`,
          dateTime: fullDateTime,
          isToday: isToday,
          content: msgCn,
          dstType: dstType,
          category: emrgStepNm,
        };
      })
      .filter((msg) => msg.isToday === true) // 오늘 발생한 메시지만 추출
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime)); // 시간 내림차순 정렬
  }, []);

  /**
   * DB에 저장된 재난문자 목록을 가져오는 함수
   */
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/disaster/dashboard/disasterMessages");
      const rawData = response.data?.list || response.data?.data || (Array.isArray(response.data) ? response.data : []);
      
      setMessages(formatData(rawData));
    } catch (error) {
      console.error("재난문자 조회 에러:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 외부 API로부터 최신 데이터를 수집하도록 서버에 요청한 후 목록을 갱신하는 함수
   */
const handleRefresh = async () => {
  try {
    setIsLoading(true);
    const now = new Date();
    // 일주일 전 날짜 계산
    const weekAgo = new Date(now.setDate(now.getDate() - 7)); 
    const fetchDate = `${weekAgo.getFullYear()}/${String(weekAgo.getMonth() + 1).padStart(2, "0")}/${String(weekAgo.getDate()).padStart(2, "0")}`;

    await axios.post("/api/disaster/dashboard/disasterMessageInfo", {
      crtDt: `${fetchDate} 00:00:00`, // 오늘 대신 7일 전부터 가져오도록 변경
      rgnNm: "전북",
      numOfRows: 100, // 7일치니까 넉넉하게 요청
      pageNo: 1,
      type: "json",
    });

    await fetchMessages(); // 리스트 새로고침
    
    // 만약 DisasterMessageList와 같은 페이지에 있다면 
    // 부모나 공통 상태를 통해 List 컴포넌트의 데이터도 다시 불러와야 해!
  } catch (error) {
    console.error("데이터 갱신 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

  // 컴포넌트 마운트 시 데이터 호출
  useEffect(() => {
    fetchMessages();
  }, [formatData]);

  return (
    <div className="flex flex-col h-auto lg:h-full max-h-[500px] md:max-h-full bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* 타이틀 및 갱신 버튼 */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-white flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900">전북 실시간 재난문자</h3>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-bold"
        >
          {isLoading ? "수집 중..." : "갱신"}
        </button>
      </div>

      {/* 재난문자 리스트 영역 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 custom-scrollbar">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const style = typeMap[msg.dstType] || typeMap.DEFAULT;
            return (
              <div
                key={msg.key}
                className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl border-l-4 transition-all hover:bg-white"
                style={{ borderLeftColor: style.color }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{msg.category}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded font-black ${style.bg} ${style.text}`}
                    >
                      {msg.dstType || "알림"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    {msg.isToday && (
                      <span className="text-red-500 font-bold text-[10px] animate-pulse">NEW</span>
                    )}
                    {msg.dateTime}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {msg.content}
                </p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p className="text-sm font-medium">오늘 수신된 재난문자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterMessage;