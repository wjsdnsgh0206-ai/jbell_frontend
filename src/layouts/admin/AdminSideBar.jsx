// src/layouts/admin/AdminSideBar.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_MENU_DATA } from "@/components/admin/AdminSideMenuData";
import jeonbuk from "@/assets/logo/jeonbuk_safety_nuri_watermark_noText.png";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 1. URL에서 대분류 추출
  const pathParts = pathname.split("/");
  const activeGnb = pathParts[2] || "system";
  const menuCategories = ADMIN_MENU_DATA[activeGnb] || [];

  // 2. 현재 경로에 맞는 아코디언 찾기
  const findActiveCategory = () => {
    return (
      menuCategories.find(
        (cat) =>
          cat.isAvailable && cat.items.some((item) => pathname === item.path),
      )?.title || ""
    );
  };

  const [openCategory, setOpenCategory] = useState("");

  useEffect(() => {
    const activeTitle = findActiveCategory();
    if (activeTitle) setOpenCategory(activeTitle);
  }, [pathname, activeGnb]);

  return (
    /* 배경색 복구: #001529 기반 토큰 적용 */
    <aside className="w-64 bg-[var(--admin-sidebar-bg)] text-gray-300 flex flex-col min-h-screen">
      {/* 로고 영역: 구조 유지 */}

          <div className="px-5 pt-5 flex justify-center items-center border-b border-white/5">
            <img
              className="w-[40px] sm:w-[40px] h-auto"
              alt="전북안전누리 로고"
              src={jeonbuk}
            />
            <h1 className="text-heading-m py-4 text-white">전북안전누리</h1>
          </div>

      <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
        {menuCategories.map((cat) => (
          <section
            key={cat.title}
            className="flex flex-col border-b border-[#002140]/30 last:border-0"
          >
            {/* 대분류 버튼: 17px(text-body-m-bold) 적용 */}
            <button
              onClick={() =>
                setOpenCategory(openCategory === cat.title ? "" : cat.title)
              }
              className={`flex items-center justify-between px-6 py-4 hover:bg-[var(--admin-sidebar-hover)] transition-all
                ${cat.items.some((i) => i.path === pathname) ? "text-white font-bold" : "text-gray-400"}`}
            >
              <span className="text-body-m-bold">{cat.title}</span>
              {cat.isAvailable &&
                (openCategory === cat.title ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                ))}
            </button>

            {/* 소분류 리스트: 17px(text-body-m) 적용 */}
            {openCategory === cat.title && (
              <div className="bg-[var(--admin-sidebar-sub)] py-1">
                {cat.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full px-10 py-3.5 text-body-m transition-all
                      ${
                        pathname === item.path
                          ? "bg-[var(--admin-sidebar-active)] text-white font-bold"
                          : "text-gray-400 hover:text-white hover:bg-[var(--admin-sidebar-hover)]"
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSideBar;
