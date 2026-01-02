import React, { Suspense, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DisasterModalLayout = ( {children} ) => {
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

  // 모바일 메뉴 열렸을 때 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-2 lg:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => navigate("/")} />

      {/* 메인 컨테이너: rounded-lg급으로 더 각지게 조절 */}
      <div className="relative w-full max-w-[1600px] h-full sm:h-[98vh] bg-white sm:rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all">
        
        {/* 데스크탑 전용 사이드바 */}
        <aside className="hidden lg:flex w-[220px] bg-[#1a2332] text-white shrink-0 flex-col border-r border-white/5">
          <div className="p-5 font-black text-lg tracking-tight flex items-center gap-2 border-b border-white/5">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
            전주시 안전누리
          </div>
          <nav className="flex-1 mt-2 px-2 space-y-0.5">
            {menuList.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.label}
                  onClick={() => navigate(menu.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-[14px] font-bold transition-all
                    ${isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  {menu.label}
                  {isActive && <span className="text-sm">→</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#f0f2f5]">
          
          {/* 헤더: 모바일 햄버거 메뉴 복구 */}
          <header className="px-4 sm:px-6 py-3 flex justify-between items-center bg-white shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              {/* 햄버거 버튼: 모바일(lg 미만)에서만 노출 */}
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                  <div className="w-5 h-0.5 bg-gray-600"></div>
                </div>
              </button>
              
              <div className="flex items-center gap-2.5">
                <h2 className="font-black text-gray-900 text-lg tracking-tight">{currentTitle}</h2>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                  </span>
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-tighter">Live</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate("/")} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-8 h-8 rounded flex items-center justify-center transition-all"
            >
              <span className="text-lg">✕</span>
            </button>
          </header>

          {/* 4. 스크롤이 발생하는 진짜 본문 영역 */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 custom-scrollbar">
            <div className="max-w-full mx-auto">
              <Suspense>
                {children}
              </Suspense>
            </div>
          </div>

          {/* 모바일 슬라이드 메뉴 오버레이 */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-[110] lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
              <nav className="relative w-2/3 h-full bg-[#1a2332] text-white p-6 animate-in slide-in-from-left duration-300">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-black text-lg">전주시 안전누리</span>
                  <button onClick={() => setIsMenuOpen(false)} className="text-2xl">✕</button>
                </div>
                <div className="space-y-2">
                  {menuList.map((menu) => (
                    <button 
                      key={menu.label} 
                      onClick={() => handleMenuClick(menu.path)} 
                      className={`w-full text-left px-4 py-3 rounded-md text-[15px] font-bold ${location.pathname === menu.path ? "bg-blue-600 text-white" : "text-slate-400"}`}
                    >
                      {menu.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DisasterModalLayout;