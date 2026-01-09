// route-sh.jsx
import { lazy } from 'react';

// 1. 선언이 잘 되어 있는지 확인
export const AdminCommonCodeList = lazy(() => import("@/pages/admin/CodeManagement/AdminCommonCodeList"));


export const shAdminRoutes = [

    // 공통코드관리 목록페이지 //
    {
        path: "/admin/adminCommonCodeList", 
        element: <AdminCommonCodeList />,
        nowPage: "공통코드관리",
  },



];