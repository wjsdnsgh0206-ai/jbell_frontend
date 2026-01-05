import { Link, useNavigate } from "react-router-dom";
import navigationItems from '@/routes/user/navigationItems';
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, User, LogOut, LogIn, UserPlus } from 'lucide-react'; // 아이콘 라이브러리 활용

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

  // 아이콘을 컴포넌트로 관리 (이미지 URL 대신 Lucide 아이콘 사용 권장)
  const authButtons = isLoggedIn 
    ? [
        { label: "마이페이지", icon: User, lnk: "/myProfile" },
        { label: "로그아웃", icon: LogOut, action: handleLogout },
      ]
    : [
        { label: "로그인", icon: LogIn, lnk: "/loginMain" },
        { label: "회원가입", icon: UserPlus, lnk: "/signupAgreement" },
      ];

  return (
    // z-50으로 헤더를 최상위에 배치
    <header className="flex flex-col w-full relative z-50 bg-white shadow-sm">
      
      {/* 1. 최상단 컬러 바 (높이 lg 기준 5, 모바일 2) */}
      <div className="w-full h-2 lg:h-5 bg-secondary-5" />

      {/* 2. 메인 헤더 (로고 + 인증 버튼 + 햄버거) */}
      <div className="flex w-full max-w-screen-xl mx-auto items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        
        {/* 로고 */}
        <Link to="/" className="shrink-0">
          <img
            className="w-[140px] sm:w-[160px] lg:w-[200px] h-auto"
            alt="전북안전누리 로고"
            src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
          />
        </Link>

        {/* [PC] 우측 상단 인증 버튼 */}
        <div className="hidden lg:flex items-center gap-2">
          {authButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={() => button.action ? button.action() : navigate(button.lnk)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-graygray-5 transition-colors"
              >
                {/* 아이콘 크기 반응형 w-4 -> lg:w-5 */}
                <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-graygray-90" />
                <span className="text-body-m-bold text-graygray-90 whitespace-nowrap">
                  {button.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* [Mobile] 햄버거 버튼 */}
        <button
          className="lg:hidden p-2 text-graygray-90 hover:bg-graygray-5 rounded-md"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* 3. [PC] 네비게이션 바 (GNB) */}
      <nav className="hidden lg:flex w-full border-t border-b border-graygray-30 bg-white">
        <div className="flex w-full max-w-screen-xl mx-auto h-16 items-center gap-8">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group inline-flex items-center gap-2 h-full px-2 relative"
            >
              <span className="text-body-l-bold text-graygray-70 group-hover:text-secondary-50 transition-colors">
                {item.label}
              </span>
              {/* 이미지 아이콘이 있다면 유지, 없다면 제거 가능 */}
              {item.icon && (
                <img className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" alt="" src={item.icon} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* 4. [Mobile] 풀스크린 메뉴 (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* 배경 오버레이 (클릭 시 닫힘) */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* 슬라이드 메뉴 패널 */}
          <div className="absolute top-0 right-0 w-[80%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col animate-fade-in-right">
            
            {/* 모바일 헤더 (닫기 버튼) */}
            <div className="flex items-center justify-between p-4 border-b border-graygray-10">
              <span className="text-title-m text-graygray-90">메뉴</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-graygray-5 rounded-full"
              >
                <X className="w-6 h-6 text-graygray-70" />
              </button>
            </div>

            {/* 인증 버튼 영역 */}
            <div className="flex gap-2 p-4 bg-secondary-5">
              {authButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      button.action ? button.action() : navigate(button.lnk);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-white rounded-xl shadow-sm border border-graygray-10 active:scale-95 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-secondary-50" />
                    <span className="text-detail-m font-bold text-graygray-90">
                      {button.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 네비게이션 리스트 */}
            <div className="flex-1 overflow-y-auto py-2">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-graygray-5 border-b border-graygray-5 last:border-0 text-left group"
                >
                  <div className="flex items-center gap-3">
                    {/* 아이콘이 URL 형태라면 img 태그 사용 */}
                    {item.icon && <img className="w-6 h-6 opacity-60 group-hover:opacity-100" alt="" src={item.icon} />}
                    <span className="text-body-m-bold text-graygray-70 group-hover:text-secondary-50">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-graygray-40" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;