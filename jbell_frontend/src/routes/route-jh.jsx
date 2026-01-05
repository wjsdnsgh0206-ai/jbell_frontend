import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

const EarthquakeActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquake/EarthquakeActionGuide"));
const TyphoonActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonActionGuide"));
const FloodActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/flood/FloodActionGuide"));
const HeavyRainActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/heavyRain/HeavyRainActionGuide"));
const LandslideActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/landslide/LandslideActionGuide"));

const TrafficAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/trafficAccident/TrafficAccidentActionGuide"));


export const jhUserRoutes = [
  /* 자연재난행동요령 */
  // 지진 행동요령
  {
    path: "/earthquakeActionGuide",
    element: <EarthquakeActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 태풍 행동요령
  {
    path: "/typhoonActionGuide",
    element: <TyphoonActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 홍수 행동요령
  {
    path: "/floodActionGuide",
    element: <FloodActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 호우 행동요령
  {
    path: "/heavyRainActionGuide",
    element: <HeavyRainActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 산사태 행동요령
  {
    path: "/landslideActionGuide",
    element: <LandslideActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },

  /* 사회재난행동요령 */
  // 교통사고 행동요령
  {
    path: "/trafficAccidentActionGuide",
    element: <TrafficAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 화재 행동요령
  {
    path: "/fireActionGuide",
    element: <FireActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 산불 행동요령
  {
    path: "/wildfireActionGuide",
    element: <WildfireActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 건축물붕괴
  {
    path: "/buildingCollapseActionGuide",
    element: <BuildingCollapseActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 전기, 가스 사고
  {
    path: "/electricityGasAccidentActionGuide",
    element: <ElectricityGasAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 도로터널사고
  {
    path: "/roadTunnelAccidentActionGuide",
    element: <RoadTunnelAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 철도, 지하철 사고
  {
    path: "/railwaySubwayAccidentActionGuide",
    element: <RailwaySubwayAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },

  /* 생활안전행동요령 */
  // 응급처치
  {
    path: "/trafficAccidentActionGuide",
    element: <TrafficAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 심폐소생술
  {
    path: "/cprActionGuide",
    element: <CprActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 식중독
  {
    path: "/foodPoisoningActionGuide",
    element: <FoodPoisoningActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 승강기 안전사고
  {
    path: "/elevatorAccidentActionGuide",
    element: <ElevatorAccidentActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
  // 산행안전사고
  {
    path: "/mountainSafetyActionGuide",
    element: <MountainSafetyActionGuide />,
    sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE,
    nowPage: "행동요령",
  },
];
