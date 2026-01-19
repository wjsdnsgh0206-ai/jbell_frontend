// src/routes/admin/route-sh.jsx
import { lazy } from 'react';
// import RealtimeDashboard from '@/pages/admin/realtime/RealtimeDashboard';

export const RealTimeDashboard = lazy(() => import("@/pages/admin/realtime/RealTimeDashboard"));
// export const BehavioralGuideDetail = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideDetail"));
export const AccidentNews = lazy(() => import("@/pages/admin/realtime/AccidentNews"));
export const Disaster = lazy(() => import("@/pages/admin/realtime/Disaster"));



export const jyAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  {
    path: "/admin/realtime/realtimeDashboard", 
    element: <RealTimeDashboard />,
    nowPage: "행동요령 관리",
  },
      {
    path: "/admin/realtime/accidentNews", 
    element: <AccidentNews />,
    nowPage: "사고속보 관리",
  },
  {
    path: "/admin/realtime/disaster", 
    element: <Disaster />,
    nowPage: "재난 관리",
  },
];



