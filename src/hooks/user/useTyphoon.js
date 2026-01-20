// src/hooks/user/useTyphoon.js
import { useState, useCallback } from "react";
import { disasterModalService } from "@/services/api";
import { JEONBUK_CODE_MAP, DISASTER_TYPE_CODE } from "@/components/user/disaster/disasterCodes";

const useTyphoon = () => {
  const [disasterStatus, setDisasterStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 태풍 데이터 조회 및 가공 함수
  const fetchTyphoonData = useCallback(async () => {
    setIsLoading(true);
    try {
      // ★ 테스트 시나리오: 현재 태풍(7) 데이터가 없으므로 한파(3)로 테스트
      // 실전 배포 시에는 DISASTER_TYPE_CODE.TYPHOON 으로 변경하세요.
      const targetType = DISASTER_TYPE_CODE.COLD_WAVE; 
      // const targetType = DISASTER_TYPE_CODE.TYPHOON; 

      const response = await disasterModalService.getDisasterSpecials({
        warningType: targetType,
      });

      // 🔍 [로그 1] API에서 온 전체 응답 구조 확인
      console.log("📡 API Raw Response:", response);

      // 데이터 안전하게 추출
      const items = response?.response?.body?.items?.item;
      if (!items) {
        setDisasterStatus({});
        return;
      }

      // 배열 변환 (데이터가 1개면 객체로 올 수 있음)
      const itemList = Array.isArray(items) ? items : [items];

      // 🔍 [로그 2] 필터링 전 아이템 개수 확인
      console.log(`📦 수신된 특보 아이템 개수: ${itemList.length}개`);

      // 데이터 가공 (전북 지역 필터링 & 매핑)
      const statusMap = {};

      itemList.forEach((item) => {
        // 1. 전북 지역 코드인지 확인 (매핑 테이블 활용)
        const regionName = JEONBUK_CODE_MAP[item.areaCode];

        if (!regionName) {
          // 🔍 [로그 3] 전북 외 지역이 들어올 경우 확인 (선택사항)
          // console.log(`⏩ 전북 외 지역 패스: ${item.areaName} (${item.areaCode})`);
          return; 
        }

        // 2. 해제된 특보(command: 2) 제외
        if (item.command === "2") return;

        // 3. 특보 단계 확인 (warnStress - 0:주의보, 1:경보)
        const isWarning = Number(item.warnStress) === 1;

        statusMap[regionName] = {
          code: item.areaCode,
          region: regionName,
          level: isWarning ? "경보" : "주의보",
          color: isWarning ? "#FF4D4D" : "#FFA500", // 빨강(경보) vs 주황(주의보)
          startTime: item.startTime, // 발효시각
          type: item.warnVar, // 특보종류
        };
      });
      
      // 🔍 [로그 4] 최종 가공된 전북 지도용 데이터 확인
      console.log("✅ 가공 완료된 전북 특보 Map:", statusMap);
      
      setDisasterStatus(statusMap);
      
    } catch (error) {
      console.error("태풍 특보 조회 실패:", error);
      setDisasterStatus({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    disasterStatus, // 가공된 데이터 (Typhoon.jsx에서 지도에 넣을 것)
    isLoading,      // 로딩 상태
    fetchTyphoonData // 데이터 호출 함수
  };
};

export default useTyphoon;