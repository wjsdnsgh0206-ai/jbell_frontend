// src/pages/admin/CodeManagement/AdminCommonCodeData.js
export const AdminCommonCodeData = [
  // 그룹 코드만 등록된 데이터 (상세코드가 없는 상태)
  { id: 1, groupCode: 'CATEGORY_1', groupName: '카테고리1', subCode: '-', subName: '-', desc: '카테고리1 그룹 코드 자체 설명', date: '2025-05-20 06:00', order: 1, visible: true },
  
  // 그룹 코드 아래에 상세 코드가 있는 데이터
  { id: 2, groupCode: 'CATEGORY_1', groupName: '카테고리1', subCode: 'ABCD_1', subName: '행정구역', desc: '대한민국 행정 구역 코드번호', date: '2025-05-20 06:00', order: 2, visible: true },
  
  { id: 3, groupCode: 'CATEGORY_2', groupName: '카테고리2', subCode: '-', subName: '-', desc: '카테고리2 그룹 코드 자체 설명', date: '2025-05-20 06:00', order: 1, visible: true },
  { id: 4, groupCode: 'CATEGORY_2', groupName: '카테고리2', subCode: 'ABCD_2', subName: '재난유형', desc: '대한민국 재난 유형 코드번호', date: '2025-05-20 06:00', order: 2, visible: true },
  
  { id: 5, groupCode: 'CATEGORY_3', groupName: '카테고리3', subCode: '-', subName: '-', desc: '카테고리3 그룹 코드 자체 설명', date: '2025-05-20 06:00', order: 1, visible: true },
  { id: 6, groupCode: 'CATEGORY_3', groupName: '카테고리3', subCode: 'ABCD_3', subName: '대피소분류', desc: '지역별 행정구역 대피소 분류 코드번호', date: '2025-05-20 06:00', order: 2, visible: true },
  { id: 7, groupCode: 'CATEGORY_3', groupName: '카테고리3', subCode: 'ABCD_3_2', subName: '대피소 분류2', desc: '지역별 행정구역 대피소 분류 코드번호2', date: '2025-05-20 06:00', order: 3, visible: false },
  
  { id: 8, groupCode: 'CATEGORY_4', groupName: '카테고리4', subCode: 'ABCD_4_1', subName: '행동요령', desc: '재난별 재난대비 행동요령 코드번호', date: '2025-05-20 06:00', order: 1, visible: true },
  { id: 9, groupCode: 'CATEGORY_4', groupName: '카테고리4', subCode: 'ABCD_4_2', subName: '공지사항', desc: '공지사항 고유 코드번호', date: '2025-05-20 06:00', order: 2, visible: true },
  { id: 10, groupCode: 'CATEGORY_4', groupName: '카테고리4', subCode: 'ABCD_4_3', subName: '고객센터', desc: '고객센터 고유 코드번호', date: '2025-05-20 06:00', order: 3, visible: true },
  { id: 11, groupCode: 'CATEGORY_4', groupName: '카테고리4', subCode: 'ABCD_4_4', subName: '안전정보지도', desc: '안전정보지도 고유 코드번호', date: '2025-05-20 06:00', order: 4, visible: true },
];