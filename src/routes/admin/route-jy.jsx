// src/routes/admin/route-sh.jsx
import { lazy } from 'react';
// import RealtimeDashboard from '@/pages/admin/realtime/RealtimeDashboard';

export const RealTimeDashboard = lazy(() => import("@/pages/admin/realtime/RealTimeDashboard"));
// export const BehavioralGuideDetail = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideDetail"));
export const AccidentNews = lazy(() => import("@/pages/admin/realtime/AccidentNews"));
export const Disaster = lazy(() => import("@/pages/admin/realtime/Disaster"));
export const AccidentNewsDetail = lazy(() => import("@/pages/admin/realtime/AccidentNewsDetail"));
export const AccidentNewsAdd = lazy(() => import("@/pages/admin/realtime/AccidentNewsAdd"));

export const jyAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  // ================
  // 관리자 메인 페이지
  // ================
  {
    path: "/admin/realtime/realtimeDashboard", 
    element: <RealTimeDashboard />,
    nowPage: "대시보드",
  },

  // ================
  // 관리자 사고속보 페이지
  // ================
  {
    path: "/admin/realtime/accidentNews", 
    element: <AccidentNews/>,
    nowPage: "사고속보 목록",
  },
  {
    path: "/admin/realtime/accidentNewsDetail/:id", 
    element: <AccidentNewsDetail/>,
    nowPage: "사고속보 보기",
  },
  {
    path: "/admin/realtime/accidentNewsAdd",
    element: <AccidentNewsAdd/>,
    nowPage: "사고속보 등록",
  },

  {
    path: "/admin/realtime/disaster", 
    element: <Disaster />,
    nowPage: "재난 관리",
  },
];



