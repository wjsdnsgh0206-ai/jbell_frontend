// src/routes/admin/route-sh.jsx
import { lazy } from 'react';

export const AdminCommonCodeList = lazy(() => import("@/pages/admin/codeManagement/AdminCommonCodeList"));
export const AdminGroupCodeAdd = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeAdd"));
export const AdminSubCodeAdd = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeAdd"));
export const AdminGroupCodeDetail = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeDetail"));
export const AdminSubCodeDetail = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeDetail"));
export const AdminGroupCodeEdit = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeEdit"));
export const AdminSubCodeEdit = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeEdit"));
export const AdminPressRelList = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelList"));
export const AdminPressRelAdd = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelAdd"));
export const AdminPressRelDetail = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelDetail"));
export const AdminPressRelEdit = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelEdit"));
export const AdminSafetyEduList = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduList"));
export const AdminSafetyEduAdd = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduAdd"));
export const AdminSafetyEduDetail = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduDetail"));
export const AdminSafetyEduEdit = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduEdit"));




export const shAdminRoutes = [
  // 공통코드관리 목록페이지 (시스템 관리 그룹)
  // URL 계층화: /admin/대분류/소분류+행위
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


  // 보도자료관리 목록페이지 (콘텐츠관리 그룹- 홍보/자료 관리)

   {
    path: "/admin/contents/pressRelList", 
    element: <AdminPressRelList />,
    nowPage: "보도자료관리",
  },

  // 보도자료관리 등록페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/pressRelAdd", 
    element: <AdminPressRelAdd />,
    nowPage: "보도자료등록",
  },

  // 보도자료관리 상세페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/pressRelDetail/:id", 
    element: <AdminPressRelDetail />,
    nowPage: "보도자료상세",
  },

   // 보도자료관리 수정페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/pressRelEdit/:id", 
    element: <AdminPressRelEdit />,
    nowPage: "보도자료수정",
  },

  // 시민안전교육관리 목록페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/safetyEduList", 
    element: <AdminSafetyEduList />,
    nowPage: "시민안전교육목록",
  },
  
  // 시민안전교육관리 등록페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/safetyEduAdd", 
    element: <AdminSafetyEduAdd />,
    nowPage: "시민안전교육등록",
  },
  
  // 시민안전교육관리 상세페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/safetyEduDetail/:id", 
    element: <AdminSafetyEduDetail />,
    nowPage: "시민안전교육상세",
  },

  // 시민안전교육관리 수정페이지 (콘텐츠관리 그룹- 홍보/자료 관리)
   {
    path: "/admin/contents/safetyEduEdit/:id", 
    element: <AdminSafetyEduEdit />,
    nowPage: "시민안전교육수정",
  },



];



