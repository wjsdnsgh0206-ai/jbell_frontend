// src/routes/route-jy.jsx
import { lazy } from "react";
import {
  AccidentNews,
  Earthquake,
  Flood,
  LandSlide,
  Typhoon,
  ForestFire,
  ColdWave,
} from "@/components/user/disaster";

import DisasterModalLayout from "@/layouts/user/disasterModal/DisasterModalLayout";

/*
  route-jy.jsx
  > 작성자 : 최지영
  > 파일 설명 : 사용자 페이지 및 재난 모달 라우트 구성
*/

const UserPageMain = lazy(() => import("@/pages/user/UserPageMain"));
const UserMap = lazy(() => import("@/pages/user/UserMap"));
const UserNoticeList = lazy(() =>
  import("@/pages/user/openboards/UserNoticeList")
);

const jyUserRoutes = [
  {
    path: "/",
    element: <UserPageMain />,
  },
  {
    path: "/map",
    element: <UserMap />,
  },
  {
    path: "/userNoticeList",
    element: <UserNoticeList />,
  },
];

const disasterModal = [
  {
    path: "/disaster",
    element: <DisasterModalLayout />,
    children: [
      { index: true, element: <AccidentNews /> }, 
      { path: "accident", element: <AccidentNews /> }, // 사고
      { path: "earthquake", element: <Earthquake /> }, // 지진
      { path: "flood", element: <Flood /> }, // 홍수
      { path: "landSlide", element: <LandSlide /> }, // 산사태
      { path: "typhoon", element: <Typhoon /> }, // 태풍
      { path: "forestFire", element: <ForestFire /> }, // 산불
      { path: "coldWave", element: <ColdWave /> }, // 한파
    ]
  },
];

export { jyUserRoutes, disasterModal };
