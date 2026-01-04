import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

const EarthquakeActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquake/EarthquakeActionGuide"));
const TyphoonActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonActionGuide"));
const FloodActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/flood/FloodActionGuide"));
const HeavyRainActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/heavyRain/HeavyRainActionGuide"));
const LandslideActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/landslide/LandslideActionGuide"));

const TrafficAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/trafficAccident/TrafficAccidentActionGuide"));


export const jhUserRoutes = [
    /* 행동요령 > 재난별행동요령 > 태풍 단계별 행동요령 */
    // 태풍 예보 시 행동요령
  {
    path: "/earthquakeActionGuide",
    element: <EarthquakeActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "지진" ,
  },
  {
    path: "/typhoonActionGuide",
    element: <TyphoonActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "태풍" ,
  },
  {
    path: "/floodActionGuide",
    element: <FloodActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "홍수" ,
  },
  {
    path: "/heavyRainActionGuide",
    element: <HeavyRainActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "호우" ,
  },
  {
    path: "/landslideActionGuide",
    element: <LandslideActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "산사태" ,
  },
  {
    path: "/trafficAccidentActionGuide",
    element: <TrafficAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
    activeItem: "교통사고" ,
  },
];
