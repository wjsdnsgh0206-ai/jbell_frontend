import { useState, useEffect, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

export const useWeatherWarning = (disasterType) => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. 날짜 설정: 오늘 날짜를 기준으로 조회 (15일 데이터 포함을 위해)
      const now = new Date();
      // 만약 과거 데이터를 더 넓게 보고 싶다면 setDate(now.getDate() - 1) 등을 유지해도 됨
      const inqDt = now.toISOString().split('T')[0].replace(/-/g, '');
      
      const res = await disasterModalService.getWeatherWarning({ inqDt });
      
      const result = res.data || res; 
      const rawData = result.body || []; 

      console.log(`📡 [API 응답] 전체 데이터 개수: ${result.totalCount || rawData.length}`);

      if (Array.isArray(rawData) && rawData.length > 0) {
        const filtered = rawData.filter((item) => {
          const title = item.TTL || "";
          const content = item.SPNE_FRMNT_PRCON_CN || "";
          const zone = item.RLVT_ZONE || "";
          const targetText = (title + content + zone).replace(/\s/g, "");

          // 2. 재난별 필터링
          switch (disasterType) {
            case 'earthquake':
              return /지진|해일/.test(targetText);
            case 'flood':
              return /호우|홍수|강수|비/.test(targetText);
            case 'landSlide':
              return /산사태|대설|한파|눈/.test(targetText);
            case 'typhoon':
              return /태풍|강풍|풍랑|바람/.test(targetText);
            case 'forestFire':
              return /건조|산불|화재/.test(targetText);
            default:
              return false;
          }
        });

        // 3. 🔥 최신순 정렬 보강 (날짜 우선 -> 일련번호 차선)
        const sorted = filtered.sort((a, b) => {
          // PRSNTN_DT (발표일시: 20260115...) 비교
          const dateA = String(a.PRSNTN_DT || "");
          const dateB = String(b.PRSNTN_DT || "");

          if (dateA !== dateB) {
            // 문자열 내림차순 정렬 (최신 날짜가 위로)
            return dateB.localeCompare(dateA);
          }

          // 날짜가 같으면 PRSNTN_SN (일련번호) 기준 내림차순
          return Number(b.PRSNTN_SN || 0) - Number(a.PRSNTN_SN || 0);
        });

        console.log(`🎯 [${disasterType}] 최신순 정렬 완료: ${sorted.length}건`);
        setWarnings(sorted);
      } else {
        console.warn("⚠️ 원본 데이터(body)가 배열이 아니거나 비어있어.");
        setWarnings([]);
      }
    } catch (error) {
      console.error("🚨 기상특보 API 연결 에러:", error);
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