import { lazy } from 'react';

export const AdminFAQList = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQList"));
export const AdminFAQAdd = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQAdd"));
export const AdminFAQDetail = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQDetail"));

export const bjAdminRoutes = [

    // 고객센터관리 - FAQ관리(리스트)
    {
        path: "/admin/service/FAQList",
        element: <AdminFAQList />,
        nowPage: "FAQ관리리스트",
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
        nowpage: "FAQ관리상세",

    },
];