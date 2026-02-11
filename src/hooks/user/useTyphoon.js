// src/hooks/user/useTyphoon.js
import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";

const useTyphoon = () => {
  const [typhoonList, setTyphoonList] = useState([]);
  const [disasterStatus, setDisasterStatus] = useState({});
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typhoonCount, setTyphoonCount] = useState(0);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const str = String(timeStr);
    if (str.length < 12) return str;
    return `${str.substring(4, 6)}.${str.substring(6, 8)} ${str.substring(8, 10)}:${str.substring(10, 12)}`;
  };

  const fetchTyphoonData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. 태풍 경로 데이터
      const typhoonRes = await disasterModalService.getTyphoonList();
      if (typhoonRes?.status === "SUCCESS" && Array.isArray(typhoonRes.data)) {
        // src/hooks/user/useTyphoon.js (일부 수정)
const formattedPath = typhoonRes.data
  .filter((t) => t.typhoonLat !== null && t.typhoonLon !== null) // null 체크 강화
  .map((t, index) => ({
    id: `path-${t.typhoonYear || "2026"}-${t.typhoonNo || index}-${index}`,
    typhoonName: t.typhoonName,
    typhoonLat: Number(t.typhoonLat), 
    typhoonLon: Number(t.typhoonLon), 
    typhoonActiveYn: t.typhoonActiveYn,
    typhoonAnalysisDatetime: t.typhoonAnalysisDatetime,
    type: "typhoon_path",
  }));
setTyphoonList(formattedPath);

      }

      // console.log("태풍 >>>>", typhoonRes);

      // 2. 기상특보 7번(태풍) 데이터
      const response = await disasterModalService.getWeatherList(7);

      // [해결 2] rawData.map 에러 방지: 데이터가 배열인지 확실히 체크
      const itemList = Array.isArray(response?.data) ? response.data : [];

      // ✅ 태풍 특보 발생 건수
setTyphoonCount(itemList.length);

      if (itemList.length === 0) {
        setDisasterStatus({});
        setMarkers([]);
        return;
      }

      const statusMap = {};
      const newMarkers = [];

      itemList.forEach((item, index) => {
        const regionInfo = JEONBUK_CODE_MAP[item.areaCode];
        if (!regionInfo) return;

        const regionName = regionInfo.name;
        const isWarning = Number(item.warnStress) === 1;

        statusMap[regionName] = {
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500",
        };

        newMarkers.push({
          // 여기도 index를 추가해서 절대 겹치지 않게 함
          id: `marker-${item.areaCode}-${index}`,
          region: regionName,
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500",
          publishTime: formatTime(item.tmFc),
          startTime: formatTime(item.startTime),
          lat: regionInfo.lat,
          lng: regionInfo.lng,
        });
      });

      setDisasterStatus(statusMap);
      setMarkers(newMarkers);
    } catch (error) {
      console.error("❌ 태풍 데이터 로드 실패:", error);
      setDisasterStatus({});
      setMarkers([]);
      setTyphoonList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { typhoonList, disasterStatus, markers,typhoonCount, isLoading, fetchTyphoonData };
};

export default useTyphoon;
