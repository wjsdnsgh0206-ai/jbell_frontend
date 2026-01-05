// src/pages/user/facility/data.js

/**
 * [Mock DB] 가상의 대피소 데이터베이스 (20개 샘플)
 * 실제 서버 DB에 저장될 데이터 형태를 흉내 낸 것입니다.
 */
const MOCK_FACILITIES = [
  {
    id: 1,
    type: "민방위대피시설",
    name: "전주 시민공원 대피소",
    address: "전주시 완산구 효자로 444",
    lastUpdated: "2025-12-16",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "전주 시민공원 지하주차장에 위치한 대피소입니다. 비상 급수 및 발전 설비를 완비하고 있습니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "전주시청 안전총괄과" },
      { label: "수용 가능 인원", value: "500명" },
      { label: "문의 전화", value: "063-252-0000" },
    ]
  },
  {
    id: 2,
    type: "민방위대피시설",
    name: "완산구청 지하주차장",
    address: "전주시 완산구 효자로 225",
    lastUpdated: "2025-11-20",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "완산구청 내 위치한 안전 대피소입니다. 24시간 상시 개방됩니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "완산구청" },
      { label: "수용 가능 인원", value: "350명" },
      { label: "문의 전화", value: "063-220-5114" },
    ]
  },
  {
    id: 3,
    type: "한파쉼터",
    name: "효자1동 주민센터",
    address: "전주시 완산구 봉곡로 12",
    lastUpdated: "2025-12-01",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "주민센터 내 마련된 한파 쉼터입니다. 따뜻한 음료와 난방 기구가 비치되어 있습니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "관리기관", value: "효자1동" },
      { label: "운영여부", value: "동절기 운영" },
      { label: "문의 전화", value: "063-220-1111" },
    ]
  },
  {
    id: 4,
    type: "한파쉼터",
    name: "서부시장 경로당",
    address: "전주시 완산구 강변로 88",
    lastUpdated: "2025-11-15",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "시장 인근 어르신들을 위한 한파 대피 공간입니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "관리기관", value: "노인회 전주시지회" },
      { label: "문의 전화", value: "063-220-2222" },
    ]
  },
  {
    id: 5,
    type: "무더위쉼터",
    name: "삼천 도서관",
    address: "전주시 완산구 용리로 55",
    lastUpdated: "2025-06-01",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "쾌적한 에어컨 시설과 도서가 구비된 무더위 쉼터입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "관리기관", value: "전주시립도서관" },
      { label: "운영여부", value: "하절기 운영" },
    ]
  },
  {
    id: 6,
    type: "민방위대피시설",
    name: "덕진구청 지하주차장",
    address: "전주시 덕진구 기린대로 529",
    lastUpdated: "2025-12-05",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "덕진구청 지하에 위치한 민방위 대피시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "덕진구청" },
      { label: "수용 가능 인원", value: "400명" },
    ]
  },
  {
    id: 7,
    type: "무더위쉼터",
    name: "전주역 광장 쉼터",
    address: "전주시 덕진구 동부대로 680",
    lastUpdated: "2025-07-20",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "전주역을 이용하는 여행객과 시민을 위한 쿨링포그 쉼터입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "특이사항", value: "쿨링포그 설치" },
    ]
  },
  {
    id: 8,
    type: "한파쉼터",
    name: "덕진동 주민센터",
    address: "전주시 덕진구 권삼득로 485",
    lastUpdated: "2025-12-10",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "덕진동 인근 주민들을 위한 겨울철 따뜻한 쉼터입니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "문의 전화", value: "063-270-6601" },
    ]
  },
  {
    id: 9,
    type: "민방위대피시설",
    name: "전북대학교 지하도",
    address: "전주시 덕진구 백제대로 567",
    lastUpdated: "2025-10-15",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "대학교 인근 대형 지하 대피 시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "수용 가능 인원", value: "1000명" },
    ]
  },
  {
    id: 10,
    type: "무더위쉼터",
    name: "송천동 에코시티 경로당",
    address: "전주시 덕진구 세병로 21",
    lastUpdated: "2025-08-05",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "에코시티 단지 내 어르신들을 위한 시원한 공간입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "관리기관", value: "에코시티 관리소" },
    ]
  },
  {
    id: 11,
    type: "민방위대피시설",
    name: "서신동 현대아파트 지하",
    address: "전주시 완산구 당산로 114",
    lastUpdated: "2025-09-12",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "주거 단지 밀집 지역의 민방위 대피시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "아파트 관리사무소" },
    ]
  },
  {
    id: 12,
    type: "한파쉼터",
    name: "중화산동 노인복지관",
    address: "전주시 완산구 화산천변로 11",
    lastUpdated: "2025-12-02",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "복지관 내 위치하여 다양한 편의시설과 함께 이용 가능한 쉼터입니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "문의 전화", value: "063-220-3333" },
    ]
  },
  {
    id: 13,
    type: "무더위쉼터",
    name: "평화동 평화도서관",
    address: "전주시 완산구 평화로 112",
    lastUpdated: "2025-06-15",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "평화동 주민들의 여름철 휴식 공간입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "운영여부", value: "정상 운영" },
    ]
  },
  {
    id: 14,
    type: "민방위대피시설",
    name: "전주 종합경기장 지하",
    address: "전주시 덕진구 기린대로 451",
    lastUpdated: "2025-11-11",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "대규모 인원을 수용할 수 있는 전주 최대 규모의 대피시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "수용 가능 인원", value: "3000명" },
    ]
  },
  {
    id: 15,
    type: "한파쉼터",
    name: "호성동 경로당",
    address: "전주시 덕진구 호성로 34",
    lastUpdated: "2025-12-20",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "동네 어르신들이 동절기 추위를 피할 수 있는 따뜻한 쉼터입니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "관리기관", value: "호성동 주민센터" },
    ]
  },
  {
    id: 16,
    type: "무더위쉼터",
    name: "만성동 만성도서관",
    address: "전주시 덕진구 만성중앙로 45",
    lastUpdated: "2025-07-01",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "신규 조성된 법조타운 내 위치한 쾌적한 무더위 쉼터입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "문의 전화", value: "063-281-7000" },
    ]
  },
  {
    id: 17,
    type: "민방위대피시설",
    name: "삼천동 월드컵아파트 상가 지하",
    address: "전주시 완산구 삼천동1가 701",
    lastUpdated: "2025-05-20",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "상가 건물 지하에 위치한 민방위 대피시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "삼천동 행정복지센터" },
    ]
  },
  {
    id: 18,
    type: "한파쉼터",
    name: "노송동 노인복지센터",
    address: "전주시 완산구 인봉길 22",
    lastUpdated: "2025-11-30",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "겨울철 취약 계층을 위한 따뜻한 긴급 휴식처입니다.",
    details: [
      { label: "시설유형", value: "한파쉼터" },
      { label: "특이사항", value: "무료 급식 연계" },
    ]
  },
  {
    id: 19,
    type: "무더위쉼터",
    name: "전북대학교 병원 로비",
    address: "전주시 덕진구 건지로 20",
    lastUpdated: "2025-08-10",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "병원 방문객 및 인근 주민들이 폭염 시 대피할 수 있는 시원한 로비 공간입니다.",
    details: [
      { label: "시설유형", value: "무더위쉼터" },
      { label: "운영여부", value: "24시간 상시" },
    ]
  },
  {
    id: 20,
    type: "민방위대피시설",
    name: "팔복동 전주산업단지 지하",
    address: "전주시 덕진구 팔복로 100",
    lastUpdated: "2025-10-30",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "공단 지역 근로자들을 위한 대형 대피 시설입니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "한국산업단지공단" },
    ]
  },
];

// =================================================================
// [API Functions] 나중에 이곳 내부를 axios 요청으로 바꾸면 됩니다.
// =================================================================

/**
 * 1. 전체 시설 목록을 가져오는 함수 (UserFacilityList.jsx 에서 사용)
 * 추후 필터링 기능도 서버 API 쿼리 스트링으로 전달할 수 있습니다.
 */
export const getFacilityList = () => {
  return MOCK_FACILITIES;
};

/**
 * 2. 특정 ID의 시설 상세 정보를 가져오는 함수 (UserFacilityDetail.jsx 에서 사용)
 */
export const getFacilityDetail = (id) => {
  const facility = MOCK_FACILITIES.find(item => item.id === Number(id));
  return facility || null;
};