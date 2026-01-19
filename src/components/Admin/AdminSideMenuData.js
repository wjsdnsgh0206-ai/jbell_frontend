// src/components/admin/AdminSideMenuData.js

/**
 * [관리자] 사이드바 메뉴 구성 데이터
 * - 각 대분류(system, user 등)는 URL의 첫 번째 경로와 매칭됩니다. (예: /admin/system/...)
 * - 팀원들이 새로운 관리 기능을 추가할 때 이 객체에 메뉴 정보를 등록해야 사이드바에 노출됩니다.
 */
export const ADMIN_MENU_DATA = {
  // [시스템 관리] 그룹: URL이 /admin/system/... 일 때 활성화
  // --- 실시간 정보관리 🐹 최지영 ---
  realtime: [
    {
      title: "대시보드",
      path: "/admin/realtime/realtimeDashboard",
      isAvailable: false, // 하위메뉴가 없으니 false 처리
      items: [],
    },
    {
      title: "재난사고속보 관리",
      path: "/admin/realtime/accidentNews",
      isAvailable: true,
      items: [
        { name: "사고속보 관리", path: "/admin/realtime/accidentNews" },
        { name: "재난 관리", path: "/admin/realtime/disaster" },
      ],
    },
  ],
  system: [
    {
      title: "코드 관리", // 소분류 그룹 제목
      path: "/admin/system/commonCodeList", // 대표 경로 추가
      isAvailable: true, // 메뉴 활성화 여부 (준비 중일 경우 false)
      items: [
        { name: "공통코드 목록", path: "/admin/system/commonCodeList" },
        { name: "그룹코드 등록", path: "/admin/system/groupCodeAdd" },
        { name: "상세코드 등록", path: "/admin/system/subCodeAdd" },
        // { name: "상세코드 등록", path: "/admin/system/adminDetailCodeAdd" }, // 히스토리 보존용 주석
      ],
    },
    {
      title: "권한 관리",
      path: "/admin/system/authList",
      isAvailable: false, // 비활성화 상태 (클릭 불가 처리 등에 활용)
      items: [],
    },
    {
      title: "로그 관리",
      path: "/admin/system/logList",
      isAvailable: false,
      items: [],
    },
  ],
  contents: [
    {
      title: "행동요령 관리", // 소분류 그룹 제목
      path: "/admin/contents/behavioralGuideList", // 대표 경로 추가
      isAvailable: true, // 메뉴 활성화 여부 (준비 중일 경우 false)
      items: [
        { name: "행동요령 목록", path: "/admin/contents/behavioralGuideList" },
        { name: "행동요령 등록", path: "/admin/contents/behavioralGuideAdd" },
      ],
    },
    {
      title: "주요 안전정책 관리",
      path: "/admin/contents/citySafetyMasterPlan",
      isAvailable: false,
      items: [
        {
          name: "도시안전기본계획 관리",
          path: "/admin/contents/citySafetyMasterPlan",
        },
        {
          name: "재난별 안전정책 관리",
          path: "/admin/contents/disasterSafetyPolicy",
        },
        {
          name: "시민 안전보험 관리",
          path: "/admin/contents/citySafetyMasterPlan",
        },
        {
          name: "풍수해 안전보험 관리",
          path: "/admin/contents/stormAndFloodInsurance",
        },
      ],
    },
    {
      title: "열린마당 관리",
      path: "/admin/contents/pressRelList",
      isAvailable: true,
      items: [
        { name: "보도자료 관리", path: "/admin/contents/pressRelList" },
      ],
    },
    {
      title: "고객센터",
      path: "/admin/contents/logList",
      isAvailable: false,
      items: [],
    },
  ],

  // [회원 관리] 그룹: URL이 /admin/user/... 일 때 활성화 (팀원 추가 영역)
  member: [
    /* 예시:
      {
        title: "사용자 정보 관리",
        isAvailable: true,
        items: [
          { name: "회원 목록", path: "/admin/user/userList" },
          { name: "탈퇴 회원", path: "/admin/user/deletedUser" }
        ],
      }
    */
  ],
};
