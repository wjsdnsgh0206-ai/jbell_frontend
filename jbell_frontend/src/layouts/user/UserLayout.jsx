// src/layouts/user/UserLayout.jsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom"; // Outlet 필수
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import UserSideBar from "./UserSideBar";

const UserLayout = ({ sidebarData, nowPage }) => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <div className="min-h-screen flex flex-col w-full bg-white">
        <UserHeader />
        <div className="flex-1 w-full">
          {sidebarData ? (
            <div className="flex w-full max-w-screen-xl mx-auto h-full">
              <aside className="hidden md:block shrink-0 border-r border-graygray-40">
                {/* activeItem 제거 (URL 기반 자동 활성화) */}
                <UserSideBar nowPage={nowPage} categories={sidebarData} />
              </aside>
              <main className="flex-1 w-full pl-0 md:pl-12 lg:pl-20 pb-20 px-4 md:px-0">
                <Outlet /> {/* 여기가 핵심! */}
              </main>
            </div>
          ) : (
            <main className="w-full flex-1">
              <Outlet />
            </main>
          )}
        </div>
        <UserFooter />
      </div>
    </Suspense>
  );
};

export default UserLayout;