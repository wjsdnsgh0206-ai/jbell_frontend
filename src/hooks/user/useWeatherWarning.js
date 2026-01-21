import { useState, useEffect, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

export const useWeatherWarning = (disasterType) => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);
      
      const dateList = [];
      for (let i = 0; i <= 3; i++) {
        const date = new Date(threeDaysAgo);
        date.setDate(threeDaysAgo.getDate() + i);
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        dateList.push(dateStr);
      }
      
      const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0].replace(/-/g, '');
      const todayStr = now.toISOString().split('T')[0].replace(/-/g, '');
      
      let allRawData = [];
      
      for (const inqDt of dateList) {
        try {
          const res = await disasterModalService.getWeatherWarning({ inqDt });
          
          let result = res?.data || res?.response || res;
          
          if (result?.header && !['00', '0'].includes(String(result.header.resultCode))) {
            continue;
          }
          
          let dateRawData = [];
          const body = result?.body || result?.response?.body;
          const items = body?.item || result?.items?.item;
          
          if (Array.isArray(body)) {
            dateRawData = body;
          } else if (items) {
            dateRawData = Array.isArray(items) ? items : [items];
          }
          
          if (dateRawData.length > 0) {
            allRawData = allRawData.concat(dateRawData);
          }
        } catch (error) {
          // API 호출 실패 시 해당 날짜 건너뛰기
        }
      }
      
      if (allRawData.length > 0) {
        const uniqueDataMap = new Map();
        allRawData.forEach(item => {
          const key = `${item.PRSNTN_TM}_${item.PRSNTN_SN}`;
          if (!uniqueDataMap.has(key)) {
            uniqueDataMap.set(key, item);
          }
        });
        const uniqueData = Array.from(uniqueDataMap.values());
        
        const filtered = uniqueData.filter((item, index) => {
          const fullTimeStr = String(item.PRSNTN_TM || "");
          const itemDate = fullTimeStr.substring(0, 8);
          
          if (!itemDate || itemDate < threeDaysAgoStr || itemDate > todayStr) {
            return false;
          }

          const title = item.TTL || "";
          const content = item.SPNE_FRMNT_PRCON_CN || "";
          const zone = item.RLVT_ZONE || "";
          const targetText = (title + content + zone).replace(/\s/g, "");
          let matchesType = false;
          switch (disasterType) {
            case 'earthquake': matchesType = /지진|해일/.test(targetText); break;
            case 'flood': matchesType = /호우|홍수|강수|비/.test(targetText); break;
            case 'landSlide': matchesType = /산사태|대설|한파|눈/.test(targetText); break;
            case 'typhoon': matchesType = /태풍|강풍|풍랑|바람/.test(targetText); break;
            case 'forestFire': matchesType = /건조|산불|화재/.test(targetText); break;
            default: matchesType = false;
          }
          
          return matchesType;
        });

        const sorted = filtered.sort((a, b) => {
          const timeA = String(a.PRSNTN_TM || "");
          const timeB = String(b.PRSNTN_TM || "");
          
          if (timeA !== timeB) {
            return timeB.localeCompare(timeA);
          }
          return Number(b.PRSNTN_SN || 0) - Number(a.PRSNTN_SN || 0);
        });

        setWarnings(sorted);
      } else {
        setWarnings([]);
      }
    } catch (error) {
      setWarnings([]);
    } finally {
      setIsLoading(false);
    }
  }, [disasterType]);

  useEffect(() => {
    if (disasterType && disasterType !== 'accident') {
      fetchWarnings();
    }
  }, [fetchWarnings, disasterType]);

  return { warnings, isLoading, refetch: fetchWarnings };
};