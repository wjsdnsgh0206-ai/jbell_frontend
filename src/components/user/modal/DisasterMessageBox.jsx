import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * 전북 실시간 재난문자 목록 컴포넌트
 */
const DisasterMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 재난 유형별 스타일 매핑 테이블
  const typeMap = {
    NATURAL_EARTHQUAKE: { label: "지진", color: "#ef4444", bg: "bg-red-100", text: "text-red-600" },
    NATURAL_HEAVYRAIN: { label: "호우", color: "#3b82f6", bg: "bg-blue-100", text: "text-blue-600" },
    NATURAL_FLOOD: { label: "홍수", color: "#0ea5e9", bg: "bg-sky-100", text: "text-sky-600" },
    NATURAL_TYPHOON: { label: "태풍", color: "#8b5cf6", bg: "bg-purple-100", text: "text-purple-600" },
    ITEM_001: { label: "알림", color: "#94a3b8", bg: "bg-gray-100", text: "text-gray-600" }
  };

  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:8080/api/disaster/message-list");
        const rawData = response.data?.data || [];
        
        // 💡 오늘 날짜 문자열 생성 (YYYY/MM/DD 형식)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}/${month}/${day}`;

        const formattedData = rawData.map(item => {
          let fullDateTime = "날짜 정보 없음";
          let isToday = false;

          if (item.crtDt && typeof item.crtDt === 'string') {
            fullDateTime = item.crtDt.substring(0, 16); // "2026/01/27 16:09"
            isToday = item.crtDt.startsWith(todayStr); // 오늘 날짜로 시작하는지 확인
          }

          return {
            id: item.sn,
            dateTime: fullDateTime,
            isToday: isToday, // 💡 오늘 날짜 여부 저장
            content: item.msgCn,
            dstType: item.dstType,
            category: item.emrgStepNm,
            region: item.rcptnRgnNm
          };
        });

        setMessages(formattedData);
      } catch (error) {
        console.error("재난문자 수신 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromBackend();
  }, []);

  return (
    <div className="flex flex-col h-auto lg:h-full max-h-[440px] md:max-h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* 헤더 영역 */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-white">
        <h3 className="text-base font-bold text-gray-900">전북 실시간 재난문자</h3>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p className="text-sm">데이터 로딩 중...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const style = typeMap[msg.dstType] || typeMap['ITEM_001'];
            return (
              <div
                key={msg.id}
                className="p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white border-l-4"
                style={{ borderLeftColor: style.color }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{msg.category}</span>
                    <span className={`text-sm px-1.5 py-0.5 rounded font-black ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  
                  {/* 💡 날짜와 시간 표시 + 오늘이면 NEW 텍스트 표시 */}
                  <div className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
                    {msg.isToday && (
                      <span className="text-red-500 font-bold text-xs">NEW</span>
                    )}
                    {msg.dateTime}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {msg.content}
                </p>
                {/* <p className="mt-2 text-sm text-blue-500 font-semibold">{msg.region}</p> */}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p className="text-sm">수집된 재난문자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterMessage;