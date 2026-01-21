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
    { key: 'contents', name: '콘텐츠 관리', path: '/admin/contents/behavioralGuideList' },
    { key: 'facility', name: '시설 관리', path: '/admin/facility/facilityList' },
    { key: 'member', name: '회원 관리', path: '/admin/member/adminMemberList' },
    { key: 'system', name: '시스템 관리', path: '/admin/system/commonCodeList' },
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
                  <div className="h-0.5 bg-admin-primary/10 w-full absolute top-0 left-0" />
                  
                  <div className="flex flex-col">
                    {/* 이제 items가 아닌 subMenuCategories(title 그룹)를 직접 나열합니다 */}
                    {subMenuCategories.map((cat) => {
                      // 현재 페이지가 이 카테고리에 속하는지 확인 (상세 메뉴 경로 포함 여부)
                      const isCurrentCategory = cat.items.some(sub => sub.path === pathname) || pathname === cat.path;

                      return (
                        <button
                          key={cat.title}
                          disabled={!cat.isAvailable}
                          onClick={() => navigate(cat.path)}
                          className={`w-full text-center px-4 py-4 text-body-m transition-colors ${
                            isCurrentCategory
                              ? "bg-blue-50 text-admin-primary font-bold border-r-4 border-admin-primary"
                              : cat.isAvailable 
                                ? "text-graygray-70 hover:bg-gray-50 hover:text-admin-primary"
                                : "text-gray-300 cursor-not-allowed" // 비활성화 상태
                          }`}
                          style={{ fontSize: '17px' }}
                        >
                          {cat.title}
                        </button>
                      );
                    })}
                  </div>
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


            // <button onClick={() => navigate("/admin/content/adminBoardList")}>공지사항</button>
export default AdminHeader;



// import { useNavigate, useLocation } from 'react-router-dom';

// const AdminHeader = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 현재 경로와 메뉴의 경로가 일치하는지 확인하는 함수
//   const isActive = (path) => location.pathname === path;

//   // 공통 스타일 클래스
//   const baseStyle = "cursor-pointer px-2 h-full flex items-center";
//   const activeStyle = "text-blue-600 border-b-2 border-blue-600";
//   const inactiveStyle = "hover:text-blue-600 text-gray-700";

//   return (
//     <>
//       <span 
//         className={`${baseStyle} ${isActive("/admin/realtime") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/realtime")}
//       >
//         실시간 정보 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/content/adminBoardList") ? activeStyle : inactiveStyle}`} 
//         onClick={() => navigate("/admin/content/adminBoardList")}
//       >
//         콘텐츠 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/safety") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/safety")}
//       >
//         안전정보 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/member") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/member")}
//       >
//         회원 관리
//       </span>

//       <span 
//         className={`${baseStyle} ${isActive("/admin/system") ? activeStyle : inactiveStyle}`}
//         onClick={() => navigate("/admin/system")}
//       >
//         시스템 관리
//       </span>
//     </>
//   );
// };

// export default AdminHeader;