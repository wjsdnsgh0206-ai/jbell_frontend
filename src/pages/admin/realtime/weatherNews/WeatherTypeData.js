// src/pages/admin/realtime/weatherNews/WeatherTypeData.js

export const WEATHER_OPTIONS = {
  // 재난 문자용 (이전 코드 유지)
  CATEGORIES: [ { value: '안전안내', label: '안전안내' }, { value: '긴급재난', label: '긴급재난' } ],
  
  // 기상 특보용 추가
  WEATHER_TYPES: [
    { value: '한파', label: '한파' },
    { value: '건조', label: '건조' },
    { value: '호우', label: '호우' },
    { value: '폭염', label: '폭염' },
    { value: '강풍', label: '강풍' },
    { value: '대설', label: '대설' },
    { value: '태풍', label: '태풍' }
  ],
  WEATHER_LEVELS: [
    { value: '위험', label: '위험' },
    { value: '주의', label: '주의' },
    { value: '보통', label: '보통' }
  ],
  REGIONS: ["전주시", "서울", "경기도", "전라북도"] // 자주 쓰는 지역
};