// src/components/admin/sideBar/AdminSideMenuData.js
export const ADMIN_MENU_DATA = {
  system: [ // URL이 /admin/system/.. 일 때
    {
      title: "코드 관리",
      isAvailable: true,
      items: [
        { name: "공통코드 목록(수정 전)", path: "/admin/system/commonCodeListCopy" },
        { name: "공통코드 목록", path: "/admin/system/commonCodeList" },
        { name: "그룹코드 등록", path: "/admin/system/groupCodeAdd" },
        { name: "상세코드 등록", path: "/admin/system/subCodeAdd" },
        // { name: "상세코드 등록", path: "/admin/system/adminDetailCodeAdd" },
      ],
    },
    {
      title: "로그 관리",
      isAvailable: false,
      items: [],
    },
  ],
  user: [ /* /admin/user/.. 일 때 */ ],
};