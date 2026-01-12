// route-sh.jsx
import { lazy } from 'react';

// 1. 선언이 잘 되어 있는지 확인
export const AdminCommonCodeList = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeList"));
export const AdminGroupCodeAdd = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeAdd"));
export const AdminSubCodeAdd = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeAdd"));
export const AdminGroupCodeDetail = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeDetail"));
export const AdminSubCodeDetail = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeDetail"));
export const AdminGroupCodeEdit = lazy(() => import("@/pages/admin/CodeManagement/AdminGroupCodeEdit"));
export const AdminSubCodeEdit = lazy(() => import("@/pages/admin/CodeManagement/AdminSubCodeEdit"));


export const shAdminRoutes = [

    // 공통코드관리 목록페이지 //
    {
        path: "/admin/adminCommonCodeList", 
        element: <AdminCommonCodeList />,
        nowPage: "공통코드관리",
  },

    // 그룹코드 등록 페이지 //
    {
        path: "/admin/adminGroupCodeAdd", 
        element: <AdminGroupCodeAdd />,
        nowPage: "그룹코드등록",
  },

  // 상세코드 등록 페이지 //
    {
        path: "/admin/adminSubCodeAdd", 
        element: <AdminSubCodeAdd />,
        nowPage: "상세코드등록",
  },

  // 그룹코드 상세 페이지 //
    {
        path: "/admin/adminGroupCodeDetail/:id", 
        element: <AdminGroupCodeDetail />,
        nowPage: "그룹코드상세보기",
  },
  
  // 상세코드 상세 페이지 //
    {
        path: "/admin/adminSubCodeDetail/:id", 
        element: <AdminSubCodeDetail />,
        nowPage: "상세코드상세보기",
  },

  // 그룹코드 수정 페이지 //
    {
        path: "/admin/adminGroupCodeEdit/:id", 
        element: <AdminGroupCodeEdit />,
        nowPage: "그룹코드수정",
  },

   // 상세코드 수정 페이지 //
    {
        path: "/admin/adminSubCodeEdit/:id", 
        element: <AdminSubCodeEdit />,
        nowPage: "상세코드수정",
  },


];



