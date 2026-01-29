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
const PolicyPageEditor = lazy(() => import("@/pages/admin/contents/safetyPolicy/PolicyPageEditor"));

export const jhAdminRoutes = [
  /* 1. 행동요령 관리 */
  {
    path: "/admin/contents/behaviorMethodList", 
    element: <BehaviorMethodList />,
    nowPage: "행동요령 목록",
  },
  {
    path: "/admin/behaviorMethodDetail/:id", 
    element: <BehaviorMethodDetail />,
    nowPage: "행동요령 상세",
  },
  {
    path: "/admin/behaviorMethodAdd", 
    element: <BehaviorMethodAdd />,
    nowPage: "행동요령 등록",
  },

  /* 2. 주요 안전정책 관리 */
  { 
    path: "/admin/contents/citySafetyMasterPlan", 
    element: <PolicyPageEditor 
                pageTitle="도시안전기본계획 관리" 
                policyType="CITY_MASTER_PLAN" 
                tabs={[{id:0, label:'개요'}, {id:1, label:'안전관리기구'}, {id:2, label:'재난안전대책본부'}]} 
              /> 
  },
  { 
    path: "/admin/contents/disasterSafetyPolicy", 
    element: <PolicyPageEditor 
                pageTitle="재난별 안전정책 관리" 
                policyType="DISASTER_POLICY" 
                tabs={[{id:0, label:'지진'}, {id:1, label:'태풍·호우'}, {id:2, label:'기타'}]} 
              /> 
  },
  { 
    path: "/admin/contents/citizenSafetyInsurance", 
    element: <PolicyPageEditor 
                pageTitle="시민 안전보험 관리" 
                policyType="CITIZEN_INSURANCE" 
                tabs={[{id:0, label:'보장내용'}, {id:1, label:'청구방법'}]} 
              /> 
  },
  { 
    path: "/admin/contents/stormAndFloodInsurance", 
    element: <PolicyPageEditor 
                pageTitle="풍수해 안전보험 관리" 
                policyType="STORM_FLOOD_INSURANCE" 
                tabs={[{id:0, label:'가입안내'}, {id:1, label:'지원내용'}]} 
              /> 
  },
];