import { lazy } from "react";

const UserNoticeDetail = lazy(() => import("@/pages/user/UserNoticeDetail"));



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
export const shUserRoutes = [
  
  {
    path: "/noticeDetail",
    element: <UserNoticeDetail />,
  },
,
];
