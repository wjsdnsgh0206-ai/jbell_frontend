// src/components/admin/AdminSideMenuData.js

/**
 * [관리자] 사이드바 메뉴 구성 데이터
 * - 각 대분류(system, user 등)는 URL의 첫 번째 경로와 매칭됩니다. (예: /admin/system/...)
 * - 팀원들이 새로운 관리 기능을 추가할 때 이 객체에 메뉴 정보를 등록해야 사이드바에 노출됩니다.
 */
export const ADMIN_MENU_DATA = {
  // [시스템 관리] 그룹: URL이 /admin/system/... 일 때 활성화
  // --- 실시간 정보관리 최지영 ---
  realtime: [
    {
      title: "대시보드",
      path: "/admin/realtime/realtimeDashboard",
      isAvailable: true,
      items: [
        { name: "대시보드 관리", path: "/admin/realtime/realtimeDashboard" },
      ],
    },
    {
      title: "재난사고속보",
      path: "/admin/realtime/accidentNewsList",
      isAvailable: true,
      items: [
        // { name: "사고속보 관리", path: "/admin/realtime/accidentNewsList"},
        { name: "재난 API 관리", path: "/admin/realtime/disasterManagementList" },
        { name: "재난 발생 관리", path: "/admin/realtime/disasterEventManagementList" },
        { name: "기상특보 관리", path: "/admin/realtime/weatherNewsList" },
        { name: "재난문자이력 관리", path: "/admin/realtime/disasterMessageList"},
      ],
    },
    {
      title: "재난통계",
      path: "/admin/realtime/disasterStatisticsList",
      isAvailable: true,
      items: [
        { name: "재난통계 관리", path: "/admin/realtime/disasterStatisticsList"},
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
      path: "/admin/system/adminLogList",
      isAvailable: true,
      items: [
        { name: "시스템 보안 운영 분석", path: "/admin/system/adminSysOpAnalysis" }
      ],
    },
  ],
  contents: [
    {
      title: "행동요령 관리", // 소분류 그룹 제목
      path: "/admin/contents/behaviorMethodList", // 대표 경로 추가
      isAvailable: true, // 메뉴 활성화 여부 (준비 중일 경우 false)
      items: [
        { name: "행동요령 목록", path: "/admin/contents/behaviorMethodList" },
        { name: "행동요령 등록", path: "/admin/contents/behaviorMethodAdd" },
      ],
    },
    {
      title: "주요 안전정책 관리",
      path: "/admin/contents/adminSafetyPolicyList",
      isAvailable: true,
      items: [
      ],
    },
    {
      title: "열린마당 관리",
      path: "/admin/contents/pressRelList",
      isAvailable: true,
      items: [
        { name: "보도자료 관리", path: "/admin/contents/pressRelList" },
        { name: "공지사항 관리", path: "/admin/contents/adminBoardList" },
        { name: "시민안전교육 관리", path: "/admin/contents/safetyEduList" },
      ],
    },
    {
      title: "고객센터",
      path: "/admin/contents/FAQList",
      isAvailable: true,
      items: [
        {name: "FAQ관리목록", path: "/admin/contents/FAQList"},
        {name: "FAQ관리등록", path: "/admin/contents/FAQAdd"},
        {name: "QnA관리목록", path: "/admin/contents/QnAList"},
      ]
    },
  ],
  member: [
  {
    title: "회원 관리",
    path: "/admin/member/adminMemberList",
    isAvailable: true,
    items: [
        { name: "회원 조회", path: "/admin/member/adminMemberList" },
        { name: "회원 등록", path: "/admin/member/adminMemberRegister" },
      ],
    },
  ],
  facility: [
    {
    title: "시설 관리",
    path: "/admin/facility/facilityList",
    isAvailable: true,
    items: [
        { name: "시설 목록 조회", path: "/admin/facility/facilityList" },
        { name: "시설 등록", path: "/admin/facility/facilityAdd" },
      ],
    },
  ],
};