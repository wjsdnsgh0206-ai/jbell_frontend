import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import axios from "axios";

const DisasterMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 환경 변수에서 API 키 가져오기
  const DISASTER_API_KEY = import.meta.env.VITE_API_DISATER_TEXT_MESSAGE_KEY;

  useEffect(() => {
    const fetchDisasterMessages = async () => {
      if (!DISASTER_API_KEY) {
        console.error("환경 변수 VITE_API_DISATER_TEXT_MESSAGE_KEY가 설정되지 않았습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const now = new Date();
        const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const url = `/message-api/DSSP-IF-00247`;

        const response = await axios.get(url, {
          params: {
            serviceKey: DISASTER_API_KEY,
            crtDt: todayStr,
            numOfRows: 100,
            rgnNm: "전북특별자치도",
          }
        });

        const rawData = response.data?.body || [];

        const formattedData = rawData.map((item, index) => {
          const content = item.MSG_CN || "내용 없음";
          const regDt = item.CRT_DT || "";
          
          // [수정 포인트] DST_SE_NM(재난구분명) 가져오기
          const disasterCategory = item.DST_SE_NM || "알림";

          // 재난구분명이나 내용을 기반으로 태그 색상 결정을 위한 type 설정
          let type = "주의";
          if (disasterCategory.includes("화재") || content.includes("화재")) type = "화재";
          else if (
            disasterCategory.includes("대설") || disasterCategory.includes("호우") || 
            disasterCategory.includes("기상") || content.includes("눈") || content.includes("비")
          ) type = "기상";
          else if (
            disasterCategory.includes("교통") || content.includes("교통") || 
            content.includes("결빙") || content.includes("사고")
          ) type = "교통";

          return {
            id: item.SN || `msg-${index}`,
            category: disasterCategory, // DST_SE_NM 저장
            time: regDt.includes(" ") ? regDt.split(" ")[1].substring(0, 5) : "00:00",
            content: content,
            type: type,
          };
        });

        setMessages(formattedData);
      } catch (error) {
        console.error("재난문자 호출 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisasterMessages();
  }, [DISASTER_API_KEY]);

  return (
    <div className="flex flex-col h-auto lg:h-full max-h-[440px] md:max-h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0 bg-white rounded-none">
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
          messages.map((msg) => (
            <div
              key={msg.id}
              className="relative p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:shadow-md group border-l-4"
              style={{
                borderLeftColor:
                  msg.type === "화재" ? "#ef4444" :
                  msg.type === "기상" ? "#3b82f6" :
                  msg.type === "교통" ? "#f97316" : "#94a3b8",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {/* [수정 포인트] "전북" 대신 msg.category (DST_SE_NM) 표시 */}
                  <span className="text-[11px] md:text-detail-s-bold text-gray-700 font-bold">
                    {msg.category}
                  </span>
                  <span className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded font-black ${
                    msg.type === "화재" ? "bg-red-100 text-red-600" :
                    msg.type === "기상" ? "bg-blue-100 text-blue-600" :
                    msg.type === "교통" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                  }`}>
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
            <p className="text-detail-m mb-1">오늘 수신된 전북 재난문자가 없습니다.</p>
            <p className="text-detail-s opacity-70">평온한 하루네요! 😊</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        <p className="text-detail-xs text-gray-400 leading-tight">SafetyData API (전북특별자치도 기준)</p>
      </div>
    </div>
  );
};

export default DisasterMessage;