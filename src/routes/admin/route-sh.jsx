// src/routes/admin/route-sh.jsx
import { lazy } from 'react';

export const AdminCommonCodeListCopy = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeListCopy"));
export const AdminCommonCodeList = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeList"));
export const AdminGroupCodeAdd = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeAdd"));

export const shAdminRoutes = [
  // 공통코드관리 목록페이지 (시스템 관리 그룹)
  // URL 계층화: /admin/대분류/소분류+행위
  {
    path: "/admin/system/commonCodeListCopy", 
    element: <AdminCommonCodeListCopy />,
    nowPage: "공통코드관리(수정 전)",
  },
  {
    path: "/admin/system/commonCodeList", 
    element: <AdminCommonCodeList />,
    nowPage: "공통코드관리",
  },
  // 그룹코드 등록 페이지 (시스템 관리 그룹)
  {
    path: "/admin/system/groupCodeAdd", 
    element: <AdminGroupCodeAdd />,
    nowPage: "그룹코드등록",
  },
];