import { useState, useCallback } from "react";
import { XMLParser } from "fast-xml-parser";
import { disasterModalService } from "@/services/api";
import dayjs from 'dayjs';

const useEarthquake = () => {
  const [eqMarkers, setEqMarkers] = useState([]);
  const [levelMarkers, setLevelMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 현재 날짜 기준 한 달 전 계산
  const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYYMMDD');
  const oneMonthAgoFull = Number(dayjs().subtract(1, 'month').format('YYYYMMDD000000'));

  // 1. 지진특보 API (전북 + 한 달)
  const fetchEarthquakeData = useCallback(async () => {
    setIsLoading(true);
    const now = dayjs().format('YYYYMMDD');
    try {
      const xmlData = await disasterModalService.getEarthquakeWarning({
        frDate: oneMonthAgo,
        laDate: now,
        msgCode: "102,212",
        arDiv: "A",
      });

      const parser = new XMLParser({ ignoreAttributes: false });
      const jsonObj = parser.parse(xmlData);
      const items = jsonObj?.alert?.earthqueakNoti?.info || [];
      const itemList = Array.isArray(items) ? items : [items];

      const formatted = itemList
        .filter(item => item && Object.keys(item).length > 0)
        .filter(item => item.eqArCdNm === '전북' && oneMonthAgoFull < Number(item.tmIssue))
        .map(item => ({
          lat: parseFloat(item?.eqLt),
          lng: parseFloat(item?.eqLn),
          title: `[특보] 규모 ${item?.magMl}`,
          content: `장소: ${item?.eqPt}<br/>발생시각: ${String(item?.tmIssue).substring(4,6)}월 ${String(item?.tmIssue).substring(6,8)}일`,
        }))
        .filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
        
      setEqMarkers(formatted);
    } catch (error) {
      console.error("지진특보 로드 에러:", error);
      setEqMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, [oneMonthAgo, oneMonthAgoFull]);

  // 2. 진도정보조회 API (전북 + 한 달)
  const fetchEarthquakeLevel = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterModalService.getEarthquakeLevel();
      const items = response?.body || []; 
      
      const formatted = items
        .filter(item => {
          const isJeonbuk = item.PSTN?.includes('전북') || item.STDG_CTPV_CD === '45'; 
          const isRecent = Number(item.PRSNTN_DT) >= Number(oneMonthAgo);
          return isJeonbuk && isRecent;
        })
        .map(item => {
          const dateStr = String(item.PRSNTN_DT);
          return {
            lat: parseFloat(item.LAT),
            lng: parseFloat(item.LOT),
            title: `[진도] 규모 ${item.ROPR_}`,
            content: `
              <strong>장소:</strong> ${item.PSTN}<br/>
              <strong>최대진도:</strong> ${item.ROPR_GRD}등급<br/>
              <strong>발생시각:</strong> ${dateStr.substring(4,6)}월 ${dateStr.substring(6,8)}일 ${item.PRSNTN_HR.substring(0,2)}:${item.PRSNTN_HR.substring(2,4)}
            `,
          };
        })
        .filter(m => !isNaN(m.lat) && !isNaN(m.lng));

      setLevelMarkers(formatted);
    } catch (error) {
      console.error("진도정보 로드 에러:", error);
      setLevelMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, [oneMonthAgo]);

  const clearMarkers = useCallback(() => {
    setEqMarkers([]);
    setLevelMarkers([]);
  }, []);

  return { eqMarkers, levelMarkers, fetchEarthquakeData, fetchEarthquakeLevel, clearMarkers, isLoading };
};

export default useEarthquake;