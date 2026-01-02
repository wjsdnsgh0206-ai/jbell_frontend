import { lazy } from "react";
import { SIDE_MENU_DATA_BehavioralGuide } from "@/components/user/sideBar/SideMenuDataBehavioralGuide";


/* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
const TyphoonBeforeAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonBeforeAction"));
const TyphoonDuringAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonDuringAction"));
const TyphoonAfterAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonAfterAction"));

export const jhUserRoutes = [
    /* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
    // 태풍 예보 시 행동요령
  {
    path: "/behavioralGuide/disasterGuide/typhoon/TyphoonAfterAction",
    element: <TyphoonBeforeAction />,
     sidebarData: SIDE_MENU_DATA_BehavioralGuide.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "내 정보" },
];
