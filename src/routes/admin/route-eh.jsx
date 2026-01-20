// src/routes/admin/route-eh.jsx
import { lazy } from 'react';

export const FacilityList = lazy(() => import("@/pages/admin/facility/FacilityList"));
export const FacilityUpdate = lazy(() => import("@/pages/admin/facility/FacilityUpdate"));
export const FacilityAdd = lazy(() => import("@/pages/admin/facility/FacilityAdd"));
export const FacilityDetail = lazy(() => import("@/pages/admin/facility/FacilityDetail"));

export const ehAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  {
    path: "/admin/facility/FacilityList", 
    element: <FacilityList />,
    nowPage: "시설 관리",
  },
  {
    path: "/admin/facility/FacilityList", 
    element: <FacilityUpdate />,
    nowPage: "시설 정보 수정",
  },
  {
    path: "/admin/facility/FacilityList", 
    element: <FacilityAdd />,
    nowPage: "시설 정보 등록",
  },
  {
    path: "/admin/facility/FacilityList", 
    element: <FacilityDetail />,
    nowPage: "시설 상세 정보",
  },
];



