// src/layouts/admin/AdminHeader.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { ADMIN_MENU_DATA } from '@/components/admin/AdminSideMenuData';

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
    { key: 'system', name: '시스템 관리', path: '/admin/system/commonCodeList' },
    { key: 'customer', name: '고객지원 관리', path: '/admin/customer/FAQList'},
  ]; 

  return (
    <div className="flex items-center h-full w-full">
      <nav className="flex items-center h-full">
        {navItems.map((item) => {
          const subMenuCategories = ADMIN_MENU_DATA[item.key] || [];
          const hasSub = subMenuCategories.length > 0;

          return (
            /* [중요] relative 속성을 부모 컨테이너에 줌으로써 드롭다운 너비의 기준점 설정 */
            <div key={item.key} className="relative group h-full flex items-center">
              {/* [대메뉴] 너비를 넓히기 위해 px-8 적용 및 min-w 설정 */}
              <button
                onClick={() => navigate(item.path)}
                className={`h-full flex items-center justify-center gap-2 px-8 min-w-[180px] transition-all border-b-4 text-body-m-bold whitespace-nowrap relative z-20 ${
                  activeGnb === item.key
                    ? "text-admin-primary border-admin-primary bg-blue-50/50"
                    : "text-admin-text-secondary border-transparent hover:text-admin-primary hover:bg-gray-50"
                }`}
                style={{ fontSize: '17px' }}
              >
                {item.name}
                {hasSub && (
                  <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                )}
              </button>

              {/* [드롭다운] 너비를 부모(button)와 동일하게 맞춤 (w-full) */}
              {hasSub && (
                <div className="absolute top-full left-0 w-full min-w-full bg-white shadow-2xl border-x border-b border-admin-border rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-0 z-50 py-2">
                  {/* 상단 포인트 디자인 (Active 바와 연결되는 느낌) */}
                  <div className="h-0.5 bg-admin-primary/10 w-full absolute top-0 left-0" />
                  
                  {subMenuCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="flex flex-col">
                      {cat.items.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => navigate(subItem.path)}
                          className={`w-full text-center px-4 py-4 text-body-m transition-colors ${
                            pathname === subItem.path
                              ? "bg-blue-50 text-admin-primary font-bold border-r-4 border-admin-primary"
                              : "text-graygray-70 hover:bg-gray-50 hover:text-admin-primary"
                          }`}
                          style={{ fontSize: '17px' }}
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 우측 유틸리티 영역 */}
      <div className="ml-auto flex items-center pr-10">
        <button 
          onClick={() => navigate("/")}
          className="text-body-m-bold text-graygray-60 hover:text-secondary-50 transition-all px-6 py-2.5 border-2 border-graygray-30 rounded-xl flex items-center gap-2 shadow-sm"
          style={{ fontSize: '17px' }}
        >
          <span>사용자 페이지</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;