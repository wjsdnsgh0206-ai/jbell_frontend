// src/routes/route-jy.jsx
import { lazy } from "react";
import { AccidentNews, Earthquake, Flood, HeavyRain, LandSlide, Typhoon, ForestFire } from "@/components/user/disaster";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

/*
  route-jy.jsx
  > 작성자 : 최지영
  > 파일 이름 : 사용자 페이지 및 재난 모달 라우트 구성
  > 파일 설명 : 사용자 메인, 지도, 시설 리스트 등 주요 페이지와 재난사고속보 모달 내 탭별 라우트(disasterModal)를 정의함.
*/

const UserPageMain = lazy(() => import("@/pages/user/UserPageMain"));
const UserMap = lazy(() => import("@/pages/user/UserMap"));
const UserNoticeList = lazy(() => import("@/pages/user/openboards/UserNoticeList"));

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
    element: <AccidentNews />,
  },
  {
    path: "/disaster/accident",
    element: <AccidentNews />,
  },
  {
    path: "/disaster/earthquake",
    element: <Earthquake />,
  },
  {
    path: "/disaster/flood",
    element: <Flood />,
  },
  {
    path: "/disaster/heavyRain",
    element: <HeavyRain />,
  },
  {
    path: "/disaster/landSlide",
    element: <LandSlide />,
  },
  {
    path: "/disaster/typhoon",
    element: <Typhoon />,
  },
  {
    path: "/disaster/forestFire",
    element: <ForestFire />,
  },
];

export { jyUserRoutes, disasterModal };
