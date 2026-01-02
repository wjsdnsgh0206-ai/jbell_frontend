import { lazy } from "react";

/* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
const TyphoonBeforeAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonBeforeAction"));
const TyphoonDuringAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonDuringAction"));
const TyphoonAfterAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonAfterAction"));

export const jhUserRoutes = [
    /* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
    // 태풍 예보 시 행동요령
  {
    path: "/behavioralGuide/disasterGuide/typhoon/TyphoonAfterAction",
    element: <TyphoonBeforeAction />
  },
];
