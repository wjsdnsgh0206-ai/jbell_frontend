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

      // 1. 오늘 날짜 구하기 (YYYYMMDD 형식)
      const now = new Date();
      const todayStr = now.getFullYear() + 
                       String(now.getMonth() + 1).padStart(2, '0') + 
                       String(now.getDate()).padStart(2, '0');

      // 2. 필터링 및 가공
      const formattedData = rawItems
        .filter(item => {
          // startDate의 앞 8자리가 오늘 날짜와 일치하는 것만 필터링
          const itemDate = String(item.startDate || "");
          return itemDate.startsWith(todayStr);
        })
        .map((item, index) => {
          const rawDate = String(item.startDate || "");
          const type = String(item.eventType || "");
          
          let category = "기타돌발";
          if (/(사고|재난|차량고장)/.test(type)) category = "재난";
          else if (/(공사|작업|보수)/.test(type)) category = "공사";

          return {
            id: item.eventId || `acc-${index}`,
            category,
            type: type || "알 수 없음",
            content: item.message || item.eventText || "상세 정보 없음",
            _rawDateNum: Number(rawDate) || 0, 
            displayDate: rawDate.length >= 12 
              ? `${rawDate.substring(0, 4)}.${rawDate.substring(4, 6)}.${rawDate.substring(6, 8)} ${rawDate.substring(8, 10)}:${rawDate.substring(10, 12)}`
              : "시간 정보 없음",
            detailDate: rawDate.length >= 12
              ? `${rawDate.substring(0, 4)}년 ${rawDate.substring(4, 6)}월 ${rawDate.substring(6, 8)}일 ${rawDate.substring(8, 10)}시 ${rawDate.substring(10, 12)}분`
              : "정보 없음",
            roadName: item.roadName || "도로명 미상",
            lat: item.coordY, 
            lng: item.coordX
          };
        });

      // 3. 최신순 정렬 후 상위 30건만 추출
      formattedData.sort((a, b) => b._rawDateNum - a._rawDateNum);
      const limitedData = formattedData.slice(0, 30); // 딱 30개만 자르기
      
      setAccidents(limitedData);
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