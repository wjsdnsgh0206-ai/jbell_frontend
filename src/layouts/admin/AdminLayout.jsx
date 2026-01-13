// src/layouts/admin/AdminLayout.jsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom"; 
import AdminSideBar from './AdminSideBar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import BreadCrumb from '@/components/Admin/AdminBreadCrumb'

const AdminLayout = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      {/* 1. 전체 바깥 컨테이너: 사이드바와 (헤더+콘텐츠)를 가로로 배치 */}
      <div className="flex min-h-screen bg-[#f4f7f9]">
        
        {/* 좌측 사이드바 (고정 너비) */}
        <AdminSideBar />

        {/* 2. 우측 영역 컨테이너: 헤더와 콘텐츠를 세로로 배치 */}
        <div className="flex-1 flex flex-col">
          
          {/* 상단 헤더 */}
          <header className="bg-white h-16 border-b flex items-center px-10 gap-10 text-[15px] font-medium text-gray-600">
            <AdminHeader />
          </header>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-10">
              <BreadCrumb /> 
              
              {/* 실제 페이지 컴포넌트 (예: AdminCommonCodeList) */}
              <Outlet />
            </div>
          </main>

          <AdminFooter/> 
        </div>
      </div>
    </Suspense>
  );
};

export default AdminLayout;