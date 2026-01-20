// src/hooks/user/useColdWave.js
import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP, DISASTER_TYPE_CODE } from "@/components/user/disaster/disasterCodes";

const useColdWave = () => {
  const [disasterStatus, setDisasterStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState([]); 

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const str = String(timeStr);
    return `${str.substring(4, 6)}.${str.substring(6, 8)} ${str.substring(8, 10)}:${str.substring(10, 12)}`;
  };

  const fetchColdWaveData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterModalService.getDisasterSpecials({
        warningType: DISASTER_TYPE_CODE.COLD_WAVE 
      });

      const items = response?.response?.body?.items?.item;
      if (!items) {
        setDisasterStatus({});
        setMarkers([]);
        return;
      }

      const itemList = Array.isArray(items) ? items : [items];
      const statusMap = {};
      const newMarkers = []; 

      itemList.forEach((item) => {
        // 1. 매핑 정보 객체 가져오기 ({name, lat, lng})
        const regionInfo = JEONBUK_CODE_MAP[item.areaCode];

        if (!regionInfo) return; 
        if (item.command === "2") return;

        const regionName = regionInfo.name; // 이름 추출
        const isWarning = Number(item.warnStress) === 1;

        // 2. 지도 색칠용 데이터
        statusMap[regionName] = {
          code: item.areaCode,
          region: regionName,
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500", 
          startTime: item.startTime,
          type: item.warnVar,
        };

        // 3. 지도 마커용 데이터
        newMarkers.push({
          lat: regionInfo.lat, // 좌표 사용
          lng: regionInfo.lng,
          time: item.startTime,
          title: `[${isWarning ? "경보" : "주의보"}] ${regionName}`,
          content: `
            <div style="padding:4px 0;">
              <strong>지역:</strong> ${regionName}<br/>
              <strong>발효시각:</strong> ${formatTime(item.startTime)}<br/>
              <span style="color:${isWarning ? "red" : "orange"}; font-weight:bold;">
                 현재 한파 ${isWarning ? "경보" : "주의보"} 발효 중
              </span>
            </div>
          `
        });
      });
      
      console.log("📍 생성된 마커 개수:", newMarkers.length);
      
      setDisasterStatus(statusMap);
      setMarkers(newMarkers); 
      
    } catch (error) {
      console.error("한파 특보 조회 실패:", error);
      setDisasterStatus({});
      setMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { disasterStatus, markers, isLoading, fetchColdWaveData };
};

export default useColdWave;