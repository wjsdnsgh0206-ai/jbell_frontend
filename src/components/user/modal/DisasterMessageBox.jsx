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
    const now = new Date();
    // 비교를 위한 오늘 날짜 문자열 (YYYY/MM/DD)
    const todayStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    return rawData
      .map(item => {
        // 대소문자 및 스네이크 케이스 대응 (DTO 설정에 맞춰 유연하게)
        const sn = item.sn || item.SN;
        const crtDt = item.crtDt || item.CRT_DT;
        const msgCn = item.msgCn || item.MSG_CN;
        const dstType = item.dstType || item.DST_TYPE || item.DST_SE_NM;
        const emrgStepNm = item.emrgStepNm || item.EMRG_STEP_NM;

        let fullDateTime = "날짜 정보 없음";
        let isToday = false;

        if (crtDt) {
          // "2026-01-28T10:00:11" 또는 "2026/01/28 10:00:11" 대응
          const formattedDt = crtDt.replace(/-/g, '/').replace('T', ' ');
          fullDateTime = formattedDt.substring(0, 16);
          isToday = formattedDt.startsWith(todayStr); // 오늘 날짜로 시작하는지 체크
        }

        return {
          id: sn,
          dateTime: fullDateTime,
          isToday: isToday, // 💡 필터링 기준이 됨
          content: msgCn,
          dstType: dstType,
          category: emrgStepNm,
        };
      })
      // ⭐ 이 부분이 핵심! 오늘 날짜인 데이터만 남김
      .filter(msg => msg.isToday === true)
      // (옵션) 최신순 정렬이 안 되어 있다면 여기서 한 번 더 정렬 가능
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, []);

  // 💡 DB에서 데이터를 가져오는 함수 (GET)
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      // 백엔드 GetMapping 주소와 맞춰야 해!
      const response = await axios.get("http://localhost:8080/api/disaster/dashboard/disasterMessages");
      
      // 백엔드 반환 구조가 ApiResponse<T> 형태라면 response.data.data 로 접근
      const rawData = response.data?.data || response.data || [];
      setMessages(formatData(rawData));
    } catch (error) {
      console.error("재난문자 조회 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 [선택] 최신 데이터로 수집(POST)하고 다시 불러오기
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/'); // "2026/01/28"
      
      await axios.post("http://localhost:8080/api/disaster/dashboard/disasterMessageInfo", {
        crtDt: `${today} 00:00:00`,
        rgnNm: "전북",
        numOfRows: 30,
        pageNo: 1,
        type: "json"
      });
      
      // 수집 끝났으면 다시 목록 불러오기
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
      {/* 헤더 영역 */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 bg-white flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900">전북 실시간 재난문자 (최근 7일)</h3>
        <button 
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
        >
          {isLoading ? "수집 중..." : "갱신"}
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {isLoading && messages.length === 0 ? (
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
                  
                  <div className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
                    {msg.isToday && (
                      <span className="text-red-500 font-bold text-xs animate-pulse">NEW</span>
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
            <p className="text-sm">수집된 재난문자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterMessage;