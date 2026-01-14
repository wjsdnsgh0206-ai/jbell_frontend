import { useState, useCallback } from "react";
import { XMLParser } from "fast-xml-parser";
import { disasterModalService } from "@/services/api";
import dayjs from 'dayjs';

const useEarthquake = () => {
  const [eqMarkers, setEqMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEarthquakeData = useCallback(async () => {
    setIsLoading(true);
    
    const now = dayjs().format('YYYYMMDD');
    const oneYearAgo = dayjs().subtract(1, 'year').format('YYYYMMDD');
    
    try {
      const xmlData = await disasterModalService.getEarthquakeWarning({
        frDate: oneYearAgo,
        laDate: now,
        msgCode: "102,212", 
        arDiv: "A",
      });

      const parser = new XMLParser({
        ignoreAttributes: false,
      });

      const jsonObj = parser.parse(xmlData);
      console.log("Raw API Response:", jsonObj);

      const items = jsonObj?.alert?.earthqueakNoti.info || [];
      const itemList = Array.isArray(items) ? items : [items];
      const oneMonthDateAgo = Number(dayjs().subtract(1, 'month').format('YYYYMMDD000000'));

      const formatted = itemList
        .filter(item => item && Object.keys(item).length > 0)
        .filter(item => item.eqArCdNm === '전북' && oneMonthDateAgo < Number(item.tmIssue))
        .map(item => {
            const tmIssue = String(item?.tmIssue);
            return {
                lat: parseFloat(item?.eqLt),
                lng: parseFloat(item?.eqLn),
                title: `규모 ${item?.magMl} 지진`,
                content: `장소: ${item?.eqPt}<br/>발생시각: ${tmIssue.substring(4,6)}월 ${tmIssue.substring(6,8)}일 ${tmIssue.substring(8,10)}시`,
            }
        })
        .filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
        
      setEqMarkers(formatted);
      console.log("전국 지진 데이터 로드 완료:", formatted);
    } catch (error) {
      console.error("지진 데이터 로드 실패:", error);
      setEqMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearEqMarkers = useCallback(() => {
    setEqMarkers([]);
  }, []);

  return { eqMarkers, fetchEarthquakeData, clearEqMarkers, isLoading };
};

export default useEarthquake;