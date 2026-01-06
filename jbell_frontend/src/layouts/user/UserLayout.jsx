import { Suspense } from "react";
import { Outlet } from "react-router-dom"; 
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import UserSideBar from "./UserSideBar";

/*
  UserLayout 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 모든 페이지에서 사용되는 기본 layout
  > 컴포넌트 설명 : header와 footer, sideBar 컴포넌트를 불러와서 사용 할 수 있는 기본 페이지 layout.
*/

const UserLayout = ({ sidebarData, nowPage }) => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <div className="min-h-screen flex flex-col w-full bg-white">
        {/* header */}
        <UserHeader />
        <div className="flex-1 w-full">
          {sidebarData ? (
            <div className="flex w-full max-w-screen-xl mx-auto h-full">
              <aside className="hidden md:block shrink-0 border-r border-graygray-40">
                <UserSideBar nowPage={nowPage} categories={sidebarData} />
              </aside>
              <main className="flex-1 w-full pl-0 md:pl-12 lg:pl-20 pb-20 px-4 md:px-0">
                <Outlet />
              </main>
            </div>
          ) : (
            <main className="w-full flex-1">
              <Outlet />
            </main>
          )}
        </div>
        {/* footer */}
        <UserFooter />
      </div>
    </Suspense>
  );
};

export default UserLayout;