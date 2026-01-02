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

  const currentTitle = menuList.find((m) => m.path === location.pathname)?.label || "재난정보";

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-3 lg:p-4 font-sans text-gray-900">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => navigate("/")} 
      />

      <div className="relative w-full sm:w-[98%] max-w-[1800px] h-full sm:h-[96vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
        
        {/* 1. 데스크탑용 사이드바 */}
        <aside className="hidden lg:flex w-[280px] bg-[#1a2332] text-white shrink-0 flex-col border-r border-white/5 shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
          <div className="p-8 font-black text-2xl tracking-tighter flex items-center gap-3 border-b border-white/5 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-1.5 h-6 bg-blue-500 rounded-full group-hover:scale-y-125 group-hover:bg-blue-400 transition-all duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">전북안전누리</span>
          </div>

          <nav className="flex-1 mt-6 px-4 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">재난 카테고리</p>
            {menuList.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.label}
                  onClick={() => navigate(menu.path)}
                  className={`
                    group relative w-full flex items-center justify-between px-6 py-4 rounded-xl text-[17px] font-black transition-all duration-300 ease-out
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] translate-x-2" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]" />
                  )}
                  <span className="relative z-10">{menu.label}</span>
                  <span className={`
                    text-xl transition-all duration-300
                    ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"}
                  `}>
                    →
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="p-8 opacity-20 text-[10px] font-medium tracking-widest text-center text-white">
            JEONBUK SAFETY NURI
          </div>
        </aside>

        {/* 2. 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#f8f9fb]">
          {/* 헤더 부분 수정 */}
          <header className="px-4 sm:px-8 py-5 flex justify-between items-center bg-white shrink-0 z-20 border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="lg:hidden p-2.5 -ml-2 text-gray-600 hover:bg-gray-100 rounded-xl active:scale-90 transition-transform"
              >
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-gray-700"></div>
                  <div className="w-6 h-0.5 bg-gray-700"></div>
                  <div className="w-4 h-0.5 bg-gray-700"></div>
                </div>
              </button>
              
              {/* ⚡ 실시간 점(Dot) 애니메이션 추가 부분 */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
                <h2 className="font-black text-gray-900 text-xl sm:text-2xl tracking-tight leading-none">
                  {currentTitle}
                </h2>
              </div>
            </div>
            
            <button 
              onClick={() => navigate("/")} 
              className="bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-gray-100"
            >
              <span className="text-xl font-light">✕</span>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400 font-bold">데이터를 불러오는 중입니다...</div>}>
              {children}
            </Suspense>
          </main>

          {/* 3. 모바일 전용 슬라이드 메뉴 */}
          <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
            <div 
              className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} 
              onClick={() => setIsMenuOpen(false)} 
            />
            
            <nav className={`relative w-[300px] h-full bg-[#1a2332] text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1e293b]">
                <span className="font-black text-2xl tracking-tighter text-blue-400">전북안전누리</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-2xl font-light text-slate-400 p-2">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">재난 정보 서비스</p>
                {menuList.map((menu, idx) => (
                  <button 
                    key={menu.label} 
                    onClick={() => handleMenuClick(menu.path)} 
                    style={{ transitionDelay: isMenuOpen ? `${idx * 40}ms` : '0ms' }}
                    className={`w-full text-left px-5 py-5 rounded-2xl text-[17px] font-black transition-all ${
                      location.pathname === menu.path 
                      ? "bg-blue-600 text-white shadow-lg translate-x-2" 
                      : `text-slate-400 hover:bg-white/5 ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`
                    }`}
                  >
                    {menu.label}
                  </button>
                ))}
              </div>

              <div className="p-8 border-t border-white/5 text-[12px] text-slate-600">
                <p className="font-bold mb-1">전라북도청 재난안전대책본부</p>
                <p>© 2026 JEONBUK SAFETY NURI</p>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisasterModalLayout;