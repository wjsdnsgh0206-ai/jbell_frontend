// src/components/admin/sideBar/AdminSideMenuData.js
export const ADMIN_MENU_DATA = {
  SYSTEM: [ // 시스템 관리 탭 클릭 시 보여줄 메뉴
    {
      title: "코드 관리",
      isAvailable: true,
      items: [
        { name: "공통코드 관리", path: "/admin/adminCommonCodeList" },
        { name: "그룹코드 등록", path: "/admin/adminGroupCodeAdd" },
        { name: "상세코드 등록", path: "/admin/adminDetailCodeAdd" },
      ],
    },
    {
      title: "로그 관리",
      isAvailable: false,
      items: [],
    },
  ],
  USER: [ /* 회원 관리 메뉴들... */ ],
  CONTENT: [ /* 콘텐츠 관리 메뉴들... */ ],
};