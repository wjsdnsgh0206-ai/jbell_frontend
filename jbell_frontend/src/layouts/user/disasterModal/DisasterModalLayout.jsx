import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const DisasterModalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = [
    { label: "사고속보", path: "/disaster/accident" },
    { label: "지진", path: "/disaster/earthquake" },
    { label: "태풍", path: "/disaster/typhoon" },
    { label: "호우", path: "/disaster/heavyRain" },
    { label: "홍수", path: "/disaster/flood" },
    { label: "산사태", path: "/disaster/landslide" },
    { label: "산불", path: "/disaster/wildfire" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const currentTitle = menuList.find(m => m.path === location.pathname)?.label || "재난정보";

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    /* 1. 최상단: fixed를 유지해야 '모달'이 됨 */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
      
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => navigate("/")}
      />

      {/* 2. 메인 컨테이너: h-full(모바일) / h-[90vh](데스크탑)로 높이를 가둬야 함 */}
      <div className="relative w-full max-w-[1280px] h-full sm:h-[90vh] bg-white sm:bg-[#f4f7fa] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* 사이드바 (데스크탑 전용) */}
        <aside className="hidden lg:flex w-[240px] bg-[#2d3e5d] text-white shrink-0 flex-col">
          <div className="p-6 border-b border-white/10 font-bold text-lg">전주시안전누리</div>
          <nav className="flex-1 mt-4">
            {menuList.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.label}
                  onClick={() => navigate(menu.path)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors
                    ${isActive ? "bg-white text-[#2d3e5d] font-bold" : "text-gray-300 hover:bg-white/10"}`}
                >
                  {menu.label}
                  <span className={isActive ? "text-[#2d3e5d]" : "text-gray-500"}>&gt;</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 3. 메인 콘텐츠 영역: flex-1과 min-h-0으로 내부 스크롤 준비 */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          
          {/* 헤더: shrink-0을 줘야 스크롤 시 안 찌그러짐 */}
          <header className="px-4 sm:px-8 py-4 border-b flex justify-between items-center bg-white shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-1 text-gray-600 hover:bg-gray-100 rounded-md">
                {isMenuOpen ? <span className="text-2xl">✕</span> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-gray-600"></div><div className="w-6 h-0.5 bg-gray-600"></div><div className="w-6 h-0.5 bg-gray-600"></div></div>}
              </button>
              <h2 className="font-black text-gray-800 text-lg sm:text-xl">{currentTitle}</h2>
            </div>
            <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center gap-1">
              <span className="hidden sm:inline">닫기</span><span className="text-xl sm:hidden">✕</span>
            </button>
          </header>

          {/* 4. 스크롤이 발생하는 진짜 본문 영역 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
            <div className="max-w-full mx-auto">
              <Outlet />
            </div>
          </div>

          {/* 모바일 햄버거 메뉴 오버레이 (위치는 그대로) */}
          <div className={`fixed inset-0 top-[61px] z-10 lg:hidden transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <nav className="relative w-3/4 max-w-[280px] h-full bg-[#2d3e5d] text-white shadow-xl py-6 px-4">
              <p className="text-xs font-bold text-gray-400 mb-6 px-2 uppercase tracking-widest">Disaster Menu</p>
              <div className="space-y-2">
                {menuList.map((menu) => (
                  <button key={menu.label} onClick={() => handleMenuClick(menu.path)} className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${location.pathname === menu.path ? "bg-white text-[#2d3e5d]" : "text-gray-300 active:bg-white/10"}`}>
                    {menu.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DisasterModalLayout;