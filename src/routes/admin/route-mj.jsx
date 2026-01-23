import { lazy } from "react";
import AdminMemberEdit from "../../pages/admin/member/AdminMemberEdit";
import AdminMemberDetail from "../../pages/admin/member/AdminMemberDetail";
import AdminBoardManagement from "../../pages/admin/board/AdminBoardManagement";

// ⭐ ========================
// 코드 수정 20260122 오전 11:40
// 주요 수정 사항 : lazy로 파일 import하는 코드에 export 제거. 
// 제거 이유 : 컴포넌트와 데이터가 섞여서 함께 export되어 경고 메시지가 뜸. 이를 해결하기 위해 데이터만 export하는 방식으로 수정. 
// ========================

const AdminBoardList = lazy(() => import("@/pages/admin/board/AdminBoardList"));
const AdminBoardDetail = lazy(() => import("@/pages/admin/board/AdminBoardDetail"));
const AdminLogList = lazy(() => import("@/pages/admin/board/AdminLogList"));
const AdminMemberList = lazy(() => import("@/pages/admin/member/AdminMemberList"));
const AdminMemberRegister = lazy(() => import("@/pages/admin/member/AdminMemberRegister"));

// ------ 라우트 페이지 경로 입력 파일 ------ //
// Routes.jsx에서 이 파일을 불러와서 Route를 생성함.
// 실제 페이지 라우트 정의 (기능용)
// route-jy.jsx 파일은 최지영 파일임. 각자 자기꺼 페이지 라우트 파일 만들어서 사용 할 것. 

/* const UserPageMain = lazy(() => import("@/pages/user/UserPageMain"));
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
const mjAdminRoutes = [
      {
            path: "/admin/contents/adminBoardList", 
            element: <AdminBoardList />,
            nowPage: "공지사항",
      },
      {
            path: "/admin/contents/adminBoardDetail/:boardId", 
            element: <AdminBoardDetail />,
            nowPage: "공지사항 상세보기",
      },
      {
            path: "/admin/contents/adminBoardRegister", 
            element: <AdminBoardManagement />,
            nowPage: "공지사항 등록",
      },
      {
            path: "/admin/contents/adminBoardEdit/:boardId", 
            element: <AdminBoardManagement />,
            nowPage: "공지사항 수정",
      },
      {
            path: "/admin/system/adminLogList", 
            element: <AdminLogList />,
            nowPage: "로그 관리",
      },
      {
            path: "/admin/system/adminSysOpAnalysis", 
            element: <AdminSysOpAnalysis />,
            nowPage: "시스템 운영/보안 분석",
      },
      {
            path: "/admin/member/adminMemberList", 
            element: <AdminMemberList />,
            nowPage: "회원 조회",
      },
      {
            path: "/admin/member/adminMemberDetail/:memberId", 
            element: <AdminMemberDetail />,
            nowPage: "회원 상세 정보 조회",
      },
      {
            path: "/admin/member/adminMemberRegister", 
            element: <AdminMemberRegister />,
            nowPage: "회원 등록",
      },
      {
            path: "/admin/member/adminMemberEdit/:memberId", 
            element: <AdminMemberEdit />,
            nowPage: "회원 수정",
      },

];


export { mjAdminRoutes };
