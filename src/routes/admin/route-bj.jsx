import { lazy } from 'react';

// ⭐ ========================
// 코드 수정 20260122 오전 11:40
// 주요 수정 사항 : lazy로 파일 import하는 코드에 export 제거. 
// 제거 이유 : 컴포넌트와 데이터가 섞여서 함께 export되어 경고 메시지가 뜸. 이를 해결하기 위해 데이터만 export하는 방식으로 수정. 
// ========================

const AdminFAQList = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQList"));
const AdminFAQAdd = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQAdd"));
const AdminFAQDetail = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQDetail"));

const AdminQnAList = lazy(() => import("@/pages/admin/customerservice/qna/AdminQnAList"));
const AdminQnADetail = lazy(() => import("@/pages/admin/customerservice/qna/AdminQnADetail"));

export const bjAdminRoutes = [

    // 고객센터관리 - FAQ관리(리스트)
    {
        path: "/admin/contents/FAQList",
        element: <AdminFAQList />,
        nowPage: "FAQ관리목록",
    },

    // 고객센터관리 - FAQ관리(등록)
    {
        path: "/admin/contents/FAQAdd",
        element: <AdminFAQAdd />,
        nowPage: "FAQ관리등록",

    },

    //고객센터관리 - FAQ관리(상세)
    {
        path: "/admin/contents/FAQDetail/:id",
        element: <AdminFAQDetail/>,
        nowPage: "FAQ관리상세",

    },

    //고객센터관리 - QnA관리(리스트)
    {
        path: "/admin/contents/QnAList",
        element: <AdminQnAList />,
        nowPage: "QnA관리목록",

    },

    //고객센터관리 - QnA관리(상세)
    {
        path: "/admin/contents/QnADetail/:id",
        element: <AdminQnADetail />,
        nowPage: "QnA관리상세",
    }
];