// src/routes/admin/route-sh.jsx
import { lazy } from 'react';

// ⭐ ========================
// 코드 수정 20260122 오전 11:40
// 주요 수정 사항 : lazy로 파일 import하는 코드에 export 제거. 
// 제거 이유 : 컴포넌트와 데이터가 섞여서 함께 export되어 경고 메시지가 뜸. 이를 해결하기 위해 데이터만 export하는 방식으로 수정. 
// ========================

const AdminCommonCodeList = lazy(() => import("@/pages/admin/codeManagement/AdminCommonCodeList"));
const AdminGroupCodeAdd = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeAdd"));
const AdminSubCodeAdd = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeAdd"));
const AdminGroupCodeDetail = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeDetail"));
const AdminSubCodeDetail = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeDetail"));
const AdminGroupCodeEdit = lazy(() => import("@/pages/admin/codeManagement/AdminGroupCodeEdit"));
const AdminSubCodeEdit = lazy(() => import("@/pages/admin/codeManagement/AdminSubCodeEdit"));
const AdminPressRelList = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelList"));
const AdminPressRelAdd = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelAdd"));
const AdminPressRelDetail = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelDetail"));
const AdminPressRelEdit = lazy(() => import("@/pages/admin/pressManagement/AdminPressRelEdit"));
const AdminSafetyEduList = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduList"));
const AdminSafetyEduEdit = lazy(() => import("@/pages/admin/safetyEducation/AdminSafetyEduEdit"));


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



