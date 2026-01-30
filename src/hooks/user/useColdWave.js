import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";

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
      const response = await disasterModalService.getWeatherList(3);
      const itemList = response?.data || [];
      
      if (itemList.length === 0) {
        setDisasterStatus({});
        setMarkers([]);
        return;
      }

      const statusMap = {};
      const newMarkers = [];

      itemList.forEach((item) => {
        const regionInfo = JEONBUK_CODE_MAP[item.areaCode];
        
        // 전북 지역 코드 매핑 확인
        if (!regionInfo) return; 

        const regionName = regionInfo.name;
        const isWarning = Number(item.warnStress) === 1;

        statusMap[regionName] = {
          code: item.areaCode,
          region: regionName,
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500", 
          startTime: item.startTime,
          type: item.warnVar,
        };

        newMarkers.push({
          lat: regionInfo.lat,
          lng: regionInfo.lng,
          time: item.startTime,
          title: `[한파 ${isWarning ? "경보" : "주의보"}] ${regionName}`,
          content: `
            <div style="padding:8px; min-width:150px; line-height:1.4;">
              <div style="margin-bottom:4px;"><strong>지역:</strong> ${regionName}</div>
              <div style="font-size:12px; color:#666;">발표: ${formatTime(item.tmFc)}</div>
              <div style="font-size:12px; color:#666; margin-bottom:4px;">발효: ${formatTime(item.startTime)}</div>
              <div style="color:${isWarning ? "#FF4D4D" : "#FFA500"}; font-weight:bold; border-top:1px solid #eee; padding-top:4px; margin-top:4px;">
                  현재 한파 ${isWarning ? "경보" : "주의보"} 발효 중
              </div>
            </div>
          `
        });
      });

      setDisasterStatus(statusMap);
      setMarkers(newMarkers);
      
    } catch (error) {
      setDisasterStatus({});
      setMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { disasterStatus, markers, isLoading, fetchColdWaveData };
};

export default useColdWave;