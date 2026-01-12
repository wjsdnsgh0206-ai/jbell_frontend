import { lazy } from 'react';

export const AdminFAQList = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQList"));
export const AdminFAQAdd = lazy(() => import("@/pages/admin/customerservice/faq/AdminFAQAdd"));

export const bjAdminRoutes = [

    // 고객센터관리 - FAQ관리(리스트)
    {
        path: "/admin/adminFAQList",
        element: <AdminFAQList />,
        nowPage: "FAQ관리리스트",
    },

    // 고객센터관리 - FAQ관리(등록/수정)
    {
        path: "/admin/adminFAQAdd",
        element: <AdminFAQAdd />,
        nowPage: "FAQ관리등록",

    },
];