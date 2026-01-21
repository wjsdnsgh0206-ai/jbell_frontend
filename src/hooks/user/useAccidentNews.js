import { useState, useEffect, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

export const useAccidentNews = () => {
  const [accidents, setAccidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterModalService.getAccidentNews();
      const rawData = response?.body?.items;
      
      if (!rawData) {
        setAccidents([]);
        return;
      }
      const rawItems = Array.isArray(rawData) ? rawData : [rawData];

      const now = new Date();
      const todayStr = now.getFullYear() + 
                       String(now.getMonth() + 1).padStart(2, '0') + 
                       String(now.getDate()).padStart(2, '0');

      const formattedData = rawItems
        .filter(item => String(item.startDate || "").startsWith(todayStr))
        .map((item, index) => {
          const rawStart = String(item.startDate || "");
          const rawEnd = String(item.endDate || "");
          const type = String(item.eventType || "");
          
          let category = "기타돌발";
          if (/(사고|재난|차량고장)/.test(type)) category = "재난";
          else if (/(공사|작업|보수)/.test(type)) category = "공사";

          return {
            id: item.linkId || item.eventId || `acc-${index}`, // 고유 ID로 linkId 사용
            category,
            type: type || "알 수 없음",
            detailType: item.eventDetailType || "", // 세부 유형 (ex: 추돌사고, 포장공사 등)
            content: item.message || "상세 정보 없음",
            
            // 날짜 관련
            _rawDateNum: Number(rawStart) || 0, 
            displayDate: rawStart.length >= 12 
              ? `${rawStart.substring(4, 6)}.${rawStart.substring(6, 8)} ${rawStart.substring(8, 10)}:${rawStart.substring(10, 12)}`
              : "시간 정보 없음",
            fullDate: rawStart.length >= 12
              ? `${rawStart.substring(0, 4)}년 ${rawStart.substring(4, 6)}월 ${rawStart.substring(6, 8)}일 ${rawStart.substring(8, 10)}시 ${rawStart.substring(10, 12)}분`
              : "정보 없음",
            endDate: rawEnd.length >= 12 
              ? `${rawEnd.substring(8, 10)}:${rawEnd.substring(10, 12)}`
              : null,

            // 도로 및 위치 정보
            roadName: item.roadName || "도로명 미상",
            roadNo: item.roadNo ? `${item.roadNo}번선` : "",
            roadType: item.type || "", // 도로 유형 (고속도로/국도 등)
            direction: item.roadDrcType || "", // 도로 방향
            
            // 통제 정보
            blockType: item.lanesBlockType || "", // 차단 통제 유형
            blockedLanes: item.lanesBlocked || "", // 차단 차로 (ex: 1차로, 전차로)
            
            lat: Number(item.coordY), 
            lng: Number(item.coordX)
          };
        });

      formattedData.sort((a, b) => b._rawDateNum - a._rawDateNum);
      setAccidents(formattedData.slice(0, 30));
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setAccidents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccidents();
  }, [fetchAccidents]);

  return { accidents, isLoading, refetch: fetchAccidents };
};