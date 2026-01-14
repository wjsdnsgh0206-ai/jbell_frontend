// src/layouts/admin/AdminLayout.jsx
import React, { useState, Suspense } from "react";
import { Outlet } from "react-router-dom"; 
import AdminSideBar from './AdminSideBar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminBreadCrumb from '@/components/admin/AdminBreadCrumb'

/**
 * [공통] 관리자 레이아웃 (AdminLayout)
 * - 관리자 페이지의 기본 골격(Sidebar, Header, Footer, Content)을 정의합니다.
 * - React Router의 <Outlet>을 통해 하위 페이지를 렌더링합니다.
 * - 하위 페이지(특히 상세 페이지)에서 브레드크럼 타이틀을 동적으로 변경할 수 있도록 Context를 제공합니다.
 */
const AdminLayout = () => {
  // 1. 브레드크럼 타이틀 상태 관리
  // 하위 페이지에서 이 state를 변경하면(setBreadcrumbTitle), 상단 AdminBreadCrumb에 반영됩니다.
  const [breadcrumbTitle, setBreadcrumbTitle] = useState("");

  return (
    // Suspense: 하위 페이지가 Lazy Loading(지연 로딩) 될 때 보여줄 로딩 UI
    <Suspense fallback={<div>로딩 중...</div>}>
      
      {/* 2. 전체 레이아웃 컨테이너: Flex Row (좌측 사이드바 | 우측 콘텐츠) */}
      <div className="flex min-h-screen bg-[#f4f7f9]">
        
        {/* [좌측] 사이드바 컴포넌트 (고정 너비) */}
        <AdminSideBar />

        {/* [우측] 메인 콘텐츠 영역 컨테이너: Flex Column (헤더 -> 본문 -> 푸터) */}
        <div className="flex-1 flex flex-col">
          
          {/* 상단 헤더 영역 */}
          <header className="bg-white h-16 border-b flex items-center px-10 gap-10 text-[15px] font-medium text-gray-600">
            <AdminHeader />
          </header>

          {/* 실제 페이지 콘텐츠가 들어가는 영역 (Y축 스크롤 처리됨) */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-10">
              {/* [공통] 브레드크럼 컴포넌트 */}
              {/* customTitle props로 현재 state 값을 전달하여 화면에 표시 */}
              <AdminBreadCrumb customTitle={breadcrumbTitle} />
              
              {/* [핵심] Outlet (하위 페이지 렌더링 위치) */}
              {/* context prop을 통해 setBreadcrumbTitle 함수를 하위 페이지로 전달합니다. */}
              {/* ★사용법: 하위 페이지에서 const { setBreadcrumbTitle } = useOutletContext(); 로 꺼내서 사용 */}
              <Outlet context={{ setBreadcrumbTitle }} />
            </div>
          </main>

          {/* 하단 푸터 영역 */}
          <AdminFooter/> 
        </div>
      </div>
    </Suspense>
  );
};

export default AdminLayout;