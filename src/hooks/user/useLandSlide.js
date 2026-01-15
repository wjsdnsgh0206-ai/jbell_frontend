import { useState, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

const useLandSlide = () => {
  const [lsMarkers, setLsMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const regionCoords = {
    "전주시": { lat: 35.8242, lng: 127.1480 },
    "군산시": { lat: 35.9677, lng: 126.7366 },
    "익산시": { lat: 35.9483, lng: 126.9573 },
    "정읍시": { lat: 35.5699, lng: 126.8573 },
    "남원시": { lat: 35.4164, lng: 127.3905 },
    "김제시": { lat: 35.8036, lng: 126.8808 },
    "완주군": { lat: 35.9046, lng: 127.1623 },
    "진안군": { lat: 35.7915, lng: 127.4249 },
    "무주군": { lat: 36.0068, lng: 127.6607 },
    "장수군": { lat: 35.6472, lng: 127.5209 },
    "임실군": { lat: 35.6178, lng: 127.2889 },
    "순창군": { lat: 35.3743, lng: 127.1373 },
    "고창군": { lat: 35.4358, lng: 126.7020 },
    "부안군": { lat: 35.7316, lng: 126.7334 },
  };

  const fetchLandSlideData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await disasterModalService.getLandSlideWarning({ numOfRows: 100 });
      const rawData = res?.response?.body?.items?.item || [];
      const dataList = Array.isArray(rawData) ? rawData : [rawData];

      const now = new Date();
      
      const markers = dataList
        .map((item, index) => {
          const regionName = Object.keys(regionCoords).find(key => 
            item.ocrnFrcstIssuInsttNm?.includes(key)
          );
          
          if (!regionName) return null;

          // 1. 날짜 확인 (24시간 이내 여부)
          const issueDate = item.frstFrcstIssuDt ? new Date(item.frstFrcstIssuDt) : null;
          let isRecent = false;
          if (issueDate) {
            const diffDays = Math.abs(now - issueDate) / (1000 * 60 * 60 * 24);
            isRecent = diffDays <= 1;
          }

          // 2. 상태 확인 (해제가 아닌 발령 상태인가)
          const currentStatus = item.frcstIssuStts || "해제";
          const isNotReleased = currentStatus !== "해제";

          const coords = regionCoords[regionName];
          
          return {
            id: `ls-${index}-${item.frstFrcstIssuDt || Date.now()}`, 
            lat: coords.lat,
            lng: coords.lng,
            // 최근 1일 이내 데이터이면서 + 상태가 '해제'가 아닐 때만 true (활성 특보)
            isActiveWarning: isRecent && isNotReleased, 
            info: {
              name: item.ocrnFrcstIssuInsttNm || "산사태 예보",
              grade: item.frcstIssuKindNm || "주의보",
              status: currentStatus,
              address: `${item.ocrnFrcstIssuInsttNm} 인근`,
              date: item.frstFrcstIssuDt || "정보 없음",
              tel: "063-120",
              desc: `${item.ocrnFrcstIssuInsttNm} 산사태 ${item.frcstIssuKindNm} 발령 (${currentStatus})`
            }
          };
        })
        .filter(marker => marker !== null);

      const sortedMarkers = markers.sort((a, b) => new Date(b.info.date) - new Date(a.info.date));
      setLsMarkers(sortedMarkers);
    } catch (error) {
      console.error("🚨 산사태 데이터 로드 실패:", error);
      setLsMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { lsMarkers, isLoading, fetchLandSlideData };
};

export default useLandSlide;