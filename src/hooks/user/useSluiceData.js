import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";

export const useSluiceData = () => {
  const [damData, setDamData] = useState([]);
  const [rainMarkers, setRainMarkers] = useState([]);
  const [rainStatus, setRainStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // 발생 건수 (통계용)
  const [rainCount, setRainCount] = useState(0); // 호우 특보만 사용

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const str = String(timeStr);
    return str.length < 12
      ? str
      : `${str.substring(4, 6)}.${str.substring(6, 8)} ${str.substring(
          8,
          10
        )}:${str.substring(10, 12)}`;
  };

  /* =========================
      호우 특보
  ========================= */
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
          color: isWarning ? "#FF4D4D" : "#FFA500",
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

      // 호우 특보 발생 건수만 통계로 사용
      setRainCount(newMarkers.length);
      setRainStatus(statusMap);
      setRainMarkers(newMarkers);
    } catch (error) {
      console.error("[호우특보 API] 에러:", error);
      setRainCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
      수위 / 댐
  ========================= */
  const fetchDamData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disasterModalService.getWaterLevelList();

      let itemList = [];
      if (Array.isArray(response?.data?.data)) {
        itemList = response.data.data;
      } else if (Array.isArray(response?.data)) {
        itemList = response.data;
      } else if (Array.isArray(response)) {
        itemList = response;
      }

      if (itemList.length === 0) {
        setDamData([]);
        return;
      }

      const formattedData = itemList.map((item) => {
        const obsName = item.obsNm || item.obs_nm || "";
        const isJeonbuk =
          obsName.includes("진안") ||
          obsName.includes("전주") ||
          (item.bbsnNm?.includes("섬진강") ?? false);

        return {
          name: obsName || "관측소명 없음",
          damCode: item.obsCd || item.obs_cd || "-",
          bbsnNm: item.bbsnNm || item.bbsn_nm || "-",
          waterLevel: item.waterLevel ?? item.water_level ?? 0,
          storageRate:
            (item.waterLevel > 5 || item.water_level > 5) ? "90" : "45",
          discharge: "-",
          time: formatTime(item.obsTime || item.obs_time),
          region: isJeonbuk ? "전북" : "기타",
          mngOrg: item.mngOrg || item.mng_org || "-",
        };
      });

      setDamData(formattedData);
    } catch (error) {
      console.error("[수위 API] 로직 에러:", error);
      setDamData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    damData,        
    rainMarkers,
    rainStatus,
    rainCount,    
    loading,
    fetchDamData,
    fetchRainfallWarning,
  };
};
