import React, { Suspense, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/*
  DisasterModalLayout 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 레이아웃 컴포넌트
  > 컴포넌트 설명 : header -> 재난사고속보 클릭 또는 main의 재난사고속보탭 더보기 클릭을 통해 오픈되는
    재난사고속보 모달창. 각 재난별 속보를 표시해주는 컴포넌트. 추후 api연동 필요함. (재난별로)
*/

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
    { label: "산불", path: "/disaster/forestFire" },
  ];

  // 메뉴 클릭 시 페이지 이동 후 메뉴 닫기
  const handleMenuClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // 현재 경로에 맞는 메뉴 라벨을 타이틀로 설정 (없으면 기본값 사용)
  const currentTitle =
    menuList.find((m) => m.path === location.pathname)?.label || "재난정보";

  // 메뉴가 열리면 모달 바깥의 body 스크롤을 막고, 닫히면 다시 허용
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-3 lg:p-4 font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* 모달 가장 최상단 div박스 */}
      <div className="relative z-10 w-full sm:w-[98%] max-w-[1800px] h-full sm:h-[96vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
        {/* === 1. 데스크탑용 사이드바 === */}
        <aside className="hidden lg:flex w-[280px] bg-graygray-90 text-white shrink-0 flex-col border-r border-white/5">
          <div
            className="p-8 font-black text-2xl tracking-tighter flex items-center gap-3 border-b border-white/5 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-1.5 h-6 bg-blue-500 rounded-full group-hover:scale-y-125 transition-all duration-300" />
            <span className="group-hover:translate-x-1 transition-transform">
              전북안전누리
            </span>
          </div>

          <nav className="flex-1 mt-6 px-4 space-y-2">
            {menuList.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <button
                  key={menu.label}
                  onClick={() => navigate(menu.path)}
                  className={`
                    group relative w-full flex items-center justify-between px-6 py-4 rounded-xl text-body-l-bold transition-all duration-300
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg translate-x-2"
                        : "text-graygray-40 hover:text-white hover:bg-white/5 hover:translate-x-1"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-sm" />
                  )}
                  <span className="relative z-10">{menu.label}</span>
                  <span
                    className={`text-xl transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="p-8 opacity-20 text-[10px] font-medium tracking-widest text-center">
            JEONBUK SAFETY NURI
          </div>
        </aside>

        {/* === 2. 메인 콘텐츠 영역 === */}
        <div className="flex-1 flex flex-col min-h-0 text-graygray-90">
          <header className="px-4 sm:px-8 py-5 flex justify-between items-center bg-white shrink-0 z-20 border-b border-graygray-10 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2.5 -ml-2 text-graygray-60 hover:bg-secondary-5 rounded-xl transition-transform"
              >
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-graygray-80"></div>
                  <div className="w-6 h-0.5 bg-graygray-80"></div>
                  <div className="w-4 h-0.5 bg-graygray-80"></div>
                </div>
              </button>

              <div className="flex items-center gap-2.5">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
                <h2 className="text-title-m sm:text-title-xl font-black tracking-tight leading-none text-graygray-90">
                  {currentTitle}
                </h2>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="bg-secondary-5 hover:bg-red-50 hover:text-red-500 text-graygray-40 w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-graygray-10"
            >
              <span className="text-xl font-light">✕</span>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 scrollbar-hide">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full text-graygray-40 font-bold">
                  데이터를 불러오는 중입니다...
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </div>

        {/* === 3. 모바일 메뉴 (Drawer) === */}
        <div
          className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${
            isMenuOpen ? "visible" : "invisible"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          <nav
            className={`relative w-[300px] h-full bg-graygray-90 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <span className="font-black text-2xl tracking-tighter text-blue-400">
                전북안전누리
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-light text-graygray-40 p-2"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-1">
              {menuList.map((menu) => (
                <button
                  key={menu.label}
                  onClick={() => handleMenuClick(menu.path)}
                  className={`w-full text-left px-5 py-5 rounded-2xl text-body-l-bold transition-all ${
                    location.pathname === menu.path
                      ? "bg-blue-600 text-white shadow-lg translate-x-2"
                      : "text-graygray-40 active:bg-white/5"
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
  );
};

export default DisasterModalLayout;
