// src/routes/admin/route-eh.jsx
import { lazy } from 'react';

export const FacilityList = lazy(() => import("@/pages/admin/facility/FacilityList"));

export const ehAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  {
    path: "/admin/facility/FacilityList", 
    element: <FacilityList />,
    nowPage: "대피소 관리",
  },
];



