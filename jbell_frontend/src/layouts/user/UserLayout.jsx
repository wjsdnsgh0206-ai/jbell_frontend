import { Suspense } from "react";
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import UserSideBar from "./UserSideBar"; // 경로 확인 필요

/**
 * @param children - 페이지 본문 컨텐츠
 * @param sidebarData - 사이드바 메뉴 구조 데이터
 * @param nowPage - 사이드바 최상단 대제목
 * @param activeItem - 현재 활성화된 메뉴 이름
 */
const UserLayout = ({
  children,
  sidebarData = null,
  nowPage = "페이지",
  activeItem = ""
}) => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center text-body-m text-graygray-50">
        로딩 중...
      </div>
    }>
      {/* 전체 레이아웃: flex-col, min-h-screen으로 푸터 하단 고정 */}
      <div className="min-h-screen flex flex-col w-full relative bg-white text-graygray-90">

        {/* 공통 헤더 */}
        <UserHeader />

        {/* 메인 컨텐츠 영역 (flex-1로 남은 높이 차지) */}
        <div className="flex-1 w-full">
          {sidebarData ? (
            /* 사이드바가 있는 레이아웃 */
            <div className="flex w-full max-w-screen-xl mx-auto h-full">
              
              {/* 왼쪽 사이드바 영역 
                  - hidden md:block: 모바일 숨김, 태블릿 이상 노출
                  - shrink-0: 너비 축소 방지
                  - UserSideBar 컴포넌트 내부에서 너비(lg:w-[240px])를 처리하므로 여기선 제거
              */}
              <aside className="hidden md:block shrink-0 border-r">
                <UserSideBar 
                  nowPage={nowPage} 
                  activeItem={activeItem} 
                  categories={sidebarData} 
                />
              </aside>

              {/* 오른쪽 본문 컨텐츠 영역 
                  - pl-0 md:pl-12 lg:pl-20: 사이드바와의 간격 조정
                  - overflow-hidden: 내부 컨텐츠 넘침 방지
              */}
              <main className="flex-1 w-full pl-0 md:pl-12 lg:pl-20 py-10 px-4 md:px-0">
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