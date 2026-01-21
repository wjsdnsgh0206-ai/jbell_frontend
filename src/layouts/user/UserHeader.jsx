import { Link, useNavigate } from "react-router-dom";
import navigationItems from '@/routes/user/navigationItems';
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, ChevronDown, User, LogOut, LogIn, UserPlus } from 'lucide-react';



const UserHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpenIndex, setMobileOpenIndex] = useState(null);

  useEffect(() => {
    // [변경] localStorage -> sessionStorage 로 변경
    // 브라우저 탭을 닫으면 데이터가 삭제되므로 상태 유지가 되지 않습니다.
    const status = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(status);
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // [변경] 삭제 시에도 sessionStorage 사용
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userName');
      setIsLoggedIn(false);
      navigate('/');
      window.location.reload();
    }
  };
  const authButtons = isLoggedIn 
    ? [
        { label: "마이페이지", icon: User, lnk: "/myProfile" },
        { label: "로그아웃", icon: LogOut, action: handleLogout },
      ]
    : [
        { label: "로그인", icon: LogIn, lnk: "/loginMain" },
        { label: "회원가입", icon: UserPlus, lnk: "/signupAgreement" },
      ];

  const toggleMobileSubMenu = (index) => {
    setMobileOpenIndex(mobileOpenIndex === index ? null : index);
  };

  return (
    <header className="flex flex-col w-full relative z-50 bg-white shadow-sm">
      
      {/* 1. 최상단 컬러 바 */}
      <div className="w-full h-2 md:h-5 bg-secondary-5" />

      {/* 2. 메인 헤더 */}
      <div className="flex w-full max-w-screen-xl mx-auto items-center justify-between py-4 px-4 sm:px-6 xl:px-8">
        <Link to="/" className="shrink-0">
          <img
            // [수정] lg -> xl로 breakpoint 변경하여 로고 크기 대응
            className="w-[140px] sm:w-[160px] xl:w-[200px] h-auto"
            alt="전북안전누리 로고"
            src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
          />
        </Link>
        
        {/* 관리자 페이지 이동(임시) */}
        <div className="text-body-l-bold text-graygray-70 hover:text-secondary-50 transition-colors px-4 py-1 border border-graygray-50 rounded-lg">
          <button onClick={() => navigate("/admin/system/commonCodeList")}>관리자 페이지</button>
        </div>

        {/* [PC] 인증 버튼 - xl(1280px) 이상에서만 표시 */}
        <div className="hidden xl:flex items-center gap-2">
          {authButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={() => button.action ? button.action() : navigate(button.lnk)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-graygray-5 transition-colors"
              >
                <Icon className="w-4 h-4 xl:w-5 xl:h-5 text-graygray-90" />
                <span className="text-body-m-bold text-graygray-90 whitespace-nowrap">
                  {button.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* [Mobile] 햄버거 버튼 - xl 미만에서 표시 */}
        <button
          className="xl:hidden p-2 text-graygray-90 hover:bg-graygray-5 rounded-md"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* 3. [PC] 네비게이션 바 - xl(1280px) 이상에서만 표시 */}
      <nav className="hidden xl:flex w-full border-t border-b border-graygray-30 bg-white">
        <div className="flex w-full max-w-screen-xl mx-auto h-16 items-center px-8 gap-8">
          {navigationItems.map((item, index) => {
            const hasSub = item.children && item.children.length > 0;
            
            return (
              <div key={index} className="relative group h-full flex items-center">
                {/* 상위 메뉴 버튼 */}
                <button
                  onClick={() => navigate(item.path)}
                  className="inline-flex items-center gap-2 h-full px-2 relative z-10"
                >
                  <span className="text-body-l-bold text-graygray-70 group-hover:text-secondary-50 transition-colors whitespace-nowrap">
                    {item.label}
                  </span>

                  {/* 화살표 아이콘 */}
                  <ChevronRight 
                    className={`w-5 h-5 text-graygray-40 group-hover:text-secondary-50 transition-transform duration-300 ${
                      hasSub ? "group-hover:rotate-90" : ""
                    }`} 
                  />
                </button>

                {/* 하위 메뉴 드롭다운 */}
                {hasSub && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-lg border border-graygray-10 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-[-10px] group-hover:translate-y-0">
                    <ul className="py-2">
                      {item.children.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(sub.path);
                            }}
                            className="block w-full text-left px-4 py-3 text-body-m text-graygray-70 hover:bg-secondary-5 hover:text-secondary-50 transition-colors"
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* 4. [Mobile] 풀스크린 메뉴 - xl 미만에서만 표시 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="absolute top-0 right-0 w-[80%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col animate-fade-in-right">
            
            <div className="flex items-center justify-between p-4 border-b border-graygray-10">
              <span className="text-title-m text-graygray-90">메뉴</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-graygray-5 rounded-full">
                <X className="w-6 h-6 text-graygray-70" />
              </button>
            </div>

            <div className="flex gap-2 p-4 bg-secondary-5">
              {authButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <button
                    key={index}
                    onClick={() => { button.action ? button.action() : navigate(button.lnk); setIsMobileMenuOpen(false); }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-white rounded-xl shadow-sm border border-graygray-10 active:scale-95 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-secondary-50" />
                    <span className="text-detail-m font-bold text-graygray-90">{button.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {navigationItems.map((item, index) => {
                const hasSub = item.children && item.children.length > 0;
                const isOpen = mobileOpenIndex === index;

                return (
                  <div key={index} className="border-b border-graygray-5 last:border-0">
                    <div className="w-full flex items-center justify-between px-6 py-4 hover:bg-graygray-5 transition-colors group">
                      <button
                        onClick={() => {
                          if (hasSub) {
                            toggleMobileSubMenu(index);
                          } else {
                            navigate(item.path);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className="flex-1 flex items-center gap-3 text-left"
                      >
                        {item.icon && <img className="w-6 h-6 opacity-60 group-hover:opacity-100" alt="" src={item.icon} />}
                        <span className={`text-body-m-bold ${isOpen ? 'text-secondary-50' : 'text-graygray-70'}`}>
                          {item.label}
                        </span>
                      </button>

                      {hasSub ? (
                        <button onClick={() => toggleMobileSubMenu(index)} className="p-1">
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-secondary-50" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-graygray-40" />
                          )}
                        </button>
                      ) : (
                         <ChevronRight className="w-5 h-5 text-graygray-40" />
                      )}
                    </div>

                    {hasSub && isOpen && (
                      <div className="bg-graygray-5 px-6 py-2 animate-fade-in">
                        {item.children.map((sub, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => {
                              navigate(sub.path);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-left py-3 px-4 text-body-m text-graygray-70 hover:text-secondary-50 border-l-2 border-transparent hover:border-secondary-50 transition-all"
                          >
                            - {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;