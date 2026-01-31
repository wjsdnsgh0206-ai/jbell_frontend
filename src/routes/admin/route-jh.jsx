// src/routes/admin/route-jh.jsx
import { lazy } from 'react';

// ⭐ ========================
// 코드 수정 20260122 오전 11:40
// 주요 수정 사항 : lazy로 파일 import하는 코드에 export 제거. 
// 제거 이유 : 컴포넌트와 데이터가 섞여서 함께 export되어 경고 메시지가 뜸. 이를 해결하기 위해 데이터만 export하는 방식으로 수정. 
// ========================

const BehaviorMethodList = lazy(() => import("@/pages/admin/behaviorMethod/BehaviorMethodList"));
const BehaviorMethodDetail = lazy(() => import("@/pages/admin/behaviorMethod/BehaviorMethodDetail"));
const BehaviorMethodAdd = lazy(() => import("@/pages/admin/behaviorMethod/BehaviorMethodAdd"));
const AdminSafetyPolicyList = lazy(() => import("@/pages/admin/safetyPolicy/AdminSafetyPolicyList"));
export const jhAdminRoutes = [
  /* 1. 행동요령 관리 */
  {
    path: "/admin/contents/behaviorMethodList", 
    element: <BehaviorMethodList />,
    nowPage: "행동요령 목록",
  },
  {
    path: "/admin/contents/behaviorMethodDetail/:id", 
    element: <BehaviorMethodDetail />,
    nowPage: "행동요령 상세",
  },
  {
    path: "/admin/contents/behaviorMethodAdd", 
    element: <BehaviorMethodAdd />,
    nowPage: "행동요령 등록",
  },

  /* 2. 주요 안전정책 관리 */
  { 
    path: "/admin/contents/adminSafetyPolicyList", 
    element: <AdminSafetyPolicyList /> 
  },
];