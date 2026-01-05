import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserOpenSpaceSideBar = () => {
  const location = useLocation();
  const path = location.pathname;

  // 활성화 여부 판단 로직
  const isNotice = path.includes('userOpenSpaceLi') || path.includes('userNoticeDetail');
  const isPress = path.includes('userPressLi') || path.includes('userPressRelDetail');
  const isSafety = path.includes('userSafetyEdu');

  // 스타일 정의 (참고 사진 기준)
  const activeStyle = "border-b-[3px] border-[#1e3a8a] bg-white"; // 두꺼운 하단 선 + 흰색 배경
  const activeTextStyle = "font-bold text-[#1e3a8a] text-[17px]"; // 파란색 볼드 텍스트
  
  const inactiveStyle = "border-b border-gray-200 bg-white hover:bg-gray-50"; // 기본 선 + 연한 호버 효과
  const inactiveTextStyle = "text-gray-600 text-[17px]"; // 기본 회색 텍스트

  return (
    <nav className="flex flex-col w-full lg:w-[296px] items-start lg:border-r border-gray-300 min-h-[600px]" aria-label="열린마당 사이드바">
      <div className="flex flex-col items-start w-full">
        
        {/* 사이드바 헤더: 열린마당 */}
        <div className="flex w-full px-4 py-6 lg:py-10 border-b border-gray-300 items-center">
          <h2 className="text-xl font-bold text-gray-900">
            열린마당
          </h2>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex flex-col w-full items-start">
          
          {/* 공지사항 */}
          <Link 
            to="/userOpenSpaceLi" 
            className={`flex h-16 w-full items-center px-4 transition-all ${isNotice ? activeStyle : inactiveStyle}`}
          >
            <span className={isNotice ? activeTextStyle : inactiveTextStyle}>
              공지사항
            </span>
          </Link>

          {/* 보도자료 */}
          <Link 
            to="/userPressLi" 
            className={`flex h-16 w-full items-center px-4 transition-all ${isPress ? activeStyle : inactiveStyle}`}
          >
            <span className={isPress ? activeTextStyle : inactiveTextStyle}>
              보도자료
            </span>
          </Link>

          {/* 시민안전교육 */}
          <Link 
            to="/userSafetyEdu" 
            className={`flex h-16 w-full items-center px-4 transition-all ${isSafety ? activeStyle : inactiveStyle}`}
          >
            <span className={isSafety ? activeTextStyle : inactiveTextStyle}>
              시민안전교육
            </span>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default UserOpenSpaceSideBar;