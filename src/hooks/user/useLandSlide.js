import { useState, useCallback } from 'react';
import { disasterModalService } from '@/services/api';

const useLandSlide = () => {
  const [lsData, setLsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLandSlideData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await disasterModalService.getLandSlideWarning({ 
        pageNo: 1, 
        numOfRows: 100
      });

      console.log("📡 [1] 서버 응답 확인:", res.data);

      // 📌 이미지 로그 확인 결과: 데이터는 res.data.data 에 배열로 들어있음
      const dataList = res?.data?.data || [];
      console.log("✅ [2] 추출된 리스트 (Array):", dataList);

      const now = new Date();
      
      const formattedList = dataList.map((item, index) => {
        /**
         * 📌 필드명 매핑 주의: 
         * 로그상 fireId 등이 보이는 것으로 보아, 
         * 백엔드에서 산사태 필드명을 확인해야 함. 
         * 일단 안전하게 여러 케이스 대응.
         */
        const name = item.sggNm || item.fireLoc || "전북 지역"; 
        const grade = item.lnldFrcstNm || "주의보";
        const dateStr = item.predcAnlsDt || item.localDateTime || "";

        // 날짜 파싱
        let issueDate = dateStr ? new Date(dateStr) : null;
        let isRecent = false;
        
        if (issueDate && !isNaN(issueDate.getTime())) {
          const diffHours = Math.abs(now - issueDate) / (1000 * 60 * 60);
          isRecent = diffHours <= 24;
        } else {
          // 날짜가 없으면 일단 발령상태로 표시해서 데이터 뜨는지 확인
          isRecent = true; 
        }

        return {
          id: `ls-${index}-${item.fireId || index}`, 
          isActiveWarning: isRecent, 
          info: {
            name: name,
            grade: grade,
            status: isRecent ? "발령" : "기록",
            address: `${name} 인근`,
            date: dateStr || "정보 없음",
            tel: "063-120",
            desc: `${name} 산사태 정보 확인 필요`
          }
        };
      });

      setLsData(formattedList);
      console.log("📊 [3] 최종 변환 데이터:", formattedList);

    } catch (error) {
      console.error("🚨 [에러] 처리 중 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { lsData, isLoading, fetchLandSlideData };
};

export default useLandSlide;