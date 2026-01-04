import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // 아이콘 대체 (Icon20 대신 사용)
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
      // className="flex flex-col w-[296px] items-center pl-0 pr-10 py-0 relative [border-right-style:solid] border-graygray-40"
      // aria-label="사이드바 메뉴"

      // 여기 lg:w-[296px]를 lg:w-[240px]로 수정했어! (원하는 만큼 숫자를 조절해줘)
      className="flex flex-col w-full lg:w-[240px] items-start lg:pl-0 lg:pr-5 lg:py-0 border-gray-200"
      aria-label="사이드바 네비게이션"
    >
      <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto]">
        
        {/* 헤더 영역 */}
        <header className="flex w-64 items-center gap-2 px-2 py-10 relative flex-[0_0_auto] bg-graygray-0 border-b [border-bottom-style:solid] border-graygray-50">
          <h1 className="relative flex-1 h-[15px] mt-[-1.00px] font-title-title-l-700 font-[number:var(--title-title-l-700-font-weight)] text-graygray-90 text-[length:var(--title-title-l-700-font-size)] tracking-[var(--title-title-l-700-letter-spacing)] leading-[var(--title-title-l-700-line-height)] whitespace-nowrap [font-style:var(--title-title-l-700-font-style)]">
            {nowPage}
          </h1>
        </header>

        {/* 카테고리 리스트 영역 */}
        {categories.map((cat) => {
          const hasSubItems = cat.items && cat.items.length > 0;
          const isOpened = openCategory === cat.title;
          // 상위 메뉴 활성화 조건: 현재 열려있거나, 자신이 activeItem일 때
          const isCategoryActive = isOpened || cat.title === activeItem;

          return (
            <section key={cat.title} className="flex-col w-64 items-start flex-[0_0_auto] flex relative">
              {/* 대분류 버튼 */}
              <button
                className={`
                  flex h-16 items-center gap-2 px-2 py-0 relative self-stretch w-full bg-graygray-0 text-left
                  border-b [border-bottom-style:solid]
                  ${isCategoryActive 
                    ? "border-b-[3px] border-secondarysecondary-50" 
                    : "border-graygray-30"
                  }
                `}
                onClick={() => handleTitleClick(cat)}
                aria-expanded={isOpened}
              >
                <span className={`
                  relative flex-1 
                  text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)]
                  ${isCategoryActive
                    ? "font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] text-secondarysecondary-50"
                    : "font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] text-graygray-90"
                  }
                `}>
                  {cat.title}
                </span>
                
                {hasSubItems && (
                   // Icon20 대체: Lucide Icon에 제공된 스타일 클래스 적용 (!relative !w-5 !h-5)
                   isOpened 
                   ? <ChevronUp className={`!relative !w-5 !h-5 ${isCategoryActive ? 'text-secondarysecondary-50' : 'text-graygray-90'}`} />
                   : <ChevronDown className={`!relative !w-5 !h-5 ${isCategoryActive ? 'text-secondarysecondary-50' : 'text-graygray-90'}`} />
                )}
              </button>

              {/* 하위 메뉴 (Depth 2) */}
              {hasSubItems && isOpened && (
                <ul className="flex flex-col items-start px-0 py-4 relative self-stretch w-full flex-[0_0_auto] border-b [border-bottom-style:solid] border-graygray-30">
                  {cat.items.map((item) => {
                    const isItemActive = activeItem === item.name;

                    return (
                      <li
                        key={item.name}
                        className={`
                          items-center gap-1 px-4 py-3.5 self-stretch w-full flex-[0_0_auto] rounded-lg flex relative
                          ${isItemActive ? "bg-secondarysecondary-5" : ""}
                        `}
                      >
                        <button
                          onClick={() => navigate(item.path)}
                          className="flex items-start gap-1 grow relative flex-1 text-left"
                        >
                          <span className="flex items-start gap-2 px-0 py-1 relative flex-1 grow">
                            {/* 불릿 포인트 (사각형) */}
                            <span className="inline-flex items-center gap-2.5 pt-2.5 pb-0 px-0 relative flex-[0_0_auto]">
                              <span
                                className="relative w-1 h-1 bg-graygray-80 rounded-sm"
                                aria-hidden="true"
                              />
                            </span>
                            
                            {/* 텍스트 */}
                            <span
                              className={`
                                mt-[-1.00px] relative flex-1
                                text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)]
                                ${isItemActive
                                  ? "font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] text-secondarysecondary-50"
                                  : "font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-90"
                                }
                              `}
                            >
                              {item.name}
                            </span>
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
    </nav>
  );
};

export default UserSideBar;