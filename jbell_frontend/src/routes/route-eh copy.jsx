import { lazy } from "react";
import { SIDE_MENU_DATA } from "@/components/user/sideBar/SideMenuData";


// Login 관련 페이지
const FindIdCheck = lazy(() => import("@/pages/user/login/FindIdCheck"));
const FindPwCheck = lazy(() => import("@/pages/user/login/FindPwCheck"));
const IdPwLogin = lazy(() => import("@/pages/user/login/IdPwLogin"));
const LoginMain = lazy(() => import("@/pages/user/login/LoginMain"));

// Mypage 관련 페이지
const EditProfile = lazy(() => import("@/pages/user/mypage/EditProfile"));
const EditProfileCheck = lazy(() => import("@/pages/user/mypage/EditProfileCheck"));
const MyInquiryList = lazy(() => import("@/pages/user/mypage/MyInquiryList"));
const MyProfile = lazy(() => import("@/pages/user/mypage/MyProfile"));
const WithdrawalModal = lazy(() => import("@/pages/user/mypage/WithdrawalModal"));

// Signup 관련 페이지
const SignupAgreement = lazy(() => import("@/pages/user/signup/SignupAgreement"));
const SignupForm = lazy(() => import("@/pages/user/signup/SignupForm"));
const SignupSuccess = lazy(() => import("@/pages/user/signup/SignupSuccess"));





// ------ 라우트 페이지 경로 입력 파일 ------ //
// Routes.jsx에서 이 파일을 불러와서 Route를 생성함.
// 실제 페이지 라우트 정의 (기능용)
// route-jy.jsx 파일은 최지영 파일임. 각자 자기꺼 페이지 라우트 파일 만들어서 사용 할 것. 

/*
 * ✔ 작성 규칙
 * 1️⃣ 페이지 컴포넌트는 반드시 lazy()로 import 할 것
 *    → 초기 로딩 속도 최적화 목적
 *
 * 2️⃣ path 규칙
 *    - index: true  → "/" 첫 진입 페이지
 *    - path는 소문자 + 카멜케이스
 *    - 앞에 "/" 붙이지 않음 (부모 Route가 "/"임)
 *
 * 3️⃣ 페이지 추가 방법
 *    ① pages 폴더에 페이지 컴포넌트 생성 (모달의 경우 레이아웃은 layouts, 컨텐츠는 components 폴더에 생성.)
 *    ② lazy import 하기
 *    ③ 아래 jyUserRoutes 배열에 객체 하나 추가
 *
 */
export const ehUserRoutes = [
// Login 관련 경로
  { path: "/loginMain", element: <LoginMain /> },
  { path: "/IdPwLogin", element: <IdPwLogin /> },
  { path: "/findIdCheck", element: <FindIdCheck /> },
  { path: "/findPwCheck", element: <FindPwCheck /> },

  // Mypage 관련 경로
  { path: "/myProfile", element: <MyProfile />,
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "내 정보" },
  { path: "/editProfileCheck", 
    element: <EditProfileCheck /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "내 정보 수정" },
  { path: "/editProfile", 
    element: <EditProfile />,  
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "내 정보 수정"},
  { path: "/myInquiryList", 
    element: <MyInquiryList /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "내 문의 내역"},
  { path: "/withdrawal", 
    element: <WithdrawalModal /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
    activeItem: "회원 탈퇴"},

  // Signup 관련 경로
  { path: "/signupAgreement", element: <SignupAgreement /> },
  { path: "/signupForm", element: <SignupForm /> },
  { path: "/signupSuccess", element: <SignupSuccess /> },

  // // sidebar
  // { path: "/UserSideBar", element: <UserSideBar /> }
];
