import React from 'react';

const UserHeader = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* 상단 유틸리티 라인 */}
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 py-2 text-xs text-gray-600 px-4">
        <button>Language</button>
        <button>지점</button>
        <button>글자·화면 설정</button>
        <div className="flex items-center gap-3 ml-4">
          <button className="flex items-center gap-1 font-medium text-black">
            <span>🔍</span> 통합검색
          </button>
          <button className="flex items-center gap-1">
            <span>🔑</span> 로그인
          </button>
          <button className="flex items-center gap-1">
            <span>👤</span> 회원가입
          </button>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          {/* 정부 로고 (가상) */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 via-white to-blue-500 border border-gray-200" />
            <span className="text-xl font-bold tracking-tight">대한민국정부</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-8 font-semibold text-gray-800">
          <button className="hover:text-blue-600 flex items-center gap-1">민원 <span className="text-[10px]">▼</span></button>
          <button className="hover:text-blue-600 flex items-center gap-1">서비스신청 <span className="text-[10px]">▼</span></button>
          <button className="hover:text-blue-600 flex items-center gap-1">정책정보 <span className="text-[10px]">▼</span></button>
          <button className="hover:text-blue-600 flex items-center gap-1">기관소개 <span className="text-[10px]">▼</span></button>
          <button className="hover:text-blue-600 flex items-center gap-1">고객센터 <span className="text-[10px]">▼</span></button>
        </nav>
      </div>
    </header>
  );
};

export default UserHeader;