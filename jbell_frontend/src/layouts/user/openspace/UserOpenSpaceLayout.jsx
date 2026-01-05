import React from 'react';
import UserOpenSpaceSideBar from './UserOpenSpaceSideBar'; 

const UserOpenSpaceLayout = ({ children }) => {
  return (
    // 사진의 max-w와 gap 설정을 그대로 적용
    <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto items-start justify-center gap-8 lg:gap-20 px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 왼쪽 사이드바 */}
      <UserOpenSpaceSideBar />

      {/* 오른쪽 본문 내용 */}
      <main className="flex-1 w-full text-left pt-2">
        {children}
      </main>
      
    </div>
  );
};

export default UserOpenSpaceLayout;