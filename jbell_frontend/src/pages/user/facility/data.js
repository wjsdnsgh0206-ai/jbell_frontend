// src/pages/user/facility/data.js

// 1. [Mock DB] 가상의 시설 데이터 리스트 (서버 DB 역할)
const MOCK_FACILITIES = [
  {
    id: 1,
    name: "전주 시민 체육관 대피소",
    lastUpdated: "2025년 12월 16일",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png",
    description: "본 대피소는 내진 설계가 적용되어 있으며, 비상 급수 시설과 자가 발전기를 갖추고 있습니다.",
    // 상세 정보 (Key-Value)
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "전주시청 안전총괄과" },
      { label: "시설규모", value: "1200 ㎡" },
      { label: "수용 가능 인원", value: "500명" },
      { label: "주소", value: "전주시 완산구 효자로 225" },
      { label: "평상시 활용 유형", value: "지하주차장" },
      { label: "운영여부", value: "운영중" },
      { label: "문의 전화", value: "063-252-0000" },
    ]
  },
  {
    id: 2,
    name: "완산구청 지하주차장",
    lastUpdated: "2025년 11월 20일",
    locationImage: "https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png", // 이미지 교체 필요
    description: "구청 지하주차장을 긴급 대피소로 활용합니다. 24시간 개방되어 있습니다.",
    details: [
      { label: "시설유형", value: "민방위대피시설" },
      { label: "관리기관", value: "완산구청" },
      { label: "시설규모", value: "800 ㎡" },
      { label: "수용 가능 인원", value: "300명" },
      { label: "주소", value: "전주시 완산구 효자로 225" },
      { label: "평상시 활용 유형", value: "주차장" },
      { label: "운영여부", value: "운영중" },
      { label: "문의 전화", value: "063-220-5114" },
    ]
  },
  // ... 더 많은 더미 데이터 추가 가능
];

/**
 * 2. [Mock API] ID로 특정 시설 정보를 가져오는 함수
 * 나중에 이 함수 내부를 axios.get(`/api/facilities/${id}`) 로 바꾸면 끝입니다!
 */
export const getFacilityDetail = (id) => {
  // id는 URL에서 문자열로 오기 때문에 숫자로 변환해서 비교
  const facility = MOCK_FACILITIES.find(item => item.id === Number(id));
  return facility || null; // 없으면 null 반환
};