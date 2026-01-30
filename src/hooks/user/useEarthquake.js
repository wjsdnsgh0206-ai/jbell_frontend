import { useState, useCallback, useMemo } from "react";
import { disasterModalService } from "@/services/api";

const useEarthquake = () => {
  const [eqMarkers, setEqMarkers] = useState([]);
  const [levelMarkers, setLevelMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 전북도청 좌표 (기준점)
  const JEONBUK_PROVINCIAL_HALL = { lat: 35.8202, lng: 127.1088 };

  const fetchEarthquakeData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterModalService.getEarthquakeList();
      const items = response?.data || response || [];

      if (!Array.isArray(items)) {
        setEqMarkers([]);
        return;
      }

      const formattedData = items
        .map((eq, idx) => {
          /** 📍 위경도 */
          const latNum = parseFloat(eq.LAT ?? eq.lat);
          const lngNum = parseFloat(eq.LON ?? eq.lon ?? eq.lng);

          if (isNaN(latNum) || isNaN(lngNum)) return null;

          /** 📍 위치명 (전북 필터 유지) */
          const locationName = eq.LOC ?? eq.loc ?? "";
          if (
            !locationName.includes("전북") &&
            !locationName.includes("전라북도")
          ) {
            return null;
          }

          /** 📍 발생 시각
           * - 기존: TM_EQK (없음)
           * - 실제 데이터: tmFc (YYYYMMDDHHMM)
           */
          const rawTime = String(
            eq.TM_EQK ??
            eq.tmEqk ??
            eq.tmFc ??   // ✅ 핵심 수정
            ""
          );

          let formattedDate = "정보 없음";
          let formattedTime = "정보 없음";

          if (rawTime.length >= 8) {
            formattedDate = `${rawTime.substring(0, 4)}-${rawTime.substring(
              4,
              6
            )}-${rawTime.substring(6, 8)}`;

            if (rawTime.length >= 12) {
              formattedTime = `${rawTime.substring(8, 10)}:${rawTime.substring(
                10,
                12
              )}:${rawTime.substring(12, 14) || "00"}`;
            }
          }

          return {
            id: eq.SEQ ?? eq.seq ?? eq.TM_SEQ ?? `eq-${idx}`,
            lat: latNum,
            lng: lngNum,
            title: `[규모 ${eq.MT ?? eq.mt ?? "0.0"}] 지진발생`,
            rawTime,

            content: `
              <div style="line-height:1.6; padding:10px; min-width:200px; font-family:sans-serif;">
                <div style="border-bottom:2px solid #f3f4f6; padding-bottom:8px; margin-bottom:8px;">
                  <span style="color:#ef4444; font-weight:bold; font-size:15px;">
                    규모 ${eq.MT ?? eq.mt ?? "0.0"} 지진
                  </span>
                </div>
                <div style="font-size:13px; color:#374151;">
                  <p style="margin:4px 0;"><b>발생날짜:</b> ${formattedDate}</p>
                  <p style="margin:4px 0;"><b>발생시각:</b> ${formattedTime}</p>
                  <p style="margin:4px 0;"><b>발생위치:</b> ${locationName}</p>
                  <p style="margin:4px 0;"><b>참고사항:</b> ${eq.REM ?? eq.rem ?? "없음"}</p>
                </div>
              </div>
            `,
          };
        })
        .filter(Boolean);

      setEqMarkers(formattedData);
    } catch (error) {
      console.error("🔥 지진 데이터 로드 실패:", error);
      setEqMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 최신 지진 */
  const latestEq = useMemo(() => {
    if (eqMarkers.length === 0) return null;
    return [...eqMarkers].sort((a, b) =>
      String(b.rawTime).localeCompare(String(a.rawTime))
    )[0];
  }, [eqMarkers]);

  /** 지도 중심 */
  const getMapCenter = useCallback(
    (mode) => {
      if (mode === "지진특보" && latestEq) {
        return { lat: latestEq.lat, lng: latestEq.lng };
      }
      return JEONBUK_PROVINCIAL_HALL;
    },
    [latestEq]
  );

  const fetchEarthquakeLevel = useCallback(() => {}, []);

  const clearMarkers = useCallback(() => {
    setEqMarkers([]);
    setLevelMarkers([]);
  }, []);

  return {
    eqMarkers,
    levelMarkers,
    fetchEarthquakeData,
    fetchEarthquakeLevel,
    clearMarkers,
    isLoading,
    getMapCenter,
    selectedMarker: latestEq,
  };
};

export default useEarthquake;
