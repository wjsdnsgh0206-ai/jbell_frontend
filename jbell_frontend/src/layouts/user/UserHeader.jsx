import { Link, useNavigate } from "react-router-dom";
import navigationItems from '@/routes/user/navigationItems';
import { useState, useEffect } from "react";

const UserHeader = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(status);
  }, []);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      navigate('/');
      window.location.reload();
    }
  };

  const authButtons = isLoggedIn 
    ? [
        { label: "마이페이지", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20.svg", lnk: "/myProfile" },
        { label: "로그아웃", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-1.svg", action: handleLogout },
      ]
    : [
        { label: "로그인", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20.svg", lnk: "/loginMain" },
        { label: "회원가입", icon: "https://c.animaapp.com/PZUA6SpP/img/icon20-1.svg", lnk: "/signupAgreement" },
      ];

  return (
    <div className="flex flex-col w-full font-body-body-l-700 items-center relative z-50">
      <div className="flex flex-col items-center relative w-full bg-white">
        {/* 최상단 띠 정보창 - lg 기준으로 높이 조절 */}
        <div className="flex flex-col items-center relative w-full bg-secondarysecondary-5 h-2 lg:h-5" />

        <header className="flex w-full max-w-[1280px] items-center justify-between py-4 px-4 sm:px-6 lg:px-8 relative bg-transparent">
          {/* 로고 */}
          <div className="flex items-center relative">
            <Link to="/#">
              <img
                className="relative w-[140px] sm:w-[160px] lg:w-[199px] h-auto cursor-pointer"
                alt="전북안전누리 로고"
                src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
              />
            </Link>
          </div>

          {/* 1. 데스크탑 인증 버튼 - lg 이상에서만 표시 */}
          <div className="hidden lg:flex items-center justify-end gap-2">
            {authButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => button.action ? button.action() : navigate(button.lnk)}
                className="inline-flex justify-center gap-2 px-3 py-2 rounded-md items-center hover:bg-gray-50 transition-colors"
                aria-label={button.label}
              >
                <img className="relative w-4 h-4 lg:w-5 lg:h-5" alt="" src={button.icon} />
                <span className="font-bold text-graygray-90 text-sm lg:text-[17px] whitespace-nowrap">
                  {button.label}
                </span>
              </button>
            ))}
          </div>

          {/* 2. 모바일 햄버거 버튼 - lg 미만에서 표시 */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* 3. 데스크탑 네비게이션 - lg 이상에서만 표시 */}
        <nav
          className="hidden lg:flex h-16 w-full bg-white border-t border-b border-graygray-30 items-center justify-center relative"
          aria-label="Secondary navigation"
        >
          <div className="flex w-full max-w-[1280px] h-full items-center gap-4 px-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => navigate(item.path)}
                className="inline-flex gap-2 px-4 h-full items-center relative whitespace-nowrap group"
              >
                <span className="font-bold text-graygray-70 text-[19px] group-hover:text-secondary-50 transition-colors">
                  {item.label}
                </span>
                <img className="relative w-4 h-4 lg:w-5 lg:h-5 opacity-70" alt="" src={item.icon} />
              </button>
            ))}
          </div>
        </nav>

        {/* 4. 모바일 통합 메뉴 - lg 미만에서만 표시 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-white border-b border-gray-200 shadow-xl absolute top-full left-0 transition-all duration-300 ease-in-out">
            <div className="flex flex-col p-4 space-y-4">
              <div className="flex gap-2 pb-4 border-b border-gray-100">
                {authButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      button.action ? button.action() : navigate(button.lnk);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 active:bg-gray-200 border border-gray-100"
                  >
                    <img className="w-5 h-5" alt="" src={button.icon} />
                    <span className="font-bold text-graygray-90 text-sm">
                      {button.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-col space-y-1">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-4 hover:bg-blue-50 active:bg-blue-50 rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <img className="w-6 h-6" alt="" src={item.icon} />
                      <span className="font-bold text-graygray-70 text-lg">
                        {item.label}
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;