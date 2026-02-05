// src/pages/admin/realtime/weatherNews/WeatherTypeData.js

export const WEATHER_OPTIONS = {

  // 백엔드 CASE 문 로직에 맞춰 수정 (산불, 호우·홍수 추가 및 매핑 통일)
  WEATHER_TYPES: [
    { value: '한파', label: '한파' },
    { value: '산불', label: '산불' }, // 건조/산불 통합
    { value: '호우·홍수', label: '호우·홍수' }, // 호우/홍수 통합
    { value: '폭염', label: '폭염' },
    { value: '강풍', label: '강풍' },
    { value: '대설', label: '대설' }, // 대설/폭설 통합
    { value: '태풍', label: '태풍' },
    { value: '기타', label: '기타' } // ELSE 처리용
  ],
  
  WEATHER_LEVELS: [
    { value: '위험', label: '위험' },
    { value: '주의', label: '주의' },
    { value: '보통', label: '보통' }
  ],
};


// const WARNING_TYPE_OPTIONS = [
//   '지진',
//   '호우홍수',
//   '태풍',
//   '산사태',
//   '산불',
//   '한파',
//   '폭염',
//   '강풍',
//   '대설',
//   '기타',
// ];