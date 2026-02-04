// src/hooks/user/useWeatherWarning.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useWeatherWarning = () => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 재난별 매칭 키워드 설정
  const DISASTER_KEYWORDS = {
    지진: ["지진", "해일"],
    호우홍수: ["호우", "대우", "홍수", "강우", "침수"],
    산사태: ["산사태", "토사"],
    태풍: ["태풍"],
    산불: ["산불", "화재"],
    한파: ["한파", "대설", "눈", "추위"]
  };

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    headers: { "Content-Type": "application/json" },
  });

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/disaster/dashboard/weatherWarnings", {
        params: { pageNo: 1, numOfRows: 100 },
      });

      const list = res.data?.list ?? [];
      if (list.length === 0) {
        setWarnings([]);
        return;
      }

      const processedData = list
        .map((item) => {
          const rawZone = item.rlvtZone || item.RLVT_ZONE || "";
          const rawContent = item.SPNE_FRMNT_PRCON_CN || item.content || item.CONTENT || "";
          const title = item.ttl || item.TTL || "";

          // 1. 전북 관련 구역만 추출
          const processedZone = rawZone
            .split(/,|\n|;/)
            .map(s => s.trim())
            .filter(s => s.includes("전북") || s.includes("전라북도"))
            .join(", ");

          // 2. 재난 카테고리 매칭
          let category = "기타"; // 매칭되는 게 없을 경우
          for (const [key, keywords] of Object.entries(DISASTER_KEYWORDS)) {
            if (keywords.some(kw => title.includes(kw) || rawContent.includes(kw))) {
              category = key;
              break; 
            }
          }

          return {
            PRSNTN_SN: item.prsntnSn || item.PRSNTN_SN,
            TTL: title,
            CONTENT: rawContent,
            PRSNTN_TM: String(item.prsntnTm || item.PRSNTN_TM || ""),
            RLVT_ZONE: processedZone,
            CATEGORY: category, // ✅ 분류된 카테고리 추가
          };
        })
        // 3. 전북 데이터이면서 카테고리가 '기타'가 아닌 것만 (혹은 필요에 따라 조절)
        .filter((item) => item.RLVT_ZONE.length > 0 && item.CATEGORY !== "기타");

      // 4. 최신순 정렬
      const sorted = [...processedData].sort((a, b) =>
        b.PRSNTN_TM.localeCompare(a.PRSNTN_TM)
      );

      setWarnings(sorted);
    } catch (error) {
      console.error("❌ 기상특보 조회 실패:", error);
      setWarnings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  return {
    warnings, // 전체 데이터 (안에 CATEGORY 필드가 있음)
    isLoading,
    refetch: fetchWarnings,
  };
};