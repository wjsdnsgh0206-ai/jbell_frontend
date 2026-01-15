// import { useState, useCallback } from "react";
// import { disasterModalService } from "@/services/api";
// import dayjs from "dayjs";

// const useLandSlide = () => {
//   const [lsMarkers, setLsMarkers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchLandSlideData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       // 1. API 호출 (1000개 요청)
//       const data = await disasterModalService.getLandSlideWarning({ numOfRows: 1000 });
      
//       const today = dayjs();
//       const sevenDaysAgo = today.subtract(7, "day");

//       // 2. 지역(전북: 45) + 최근 7일 필터링 복구
//       const filtered = data.filter((item) => {
//         const isJeonbuk = item.STDG_CD?.startsWith("45");
//         if (!item.RCNT_LNLD_OCRN_YMD) return false;

//         const occurDate = dayjs(item.RCNT_LNLD_OCRN_YMD);
//         // 오늘 포함 최근 7일 이내 데이터만!
//         return isJeonbuk && (occurDate.isAfter(sevenDaysAgo) || occurDate.isSame(sevenDaysAgo, 'day'));
//       });

//       console.log(`🔎 최근 7일 내 전북 필터링 결과: ${filtered.length}건`);

//       if (filtered.length === 0) {
//         setLsMarkers([]);
//         return;
//       }

//       // 3. 주소 -> 좌표 변환
//       const geocoder = new window.kakao.maps.services.Geocoder();
//       const markerPromises = filtered.map((item) => {
//         return new Promise((resolve) => {
//           const address = item.DADDR || item.RONA_DADDR || item.DSTRCT_NM;
//           geocoder.addressSearch(address, (result, status) => {
//             if (status === window.kakao.maps.services.Status.OK) {
//               resolve({
//                 lat: parseFloat(result[0].y),
//                 lng: parseFloat(result[0].x),
//                 title: item.DSTRCT_NM,
//                 info: {
//                   name: item.DSTRCT_NM,
//                   address: address,
//                   date: item.RCNT_LNLD_OCRN_YMD,
//                   shelter: item.SHNT_PLC_NM_1 || "정보 없음",
//                   tel: item.SHNT_PLC_TELNO_1 || "-"
//                 }
//               });
//             } else { resolve(null); }
//           });
//         });
//       });

//       const markers = await Promise.all(markerPromises);
//       setLsMarkers(markers.filter(m => m !== null));

//     } catch (error) {
//       console.error("데이터 로드 실패", error);
//       setLsMarkers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return { lsMarkers, isLoading, fetchLandSlideData };
// };

// export default useLandSlide;


// --- 아래는 test용 1년치 데이터 ---

import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";

const useLandSlide = () => {
  const [lsMarkers, setLsMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLandSlideData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 넉넉하게 1000개 가져오기
      const data = await disasterModalService.getLandSlideWarning({ numOfRows: 1000 });
      
      // 🔍 [필터 수정] 날짜 조건 빼고 오직 '전북(45)' 데이터만!
      const filtered = data.filter((item) => item.STDG_CD?.startsWith("45"));

      console.log(`📍 전북 데이터 ${filtered.length}건을 지도에 표시할게.`);

      if (filtered.length === 0) {
        setLsMarkers([]);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      const markerPromises = filtered.map((item) => {
        return new Promise((resolve) => {
          // 상세주소가 없으면 지구명으로라도 검색
          const address = item.DADDR || item.RONA_DADDR || item.DSTRCT_NM;
          
          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({
                lat: parseFloat(result[0].y),
                lng: parseFloat(result[0].x),
                title: item.DSTRCT_NM,
                info: {
                  name: item.DSTRCT_NM,
                  address: address,
                  date: item.RCNT_LNLD_OCRN_YMD || "기록 없음",
                  shelter: item.SHNT_PLC_NM_1 || "정보 없음",
                  tel: item.SHNT_PLC_TELNO_1 || "-"
                }
              });
            } else { resolve(null); }
          });
        });
      });

      const markers = await Promise.all(markerPromises);
      setLsMarkers(markers.filter(m => m !== null));

    } catch (error) {
      console.error("데이터 로드 실패", error);
      setLsMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { lsMarkers, isLoading, fetchLandSlideData };
};

export default useLandSlide;