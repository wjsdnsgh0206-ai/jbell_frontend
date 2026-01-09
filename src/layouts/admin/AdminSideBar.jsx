// src/layouts/admin/AdminSideBar.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 메뉴 데이터 구조
  const categories = [
    {
      title: "코드 관리",
      items: [
        { name: "공통코드 관리", path: "/admin/adminCommonCodeList" },
        { name: "그룹코드 등록", path: "/admin/adminGroupCodeAdd" },
        { name: "상세코드 등록", path: "/admin/adminDetailCodeAdd" },
      ],
      isAvailable: true // 로직 동작 여부
    },
    {
      title: "로그 관리",
      items: [], // 아직 하위 로직 없음
      isAvailable: false // 단순 텍스트 표시용
    }
  ];

  // 현재 경로에 맞는 카테고리 활성화 (코드 관리만 해당)
  const findActiveCategory = () => {
    return categories.find(cat => 
      cat.isAvailable && cat.items.some(item => location.pathname === item.path)
    )?.title || "코드 관리";
  };

  const [openCategory, setOpenCategory] = useState(findActiveCategory);

  useEffect(() => {
    const activeCat = findActiveCategory();
    setOpenCategory(activeCat);
  }, [location.pathname]);

  const handleTitleClick = (cat) => {
    // isAvailable이 true인 경우만 아코디언 동작
    if (cat.isAvailable) {
      setOpenCategory(openCategory === cat.title ? '' : cat.title);
    }
  };

  return (
    <aside className="w-64 bg-[#001529] text-gray-300 flex flex-col min-h-screen font-['Pretendard_GOV']">
      {/* 로고 영역 */}
      <div className="p-6 flex items-center gap-3 border-b border-[#002140]">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-5 h-5 bg-red-500 rounded-full"></div>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">대한민국정부</span>
      </div>

      <nav className="flex-1 mt-4">
        {categories.map((cat) => {
          const isOpened = openCategory === cat.title;
          const isCategoryActive = cat.isAvailable && cat.items.some(i => i.path === location.pathname);

          return (
            <section key={cat.title} className="flex flex-col w-full border-b border-[#002140]/30 last:border-0">
              {/* 카테고리 타이틀 버튼 */}
              <button
                onClick={() => handleTitleClick(cat)}
                className={`flex items-center justify-between w-full px-6 py-4 transition-all
                  ${!cat.isAvailable ? "cursor-default opacity-50" : ""}
                  ${isCategoryActive ? "text-white font-bold" : "hover:bg-[#1e2d3d] hover:text-white"}
                `}
              >
                <span className="text-[15px]">{cat.title}</span>
                {/* 로직이 있는 경우에만 화살표 표시 */}
                {cat.isAvailable && (
                  isOpened ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />
                )}
              </button>

              {/* 하위 메뉴 리스트 (코드 관리만 동작) */}
              {cat.isAvailable && isOpened && (
                <div className="overflow-hidden bg-[#000c17] py-1 transition-all">
                  <ul>
                    {cat.items.map((item) => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <button
                            onClick={() => navigate(item.path)}
                            className={`flex items-center w-full px-10 py-3.5 text-[14px] transition-all
                              ${isItemActive 
                                ? "bg-[#1890ff] text-white font-bold" 
                                : "text-gray-400 hover:text-white hover:bg-[#001529]/50"}
                            `}
                          >
                            {item.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSideBar;