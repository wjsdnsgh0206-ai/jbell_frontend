// src/layouts/admin/AdminLayout.jsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom"; 
import AdminSideBar from './AdminSideBar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminLayout = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f4f7f9] text-admin-primary font-bold">
        잠시만 기다려주세요...
      </div>
    }>
      {/* 1. 전체 바깥 컨테이너: 사이드바와 콘텐츠 영역 분리 */}
      <div className="flex min-h-screen bg-[#f4f7f9] font-['Pretendard_GOV']">
        
        {/* 좌측 사이드바 (고정 너비) */}
        <AdminSideBar />

        {/* 2. 우측 영역 컨테이너: 헤더 + 본문 + 푸터 */}
        <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0은 내부 콘텐츠 table 깨짐 방지용 */}
          
          {/* 상단 헤더 (GNB) */}
          {/* 높이 h-16과 px-10 등 기존 디자인 시스템 유지 */}
          <header className="bg-white h-16 border-b border-gray-200 flex items-center px-10 gap-10 text-[15px] font-medium text-gray-600 sticky top-0 z-30 shadow-sm">
            <AdminHeader />
          </header>

          {/* 메인 콘텐츠 (Outlet) */}
          <main className="flex-1 overflow-y-auto">
            {/* 페이지별 여백은 Layout보다 Page 컴포넌트 내부에서 조절하는 것이 더 유연합니다 */}
            <Outlet />
          </main>

          {/* 하단 푸터 */}
          <AdminFooter /> 
        </div>
      </div>
    </Suspense>
  );
};

export default AdminLayout;