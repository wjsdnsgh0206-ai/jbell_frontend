import React, { useState, useEffect, useCallback } from "react";
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

  // 💡 데이터를 가공하고 오늘 날짜만 필터링하는 함수
  const formatData = useCallback((rawData) => {
    // [중요] rawData가 배열이 아니면 빈 배열로 강제 설정하여 .map 에러 방지
    const safeData = Array.isArray(rawData) ? rawData : [];
    
    const now = new Date();
    const todayStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    return safeData
      .map((item, index) => {
        const sn = item.sn || item.SN;
        const crtDt = item.crtDt || item.CRT_DT;
        const msgCn = item.msgCn || item.MSG_CN;
        const dstType = item.dstType || item.DST_TYPE || item.DST_SE_NM;
        const emrgStepNm = item.emrgStepNm || item.EMRG_STEP_NM;

        let fullDateTime = "날짜 정보 없음";
        let isToday = false;

        if (crtDt) {
          const formattedDt = crtDt.replace(/-/g, '/').replace('T', ' ');
          fullDateTime = formattedDt.substring(0, 16);
          isToday = formattedDt.startsWith(todayStr);
        }

        return {
          // sn이 혹시 중복되거나 없을 경우를 대비해 index를 섞음
          id: sn ? `msg-${sn}-${index}` : `msg-idx-${index}`,
          dateTime: fullDateTime,
          isToday: isToday,
          content: msgCn,
          dstType: dstType,
          category: emrgStepNm,
        };
      })
      .filter(msg => msg.isToday === true)
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, []);

  // 💡 DB에서 데이터를 가져오는 함수 (GET)
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/disaster/dashboard/disasterMessages");
      
      // [수정 포인트] 데이터 구조를 더 안전하게 파싱
      const rawData = response.data?.data || response.data || [];
      
      // formatData 함수가 이제 안전하게 배열 체크를 함
      setMessages(formatData(rawData));
    } catch (error) {
      console.error("재난문자 조회 에러:", error);
      setMessages([]); // 에러 시 빈 배열로 초기화
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
      
      await axios.post("/api/disaster/dashboard/disasterMessageInfo", {
        crtDt: `${today} 00:00:00`,
        rgnNm: "전북",
        numOfRows: 30,
        pageNo: 1,
        type: "json"
      });
      
      await fetchMessages();
    } catch (error) {
      console.error("데이터 갱신 실패:", error);
      alert("최신 데이터를 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [formatData]);

  return (
    <div className="flex flex-col h-auto lg:h-full max-h-[500px] md:max-h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-white flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900">전북 실시간 재난문자</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          {isLoading ? "수집 중..." : "갱신"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p className="text-sm font-medium">데이터 로딩 중...</p>
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
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-black ${style.bg} ${style.text}`}>
                      {style.label}
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
            <p className="text-sm font-medium">수신된 재난문자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterMessage;