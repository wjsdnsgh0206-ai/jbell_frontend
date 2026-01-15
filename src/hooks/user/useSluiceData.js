import { useState } from 'react';
import { disasterModalService } from "@/services/api";

// ✅ 전국 주요 댐 리스트 (전북 댐을 배열 맨 앞에 배치)
const ALL_DAM_LIST = [
  { code: '3031210', name: '용담댐', region: '전북' },
  { code: '4011110', name: '섬진강댐', region: '전북' },
  { code: '1001110', name: '소양강댐', region: '강원' },
  { code: '1003110', name: '충주댐', region: '충북' },
  { code: '2022510', name: '대청댐', region: '충남' },
  { code: '2018110', name: '안동댐', region: '경북' },
  { code: '2004110', name: '합천댐', region: '경남' },
  { code: '4013110', name: '주암댐', region: '전남' }
];

export const useSluiceData = () => {
  const [damData, setDamData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDamData = async () => {
    if (loading) return;
    setLoading(true);
    
    const sluiceKey = import.meta.env.VITE_API_DISATER_SLUICE_KEY;

    try {
      const now = new Date();
      // YYYYMMDD 형식으로 날짜 생성
      const format = (d) => d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0');
      
      const eddt = format(now);
      const stdt = format(new Date(now.setDate(now.getDate() - 10))); // 최근 10일치 조회

      const requests = ALL_DAM_LIST.map(dam => 
        disasterModalService.getSluice({
          serviceKey: sluiceKey,
          damcode: dam.code,
          stdt, eddt,
          _type: 'json'
        })
      );

      const responses = await Promise.all(requests);
      
      const combinedData = responses.map((res, index) => {
        const info = ALL_DAM_LIST[index];
        const items = res?.response?.body?.items?.item;
        const target = Array.isArray(items) ? items[items.length - 1] : items;

        return {
          ...info,
          waterLevel: target?.lowlevel || '-',
          discharge: target?.totdcwtrqy || '-',
          storageRate: target?.rsvwtrt || '-',
          time: target?.obsrdtmnt || '점검 중',
          isOffline: !target // 데이터가 아예 없으면 true
        };
      });

      setDamData(combinedData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return { damData, loading, fetchDamData }; 
};