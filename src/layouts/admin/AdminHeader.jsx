// src/layouts/admin/AdminHeader.jsx
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // URL 구조에서 대분류 키 추출 (예: /admin/system/... -> system)
  const activeGnb = pathname.split('/')[2] || 'system';

  const navItems = [
    { key: 'realtime', name: '실시간 정보 관리', path: '/admin/realtime/realtimeDashboard' },
    { key: 'content', name: '콘텐츠 관리', path: '/admin/content/contentList' },
    { key: 'safetyMap', name: '안전정보지도 관리', path: '/admin/safetyMap/safetyMapList' },
    { key: 'user', name: '회원 관리', path: '/admin/user/userList' },
    { key: 'menu', name: '메뉴 관리', path: '/admin/menu/menuList' },
    { key: 'auth', name: '권한 관리', path: '/admin/author/authorList' },
    { key: 'system', name: '공통코드 관리', path: '/admin/system/commonCodeList' },
  ];

  return (
    <div className="flex items-center h-full w-full gap-1">
      {navItems.map((item) => (
        <span
          key={item.key}
          onClick={() => navigate(item.path)}
          /* [리팩토링 포인트]
             1. text-body-m-bold (17px) 적용
             2. active 시 admin-primary (#1890ff) 및 가이드라인 폰트색 적용
             3. 비활성 시 admin-text-secondary 적용
          */
          className={`cursor-pointer h-full flex items-center px-4 transition-all border-b-4 text-body-m-bold whitespace-nowrap ${
            activeGnb === item.key
              ? "text-admin-primary border-admin-primary bg-blue-50/50"
              : "text-admin-text-secondary border-transparent hover:text-admin-primary hover:bg-gray-50"
          }`}
        >
          {item.name}
        </span>
      ))}

      {/* 우측 유틸리티 영역 (사용자 페이지 이동) */}
      <div className="ml-auto flex items-center pr-6">
        <button 
          onClick={() => navigate("/")}
          className="text-body-m-bold text-graygray-60 hover:text-secondary-50 transition-colors px-5 py-2 border-2 border-graygray-30 rounded-xl flex items-center gap-2"
        >
          <span>사용자 페이지</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;