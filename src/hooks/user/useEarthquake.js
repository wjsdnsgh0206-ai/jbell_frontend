import { useState, useCallback, useMemo } from "react";
import { disasterModalService } from "@/services/api";

const useEarthquake = () => {
  const [eqMarkers, setEqMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [earthquakeCount, setEarthquakeCount] = useState(0);

  // 전주시청 좌표 (기준점)
  const JEONJU_CITY_HALL = { lat: 35.8242, lng: 127.148 };

  // 거리 계산 함수
  const getDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p2.lat - p1.lat, 2) + Math.pow(p2.lng - p1.lng, 2),
    );
  };

  // console.log("earthquakeCount>>>>", earthquakeCount);
  const fetchEarthquakeData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await disasterModalService.getEarthquakeList();

      const items = response?.data?.data || response?.data || response || [];

      if (!Array.isArray(items)) {
        // console.warn("⚠️ 지진 데이터가 배열이 아님:", items);
        setEqMarkers([]);
        return;
      }

      const formattedData = items
        .map((eq, idx) => {
          const latNum = parseFloat(eq.lat);
          const lngNum = parseFloat(eq.lon);

          if (isNaN(latNum) || isNaN(lngNum)) return null;

          const locationName = eq.loc || "";

          if (
            !locationName.includes("전북") &&
            !locationName.includes("전라북도")
          ) {
            return null;
          }

          const rawTime = String(eq.tmFc || "");
          let formattedDate = "정보 없음";
          let formattedTime = "정보 없음";

          if (rawTime.length >= 8) {
            formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(
              4,
              6,
            )}-${rawTime.substring(6, 8)}`;

            if (rawTime.length >= 12) {
              formattedTime = `${rawTime.substring(8, 10)}:${rawTime.substring(
                10,
                12,
              )}`;
            }
          }

          const distance = getDistance(JEONJU_CITY_HALL, {
            lat: latNum,
            lng: lngNum,
          });

          return {
            id: eq.seq || `eq-${idx}`,
            lat: latNum,
            lng: lngNum,
            distance,
            title: `[규모 ${eq.mt || "0.0"}] 지진발생`,
            rawTime,
            content: `
              <div style="line-height:1.6; padding:10px; min-width:200px; font-family:sans-serif;">
                <div style="border-bottom:2px solid #f3f4f6; padding-bottom:8px; margin-bottom:8px;">
                  <span style="color:#ef4444; font-weight:bold; font-size:15px;">
                    규모 ${eq.mt || "0.0"} 지진발생정보
                  </span>
                </div>
                <div style="font-size:13px; color:#374151;">
                  <p style="margin:4px 0;"><b>발생날짜:</b> ${formattedDate}</p>
                  <p style="margin:4px 0;"><b>발생시각:</b> ${formattedTime}</p>
                  <p style="margin:4px 0;"><b>발생위치:</b> ${locationName}</p>
                  <p style="margin:4px 0;"><b>참고사항:</b> ${
                    eq.rem || "없음"
                  }</p>
                </div>
              </div>
            `,
          };
        })
        .filter(Boolean);

      // console.log("📍 전북 지진 데이터 개수:", formattedData.length);
      setEarthquakeCount(formattedData.length);
      setEqMarkers(formattedData);
    } catch (error) {
      console.error("🔥 지진 데이터 로드 실패:", error);
      setEqMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const nearestEq = useMemo(() => {
    if (eqMarkers.length === 0) return null;
    return [...eqMarkers].sort((a, b) => a.distance - b.distance)[0];
  }, [eqMarkers]);

  const getMapCenter = useCallback(
    (mode) => {
      if (mode === "지진발생정보" && nearestEq) {
        return { lat: nearestEq.lat, lng: nearestEq.lng };
      }
      return JEONJU_CITY_HALL;
    },
    [nearestEq],
  );

  const clearMarkers = useCallback(() => {
    setEqMarkers([]);
  }, []);

  return {
    eqMarkers,
    fetchEarthquakeData,
    clearMarkers,
    earthquakeCount,
    isLoading,
    getMapCenter,
    selectedMarker: nearestEq,
  };
};

export default useEarthquake;
