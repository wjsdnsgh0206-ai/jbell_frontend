// src/components/admin/AdminSideMenuData.js

/**
 * [관리자] 사이드바 메뉴 구성 데이터
 * - 각 대분류(system, user 등)는 URL의 첫 번째 경로와 매칭됩니다. (예: /admin/system/...)
 * - 팀원들이 새로운 관리 기능을 추가할 때 이 객체에 메뉴 정보를 등록해야 사이드바에 노출됩니다.
 */
export const ADMIN_MENU_DATA = {
  // [시스템 관리] 그룹: URL이 /admin/system/... 일 때 활성화
  system: [ 
    {
      title: "코드 관리",     // 소분류 그룹 제목
      isAvailable: true,     // 메뉴 활성화 여부 (준비 중일 경우 false)
      items: [
        { name: "공통코드 목록", path: "/admin/system/commonCodeList" },
        { name: "그룹코드 등록", path: "/admin/system/groupCodeAdd" },
        { name: "상세코드 등록", path: "/admin/system/subCodeAdd" },
        // { name: "상세코드 등록", path: "/admin/system/adminDetailCodeAdd" }, // 히스토리 보존용 주석
      ],
    },
    {
      title: "권한 관리",     // 추후 확장 예정 메뉴
      isAvailable: false,    // 비활성화 상태 (클릭 불가 처리 등에 활용)
      items: [],
    },
    {
      title: "로그 관리",     // 추후 확장 예정 메뉴
      isAvailable: false,
      items: [],
    },
  ],

  // [회원 관리] 그룹: URL이 /admin/user/... 일 때 활성화 (팀원 추가 영역)
  user: [ 
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

  // [콘텐츠 관리] 그룹: URL이 /admin/content/... 일 때 활성화
  content: [
    {
      title:"FAQ관리",        //소분류 그웁
      isAvailable: true,     //메뉴 활성화 여부 (준비 중일 경우 false)
      items:[
        {name: "FAQ관리목록", path: "/admin/content/FAQList"},
        {name: "FAQ관리등록", path: "/admin/content/FAQAdd"},
      ]
    },
     {
      title:"QnA관리",        //소분류 그웁
      isAvailable: true,     //메뉴 활성화 여부 (준비 중일 경우 false)
      items:[
        {name: "QnA관리목록", path: "/admin/content/QnAList"},
      ]
    },


  ]
};