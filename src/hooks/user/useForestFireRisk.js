import { useState, useCallback } from 'react';
import axios from 'axios';

const useForestFireRisk = () => {
  const [riskData, setRiskData] = useState(null);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  const fetchRiskData = useCallback(async () => {
    setIsRiskLoading(true);
    const targetUrl = "http://localhost:8080/api/disaster/fetch/forest-fire-risk-list";

    try {
      const res = await axios.get(targetUrl);
      
      // ✅ 중요: 콘솔 사진상 실제 데이터는 res.data.data 안에 있어!
      const actualData = res.data.data; 

      if (actualData && Array.isArray(actualData) && actualData.length > 0) {
        // 전북특별자치도 데이터를 찾거나 첫 번째 데이터 사용
        const jeonbukData = actualData.find(item => item.doName?.includes("전북")) || actualData[0];
        setRiskData(jeonbukData);
      }
    } catch (error) {
      console.error("🔥 DB 데이터 로드 실패:", error);
    } finally {
      setIsRiskLoading(false);
    }
  }, []);

  return { riskData, isRiskLoading, fetchRiskData };
};

export default useForestFireRisk;