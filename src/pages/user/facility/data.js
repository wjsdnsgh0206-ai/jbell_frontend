// src/pages/user/facility/data.js

/**
 * [Mock DB] 가상의 대피소 데이터베이스 (20개 샘플)
 * 실제 서버 DB에 저장될 데이터 형태를 흉내 낸 것입니다.
 */
const MOCK_FACILITIES = [
]

// =================================================================
// [Config] 페이지 설정 데이터 (새로 추가된 부분)
// =================================================================
export const facilityPageConfig = {
  // 1. 메타 정보 (타이틀, 브레드크럼)
  meta: {
    title: "대피소 소개",
    lastUpdated: "2025년 12월 16일",
    breadcrumbs: [
      { label: "홈", path: "/", hasIcon: true },
      { label: "대피소 소개", hasIcon: false },
    ]
  },
  // 2. 필터 옵션 데이터 (드롭다운 메뉴용)
  filterOptions: {
    facilityTypes: ["전체", "민방위대피시설", "한파쉼터", "무더위쉼터"],
    districts: ["전체", "완산구", "덕진구"] 
    // 나중에 "군산시", "익산시" 등이 추가되면 여기만 수정하면 됩니다.
  }
};

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
