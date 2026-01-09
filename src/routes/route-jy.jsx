import { lazy } from "react";
import {
  AccidentNews,
  Earthquake,
  Flood,
  HeavyRain,
  LandSlide,
  Typhoon,
  ForestFire,
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
      { path: "/accident", element: <AccidentNews /> },
      { path: "/earthquake", element: <Earthquake /> },
      { path: "/flood", element: <Flood /> },
      { path: "/heavyRain", element: <HeavyRain /> },
      { path: "/landSlide", element: <LandSlide /> },
      { path: "/typhoon", element: <Typhoon /> },
      { path: "forestFire", element: <ForestFire /> },
    ],
  },
];

export { jyUserRoutes, disasterModal };
