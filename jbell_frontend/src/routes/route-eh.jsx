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
  },
  { path: "/editProfileCheck", 
    element: <EditProfileCheck /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
  },
  { path: "/editProfile", 
    element: <EditProfile />,  
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
  },
  { path: "/myInquiryList", 
    element: <MyInquiryList /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
  },
  { path: "/withdrawal", 
    element: <WithdrawalModal /> , 
    sidebarData: SIDE_MENU_DATA.MY_PAGE,
    nowPage: "마이페이지",
  },

  // Signup 관련 경로
  { path: "/signupAgreement", element: <SignupAgreement /> },
  { path: "/signupForm", element: <SignupForm /> },
  { path: "/signupSuccess", element: <SignupSuccess /> },

];
