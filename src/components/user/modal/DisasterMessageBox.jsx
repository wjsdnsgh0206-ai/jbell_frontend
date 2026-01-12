import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { disasterModalService } from '@/services/api'; 

const DisasterMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // .env에 저장된 API 키
  const messageKey = import.meta.env.VITE_API_DISATER_TEXT_MESSAGE_KEY;

  useEffect(() => {
    const fetchDisasterMessages = async () => {
      try {
        setIsLoading(true);

        const data = await disasterModalService.getDisasters({
          serviceKey: messageKey,
          returnType: "json",
          pageNo: 1,
          numOfRows: 30,
        });

        const rawData = data?.body || [];

        const formattedData = rawData.map((item, index) => {
          const content = item.MSTN_BRNE_CN || "내용 없음";
          const regDt = item.REG_DT || "2026/01/01 00:00:00";

          let type = "주의";
          if (content.includes("화재")) type = "화재";
          else if (
            content.includes("호우") ||
            content.includes("태풍") ||
            content.includes("비")
          )
            type = "호우";
          else if (content.includes("교통") || content.includes("사고"))
            type = "교통";

          return {
            id: item.MSTN_BRNE_NO || `msg-${index}`,
            region: "전북지역",
            time: regDt.includes(" ")
              ? regDt.split(" ")[1].substring(0, 5)
              : "00:00",
            content: content,
            type: type,
          };
        });

        setMessages(formattedData);
      } catch (error) {
        console.error("재난문자 로딩 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (messageKey) {
      fetchDisasterMessages();
    }
  }, [messageKey]);

  return (
    /* 수정 포인트: 
      1. max-h-[400px]: 모바일에서 최대 높이 제한
      2. md:max-h-full: 데스크톱에서는 다시 높이 제한 해제
      3. overflow-hidden: 내부 스크롤 시 라운드 처리된 모서리가 깨지지 않게 함
    */
    <div className="flex flex-col h-full max-h-[450px] md:max-h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* 헤더 */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0 bg-white">
        <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-red-50">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        <h3 className="text-body-s-bold md:text-body-m-bold text-gray-900">
          실시간 재난문자
        </h3>
      </div>

      {/* 리스트 영역: flex-1과 overflow-y-auto 조합으로 내부 스크롤 구현 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-10">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-detail-s">
              최신 재난정보를 불러오는 중입니다...
            </p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="relative p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:shadow-md group border-l-4"
              style={{
                borderLeftColor:
                  msg.type === "화재"
                    ? "#ef4444"
                    : msg.type === "호우"
                    ? "#3b82f6"
                    : msg.type === "교통"
                    ? "#f97316"
                    : "#94a3b8",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] md:text-detail-s-bold text-gray-600 font-bold">
                    {msg.region}
                  </span>
                  <span
                    className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded font-black ${
                      msg.type === "화재"
                        ? "bg-red-100 text-red-600"
                        : msg.type === "호우"
                        ? "bg-blue-100 text-blue-600"
                        : msg.type === "교통"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {msg.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] md:text-detail-s text-gray-400 font-mono">
                  <Clock size={10} className="md:w-3 md:h-3" />
                  {msg.time}
                </div>
              </div>

              <p className="text-detail-s md:text-detail-m text-gray-700 leading-relaxed break-keep font-medium">
                {msg.content}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p>최근 24시간 내 재난문자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        <p className="text-detail-xs text-gray-400 leading-tight">
          본 정보는 공공데이터를 기반으로 제공되며,
          <br className="md:hidden" />
          실제 상황과 일부 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default DisasterMessage;