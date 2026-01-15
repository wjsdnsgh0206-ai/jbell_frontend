import { useState, useCallback } from 'react';
import { disasterModalService } from "@/services/api";

const useForestFire = () => {
  const [fireData, setFireData] = useState(null);
  const [isFireLoading, setIsFireLoading] = useState(false);

  const fetchFireData = useCallback(async () => {
    setIsFireLoading(true);
    console.log("📡 산불 API 요청 시작..."); // 1단계 확인

    try {
      const res = await disasterModalService.getForestFireWarning();
      
      // 2단계: API 응답 전체 구조 확인
      console.log("📦 API 전체 응답(res):", res);

      // 3단계: 데이터 경로 추적
      const responseRoot = res.response; // 보통 공공데이터는 response부터 시작
      console.log("🔍 response 필드 존재여부:", !!responseRoot);

      const items = responseRoot?.body?.items?.item || [];
      console.log("📊 추출된 전체 지역 아이템(items):", items);

      if (items.length === 0) {
        console.warn("⚠️ API는 성공했으나 아이템 배열이 비어있음!");
      }

      // 4단계: 전북 데이터 필터링 확인
      const jeonbuk = items.find(item => {
        // 공공데이터에 따라 '전북' 또는 '전북특별자치도' 등 명칭이 다를 수 있어 확인용 로그
        if (item.doname && item.doname.includes('전북')) {
          console.log("📍 전북 매칭 데이터 발견!:", item);
        }
        return item.doname === '전북특별자치도';
      });

      if (!jeonbuk) {
        console.error("❌ '전북특별자치도' 이름으로 된 데이터를 찾을 수 없음!");
        // 혹시 모르니 '전북'으로 시작하는 게 있는지 로그 찍어보자
        console.log("🧐 현재 들어오는 doname 목록:", items.map(i => i.doname));
      }

      setFireData(jeonbuk || null);

    } catch (error) {
      // 5단계: 에러 상세 정보
      console.error("🔥 산불 데이터 로드 실패 상세:", error);
      if (error.response) {
        console.error("Server Status:", error.response.status);
        console.error("Server Data:", error.response.data);
      }
    } finally {
      setIsFireLoading(false);
      console.log("🏁 산불 API 작업 종료");
    }
  }, []);

  return { fireData, isFireLoading, fetchFireData };
};

export default useForestFire;