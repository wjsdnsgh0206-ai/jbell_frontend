import { useState, useCallback } from 'react';
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";

export const useSluiceData = () => {
  const [damData, setDamData] = useState([]);
  const [rainMarkers, setRainMarkers] = useState([]);
  const [rainStatus, setRainStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const str = String(timeStr);
    return str.length < 12 ? str : `${str.substring(4, 6)}.${str.substring(6, 8)} ${str.substring(8, 10)}:${str.substring(10, 12)}`;
  };

  const fetchRainfallWarning = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disasterModalService.getWeatherList(2);
      const itemList = Array.isArray(response?.data) ? response.data : [];
      const statusMap = {};
      const newMarkers = [];

      itemList.forEach((item, index) => {
        const regionInfo = JEONBUK_CODE_MAP[item.areaCode];
        if (!regionInfo) return;
        const regionName = regionInfo.name;
        const isWarning = Number(item.warnStress) === 1;

        statusMap[regionName] = { 
          level: isWarning ? "경보" : "주의보", 
          color: isWarning ? "#FF4D4D" : "#FFA500" 
        };

        newMarkers.push({
          id: `rain-${item.areaCode}-${index}`,
          region: regionName,
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500",
          publishTime: formatTime(item.tmFc),
          startTime: formatTime(item.startTime),
          lat: regionInfo.lat,
          lng: regionInfo.lng,
        });
      });
      setRainStatus(statusMap);
      setRainMarkers(newMarkers);
    } catch (error) {
      console.error("🚨 [호우특보 API] 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDamData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disasterModalService.getWaterLevelList();
      
      // 1. 백엔드에서 준 진짜 '데이터 배열' 찾기
      // 응답 구조가 { data: { data: [...] } } 인 경우와 { data: [...] } 인 경우 모두 대응
      let itemList = [];
      if (response?.data?.data && Array.isArray(response.data.data)) {
        itemList = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        itemList = response.data;
      } else if (Array.isArray(response)) {
        itemList = response;
      }

      console.log("📥 가공 전 원본 리스트:", itemList);

      if (itemList.length === 0) {
        console.warn("⚠️ 백엔드에서 빈 배열을 보냈어. DB에 데이터가 있는지 확인해봐!");
        setDamData([]);
        return;
      }

      // 2. 데이터 가공
      const formattedData = itemList.map((item) => {
        // 백엔드 필드명이 스네이크 케이스(obs_nm)인지 카멜 케이스(obsNm)인지 확인 필요
        const obsName = item.obsNm || item.obs_nm || ""; 
        const isJeonbuk = obsName.includes("진안") || obsName.includes("전주") || (item.bbsnNm?.includes("섬진강") ?? false);

        return {
          name: obsName || "관측소명 없음",
          damCode: item.obsCd || item.obs_cd || "-",
          bbsnNm: item.bbsnNm || item.bbsn_nm || "-",
          waterLevel: item.waterLevel ?? item.water_level ?? 0,
          storageRate: (item.waterLevel > 5 || item.water_level > 5) ? "90" : "45",
          discharge: "-",
          time: formatTime(item.obsTime || item.obs_time),
          region: isJeonbuk ? "전북" : "기타",
          mngOrg: item.mngOrg || item.mng_org || "-"
        };
      });

      console.log("✅ 가공 완료 데이터:", formattedData);
      setDamData(formattedData);
    } catch (error) {
      console.error("🚨 [수위 API] 로직 에러:", error);
      setDamData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { damData, rainMarkers, rainStatus, loading, fetchDamData, fetchRainfallWarning };
};