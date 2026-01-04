import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

/* 행동요령 > 자연재난행동요령 > 지진 */
const EarthquakeBeforeAction = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquake/EarthquakeBeforeAction"));
// const EarthquakeAfterAction = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquak/EarthquakeAfterAction"));
// const EarthquakeDuringAction = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquak/EarthquakeDuringAction"));

/* 행동요령 > 자연재난행동요령 > 태풍 */
const TyphoonBeforeAction = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonBeforeAction"));
// const TyphoonDuringAction = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonDuringAction"));
// const TyphoonAfterAction = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonAfterAction"));


export const jhUserRoutes = [
    /* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
    // 태풍 예보 시 행동요령
  {
    path: "/earthquakeBeforeAction",
    element: <EarthquakeBeforeAction />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "지진" ,
  },
  {
    path: "/typhoonBeforeAction",
    element: <TyphoonBeforeAction />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "태풍" ,
  },
  // {
  //   path: "/floodBeforeAction",
  //   element: <FloodBeforeAction />,
  //   sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
  //   nowPage: "행동요령",
  //   activeItem: "홍수" ,
  // },
  // {
  //   path: "/heavyRainBeforeAction",
  //   element: <HeavyRainBeforeAction />,
  //   sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
  //   nowPage: "행동요령",
  //   activeItem: "호우" ,
  // },
  // {
  //   path: "/landslideBeforeAction",
  //   element: <LandslideBeforeAction />,
  //   sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
  //   nowPage: "행동요령",
  //   activeItem: "산사태" ,
  // },
];
