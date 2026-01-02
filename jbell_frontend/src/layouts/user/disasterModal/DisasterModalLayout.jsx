import React, { Suspense, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DisasterModalLayout = ({ children }) => {
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
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-3 lg:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => navigate("/")} />

      <div className="relative w-full sm:w-[98%] max-w-[1800px] h-full sm:h-[96vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
        
        {/* 데스크탑 사이드바 (생략) */}
        <aside className="hidden lg:flex w-[240px] bg-[#1a2332] text-white shrink-0 flex-col border-r border-white/5">
          <div className="p-6 font-black text-xl tracking-tight flex items-center gap-2 border-b border-white/5">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
            전북안전누리
          </div>
          <nav className="flex-1 mt-4 px-3 space-y-1">
            {menuList.map((menu) => (
              <button
                key={menu.label}
                onClick={() => navigate(menu.path)}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-[15px] font-bold transition-all
                  ${location.pathname === menu.path ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                {menu.label}
                {location.pathname === menu.path && <span className="text-lg">→</span>}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fb]">
          <header className="px-4 sm:px-8 py-4 flex justify-between items-center bg-white shrink-0 z-20 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
              >
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                  <div className="w-6 h-0.5 bg-gray-600"></div>
                </div>
              </button>
              <h2 className="font-black text-gray-900 text-xl tracking-tight">{currentTitle}</h2>
            </div>
            <button onClick={() => navigate("/")} className="bg-gray-100 hover:bg-gray-200 text-gray-500 w-9 h-9 rounded-lg flex items-center justify-center">
              <span>✕</span>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Suspense fallback={null}>{children}</Suspense>
          </main>

          {/* ⚡ 모바일 애니메이션 슬라이드 메뉴 */}
          <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
            {/* 검은 배경 (Fade 효과) */}
            <div 
              className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} 
              onClick={() => setIsMenuOpen(false)} 
            />
            
            {/* 메뉴창 (Slide 효과) */}
            <nav className={`relative w-3/4 max-w-[300px] h-full bg-[#1a2332] text-white p-8 shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-xl tracking-tight">전북안전누리</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-3xl font-light hover:rotate-90 transition-transform">✕</button>
              </div>
              <div className="space-y-2">
                {menuList.map((menu, idx) => (
                  <button 
                    key={menu.label} 
                    onClick={() => handleMenuClick(menu.path)} 
                    style={{ transitionDelay: isMenuOpen ? `${idx * 50}ms` : '0ms' }}
                    className={`w-full text-left px-5 py-4 rounded-xl text-[15px] font-bold transition-all ${
                      location.pathname === menu.path 
                      ? "bg-blue-600 text-white translate-x-2" 
                      : `text-slate-400 hover:bg-white/5 ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`
                    }`}
                  >
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
}

export default DisasterModalLayout;