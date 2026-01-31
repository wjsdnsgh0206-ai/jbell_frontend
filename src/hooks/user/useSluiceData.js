import { useState, useCallback } from 'react';
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP } from "@/components/user/disaster/disasterCodes";

const ALL_DAM_LIST = [
  { code: '3031210', name: '용담댐', region: '전북' },
  { code: '4011110', name: '섬진강댐', region: '전북' },
  { code: '1001110', name: '소양강댐', region: '강원' },
  { code: '1003110', name: '충주댐', region: '충북' },
  { code: '2022510', name: '대청댐', region: '충남' },
  { code: '2018110', name: '안동댐', region: '경북' },
  { code: '2004110', name: '합천댐', region: '경남' },
  { code: '4013110', name: '주암댐', region: '전남' }
];

export const useSluiceData = () => {
  const [damData, setDamData] = useState([]);
  const [rainMarkers, setRainMarkers] = useState([]); // 호우특보 마커
  const [rainStatus, setRainStatus] = useState({});   // 호우특보 지역 상태
  const [loading, setLoading] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const str = String(timeStr);
    return str.length < 12 ? str : `${str.substring(4, 6)}.${str.substring(6, 8)} ${str.substring(8, 10)}:${str.substring(10, 12)}`;
  };

  // 1. 호우특보 데이터 가져오기 (코드 2번)
  const fetchRainfallWarning = useCallback(async () => {
    setLoading(true);
    try {
      const response = await disasterModalService.getWeatherList(2); // 2: 호우
      const itemList = Array.isArray(response?.data) ? response.data : [];
      
      const statusMap = {};
      const newMarkers = [];

      itemList.forEach((item, index) => {
        const regionInfo = JEONBUK_CODE_MAP[item.areaCode];
        if (!regionInfo) return;

        const regionName = regionInfo.name;
        const isWarning = Number(item.warnStress) === 1; // 1: 경보, 0: 주의보

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

      setRainStatus(statusMap);
      setRainMarkers(newMarkers);
    } catch (error) {
      console.error("🚨 [호우특보 API] 에러:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. 댐 데이터 가져오기 (기존 유지)
  const fetchDamData = async () => {
    if (loading) return;
    setLoading(true);

    const sluiceKey = import.meta.env.VITE_API_DISATER_SLUICE_KEY;
    const now = new Date();
    const format = (d) => d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0');
    
    const eddt = format(now);
    const stdt = format(new Date(now.setDate(now.getDate() - 10)));

    const initialList = ALL_DAM_LIST.map(dam => ({ ...dam, isOffline: true, time: '불러오는 중...' }));
    setDamData(initialList);

    try {
      ALL_DAM_LIST.forEach(async (dam, index) => {
        try {
          const res = await disasterModalService.getSluice({
            serviceKey: sluiceKey,
            damcode: dam.code,
            stdt, eddt,
            _type: 'json'
          });

          const items = res?.response?.body?.items?.item;
          const target = Array.isArray(items) ? items[items.length - 1] : items;

          const updatedDam = {
            ...dam,
            waterLevel: target?.lowlevel || '-',
            discharge: target?.totdcwtrqy || '-',
            storageRate: target?.rsvwtrt || '-',
            time: target?.obsrdtmnt || '점검 중',
            isOffline: !target
          };

          setDamData(prev => {
            const newList = [...prev];
            newList[index] = updatedDam;
            return newList;
          });
        } catch (err) {
          console.error(`${dam.name} 로드 실패:`, err);
        }
      });
    } catch (error) {
      console.error("🚨 [수문 API] 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  return { damData, rainMarkers, rainStatus, loading, fetchDamData, fetchRainfallWarning };
};