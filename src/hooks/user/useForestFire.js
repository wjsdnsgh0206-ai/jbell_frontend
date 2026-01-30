import { useState, useCallback } from 'react';
import axios from 'axios'; // 직접 호출하거나 disasterModalService에 추가해서 써도 돼

const useForestFire = () => {
  const [fireData, setFireData] = useState([]); // 목록 형태이므로 초기값을 빈 배열로 설정
  const [isFireLoading, setIsFireLoading] = useState(false);

  const fetchFireData = useCallback(async () => {
    setIsFireLoading(true);
    console.log("📡 백엔드 산불 데이터(GET) 요청 시작...");

    try {
      // 우리가 만든 백엔드 GET API 호출
      const res = await axios.get("http://localhost:8080/api/disaster/fetch/forest-fire-list");
      
      // 백엔드 ApiResponse 구조에 따라 데이터 추출 (res.data.data)
      const items = res.data?.data || [];
      console.log("📊 DB에서 가져온 산불 데이터:", items);

      if (items.length === 0) {
        console.warn("⚠️ DB에 산불 데이터가 없습니다.");
      }

      // 전북 데이터만 필터링 (필요하다면)
      // 백엔드에서 이미 필터링해서 준다면 바로 setFireData(items) 하면 돼.
      const jeonbukList = items.filter(item => 
        item.fireLocVillage && item.fireLocVillage.includes('전북')
      );

      // 전체 목록을 다 쓸 거라면 items를, 전북만 쓸 거라면 jeonbukList를 넣어줘.
      setFireData(items); 

    } catch (error) {
      console.error("🔥 산불 데이터 로드 실패:", error);
    } finally {
      setIsFireLoading(false);
      console.log("🏁 산불 API 작업 종료");
    }
  }, []);

  return { fireData, isFireLoading, fetchFireData };
};

export default useForestFire;