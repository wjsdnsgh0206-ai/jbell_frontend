import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WeatherBox from "@/components/user/modal/WeatherBox";
import DisasterMessageBox from "@/components/user/modal/DisasterMessageBox";
import { disasterModal } from "@/routes/route-jy";

const DisasterModalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const menuList = [
  //   { label: "사고속보", path: "/disaster/accident" },
  //   { label: "지진", path: "/disaster/earthquake" },
  //   { label: "지진", path: "/disaster/earthquake" },
  //   { label: "지진", path: "/disaster/earthquake" },
  //   { label: "지진", path: "/disaster/earthquake" },
  //   { label: "지진", path: "/disaster/earthquake" },
  // ];

  const currentTitle =
    disasterModal.find((m) => m.path === location.pathname)?.label || "재난정보";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => navigate("/")}
      />

      {/* 모달 컨테이너: 모바일은 꽉 차게, PC는 h-[96vh] */}
      <div className="relative z-10 w-full max-w-[1700px] h-full md:h-[96vh] bg-white md:rounded-2xl flex overflow-hidden">
        
        {/* === 왼쪽 사이드바: 모바일(hidden), PC(flex) === */}
        <aside className="hidden lg:flex w-[260px] bg-graygray-90 text-white flex-col">
          <nav className="mt-6 px-4 space-y-2">
            {disasterModal.map((menu) => (
              <button
                key={menu.path}
                onClick={() => navigate(menu.path)}
                className={`w-full px-5 py-4 rounded-xl text-left font-bold transition-colors ${
                  location.pathname === menu.path
                    ? "bg-blue-600 text-white"
                    : "text-graygray-40 hover:bg-white/5"
                }`}
              >
                {menu.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* === 메인 영역 === */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 헤더: 모바일에서는 닫기 버튼 위주 */}
          <header className="px-5 py-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-body-l-bold md:text-title-xl font-black">{currentTitle}</h2>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" 
              onClick={() => navigate("/")}
            >
              <span className="text-xl">✕</span>
            </button>
          </header>

          {/* 콘텐츠 영역: 모바일은 세로 스크롤, PC는 고정 높이 내부 스크롤 */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 gap-6 p-4 md:p-6 overflow-y-auto lg:overflow-hidden bg-gray-50 md:bg-white">
            
            {/* 왼쪽 콘텐츠 (지도 + 목록) */}
            <main className="flex-1 flex flex-col min-h-0 order-1 lg:order-none">
              <Suspense fallback={<div className="p-10 text-center">로딩중...</div>}>
                <Outlet />
              </Suspense>
            </main>

            {/* 🔥 오른쪽/하단 사이드 패널: 모바일에서는 하단으로 내려감 */}
            <aside className="w-full lg:w-[360px] flex flex-col gap-4 md:gap-5 order-2 lg:order-none pb-10 lg:pb-0">
              {/* 날씨 박스: 모바일은 높이 축소 가능 */}
              <div className="h-[160px] md:h-[200px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <WeatherBox />
              </div>

              {/* 재난문자: 모바일에서도 최소 높이 확보 */}
              <div className="flex-1 min-h-[400px] lg:min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <DisasterMessageBox />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterModalLayout;