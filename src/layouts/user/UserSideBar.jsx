// src/layouts/user/UserSideBar.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가

const UserSideBar = ({ nowPage, categories = [] }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기

  // 현재 경로와 일치하는 메뉴 아이템 혹은 카테고리 찾기
  const findActiveCategory = () => {
    return categories.find(cat => {
      // 1. 하위 아이템 경로 중 하나라도 현재 URL에 포함되는지 확인
      const hasActiveSubItem = cat.items && cat.items.some(item => 
        location.pathname.startsWith(item.path)
      );
      
      // 2. 카테고리 자체 경로가 현재 URL의 시작점인지 확인 (예: /behaviorMethod/earthQuake)
      const isCategoryPath = cat.path && location.pathname.startsWith(cat.path);

      return hasActiveSubItem || isCategoryPath;
    })?.title || categories[0]?.title;
  };

  const [openCategory, setOpenCategory] = useState(findActiveCategory);

  // URL이 바뀔 때마다 열려있는 카테고리 업데이트 (선택 사항)
  useEffect(() => {
    setOpenCategory(findActiveCategory());
  }, [location.pathname, categories]);

  const handleTitleClick = (cat) => {
    const hasSubItems = cat.items && cat.items.length > 0;
    if (hasSubItems) {
      setOpenCategory(openCategory === cat.title ? '' : cat.title);
    } else if (cat.path) {
        // 타이틀 자체에 링크가 있는 경우 (예: 내 문의 내역)
        navigate(cat.path);
    }
  };

  return (
    <nav className="flex flex-col w-full lg:w-[300px] bg-white pr-10" aria-label="사이드바 메뉴">
      <div className="flex flex-col w-full">
        <header className="flex w-full items-center px-4 py-10 bg-graygray-0 border-b border-graygray-50">
          <h1 className="text-title-l text-graygray-90 whitespace-nowrap">{nowPage}</h1>
        </header>

        <div className="flex flex-col w-full">
          {categories.map((cat) => {
            const hasSubItems = cat.items && cat.items.length > 0;
            const isOpened = openCategory === cat.title;
            
            // [자동 활성화 로직] 현재 경로가 이 카테고리의 아이템 중 하나와 일치하거나, 카테고리 path와 일치할 때
            const isCategoryActive = (cat.path && location.pathname.startsWith(cat.path)) || 
                         (hasSubItems && cat.items.some(i => location.pathname.startsWith(i.path)));

            return (
              <section key={cat.title} className="flex flex-col w-full">
                <button
                  onClick={() => handleTitleClick(cat)}
                  className={`flex items-center justify-between w-full h-16 px-4 bg-graygray-0 text-left transition-colors border-b
                    ${isCategoryActive ? "border-b-[3px] border-secondary-50 text-secondary-50" : "border-graygray-30 text-graygray-90 hover:bg-graygray-5"}
                  `}
                >
                  <span className={`text-body-m-bold ${isCategoryActive ? "text-secondary-50" : "text-graygray-90"}`}>
                    {cat.title}
                  </span>
                  {hasSubItems && (
                    isOpened 
                      ? <ChevronUp className={`w-5 h-5 ${isCategoryActive ? 'text-secondary-50' : 'text-graygray-90'}`} />
                      : <ChevronDown className={`w-5 h-5 ${isCategoryActive ? 'text-secondary-50' : 'text-graygray-90'}`} />
                  )}
                </button>

                {hasSubItems && isOpened && (
                  <ul className="flex flex-col w-full py-4 border-b border-graygray-30 bg-white">
                    {cat.items.map((item) => {
                      // 정확히 일치하거나, 해당 아이템의 하위 경로일 때 활성화 (예: /earthQuake/typhoon/detail 등)
                      const isItemActive = location.pathname.startsWith(item.path);

                      return (
                        <li key={item.name} className="flex w-full px-4 py-1">
                          <button
                            onClick={() => navigate(item.path)}
                            className={`flex items-start gap-2 w-full p-2.5 rounded-lg text-left transition-colors
                              ${isItemActive ? "bg-secondary-5" : "hover:bg-graygray-5"}
                            `}
                          >
                            <span className="flex items-center pt-2">
                              <span className="w-1 h-1 bg-graygray-80 rounded-sm" aria-hidden="true" />
                            </span>
                            <span className={`text-body-m ${isItemActive ? "font-bold text-secondary-50" : "font-normal text-graygray-90"}`}>
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default UserSideBar;