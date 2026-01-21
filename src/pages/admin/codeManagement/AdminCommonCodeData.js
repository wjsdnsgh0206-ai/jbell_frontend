// src/pages/admin/codeManagement/AdminCommonCodeData.js

/**
 * [관리자] 공통코드 관리 더미 데이터
 * * [데이터 구조 규칙]
 * 1. groupCode: 상위 그룹을 식별하는 고유 코드
 * 2. subCode: 해당 그룹 내의 상세 코드 ('-' 일 경우 그룹 코드 자체를 의미)
 * 3. visible: 화면 노출 여부 (true: 사용, false: 미사용)
 * 4. order: 동일 그룹 내에서의 출력 순서
 * * ※ 주의: AdminCommonCodeList에서 이 데이터를 기반으로 
 * 그룹/상세 필터 옵션을 유동적으로 자동 생성함.
 */
export const AdminCommonCodeData = [
  // CATEGORY_1 그룹 관련 데이터
  // 상세코드가 '-'인 데이터는 그룹의 '기본 정보' 혹은 '정의'를 나타냄
  { 
    id: 1, 
    groupCode: 'CATEGORY_1', 
    groupName: '카테고리1', 
    subCode: '-', 
    subName: '-', 
    desc: '카테고리1 그룹 코드 자체 설명', 
    date: '2025-05-20 06:00:00', 
    order: 1, 
    visible: true 
  },
  { 
    id: 2, 
    groupCode: 'CATEGORY_1', 
    groupName: '카테고리1', 
    subCode: 'ABCD_1', 
    subName: '행정구역', 
    desc: '대한민국 행정 구역 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 2, 
    visible: true 
  },
  
  // CATEGORY_2 그룹 관련 데이터
  { 
    id: 3, 
    groupCode: 'CATEGORY_2', 
    groupName: '카테고리2', 
    subCode: '-', 
    subName: '-', 
    desc: '카테고리2 그룹 코드 자체 설명', 
    date: '2025-05-20 06:00:00', 
    order: 1, 
    visible: true 
  },
  { 
    id: 4, 
    groupCode: 'CATEGORY_2', 
    groupName: '카테고리2', 
    subCode: 'ABCD_2', 
    subName: '재난유형', 
    desc: '대한민국 재난 유형 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 2, 
    visible: true 
  },
  
  // CATEGORY_3 그룹 관련 데이터
  { 
    id: 5, 
    groupCode: 'CATEGORY_3', 
    groupName: '카테고리3', 
    subCode: '-', 
    subName: '-', 
    desc: '카테고리3 그룹 코드 자체 설명', 
    date: '2025-05-20 06:00:00', 
    order: 1, 
    visible: true 
  },
  { 
    id: 6, 
    groupCode: 'CATEGORY_3', 
    groupName: '카테고리3', 
    subCode: 'ABCD_3', 
    subName: '대피소분류', 
    desc: '지역별 행정구역 대피소 분류 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 2, 
    visible: true 
  },
  { 
    id: 7, 
    groupCode: 'CATEGORY_3', 
    groupName: '카테고리3', 
    subCode: 'ABCD_3_2', 
    subName: '대피소 분류2', 
    desc: '지역별 행정구역 대피소 분류 코드번호2', 
    date: '2025-05-20 06:00:00', 
    order: 3, 
    visible: false // 미사용 예시
  },
  
  // CATEGORY_4 그룹 관련 데이터 (다양한 상세 코드가 포함된 사례)
  { 
    id: 8, 
    groupCode: 'CATEGORY_4', 
    groupName: '카테고리4', 
    subCode: 'ABCD_4_1', 
    subName: '행동요령', 
    desc: '재난별 재난대비 행동요령 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 1, 
    visible: true 
  },
  { 
    id: 9, 
    groupCode: 'CATEGORY_4', 
    groupName: '카테고리4', 
    subCode: 'ABCD_4_2', 
    subName: '공지사항', 
    desc: '공지사항 고유 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 2, 
    visible: true 
  },
  { 
    id: 10, 
    groupCode: 'CATEGORY_4', 
    groupName: '카테고리4', 
    subCode: 'ABCD_4_3', 
    subName: '고객센터', 
    desc: '고객센터 고유 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 3, 
    visible: true 
  },
  { 
    id: 11, 
    groupCode: 'CATEGORY_4', 
    groupName: '카테고리4', 
    subCode: 'ABCD_4_4', 
    subName: '안전정보지도', 
    desc: '안전정보지도 고유 코드번호', 
    date: '2025-05-20 06:00:00', 
    order: 4, 
    visible: true 
  },
];