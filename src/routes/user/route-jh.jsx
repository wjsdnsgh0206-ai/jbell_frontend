// src/routes/route-jh.jsx
import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

// 자연재난행동요령 import (natural)
const TyphoonBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/TyphoonBehaviorMethod"));
const FloodBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/FloodBehaviorMethod"));
const HeavyRainBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/HeavyRainBehaviorMethod"));
const ColdWaveBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/ColdWaveBehaviorMethod"));
const EarthquakeBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/EarthquakeBehaviorMethod"));
const LandslideBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/natural/LandslideBehaviorMethod"));

// 사회재난행동요령 import (social)
const FireBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/social/FireBehaviorMethod"));
const ForestFireBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/social/ForestFireBehaviorMethod"));
const BuildingCollapseBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/social/BuildingCollapseBehaviorMethod"));
const ElectricityGasAccidentBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/social/ElectricityGasAccidentBehaviorMethod"));
const RailwaySubwayAccidentBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/social/RailwaySubwayAccidentBehaviorMethod"));

// 생활안전행동요령 import (life)
const FirstAidBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/FirstAidBehaviorMethod"));
const CprBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/CprBehaviorMethod"));
const FoodPoisoningBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/FoodPoisoningBehaviorMethod"));
const ElevatorAccidentBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/ElevatorAccidentBehaviorMethod"));
const TrafficAccidentBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/TrafficAccidentBehaviorMethod"));
const MountainSafetyBehaviorMethod = lazy(() => import("@/pages/user/behaviorMethod/life/MountainSafetyBehaviorMethod"));

// 대피소 소개 import
const UserFacilityList = lazy(() => import("@/pages/user/facility/UserFacilityList"));
const UserFacilityDetail = lazy(() => import("@/pages/user/facility/UserFacilityDetail"));

// 주요 안전정책 import
const SafetyPolicyList = lazy(() => import("@/pages/user/safetyPolicy/SafetyPolicyList"));

export const jhUserRoutes = [
  /* 자연재난행동요령 */
  { path: "/behaviorMethod/typhoon", element: <TyphoonBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/flood", element: <FloodBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/heavyRain", element: <HeavyRainBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/coldWave", element: <ColdWaveBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/earthQuake", element: <EarthquakeBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/landslide", element: <LandslideBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },

  /* 사회재난행동요령 */
  { path: "/behaviorMethod/trafficAccident", element: <TrafficAccidentBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/fire", element: <FireBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/forestFire", element: <ForestFireBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/buildingCollapse", element: <BuildingCollapseBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/electricityGasAccident", element: <ElectricityGasAccidentBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/railwaySubwayAccident", element: <RailwaySubwayAccidentBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },

  /* 생활안전행동요령 */
  { path: "/behaviorMethod/firstAid", element: <FirstAidBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/cpr", element: <CprBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/foodPoisoning", element: <FoodPoisoningBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/elevatorAccident", element: <ElevatorAccidentBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },
  { path: "/behaviorMethod/mountainSafety", element: <MountainSafetyBehaviorMethod />, sidebarData: SIDE_MENU_DATA.BEHAVIOR_METHOD, nowPage: "행동요령" },

  /* 대피소 소개 (기존 유지) */
  { 
    path: "/facilityList",
    element: <UserFacilityList />, 
    sidebarData: SIDE_MENU_DATA.FACILITY,
    nowPage: "대피소 소개",
  },
  {
    path: "/facility/detail/:id",
    element: <UserFacilityDetail />,
    sidebarData: SIDE_MENU_DATA.FACILITY,
    nowPage: "대피소 소개",
  },

  /* 도시안전기본계획 및 안전정책 (기존 유지) */
  { 
    path: "/safetyPolicyList",
    element: <SafetyPolicyList />, 
    sidebarData: SIDE_MENU_DATA.MAIN_SAFETY_POLICIES,
    nowPage: "주요 안전정책",
  },
];