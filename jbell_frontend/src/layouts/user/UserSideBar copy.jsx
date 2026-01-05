import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserSideBar = ({ nowPage, activeItem, categories = [] }) => {
  const navigate = useNavigate();

  // 초기 열려있는 카테고리 설정
  const initialCategory = categories.find(cat => 
    cat.title === activeItem || (cat.items && cat.items.some(item => item.name === activeItem))
  )?.title || categories[0]?.title;

  const [openCategory, setOpenCategory] = useState(initialCategory);

  useEffect(() => {
    const currentCat = categories.find(cat => 
      cat.title === activeItem || (cat.items && cat.items.some(item => item.name === activeItem))
    );
    if (currentCat) setOpenCategory(currentCat.title);
  }, [activeItem, categories]);

  const handleTitleClick = (cat) => {
    const hasSubItems = cat.items && cat.items.length > 0;
    if (hasSubItems) {
      setOpenCategory(openCategory === cat.title ? '' : cat.title);
    }
    if (cat.path) {
      navigate(cat.path);
    }
  };

  return (
    <nav
      // 요청사항 반영: lg:w-[300px]
      // 모바일에서는 w-full, PC에서는 300px 고정 
      className="flex flex-col w-full lg:w-[300px] bg-white pr-10"
      aria-label="사이드바 메뉴"
    >
      <div className="flex flex-col w-full">
        
        {/* 1. 헤더 영역 */}
        <header className="flex w-full items-center px-4 py-10 bg-graygray-0 border-b border-graygray-50">
          {/* 타이틀 (Title L) */}
          <h1 className="text-title-l text-graygray-90 whitespace-nowrap">
            {nowPage}
          </h1>
        </header>

        {/* 2. 카테고리 리스트 영역 */}
        <div className="flex flex-col w-full">
          {categories.map((cat) => {
            const hasSubItems = cat.items && cat.items.length > 0;
            const isOpened = openCategory === cat.title;
            // 상위 메뉴 활성화 조건: 현재 열려있거나, 자신이 activeItem일 때
            const isCategoryActive = isOpened || cat.title === activeItem;

            return (
              <section key={cat.title} className="flex flex-col w-full">
                {/* 대분류 버튼 */}
                <button
                  onClick={() => handleTitleClick(cat)}
                  aria-expanded={isOpened}
                  className={`
                    flex items-center justify-between w-full h-16 px-4 bg-graygray-0 text-left transition-colors
                    border-b
                    ${isCategoryActive 
                      ? "border-b-[3px] border-secondary-50 text-secondary-50" 
                      : "border-graygray-30 text-graygray-90 hover:bg-graygray-5"
                    }
                  `}
                >
                  {/* 텍스트 (Body M Bold) */}
                  <span className={`text-body-m-bold ${isCategoryActive ? "text-secondary-50" : "text-graygray-90"}`}>
                    {cat.title}
                  </span>
                  
                  {hasSubItems && (
                    isOpened 
                      ? <ChevronUp className={`w-5 h-5 ${isCategoryActive ? 'text-secondary-50' : 'text-graygray-90'}`} />
                      : <ChevronDown className={`w-5 h-5 ${isCategoryActive ? 'text-secondary-50' : 'text-graygray-90'}`} />
                  )}
                </button>

                {/* 하위 메뉴 (Depth 2) */}
                {hasSubItems && isOpened && (
                  <ul className="flex flex-col w-full py-4 border-b border-graygray-30 bg-white">
                    {cat.items.map((item) => {
                      const isItemActive = activeItem === item.name;

                      return (
                        <li
                          key={item.name}
                          className={`
                            flex w-full px-4 py-1
                          `}
                        >
                          <button
                            onClick={() => navigate(item.path)}
                            className={`
                              flex items-start gap-2 w-full p-2.5 rounded-lg text-left transition-colors
                              ${isItemActive ? "bg-secondary-5" : "hover:bg-graygray-5"}
                            `}
                          >
                            {/* 불릿 포인트 */}
                            <span className="flex items-center pt-2">
                              <span className="w-1 h-1 bg-graygray-80 rounded-sm" aria-hidden="true" />
                            </span>
                            
                            {/* 텍스트 (Body M) */}
                            {/* 활성화 시 Bold 처리를 원하면 font-bold 추가, 여기서는 색상만 변경 */}
                            <span className={`
                              text-body-m
                              ${isItemActive 
                                ? "font-bold text-secondary-50" 
                                : "font-normal text-graygray-90"
                              }
                            `}>
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