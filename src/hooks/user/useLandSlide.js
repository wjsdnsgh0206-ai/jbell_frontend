import { useState, useCallback, useMemo } from "react";
import { disasterModalService } from "@/services/api";

/*
  산사태
  - 통계 기준: 수집된 데이터 개수
  - 날짜는 표시용만 사용
*/

const useLandSlide = () => {
  const [lsData, setLsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
      산사태 데이터 수집
  ========================= */
  const fetchLandSlideData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await disasterModalService.getLandSlideWarning({
        pageNo: 1,
        numOfRows: 100,
      });

      const dataList = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      const formattedList = dataList.map((item, index) => {
        const name = item.sggNm || item.fireLoc || "전북 지역";
        const grade = item.lnldFrcstNm || "주의보";
        const dateStr = item.predcAnlsDt || item.localDateTime || "";

        return {
          id: `ls-${index}`,
          info: {
            name,
            grade,
            status: "발생",
            address: `${name} 인근`,
            date: dateStr || "정보 없음",
            tel: "063-120",
            desc: `${name} 산사태 정보 확인 필요`,
          },
        };
      });

      setLsData(formattedList);

    } catch (error) {
      console.error("🚨 [산사태 API] 에러:", error);
      setLsData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =========================
     산사태 발생 건수
  ========================= */
  const lsCount = useMemo(() => {
    return lsData.length;
  }, [lsData]);

  return {
    lsData,
    lsCount,     
    isLoading,
    fetchLandSlideData,
  };
};

export default useLandSlide;
