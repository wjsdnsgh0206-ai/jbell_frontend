// src/routes/admin/route-eh.jsx
import { lazy } from 'react';

const FacilityList = lazy(() => import("@/pages/admin/facility/FacilityList"));
const FacilityUpdate = lazy(() => import("@/pages/admin/facility/FacilityUpdate"));
const FacilityAdd = lazy(() => import("@/pages/admin/facility/FacilityAdd"));
const FacilityDetail = lazy(() => import("@/pages/admin/facility/FacilityDetail"));

export const ehAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  {
    path: "/admin/facility/facilityList", 
    element: <FacilityList />,
    nowPage: "시설 관리",
  },
  {
    path: "/admin/facility/facilityUpdate/:id", 
    element: <FacilityUpdate />,
    nowPage: "시설 정보 수정",
  },
  {
    path: "/admin/facility/facilityAdd", 
    element: <FacilityAdd />,
    nowPage: "시설 정보 등록",
  },
  {
    path: "/admin/facility/facilityDetail/:id", 
    element: <FacilityDetail />,
    nowPage: "시설 상세 정보",
  },
];



