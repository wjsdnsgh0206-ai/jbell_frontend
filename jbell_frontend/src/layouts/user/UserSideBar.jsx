import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserSideBar = ({ nowPage, activeItem, categories = [] }) => {
  const navigate = useNavigate();
  
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
      className="flex flex-col w-full lg:w-[296px] items-start lg:pl-0 lg:pr-5 lg:py-0 border-gray-200"
      aria-label="사이드바 네비게이션"
    >
      <div className="flex flex-col items-start w-full">
        {/* 사이드바 타이틀 (nowPage) */}
        <div className="flex w-full gap-2 px-2 py-6 lg:py-10 bg-white border-b border-gray-100 items-center">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
            {nowPage}
          </h2>
        </div>

        {/* 메뉴 리스트 영역 */}
        <div className="flex flex-col w-full items-start">
          {categories.map((cat) => {
            const hasSubItems = cat.items && cat.items.length > 0;
            const isTitleActive = cat.title === activeItem || (hasSubItems && cat.items.some(i => i.name === activeItem));
            const isOpened = openCategory === cat.title;

            return (
              <div key={cat.title} className="w-full">
                {/* 메인 카테고리 / 타이틀 누르면 이동하는 항목 */}
                <button
                  onClick={() => handleTitleClick(cat)}
                  className={`flex h-16 gap-2 px-2 py-0 w-full items-center transition-all border-b ${
                    isTitleActive 
                      ? 'bg-white border-b-[3px] border-[#003d7a]' 
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-[17px] ${isTitleActive ? 'font-bold text-[#003d7a]' : 'text-gray-600'}`}>
                    {cat.title}
                  </span>
                  {hasSubItems && (
                    <div className="ml-auto">
                      {isOpened ? <ChevronUp size={18} /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  )}
                </button>

                {/* 하위 메뉴 (아코디언 형태 유지) */}
                {hasSubItems && isOpened && (
                  <div className="flex flex-col w-full bg-gray-50/50">
                    {cat.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`flex h-12 px-6 w-full items-center border-b border-gray-50 transition-colors ${
                          activeItem === item.name 
                            ? 'text-[#003d7a] font-bold bg-white' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-[15px]">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default UserSideBar;