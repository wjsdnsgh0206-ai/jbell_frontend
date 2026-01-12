// src/routes/admin/route-sh.jsx
import { lazy } from 'react';

export const AdminCommonCodeListCopy = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeListCopy"));
export const AdminCommonCodeList = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeList"));
export const AdminGroupCodeAdd = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeAdd"));
export const AdminSubCodeAdd = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeAdd"));
export const AdminGroupCodeDetail = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeDetail"));
export const AdminSubCodeDetail = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeDetail"));
export const AdminGroupCodeEdit = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeEdit"));
export const AdminSubCodeEdit = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeEdit"));


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

  // 상세코드 등록 페이지 //
    {
        path: "/admin/system/subCodeAdd", 
        element: <AdminSubCodeAdd />,
        nowPage: "상세코드등록",
  },

  // 그룹코드 상세 페이지 //
    {
        path: "/admin/system/groupCodeDetail/:id", 
        element: <AdminGroupCodeDetail />,
        nowPage: "그룹코드상세보기",
  },
  
  // 상세코드 상세 페이지 //
    {
        path: "/admin/system/subCodeDetail/:id", 
        element: <AdminSubCodeDetail />,
        nowPage: "상세코드상세보기",
  },

  // 그룹코드 수정 페이지 //
    {
        path: "/admin/system/groupCodeEdit/:id", 
        element: <AdminGroupCodeEdit />,
        nowPage: "그룹코드수정",
  },

   // 상세코드 수정 페이지 //
    {
        path: "/admin/system/subCodeEdit/:id", 
        element: <AdminSubCodeEdit />,
        nowPage: "상세코드수정",
  },


];



