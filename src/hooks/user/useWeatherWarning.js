import { useState, useEffect, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

export const useWeatherWarning = (disasterType) => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const res = await disasterModalService.getWeatherWarning({ inqDt: today });
      
      if (res.data && res.data.body) {
        const allData = res.data.body;

        // 재난별 키워드 매칭 로직
        const filtered = allData.filter((item) => {
          const title = item.TTL || "";
          const content = item.SPNE_FRMNT_PRCON_CN || "";
          const targetText = title + content;

          switch (disasterType) {
            case 'earthquake': // 지진
              return targetText.includes('지진') || targetText.includes('해일');
            case 'flood': // 호우홍수
              return targetText.includes('호우') || targetText.includes('홍수') || targetText.includes('강수');
            case 'typhoon': // 태풍
              return targetText.includes('태풍') || targetText.includes('강풍') || targetText.includes('풍랑');
            case 'fire': // 산불
              return targetText.includes('건조') || targetText.includes('산불');
            case 'landslide': // 산사태
              return targetText.includes('산사태') || targetText.includes('호우') || targetText.includes('대설');
            default:
              return false;
          }
        });

        setWarnings(filtered);
      }
    } catch (error) {
      console.error("기상특보 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [disasterType]);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  return { warnings, isLoading, refetch: fetchWarnings };
};