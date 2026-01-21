// src/layouts/user/disasterModal/DisasterModalLayout.jsx
import React, { Suspense, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WeatherBox from "@/components/user/modal/WeatherBox";
import DisasterMessageBox from "@/components/user/modal/DisasterMessageBox";
import WeatherWarningBox from "@/components/user/modal/WeatherWarningBox";

const DisasterModalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);

  const titleMap = {
    accident: "사고속보",
    earthquake: "지진",
    flood: "홍수",
    heavyRain: "호우",
    landSlide: "산사태",
    typhoon: "태풍",
    forestFire: "산불",
    coldWave: "한파",
  };

  // 현재 URL 경로의 마지막 부분 추출 (예: accident, earthquake 등)
  const currentPath = location.pathname.split("/").pop();
  const currentTitle = titleMap[currentPath] || "재난정보";

  const menuList = [
    { label: "사고속보", path: "/disaster/accident" },
    { label: "지진", path: "/disaster/earthquake" },
    { label: "호우·홍수", path: "/disaster/flood" },
    { label: "산사태", path: "/disaster/landSlide" },
    { label: "태풍", path: "/disaster/typhoon" },
    { label: "산불", path: "/disaster/forestFire" },
    { label: "한파", path: "/disaster/coldWave" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center bg-black/60 md:p-5 overflow-y-auto lg:overflow-hidden">
      <div
        className="hidden md:block absolute inset-0 -z-10"
        onClick={() => navigate("/")}
      />

      <div className="relative w-full max-w-[1750px] min-h-screen md:min-h-0 md:h-[92vh] bg-[var(--graygray-0)] md:rounded-3xl flex flex-col lg:flex-row shadow-2xl overflow-hidden">
        {/* PC 사이드바 */}
        <aside className="hidden lg:flex w-[280px] bg-[var(--graygray-90)] text-[var(--graygray-0)] flex-col flex-shrink-0">
          <div className="px-5 pt-5 flex justify-center items-center border-b border-white/5">
            <img
              className="w-[40px] sm:w-[40px] h-auto"
              alt="전북안전누리 로고"
              src="/src/assets/logo/jeonbuk_safety_nuri_watermark_noText.png"
            />
            <h1 className="text-heading-m py-4">전북안전누리</h1>
          </div>
          <nav className="mt-4 px-4 space-y-2 flex-1 overflow-y-auto">
            {menuList.map((menu) => (
              <button
                key={menu.path}
                onClick={() => navigate(menu.path)}
                className={`w-full px-6 py-4 rounded-2xl text-left text-body-m-bold transition-all ${
                  location.pathname === menu.path
                    ? "bg-[var(--blue-600)] text-white"
                    : "text-[var(--graygray-50)] hover:bg-white/5"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--graygray-5)] overflow-hidden">
          <header className="px-5 py-4 border-b border-[var(--graygray-20)] bg-white flex justify-between items-center z-50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h2 className="text-body-m-bold md:text-title-xl">
                {currentTitle}
              </h2>
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => navigate("/")}
            >
              ✕
            </button>
          </header>

          {/* 콘텐츠 바디 */}
          <div className="flex-1 overflow-y-auto lg:overflow-hidden p-4 md:p-8 flex flex-col min-h-0">
            <div className="flex flex-col lg:flex-row gap-6 lg:h-full min-h-0">
              <main className="w-full lg:flex-[1.6] flex flex-col lg:h-full min-h-[600px] lg:min-h-0 order-1">
                <Suspense
                  fallback={
                    <div className="p-10 text-gray-400">로딩 중...</div>
                  }
                >
                  <Outlet />
                </Suspense>
              </main>

              {/* 우측 사이드바 */}
              <aside className="w-full lg:max-w-[380px] flex flex-col gap-6 order-2 pb-10 lg:pb-0">
                <div className="bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-2xl text-white overflow-hidden">
                  <button
                    onClick={() => setIsWeatherOpen(!isWeatherOpen)}
                    className="w-full px-5 py-4 flex lg:hidden justify-between items-center font-bold"
                  >
                    <span>☀️ 현재 날씨 정보</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isWeatherOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`${
                      isWeatherOpen
                        ? "max-h-[300px]"
                        : "max-h-0 lg:max-h-[300px]"
                    } transition-all duration-300 overflow-hidden`}
                  >
                    <div className="p-5 h-[220px] grid">
                      <WeatherBox />
                    </div>
                  </div>
                </div>

                {/* ✅ 모바일 순서: (행동요령은 메인 컨텐츠에서 표시) → 날씨박스 → 재난문자박스 */}
                <div className="lg:hidden">
                  <DisasterMessageBox />
                </div>

                {/* 하단 박스 영역: 분기 처리 로직 수정 */}
                <div className="hidden lg:flex flex-1 min-h-[400px] lg:min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-col">
                  {/* currentPath를 사용하여 분기 처리 (사고속보 경로인 accident일 때) */}
                  {currentPath === "accident" ? (
                    <DisasterMessageBox />
                  ) : (
                    <div className="p-4 h-full overflow-hidden flex flex-col">
                      {/* WeatherWarningBox에 현재 경로(재난타입)를 넘겨줌 */}
                      <WeatherWarningBox disasterType={currentPath} />
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* 모바일 Drawer 메뉴 */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav className="absolute top-0 left-0 bottom-0 w-[280px] bg-[var(--graygray-90)] text-white p-6 shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center ">
                  <img
                    className="w-[40px] sm:w-[40px]"
                    alt="전북안전누리 로고"
                    src="/src/assets/logo/jeonbuk_safety_nuri_watermark_noText.png"
                  />
                  <h1 className="text-heading-m">전북안전누리</h1>
                </div>
                <button onClick={() => setIsMenuOpen(false)}>✕</button>
              </div>
              <div className="space-y-2 overflow-y-auto flex-1">
                {menuList.map((menu) => (
                  <button
                    key={menu.path}
                    onClick={() => {
                      navigate(menu.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-5 py-4 rounded-2xl text-left font-bold ${
                      location.pathname === menu.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-white/5"
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
