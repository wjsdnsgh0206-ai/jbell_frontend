// src/routes/admin/route-sh.jsx
import { lazy } from 'react';
// import RealtimeDashboard from '@/pages/admin/realtime/RealtimeDashboard';

export const RealTimeDashboard = lazy(() => import("@/pages/admin/realtime/RealTimeDashboard"));
// export const BehavioralGuideDetail = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideDetail"));
export const AccidentNews = lazy(() => import("@/pages/admin/realtime/AccidentNewsList"));
// export const Disaster = lazy(() => import("@/pages/admin/realtime/Disaster"));
export const AccidentNewsDetail = lazy(() => import("@/pages/admin/realtime/AccidentNewsDetail"));
export const AccidentNewsAdd = lazy(() => import("@/pages/admin/realtime/AccidentNewsAdd"));
export const DisasterManagementList = lazy(() => import("@/pages/admin/realtime/DisasterManagementList"));
export const DisasterManagementDetail = lazy(() => import("@/pages/admin/realtime/DisasterManagementDetail"));
export const DisasterManagementAdd = lazy(() => import("@/pages/admin/realtime/DisasterManagementAdd"));

export const jyAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  // ========================
  // 관리자 메인 페이지
  // ========================
  {
    path: "/admin/realtime/realtimeDashboard", 
    element: <RealTimeDashboard />,
    nowPage: "대시보드",
  },
  // ========================
  // 관리자 사고속보 페이지
  // ========================
  {
    path: "/admin/realtime/accidentNewsList", 
    element: <AccidentNews/>,
    nowPage: "사고속보 목록",
  },
  {
    path: "/admin/realtime/accidentNewsDetail/:id", 
    element: <AccidentNewsDetail/>,
    nowPage: "사고속보 상세",
  },
  {
    path: "/admin/realtime/accidentNewsAdd",
    element: <AccidentNewsAdd/>,
    nowPage: "사고속보 등록",
  },
  // ========================
  // 관리자 재난관리 페이지
  // ========================
  {
    path: "/admin/realtime/disasterManagementList", 
    element: <DisasterManagementList />,
    nowPage: "재난관리 목록",
  },
  {
    path: "/admin/realtime/disasterManagementDetail/:id",
    element: <DisasterManagementDetail/>,
    nowPage: "재난관리 상세",
  },
  {
    path: "/admin/realtime/disasterManagementAdd",
    element: <DisasterManagementAdd/>,
    nowPage: "재난관리 등록",
  }
];



