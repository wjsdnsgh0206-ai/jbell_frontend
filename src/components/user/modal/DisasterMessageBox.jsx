import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import axios from "axios";

const DisasterMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 백엔드 영문 코드를 한글 이름과 색상으로 매핑
  const typeMap = {
    NATURAL_EARTHQUAKE: { label: "지진", color: "#ef4444", bg: "bg-red-100", text: "text-red-600" },
    NATURAL_HEAVYRAIN: { label: "호우", color: "#3b82f6", bg: "bg-blue-100", text: "text-blue-600" },
    NATURAL_FLOOD: { label: "홍수", color: "#0ea5e9", bg: "bg-sky-100", text: "text-sky-600" },
    HEAT_SHELTER: { label: "폭염", color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" },
    CIVIL_DEFENSE_DISASTER: { label: "기타/실종", color: "#94a3b8", bg: "bg-gray-100", text: "text-gray-600" },
    ITEM_001: { label: "알림", color: "#94a3b8", bg: "bg-gray-100", text: "text-gray-600" }
  };

  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        setIsLoading(true);
        // 우리 백엔드 API 호출
        const response = await axios.get("http://localhost:8080/api/disaster/message-list");
        
        // 백엔드 response.data.data 구조에 맞춰서 저장
        const formattedData = (response.data.data || []).map(item => ({
          id: item.sn,
          time: item.crtDt ? item.crtDt.split(" ")[1].substring(0, 5) : "00:00",
          content: item.msgCn,
          dstType: item.dstType,
          category: item.emrgStepNm, // 긴급/안전안내 등
          region: item.rcptnRgnNm
        }));

        setMessages(formattedData);
      } catch (error) {
        console.error("백엔드 데이터 호출 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromBackend();
  }, []);

  return (
    <div className="flex flex-col h-auto lg:h-full max-h-[440px] md:max-h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0 bg-white">
        <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-red-50">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        <h3 className="text-body-s-bold md:text-body-m-bold text-gray-900">전북 실시간 재난문자</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-10">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-detail-s">데이터를 가져오는 중입니다...</p>
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const style = typeMap[msg.dstType] || typeMap['ITEM_001'];
            return (
              <div
                key={msg.id}
                className="relative p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:shadow-md border-l-4"
                style={{ borderLeftColor: style.color }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] md:text-detail-s-bold text-gray-700 font-bold">
                      {msg.category}
                    </span>
                    <span className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded font-black ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-detail-s text-gray-400 font-mono">
                    <Clock size={10} />
                    {msg.time}
                  </div>
                </div>
                <p className="text-detail-s md:text-detail-m text-gray-700 leading-relaxed break-keep font-medium">
                  {msg.content}
                </p>
                <p className="mt-2 text-[10px] text-blue-500 font-semibold">{msg.region}</p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p className="text-detail-m mb-1">데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterMessage;