import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserSideBar = ({ nowPage, activeItem, categories = [] }) => {
  const navigate = useNavigate();

  // 초기 카테고리 설정 로직 유지
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
        
        {/* 1. 사이드바 타이틀 (nowPage) */}
        {/* 디자인 토큰: navigation-title-medium (24px, 700) 적용 */}
        <div className="flex w-full gap-2 px-2 py-6 lg:py-10 bg-white border-b border-graygray-10 items-center">
          <h2 className="font-navigation-title-medium text-[length:var(--navigation-title-medium-font-size)] font-[number:var(--navigation-title-medium-font-weight)] text-graygray-90 tracking-[var(--navigation-title-medium-letter-spacing)] leading-[var(--navigation-title-medium-line-height)]">
            {nowPage}
          </h2>
        </div>

        {/* 2. 메뉴 리스트 영역 */}
        <div className="flex flex-col w-full items-start">
          {categories.map((cat) => {
            const hasSubItems = cat.items && cat.items.length > 0;
            // 타이틀 활성화 여부 확인
            const isTitleActive = cat.title === activeItem || (hasSubItems && cat.items.some(i => i.name === activeItem));
            const isOpened = openCategory === cat.title;

            return (
              <div key={cat.title} className="w-full">
                {/* 메인 카테고리 (Depth 1) 
                  - 높이: 56px, padding: 0 12px
                  - 활성 시: border-bottom 3px solid secondary-50, 폰트 Bold, 색상 secondary-50
                  - 비활성 시: border-bottom 1px solid gray-10, 폰트 Normal, 색상 gray-90
                */}
                <button
                  onClick={() => handleTitleClick(cat)}
                  className={`
                    flex items-center justify-between w-full h-[56px] px-3 cursor-pointer transition-all
                    ${isTitleActive 
                      ? 'border-b-[3px] border-secondarysecondary-50 text-secondarysecondary-50' 
                      : 'border-b border-graygray-10 text-graygray-90 hover:text-graygray-70'
                    }
                  `}
                >
                  <span className={`
                    font-navigation-depth-medium 
                    text-[length:var(--navigation-depth-medium-font-size)]
                    tracking-[var(--navigation-depth-medium-letter-spacing)] 
                    leading-[var(--navigation-depth-medium-line-height)]
                    ${isTitleActive 
                      ? 'font-[number:var(--navigation-depth-medium-bold-font-weight)]' // Active: Bold
                      : 'font-[number:var(--navigation-depth-medium-font-weight)]'      // Inactive: Normal
                    }
                  `}>
                    {cat.title}
                  </span>

                  {hasSubItems && (
                    isOpened
                      ? <ChevronUp className={`w-[18px] h-[18px] ${isTitleActive ? 'text-secondarysecondary-50' : 'text-graygray-50'}`} />
                      : <ChevronDown className={`w-[18px] h-[18px] ${isTitleActive ? 'text-secondarysecondary-50' : 'text-graygray-50'}`} />
                  )}
                </button>

                {/* 하위 메뉴 (Depth 2) - 아코디언
                  - 배경색: graygray-5 (이미지 참조)
                  - 높이: 44px, padding: 0 24px
                  - 활성 시: secondary-50, Bold
                  - 비활성 시: gray-70, Normal
                */}
                {hasSubItems && isOpened && (
                  <div className="flex flex-col w-full bg-graygray-5">
                    {cat.items.map((item) => {
                      const isItemActive = activeItem === item.name;
                      
                      return (
                        <button
                          key={item.name}
                          onClick={() => navigate(item.path)}
                          className="flex items-center w-full h-[44px] px-6 text-left"
                        >
                          <span className={`
                            font-navigation-depth-small
                            text-[length:var(--navigation-depth-small-font-size)]
                            tracking-[var(--navigation-depth-small-letter-spacing)]
                            leading-[var(--navigation-depth-small-line-height)]
                            ${isItemActive 
                              ? 'text-secondarysecondary-50 font-[number:var(--navigation-depth-small-bold-font-weight)]' 
                              : 'text-graygray-70 font-[number:var(--navigation-depth-small-font-weight)] hover:text-graygray-50'
                            }
                          `}>
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
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