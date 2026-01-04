import { Suspense } from "react";
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
// 상대 경로 주의: layouts/user 폴더에서 components/user/sideBar 폴더로 접근
import UserSideBar from "./UserSideBar";

/**
 * @param children - 페이지 본문 컨텐츠
 * @param sidebarData - 사이드바 메뉴 구조 데이터 (SideMenuData.js에서 정의한 값)
 * @param nowPage - 사이드바 최상단 대제목 (예: 마이페이지)
 * @param activeItem - 현재 활성화(강조)할 메뉴 이름 (예: 내 정보)
 */
const UserLayout = ({
  children,
  sidebarData = null,
  nowPage = "페이지",
  activeItem = ""
}) => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-sans text-gray-500">로딩 중...</div>}>
      <div className="min-h-screen flex flex-col w-full relative bg-white font-sans text-slate-900">

        {/* 공통 헤더 */}
        <UserHeader />

        <div className="flex-1 w-full">
          {/* sidebarData가 존재할 때만 사이드바 레이아웃 적용 */}
          {sidebarData ? (
            <div className="flex w-full max-w-[1200px] mx-auto min-h-[calc(100vh-300px)]">

              {/* 왼쪽 사이드바 영역: 테블릿 이상(md)에서 노출 */}
              
              <aside className="hidden md:block flex-shrink-0 border-r border-gray-100">
                <UserSideBar 
                  nowPage={nowPage} 
                  activeItem={activeItem} 
                  categories={sidebarData} 
                />
              </aside>

              {/* 최지영 김정훈 병합 충돌 지점 */}
              {/* <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100 lg:mr-[80px]">                <UserSideBar
                nowPage={nowPage}
                activeItem={activeItem}
                categories={sidebarData}
              />
              </aside> */}

              {/* 오른쪽 본문 컨텐츠 영역 */}
              <main className="flex-1 bg-white overflow-hidden pl-0 md:pl-20">
                {children}
              </main>
            </div>
          ) : (
            /* 사이드바가 없는 일반 페이지 (메인, 로그인 등) */
            <main className="w-full flex-1">
              {children}
            </main>
          )}
        </div>

        {/* 공통 푸터 */}
        <UserFooter />
      </div>
    </Suspense>
  );
};

export default UserLayout;