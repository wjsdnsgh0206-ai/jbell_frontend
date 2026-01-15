// src/routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import UserLayout from "@/layouts/user/UserLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";
import DisasterModalLayout from "@/layouts/user/disasterModal/DisasterModalLayout";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

// 팀원별 라우트 파일 import (user)
import { jyUserRoutes, disasterModal } from "@/routes/route-jy";
import { shUserRoutes } from "@/routes/route-sh";
import { ehUserRoutes } from "@/routes/route-eh";
import { mjUserRoutes } from "@/routes/route-mj";
import { bjUserRoutes } from "@/routes/route-bj";
import { jhUserRoutes } from "@/routes/route-jh";

// 팀원별 라우트 파일 import (amdin)
// import { jyUserRoutes } from "@/routes/admin/route-jy";
import { shAdminRoutes } from "@/routes/admin/route-sh";
import { mjAdminRoutes } from "@/routes/admin/route-mj";
import { jhAdminRoutes } from "@/routes/admin/route-jh";
import { bjAdminRoutes } from "@/routes/admin/route-bj";
import { jyAdminRoutes } from "@/routes/admin/route-jy";


const AllRoutes = (props) => {
  // 1. 사용자 페이지 라우트 병합
  const allUserRoutes = [
    ...jyUserRoutes,
    ...shUserRoutes,
    ...ehUserRoutes,
    ...mjUserRoutes,
    ...bjUserRoutes,
    ...jhUserRoutes,
  ];
  
  // 2. 관리자 페이지 라우트 병합
  const allAdminRoutes = [
    // ...jyAdminRoutes,
    ...shAdminRoutes,
    // ...ehAdminRoutes,
    ...mjAdminRoutes,
    ...bjAdminRoutes,
    ...jhAdminRoutes,
    ...jyAdminRoutes
  ];

  /* 2. 사이드바 종류별로 라우트 필터링.
  본인 라우터(route-jh.jsx) 등에서 nowPage를 맞춰주세요.
  (참조 비교가 정확하지 않을 수 있으므로 nowPage 텍스트나 별도 키값으로 비교하는 것이 안전합니다)
  [A] 사이드바 그룹 (마이페이지, 행동요령, 대피소 소개, 고객센터, 열린마당)
  const behavioralRoutes = allUserRoutes.filter(route => route.nowPage === "행동요령");
  [C] 기타 사이드바 그룹 (예: 민주처럼 안전정보지도 등 별도 사이드바가 있다면 추가 필터링)
  const facilityRoutes = allUserRoutes.filter(route => route.nowPage === "대피소안내");
  */
 
 // [A] 행동요령 사이드바 그룹
 const behavioralRoutes = allUserRoutes.filter(
   (route) => route.nowPage === "행동요령"
  );
  
  // [A] 대피소 소개 사이드바 그룹
  const facilityRoutes = allUserRoutes.filter(
    (route) => route.nowPage === "대피소 소개"
  );
  
  // [A] 고객센터 사이드바 그룹
  const customerServiceRoutes = allUserRoutes.filter(
    (route) => route.nowPage === "고객센터"
  );
  
  // [A] 열린마당 사이드바 그룹
  const communityRoutes = allUserRoutes.filter(
    (route) => route.nowPage === "열린마당"
  );
  
  // [A] 마이페이지 사이드바 그룹
  const myPageRoutes = allUserRoutes.filter(
    (route) => route.nowPage === "마이페이지"
  );
  
  // [A] 주요 안전정책 사이드바 그룹
  const mainSafetyPoliciesPageRoutes = allUserRoutes.filter(
    (route) => route.nowPage === "주요 안전정책"
  );
  // [B] 사이드바 없는 그룹 (메인페이지, 로그인)
  const noSidebarRoutes = allUserRoutes.filter((route) => !route.sidebarData);

  return (
    <Routes>
      {/* --------------------------------------------------------- */}
      {/* 관리자 레이아웃 그룹 (URL 기반 연동) */}
      {/* --------------------------------------------------------- */}
      <Route element={<AdminLayout />}>
        {allAdminRoutes.map((route, idx) => (
          <Route
            key={`admin-route-${idx}`}
            path={route.path} // 예: /admin/system/commonCodeList
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 1. 행동요령 레이아웃 그룹 (UserLayout이 한 번만 마운트됨) */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.BEHAVIORALGUIDE}
            nowPage="행동요령"
            {...props}
          />
        }
      >
        {behavioralRoutes.map((route, idx) => (
          <Route
            key={`behavioral-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      myPageRoutes
      {/* --------------------------------------------------------- */}
      {/* 2. 마이페이지 레이아웃 그룹 */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.MY_PAGE}
            nowPage="마이페이지"
            {...props}
          />
        }
      >
        {myPageRoutes.map((route, idx) => (
          <Route
            key={`mypage-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 대피소 소개 레이아웃 그룹 (UserLayout이 한 번만 마운트됨) */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.FACILITY}
            nowPage="대피소 소개"
            {...props}
          />
        }
      >
        {facilityRoutes.map((route, idx) => (
          <Route
            key={`facility-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 주요 안전정책 레이아웃 그룹 (UserLayout이 한 번만 마운트됨) */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.MAIN_SAFETY_POLICIES}
            nowPage="주요 안전정책"
            {...props}
          />
        }
      >
        {mainSafetyPoliciesPageRoutes.map((route, idx) => (
          <Route
            key={`mainSafetyPolicies-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 열린마당 레이아웃 그룹 (UserLayout이 한 번만 마운트됨) */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.COMMUNITY}
            nowPage="열린마당"
            {...props}
          />
        }
      >
        {communityRoutes.map((route, idx) => (
          <Route
            key={`community-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 고객센터 레이아웃 그룹 (UserLayout이 한 번만 마운트됨) */}
      {/* --------------------------------------------------------- */}
      <Route
        element={
          <UserLayout
            sidebarData={SIDE_MENU_DATA.CUSTOMERSERVICE}
            nowPage="고객센터"
            {...props}
          />
        }
      >
        {customerServiceRoutes.map((route, idx) => (
          <Route
            key={`customerService-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 3. 사이드바 없는 레이아웃 그룹 (메인, 로그인) */}
      {/* --------------------------------------------------------- */}
      <Route element={<UserLayout sidebarData={null} {...props} />}>
        {noSidebarRoutes.map((route, idx) => (
          <Route
            key={`none-${idx}`}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
      {/* --------------------------------------------------------- */}
      {/* 4. 특수 레이아웃 (모달 등) */}
      {/* --------------------------------------------------------- */}
      {disasterModal.map((route, idx) => (
        <Route key={`modal-${idx}`} path={route.path} element={route.element}>
          {route.children.map((child, cidx) => (
            <Route
              key={`modal-child-${cidx}`}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
    </Routes>



  );
};

export default AllRoutes;

/** 각 페이지 라우터 연결 규칙
* 각자 파일(route-jh.jsx)만 수정: Routes.jsx는 건드리지 않는다.
* SideMenuData.js에 각자 title과 items 배열에 이름과 경로 지정
  title: '자연재난행동요령', 
  items: [
        { name: '지진', path: '/earthquakeActionGuide' },
        { name: '지진', path: '/earthquakeActionGuide' },
         ...
  ]
* sidebarData와 nowPage 필수: 페이지를 추가할 때, 어떤 사이드바 그룹에 속하는지 명확히 하기 위해 nowPage 값을 통일한다.
* 행동요령 페이지: nowPage: "행동요령", sidebarData: SIDE_MENU_DATA.BEHAVIORALGUIDE
* 마이페이지: nowPage: "마이페이지", sidebarData: SIDE_MENU_DATA.MY_PAGE
* 일반 페이지: sidebarData: null (또는 생략)
* activeItem 삭제: UserSideBar 리팩토링으로 인해 URL 기반으로 자동 활성화되므로, 라우트 파일에서 activeItem 속성은 더 이상 적지 않아도 된다.
*/

// Routes.jsx (추후 통합 리팩토링 버전)
// import { Routes, Route } from "react-router-dom";
// import UserLayout from "@/layouts/user/UserLayout";
// import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";

// // 페이지 컴포넌트 Lazy Import
// const EarthquakeActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/earthquake/EarthquakeActionGuide"));
// const TyphoonActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/typhoon/TyphoonActionGuide"));
// const FloodActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/flood/FloodActionGuide"));
// const HeavyRainActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/heavyRain/HeavyRainActionGuide"));
// const LandslideActionGuide = lazy(() => import("@/pages/user/behavioralGuide/natural/landslide/LandslideActionGuide"));
// const TrafficAccidentActionGuide = lazy(() => import("@/pages/user/behavioralGuide/social/trafficAccident/TrafficAccidentActionGuide"));

// // Mypage 관련 페이지
// const MyInquiryList = lazy(() => import("@/pages/user/mypage/MyInquiryList"));
// const MyProfile = lazy(() => import("@/pages/user/mypage/MyProfile"));

// // Login 관련 페이지
// const LoginMain = lazy(() => import("@/pages/user/login/LoginMain"));

// const AllRoutes = (props) => {
//   return (
//     <Routes>

//       {/* 1. 행동요령 그룹 (Sidebar: BEHAVIORALGUIDE) */}
//       {/* 이 Route 안에 있는 모든 자식은 UserLayout(행동요령 버전)을 타고 보여집니다 */}
//       <Route element={<UserLayout sidebarData={SIDE_MENU_DATA.BEHAVIORALGUIDE} nowPage="행동요령" />}>
//         <Route path="/earthquakeActionGuide" element={<EarthquakeActionGuide />} />
//         <Route path="/typhoonActionGuide" element={<TyphoonActionGuide />} />
//         <Route path="/floodActionGuide" element={<FloodActionGuide />} />
//         <Route path="/heavyRainActionGuide" element={<HeavyRainActionGuide />} />
//         <Route path="/landslideActionGuide" element={<LandslideActionGuide />} />
//         <Route path="/trafficAccidentActionGuide" element={<TrafficAccidentActionGuide />} />
//       </Route>

//       {/* 2. 마이페이지 그룹 (Sidebar: MY_PAGE) */}
//       <Route element={<UserLayout sidebarData={SIDE_MENU_DATA.MY_PAGE} nowPage="마이페이지" />}>
//         <Route path="/myProfile" element={<MyProfile />} />
//         <Route path="/myInquiryList" element={<MyInquiryList />} />
//         {/* ... 기타 마이페이지 라우트 */}
//       </Route>

//       {/* 3. 사이드바 없는 일반 페이지 그룹 */}
//       <Route element={<UserLayout sidebarData={null} />}>
//         <Route path="/" element={<MainPage />} />
//         <Route path="/loginMain" element={<LoginMain />} />
//       </Route>

//     </Routes>
//   );
// };

// export default AllRoutes;
 