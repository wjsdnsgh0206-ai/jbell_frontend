import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";


/* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
const TyphoonBeforeAction = lazy(() => import("@/pages/user/behavioralGuide/disasterGuide/typhoon/TyphoonBeforeAction"));

export const jhUserRoutes = [
    /* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
    // 태풍 예보 시 행동요령
  {
    path: "/typhoonBeforeAction",
    element: <TyphoonBeforeAction />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "태풍" },
];
