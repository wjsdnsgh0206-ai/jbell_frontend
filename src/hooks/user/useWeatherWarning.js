import { useState, useEffect, useCallback } from "react";
import { disasterApi } from "@/services/api";

export const useWeatherWarning = () => {
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 재난별 키워드
  const DISASTER_KEYWORDS = {
    지진: ["지진", "해일"],
    호우홍수: ["호우", "대우", "홍수", "강우", "침수", "강수"],
    산사태: ["산사태", "토사"],
    태풍: ["태풍"],
    산불: ["산불", "화재", "건조"],
    한파: ["한파", "대설", "눈", "추위", "적설"],
  };

  const fetchWarnings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterApi.getSavedWeatherWarnings();
      const list = response?.list || [];

      console.log("✅ [fetchWarnings] API 응답 확인:", list);

      const processedData = list
        .map((item) => {
          const title = item.TTL || "";
          const rawContent = item.SPNE_FRMNT_PRCON_CN || item.content || "";
          const visibleYn = (
            item.visible_yn ||
            item.visibleYn ||
            "Y"
          ).toUpperCase();

          // 🔍 백엔드에서 내려오는 원본 값들 로그 출력
          console.log(
            `[데이터 확인] 제목: ${title} | 원본 is_manual: ${item.is_manual} | 원본 isManual: ${item.isManual} | visibleYn: ${visibleYn}`,
          );

          // 관리자 등록 여부 판단 (보통 DB 컬럼명인 is_manual로 들어올 확률이 높음)
          const isAdminCreated =
            item.is_manual === "Y" || item.isManual === "Y";

          // 재난 카테고리 매칭
          let matchedCategories = [];
          for (const [key, keywords] of Object.entries(DISASTER_KEYWORDS)) {
            if (
              keywords.some(
                (kw) => title.includes(kw) || rawContent.includes(kw),
              )
            ) {
              matchedCategories.push(key);
            }
          }

          return {
            ...item,
            CATEGORIES: matchedCategories,
            level: item.level || item.lvl || '보통',
            visibleYn,
            isAdminCreated,
          };
        })

//                   const processedData = list.map((item) => {
//   // ... 생략
//   return {
//     ...item,
//     level: item.level || item.lvl || '보통', // 👈 이 부분이 있는지 꼭 확인!
//     visibleYn: (item.visible_yn || item.visibleYn || "Y").toUpperCase(),
//     // ... 생략
//   };
// });



        .filter((item) => {
          // 🔥 관리자 생성 데이터는 무조건 통과
          if (item.isAdminCreated === true) {
            return true;
          }

          // 기존 필터 로직
          const showItem =
            item.is_manual === "N" ||
            (item.CATEGORIES.length > 0 &&
              item.RLVT_ZONE?.includes("전북") &&
              item.visibleYn === "Y");

          if (!showItem) {
            console.log(
              "❌ 필터링으로 제외됨:",
              item.TTL,
              "| visibleYn:",
              item.visibleYn,
              "| isAdminCreated:",
              item.isAdminCreated,
              "| 카테고리개수:",
              item.CATEGORIES.length,
            );
          }

          return showItem;
        });

      // 최신 순 정렬
      const sorted = [...processedData].sort((a, b) =>
        b.PRSNTN_TM.localeCompare(a.PRSNTN_TM),
      );

      console.log(
        "✅ [정렬 후 경보 목록]",
        sorted.map((i) => ({
          TTL: i.TTL,
          visibleYn: i.visibleYn,
          isAdminCreated: i.isAdminCreated,
          level : i.level,
        })),
      );

      setWarnings(sorted);
    } catch (error) {
      console.error("❌ [fetchWarnings] 기상특보 조회 실패:", error);
      setWarnings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  return { warnings, isLoading, refetch: fetchWarnings };
};
