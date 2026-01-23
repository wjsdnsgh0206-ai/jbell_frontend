import { lazy } from "react";

// ======================================
// 관리자 메인 페이지 라우터 정리 - 최지영
// ======================================

// ⭐ ========================
// 코드 수정 20260122 오전 11:40
// 주요 수정 사항 : lazy로 파일 import하는 코드에 export 제거.
// 제거 이유 : 컴포넌트와 데이터가 섞여서 함께 export되어 경고 메시지가 뜸. 이를 해결하기 위해 데이터만 export하는 방식으로 수정.
// ========================

const RealTimeDashboard = lazy(() => import("@/pages/admin/realtime/dashboard/RealTimeDashboard"),);
const AccidentNewsList = lazy(() => import("@/pages/admin/realtime/accidentNews/AccidentNewsList"),);
const AccidentNewsDetail = lazy(() => import("@/pages/admin/realtime/accidentNews/AccidentNewsDetail"),);
const AccidentNewsAdd = lazy(() => import("@/pages/admin/realtime/accidentNews/AccidentNewsAdd"),);
const DisasterManagementList = lazy(() =>import("@/pages/admin/realtime/disasterManagement/DisasterManagementList"),);
const DisasterManagementDetail = lazy(() =>import("@/pages/admin/realtime/disasterManagement/DisasterManagementDetail"),);
const DisasterManagementAdd = lazy(() =>import("@/pages/admin/realtime/disasterManagement/DisasterManagementAdd"),);
const DisasterEventManagementList = lazy(() =>import("@/pages/admin/realtime/disasterEventManagement/DisasterEventManagementList"),);
const DisasterEventManagementDetail = lazy(() =>import("@/pages/admin/realtime/disasterEventManagement/DisasterEventManagementDetail"),);
const DisasterEventManagementAdd = lazy(() =>import("@/pages/admin/realtime/disasterEventManagement/DisasterEventManagementAdd"),);
const WeatherNewsList = lazy(() => import("@/pages/admin/realtime/weatherNews/WeatherNewsList"),);
const WeatherNewsDetail = lazy(() => import("@/pages/admin/realtime/weatherNews/WeatherNewsDetail"),);
const WeatherNewsAdd = lazy(() => import("@/pages/admin/realtime/weatherNews/WeatherNewsAdd"),);
const DisasterMessageList = lazy(() => import("@/pages/admin/realtime/disasterMessage/DisasterMessageList"),);
const DisasterMessageDetail = lazy(() => import("@/pages/admin/realtime/disasterMessage/DisasterMessageDetail"),);
const DisasterMessageAdd = lazy(() => import("@/pages/admin/realtime/disasterMessage/DisasterMessageAdd"),);
const DisasterStatisticsList = lazy(() => import("@/pages/admin/realtime/disasterStatistics/DisasterStatisticsList"),);

export const jyAdminRoutes = [
  // URL 계층화: /admin/대분류/소분류+행위

  // ========================
  // 관리자 메인 페이지
  // ========================
  {
    path: "/admin/realtime/realtimeDashboard",
    element: <RealTimeDashboard />,
    nowPage: "대시보드",
  },
  // ========================
  // 관리자 사고속보 페이지
  // ========================
  {
    path: "/admin/realtime/accidentNewsList",
    element: <AccidentNewsList />,
    nowPage: "사고속보 목록",
  },
  {
    path: "/admin/realtime/accidentNewsDetail/:id",
    element: <AccidentNewsDetail />,
    nowPage: "사고속보 상세",
  },
  {
    path: "/admin/realtime/accidentNewsAdd",
    element: <AccidentNewsAdd />,
    nowPage: "사고속보 등록",
  },
  // ========================
  // 관리자 재난관리 페이지
  // ========================
  {
    path: "/admin/realtime/disasterManagementList",
    element: <DisasterManagementList />,
    nowPage: "재난관리 목록",
  },
  {
    path: "/admin/realtime/disasterManagementDetail/:id",
    element: <DisasterManagementDetail />,
    nowPage: "재난관리 상세",
  },
  {
    path: "/admin/realtime/disasterManagementAdd",
    element: <DisasterManagementAdd />,
    nowPage: "재난관리 등록",
  },
  // ========================
  // 관리자 재난발생관리 페이지
  // ========================
  {
    path: "/admin/realtime/disasterEventManagementList",
    element: <DisasterEventManagementList />,
    nowPage: "재난발생 관리 목록",
  },
  {
    path: "/admin/realtime/disasterEventManagementDetail/:id",
    element: <DisasterEventManagementDetail />,
    nowPage: "재난발생 관리 상세",
  },
  {
    path: "/admin/realtime/disasterEventManagementAdd",
    element: <DisasterEventManagementAdd />,
    nowPage: "재난발생 관리 등록",
  },
  // ========================
  // 관리자 기상특보관리 페이지
  // ========================
  {
    path: "/admin/realtime/weatherNewsList",
    element: <WeatherNewsList />,
    nowPage: "기상특보 관리 목록",
  },
  {
    path: "/admin/realtime/weatherNewsDetail/:id",
    element: <WeatherNewsDetail />,
    nowPage: "기상특보 관리 상세",
  },
  {
    path: "/admin/realtime/weatherNewsAdd",
    element: <WeatherNewsAdd />,
    nowPage: "기상특보 관리 등록",
  },
  // ========================
  // 관리자 재난문자이력관리 페이지
  // ========================
  {
    path: "/admin/realtime/disasterMessageList",
    element: <DisasterMessageList />,
    nowPage: "재난문자이력관리 관리",
  },
  {
    path: "/admin/realtime/disasterMessageDetail/:id",
    element: <DisasterMessageDetail/>,
    nowPage: "재난문자이력관리 상세",
  },
  {
    path: "/admin/realtime/disasterMessageAdd",
    element: <DisasterMessageAdd/>,
    nowPage: "재난문자이력관리 등록",
  },
  // ========================
  // 관리자 재난통계 페이지
  // ========================
  {
    path: "/admin/realtime/disasterStatisticsList",
    element: <DisasterStatisticsList/>,
    nowPage: "재난통계",
  }
];
