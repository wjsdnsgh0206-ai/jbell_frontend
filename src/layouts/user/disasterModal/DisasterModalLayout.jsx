import React, { Suspense, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WeatherBox from "@/components/user/modal/WeatherBox";
import DisasterMessageBox from "@/components/user/modal/DisasterMessageBox";

const DisasterModalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const titleMap = {
    "accident": "사고속보", "earthquake": "지진", "flood": "홍수",
    "heavyRain": "호우", "landSlide": "산사태", "typhoon": "태풍", "forestFire": "산불",
  };

  const currentPath = location.pathname.split("/").pop();
  const currentTitle = titleMap[currentPath] || "재난정보";

  const menuList = [
    { label: "사고속보", path: "/disaster/accident" },
    { label: "지진", path: "/disaster/earthquake" },
    { label: "홍수", path: "/disaster/flood" },
    { label: "호우", path: "/disaster/heavyRain" },
    { label: "산사태", path: "/disaster/landSlide" },
    { label: "태풍", path: "/disaster/typhoon" },
    { label: "산불", path: "/disaster/forestFire" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/60 md:p-5 overflow-y-auto lg:overflow-hidden">
      <div className="hidden md:block absolute inset-0 -z-10" onClick={() => navigate("/")} />
      
      {/* 모달 컨테이너: 배경색 graygray-0 (white) 적용 */}
      <div className="relative w-full max-w-[1750px] h-fit md:h-[92vh] bg-[var(--graygray-0)] md:rounded-3xl flex flex-col lg:flex-row shadow-2xl overflow-visible lg:overflow-hidden">
        
        {/* PC 사이드바 (lg 이상) */}
        <aside className="hidden lg:flex w-[280px] bg-[var(--graygray-90)] text-[var(--graygray-0)] flex-col flex-shrink-0">
          <div className=" py-10 flex justify-center border-b border-white/5">
             <img className="w-[170px]" alt="로고" src="/src/assets/logo/jeonbuk_safety_nuri_watermark.svg" />
          </div>


          {/* <div className="py-10 flex justify-center border-b border-white/5 bg-[#0f172a]">
  <img 
    className="w-[170px] invert brightness-0" // invert + brightness-0 하면 이미지가 완전 흰색이 돼!
    alt="로고" 
    src="/src/assets/logo/jeonbuk_safety_nuri_watermark.svg" 
  />
</div> */}


          <nav className="mt-4 px-4 space-y-2 flex-1 overflow-y-auto">
            {menuList.map((menu) => (
              <button
                key={menu.path}
                onClick={() => navigate(menu.path)}
                // 타이포그래피: text-body-m-bold 적용
                // 색상: Active시 blue-600 / Inactive시 graygray-50
                className={`w-full px-6 py-4 rounded-2xl text-left text-body-m-bold transition-all ${
                  location.pathname === menu.path 
                    ? "bg-[var(--blue-600)] text-[var(--graygray-0)]" 
                    : "text-[var(--graygray-50)] hover:bg-white/5"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--graygray-5)] overflow-visible lg:overflow-hidden">
          {/* 헤더 */}
          <header className="sticky top-0 lg:relative px-6 py-4 border-b border-[var(--graygray-20)] bg-[var(--graygray-0)] flex justify-between items-center z-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              {/* 햄버거 버튼 */}
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-[var(--graygray-10)] rounded-xl">
                <svg className="w-6 h-6 text-[var(--graygray-90)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              {/* 타이틀: text-title-xl 적용 */}
              <h2 className="text-body-m-bold md:text-title-xl text-[var(--graygray-90)]">{currentTitle}</h2>
            </div>
            {/* 닫기 버튼: graygray-40, hover시 graygray-10 */}
            <button className="p-2 hover:bg-[var(--graygray-10)] rounded-full" onClick={() => navigate(-1)}>
                <span className="text-2xl text-[var(--graygray-40)]">✕</span>
            </button>
          </header>

          <div className="flex-1 overflow-visible lg:overflow-hidden p-4 md:p-8 lg:h-full min-h-0">
            <div className="flex flex-col lg:flex-row gap-6 lg:h-full">
              <main className="w-full lg:flex-[1.6] flex flex-col min-h-0 order-1 lg:h-full">
                <Suspense fallback={<div className="text-body-m text-[var(--graygray-50)]">로딩 중...</div>}>
                  <Outlet />
                </Suspense>
              </main>


              <aside className="w-full lg:max-w-[380px] flex flex-col gap-6 order-2 pb-10 lg:pb-0 lg:h-full min-h-0">
                {/* 날씨 박스: 그라디언트 blue-500 -> blue-700 */}
                <div className="h-[200px] flex-shrink-0 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-2xl p-5 text-white">
                  <WeatherBox />
                </div>
                {/* 재난문자 박스: 보더 graygray-20 (기존 gray-100 대체) */}
                <div className="flex-1 min-h-[450px] lg:min-h-0 bg-[var(--graygray-0)] rounded-xl border border-[var(--graygray-20)] shadow-sm overflow-hidden flex flex-col">
                  <DisasterMessageBox />
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* === 햄버거 메뉴 Drawer (모바일 전용) === */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            {/* 배경 */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            
            {/* 메뉴 슬라이드: 배경 graygray-90 */}
            <nav className="absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--graygray-90)] text-[var(--graygray-0)] p-6 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <img className="w-[130px]" alt="로고" src="/src/assets/logo/jeonbuk_safety_nuri_watermark.svg" />
                <button onClick={() => setIsMenuOpen(false)} className="text-white/60 hover:text-white text-xl">✕</button>
              </div>
              
              <div className="space-y-2 overflow-y-auto flex-1 no-scrollbar">
                {menuList.map((menu) => (
                  <button
                    key={menu.path}
                    onClick={() => {
                      navigate(menu.path);
                      setIsMenuOpen(false);
                    }}
                    // 모바일 메뉴: text-body-m-bold
                    className={`w-full px-5 py-4 rounded-2xl text-left text-body-m-bold transition-all ${
                      location.pathname === menu.path 
                        ? "bg-[var(--blue-600)] text-[var(--graygray-0)] shadow-lg" 
                        : "text-[var(--graygray-50)] hover:bg-white/5" // gray-400 -> graygray-50
                    }`}
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
  );
};

export default DisasterModalLayout;