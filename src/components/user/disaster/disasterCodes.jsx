// src/components/user/disaster/disasterCodes.jsx

// 1. 전북 특보구역코드 매핑 (API areaCode -> GeoJSON regionName)
// 이름과 좌표(위경도) 정보를 함께 관리하도록 구조 변경
export const JEONBUK_CODE_MAP = {
  "L1060100": { name: "고창군", lat: 35.4358, lng: 126.7021 },
  "L1060200": { name: "부안군", lat: 35.7317, lng: 126.7333 },
  "L1060300": { name: "군산시", lat: 35.9674, lng: 126.7366 },
  "L1060400": { name: "김제시", lat: 35.8036, lng: 126.8808 },
  "L1060500": { name: "완주군", lat: 35.9047, lng: 127.1624 },
  "L1060600": { name: "진안군", lat: 35.7917, lng: 127.4250 },
  "L1060700": { name: "무주군", lat: 36.0068, lng: 127.6607 },
  "L1060800": { name: "장수군", lat: 35.6475, lng: 127.5214 },
  "L1060900": { name: "임실군", lat: 35.6178, lng: 127.2889 },
  "L1061000": { name: "순창군", lat: 35.3744, lng: 127.1375 },
  "L1061100": { name: "익산시", lat: 35.9483, lng: 126.9573 },
  "L1061200": { name: "정읍시", lat: 35.5699, lng: 126.8559 },
  "L1061300": { name: "남원시", lat: 35.4164, lng: 127.3904 },
  "L1061400": { name: "전주시", lat: 35.8242, lng: 127.1480 },
};

// 2. 특보 종류 코드 (파라미터용)
export const DISASTER_TYPE_CODE = {
  COLD_WAVE: "2", // 호우 (목표 기능)
  COLD_WAVE: "3", // 한파 (현재 테스트용)
  TYPHOON: "7",   // 태풍 (목표 기능)
};