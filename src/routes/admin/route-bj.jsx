import { lazy } from 'react';

export const AdminFAQList = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQList"));
export const AdminFAQAdd = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQAdd"));
export const AdminFAQDetail = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQDetail"));

export const AdminQnAList = lazy(() => import("@/pages/admin/customerservice/qna/AdminQnAList"));
export const AdminQnADetail = lazy(() => import("@/pages/admin/customerservice/qna/AdminQnADetail"));

export const bjAdminRoutes = [

    // 고객센터관리 - FAQ관리(리스트)
    {
        path: "/admin/service/FAQList",
        element: <AdminFAQList />,
        nowPage: "FAQ관리목록",
    },

    // 고객센터관리 - FAQ관리(등록)
    {
        path: "/admin/service/FAQAdd",
        element: <AdminFAQAdd />,
        nowPage: "FAQ관리등록",

    },

    //고객센터관리 - FAQ관리(상세)
    {
        path: "/admin/service/FAQDetail",
        element: <AdminFAQDetail/>,
        nowPage: "FAQ관리상세",

    },

    //고객센터관리 - QnA관리(리스트)
    {
        path: "/admin/service/QnAList",
        element: <AdminQnAList />,
        nowPage: "QnA관리목록",

    },

    //고객센터관리 - QnA관리(상세)
    {
        path: "/admin/service/QnADetail/:id",
        element: <AdminQnADetail />,
        nowPage: "QnA관리상세",
    }
];