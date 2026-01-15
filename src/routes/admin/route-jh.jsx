// src/routes/admin/route-sh.jsx
import { lazy } from 'react';

export const BehavioralGuideList = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideList"));
export const BehavioralGuideDetail = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideDetail"));
export const BehavioralGuideAdd = lazy(() => import("@/pages/admin/contents/behavioralGuide/BehavioralGuideAdd"));

export const jhAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위
  
  /* 콘텐츠 관리 그룹 */
  // 행동요령 목록페이지
  {
    path: "/admin/contents/behavioralGuideList", 
    element: <BehavioralGuideList />,
    nowPage: "행동요령 관리",
  },
  // 행동요령 상세 및 수정 페이지
  {
    path: "/admin/contents/behavioralGuideDetail/:id", 
    element: <BehavioralGuideDetail />,
    nowPage: "행동요령 상세",
  },
  {
    path: "/admin/contents/behavioralGuideAdd", 
    element: <BehavioralGuideAdd />,
    nowPage: "행동요령 등록",
  },
];



