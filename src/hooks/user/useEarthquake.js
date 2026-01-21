// src/hooks/user/useEarthquake.js
import { useState, useCallback, useMemo } from "react";
import { XMLParser } from "fast-xml-parser";
import { disasterModalService } from "@/services/api";
import dayjs from 'dayjs';

const useEarthquake = () => {
  const [eqMarkers, setEqMarkers] = useState([]);
  const [levelMarkers, setLevelMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 기본 위치 설정: 전주시청
  const JEONJU_CITY_HALL = { lat: 35.8242238, lng: 127.1479532 };

  // ✅ 가장 최신 발생 날짜의 특보 데이터를 찾음
  const latestEq = useMemo(() => {
    if (eqMarkers.length === 0) return null;
    return [...eqMarkers].sort((a, b) => Number(b.time) - Number(a.time))[0];
  }, [eqMarkers]);

  // ✅ [수정] 현재 탭(mode)을 인자로 받아 중심점을 결정하는 함수
  const getMapCenter = useCallback((mode) => {
    if (mode === "지진특보" && latestEq) {
      return { lat: latestEq.lat, lng: latestEq.lng };
    }
    return JEONJU_CITY_HALL;
  }, [latestEq]);

  // 테스트를 위해 기간을 1년(12개월)으로 설정
  const oneYearAgo = dayjs().subtract(1, 'year').format('YYYYMMDD');
  const oneYearAgoFull = Number(dayjs().subtract(1, 'year').format('YYYYMMDD000000'));

  // 1. 지진특보 API (전북 + 1년)
  const fetchEarthquakeData = useCallback(async () => {
    setIsLoading(true);
    const now = dayjs().format('YYYYMMDD');
    try {
      const xmlData = await disasterModalService.getEarthquakeWarning({
        frDate: oneYearAgo,
        laDate: now,
        msgCode: "102,212",
        arDiv: "A",
      });

      const parser = new XMLParser({ ignoreAttributes: false });
      const jsonObj = parser.parse(xmlData);
      const items = jsonObj?.alert?.earthqueakNoti?.info || [];
      const itemList = Array.isArray(items) ? items : [items];

      const formatted = itemList
        .filter(item => item && Object.keys(item).length > 0)
        .filter(item => item.eqArCdNm === '전북' && oneYearAgoFull < Number(item.tmIssue))
        .map(item => ({
          lat: parseFloat(item?.eqLt),
          lng: parseFloat(item?.eqLn),
          title: `[특보] 규모 ${item?.magMl}`,
          address: item?.eqPt || "전북 지역 인근", // 상세 주소 추출
          time: String(item?.tmIssue),
          type: '지진',
          content: `장소: ${item?.eqPt}<br/>발생시각: ${String(item?.tmIssue).substring(4,6)}월 ${String(item?.tmIssue).substring(6,8)}일`,
        }))
        .filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
        
      setEqMarkers(formatted);
    } catch (error) {
      console.error("지진특보 로드 에러:", error);
      setEqMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, [oneYearAgo, oneYearAgoFull]);

  // 2. 진도정보조회 API (전북 + 1년)
  const fetchEarthquakeLevel = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await disasterModalService.getEarthquakeLevel();
      const items = response?.body || []; 
      
      const formatted = items
        .filter(item => {
          const isJeonbuk = item.PSTN?.includes('전북') || item.STDG_CTPV_CD === '45'; 
          const isRecent = Number(item.PRSNTN_DT) >= Number(oneYearAgo);
          return isJeonbuk && isRecent;
        })
        .map(item => {
          const dateStr = String(item.PRSNTN_DT);
          return {
            lat: parseFloat(item.LAT),
            lng: parseFloat(item.LOT),
            title: `[진도] 규모 ${item.ROPR_}`,
            address: item.PSTN, // 상세 주소 추출
            time: `${dateStr}${item.PRSNTN_HR}`,
            type: '진도',
            content: `
              <strong>장소:</strong> ${item.PSTN}<br/>
              <strong>최대진도:</strong> ${item.ROPR_GRD}등급<br/>
              <strong>발생시각:</strong> ${dateStr.substring(4,6)}월 ${dateStr.substring(6,8)}일 ${item.PRSNTN_HR.substring(0,2)}:${item.PRSNTN_HR.substring(2,4)}
            `,
          };
        })
        .filter(m => !isNaN(m.lat) && !isNaN(m.lng));

      setLevelMarkers(formatted);
    } catch (error) {
      console.error("진도정보 로드 에러:", error);
      setLevelMarkers([]);
    } finally {
      setIsLoading(false);
    }
  }, [oneYearAgo]);

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
    getMapCenter, // 함수로 전달
    selectedMarker: latestEq 
  };
};

export default useEarthquake;

// ====== 아래 코드는 한달 기준 전북 지진 데이터 가져오는 함수 =====
// (주석 생략 - 기존 주석 그대로 유지하면 돼)


// ====== 아래 코드는 한달 기준 전북 지진 데이터 가져오는 함수 =====

// import { useState, useCallback } from "react";
// import { XMLParser } from "fast-xml-parser";
// import { disasterModalService } from "@/services/api";
// import dayjs from 'dayjs';

// const useEarthquake = () => {
//   const [eqMarkers, setEqMarkers] = useState([]);
//   const [levelMarkers, setLevelMarkers] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // [수정] 한 달 기준으로 날짜 설정
//   const oneMonthAgo = dayjs().subtract(1, 'month').format('YYYYMMDD');
//   const oneMonthAgoFull = Number(dayjs().subtract(1, 'month').format('YYYYMMDD000000'));

//   // 1. 지진특보 API (전북 + 한 달)
//   const fetchEarthquakeData = useCallback(async () => {
//     setIsLoading(true);
//     const now = dayjs().format('YYYYMMDD');
//     try {
//       const xmlData = await disasterModalService.getEarthquakeWarning({
//         frDate: oneMonthAgo,
//         laDate: now,
//         msgCode: "102,212",
//         arDiv: "A",
//       });

//       const parser = new XMLParser({ ignoreAttributes: false });
//       const jsonObj = parser.parse(xmlData);
//       const items = jsonObj?.alert?.earthqueakNoti?.info || [];
//       const itemList = Array.isArray(items) ? items : [items];

//       const formatted = itemList
//         .filter(item => item && Object.keys(item).length > 0)
//         // [수정] 한 달 이내 데이터만 필터링
//         .filter(item => item.eqArCdNm === '전북' && oneMonthAgoFull < Number(item.tmIssue))
//         .map(item => ({
//           lat: parseFloat(item?.eqLt),
//           lng: parseFloat(item?.eqLn),
//           title: `[특보] 규모 ${item?.magMl}`,
//           address: item?.eqPt || "전북 지역 인근",
//           time: String(item?.tmIssue),
//           type: '지진',
//           content: `장소: ${item?.eqPt}<br/>발생시각: ${String(item?.tmIssue).substring(4,6)}월 ${String(item?.tmIssue).substring(6,8)}일`,
//         }))
//         .filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
        
//       setEqMarkers(formatted);
//     } catch (error) {
//       console.error("지진특보 로드 에러:", error);
//       setEqMarkers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [oneMonthAgo, oneMonthAgoFull]);

//   // 2. 진도정보조회 API (전북 + 한 달)
//   const fetchEarthquakeLevel = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await disasterModalService.getEarthquakeLevel();
//       const items = response?.body || []; 
      
//       const formatted = items
//         .filter(item => {
//           const isJeonbuk = item.PSTN?.includes('전북') || item.STDG_CTPV_CD === '45'; 
//           // [수정] 한 달 이내 데이터만 필터링
//           const isRecent = Number(item.PRSNTN_DT) >= Number(oneMonthAgo);
//           return isJeonbuk && isRecent;
//         })
//         .map(item => {
//           const dateStr = String(item.PRSNTN_DT);
//           return {
//             lat: parseFloat(item.LAT),
//             lng: parseFloat(item.LOT),
//             title: `[진도] 규모 ${item.ROPR_}`,
//             address: item.PSTN,
//             time: `${dateStr}${item.PRSNTN_HR}`,
//             type: '진도',
//             content: `
//               <strong>장소:</strong> ${item.PSTN}<br/>
//               <strong>최대진도:</strong> ${item.ROPR_GRD}등급<br/>
//               <strong>발생시각:</strong> ${dateStr.substring(4,6)}월 ${dateStr.substring(6,8)}일 ${item.PRSNTN_HR.substring(0,2)}:${item.PRSNTN_HR.substring(2,4)}
//             `,
//           };
//         })
//         .filter(m => !isNaN(m.lat) && !isNaN(m.lng));

//       setLevelMarkers(formatted);
//     } catch (error) {
//       console.error("진도정보 로드 에러:", error);
//       setLevelMarkers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [oneMonthAgo]);

//   const clearMarkers = useCallback(() => {
//     setEqMarkers([]);
//     setLevelMarkers([]);
//   }, []);

//   return { eqMarkers, levelMarkers, fetchEarthquakeData, fetchEarthquakeLevel, clearMarkers, isLoading };
// };

// export default useEarthquake;