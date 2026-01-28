import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useWeatherWarning = (disasterType) => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. DB 조회 API 호출
      const res = await axios.get('/api/disaster/dashboard/weatherWarnings');
      
      // 2. 응답 구조 확인 및 데이터 추출
      const allRawData = res.data?.data || res.data || [];
      console.log("검색 대상 데이터 수:", allRawData.length);

      if (allRawData.length > 0) {
        // 3일 전 날짜 계산 (비교용)
        const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
        const limitDay = threeDaysAgo.toISOString().split('T')[0].replace(/-/g, '');

        // 3. 필터링 시작
        const filtered = allRawData.filter((item) => {
          // 데이터가 대문자로 오기 때문에 대문자 필드 사용
          const prsntnTm = String(item?.PRSNTN_TM || ""); 
          const title = String(item?.TTL || "");
          const content = String(item?.SPNE_FRMNT_PRCON_CN || ""); // 상세내용
          const zone = String(item?.RLVT_ZONE || "");

          // [날짜 필터] 8자리 날짜가 limitDay(예: 20260125)보다 커야 함
          if (prsntnTm.substring(0, 8) < limitDay) return false;

          // [지역 필터] 전북, 전라북도, 전북자치도 키워드 포함 확인
          const isJeonbuk = /전북|전라북도|전북자치도/.test(zone + content);
          if (!isJeonbuk) return false;

          // [재난 유형 필터] 키워드 매칭
          const targetText = (title + content + zone).replace(/\s/g, "");
          let matches = false;
          
          switch (disasterType) {
            case 'earthquake': matches = /지진|해일/.test(targetText); break;
            case 'flood':      matches = /호우|홍수|강수|비|침수/.test(targetText); break;
            case 'landSlide':  matches = /산사태|대설|한파|눈|제설/.test(targetText); break;
            case 'typhoon':    matches = /태풍|강풍|풍랑|바람/.test(targetText); break;
            case 'forestFire': matches = /건조|산불|화재/.test(targetText); break;
            default:           matches = false;
          }
          return matches;
        });

        // 4. 최신순 정렬
        const sorted = filtered.sort((a, b) => {
          const timeA = String(a?.PRSNTN_TM || "");
          const timeB = String(b?.PRSNTN_TM || "");
          if (timeA !== timeB) return timeB.localeCompare(timeA);
          return (Number(b?.PRSNTN_SN) || 0) - (Number(a?.PRSNTN_SN) || 0);
        });

        setWarnings(sorted);
      } else {
        setWarnings([]);
      }
    } catch (error) {
      console.error("기상 특보 fetch 에러:", error);
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