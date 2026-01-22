// src/routes/route-jh.jsx
import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

// 자연재난행동요령 import
const EarthquakeActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquake/EarthquakeActionGuide"));
const TyphoonActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonActionGuide"));
const FloodActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/flood/FloodActionGuide"));
const HeavyRainActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/heavyRain/HeavyRainActionGuide"));
const LandslideActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/landslide/LandslideActionGuide"));

// 사회재난행동요령 import
const TrafficAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/trafficAccident/TrafficAccidentActionGuide"));
const FireActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/fire/FireActionGuide"));
const ForestFireActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/forestFire/ForestFireActionGuide"));
const BuildingCollapseActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/buildingCollapse/BuildingCollapseActionGuide"));
const ElectricityGasAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/electricityGasAccident/ElectricityGasAccidentActionGuide"));
const RoadTunnelAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/roadTunnelAccident/RoadTunnelAccidentActionGuide"));
const RailwaySubwayAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/railwaySubwayAccident/RailwaySubwayAccidentActionGuide"));

// 생활안전행동요령 import
const FirstAidActionGuide = lazy(() => import("@/pages/user/behavioralGuide/life/firstAid/FirstAidActionGuide"));
const CprActionGuide = lazy(() => import("@/pages/user/behavioralGuide/life/cpr/CprActionGuide"));
const FoodPoisoningActionGuide = lazy(() => import("@/pages/user/behavioralGuide/life/foodPoisoning/FoodPoisoningActionGuide"));
const ElevatorAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/life/elevatorAccident/ElevatorAccidentActionGuide"));
const MountainSafetyActionGuide = lazy(() => import("@/pages/user/behavioralGuide/life/mountainSafety/MountainSafetyActionGuide"));

// 대피소 소개 import
const UserFacilityList = lazy(() => import("@/pages/user/facility/UserFacilityList"));
const UserFacilityDetail = lazy(() => import("@/pages/user/facility/UserFacilityDetail"));

// 도시안전기본계획 import
const CitySafetyMasterPlan = lazy(() => import("@/pages/user/mainSafetyPolicies/citySafetyMasterPlan/CitySafetyMasterPlan"));
// 재난별 안전정책 import
const EarthquakeSafetyPolicy = lazy(() => import("@/pages/user/mainSafetyPolicies/disasterSafetyPolicy/earthquake/EarthquakeSafetyPolicy"));
const StormAndFloodSafetyPolicy = lazy(() => import("@/pages/user/mainSafetyPolicies/disasterSafetyPolicy/stormAndFlood/StormAndFloodSafetyPolicy"));
// // 시민 안전보험 import
const CitizenSafetyInsurance = lazy(() => import("@/pages/user/mainSafetyPolicies/citizenSafetyInsurance/CitizenSafetyInsurance"));
// // 풍수해 안전보험 import
const StormAndFloodInsurance = lazy(() => import("@/pages/user/mainSafetyPolicies/stormAndFloodInsurance/StormAndFloodInsurance"));


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
    path: "/forestFireActionGuide",
    element: <ForestFireActionGuide />,
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
    path: "/firstAidActionGuide",
    element: <FirstAidActionGuide />,
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
  /* 대피소 소개 */
  // 시설 목록
  { 
    path: "/facilityList",
    element: <UserFacilityList />, 
    sidebarData: SIDE_MENU_DATA.FACILITY,
    nowPage: "대피소 소개",
  },
  // 시설 상세 페이지
  {
    path: "/facility/detail/:id",
    element: <UserFacilityDetail />,
    sidebarData: SIDE_MENU_DATA.FACILITY,
    nowPage: "대피소 소개",
  },
  /* 도시안전기본계획*/
  // 도시안전기본계획 개요
  { 
    path: "/citySafetyMasterPlan",
    element: <CitySafetyMasterPlan />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
  /* 재난별 안전정책*/
  // 지진
  { 
    path: "/earthquakeSafetyPolicy",
    element: <EarthquakeSafetyPolicy />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
  // 태풍, 호우
  { 
    path: "/stormAndFloodSafetyPolicy",
    element: <StormAndFloodSafetyPolicy />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
  // 시민 안전보험
  { 
    path: "/citizenSafetyInsurance",
    element: <CitizenSafetyInsurance />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
  // 풍수해 안전보험
  { 
    path: "/stormAndFloodInsurance",
    element: <StormAndFloodInsurance />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
];
