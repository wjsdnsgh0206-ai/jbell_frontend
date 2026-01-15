// src/routes/admin/route-sh.jsx
import { lazy } from 'react';
// import RealtimeDashboard from '@/pages/admin/realtime/RealtimeDashboard';

export const RealTimeDashboard = lazy(() => import("@/pages/admin/realtime/RealTimeDashboard"));
// export const BehavioralGuideDetail = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideDetail"));

export const jyAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  {
    path: "/admin/realtime/realtimeDashboard", 
    element: <RealTimeDashboard />,
    nowPage: "행동요령 관리",
  },
];



