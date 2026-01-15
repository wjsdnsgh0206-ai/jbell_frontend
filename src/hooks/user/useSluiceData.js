import { useState } from 'react';
import { disasterModalService } from "@/services/api";

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
    const now = new Date();
    const format = (d) => d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + d.getDate().toString().padStart(2, '0');
    
    const eddt = format(now);
    const stdt = format(new Date(now.setDate(now.getDate() - 10)));

    // 1. 우선 빈 데이터(또는 로딩 상태용 리스트)를 먼저 세팅해서 화면을 바로 띄움
    const initialList = ALL_DAM_LIST.map(dam => ({ ...dam, isOffline: true, time: '불러오는 중...' }));
    setDamData(initialList);

    try {
      // 2. [개선 핵심] Promise.all 대신 개별적으로 fetch하고 성공할 때마다 상태 업데이트
      ALL_DAM_LIST.forEach(async (dam, index) => {
        try {
          const res = await disasterModalService.getSluice({
            serviceKey: sluiceKey,
            damcode: dam.code,
            stdt, eddt,
            _type: 'json'
          });

          const items = res?.response?.body?.items?.item;
          const target = Array.isArray(items) ? items[items.length - 1] : items;

          const updatedDam = {
            ...dam,
            waterLevel: target?.lowlevel || '-',
            discharge: target?.totdcwtrqy || '-',
            storageRate: target?.rsvwtrt || '-',
            time: target?.obsrdtmnt || '점검 중',
            isOffline: !target
          };

          // 성공한 놈부터 하나씩 갈아끼워줌 (체감 속도 대폭 향상)
          setDamData(prev => {
            const newList = [...prev];
            newList[index] = updatedDam;
            return newList;
          });

        } catch (err) {
          console.error(`${dam.name} 데이터 로드 실패:`, err);
        }
      });

    } catch (error) {
      console.error("🚨 [수문 API] 전체 에러:", error);
    } finally {
      // API 호출들이 비동기로 돌아가므로 로딩 종료 시점은 적절히 조절
      // 여기서는 요청을 다 보낸 시점에서 로딩 스피너를 끄게 됨
      setLoading(false);
    }
  };

  return { damData, loading, fetchDamData };
};