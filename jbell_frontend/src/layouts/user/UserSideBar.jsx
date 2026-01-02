import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const UserSideBar = ({ 
  nowPage = '페이지', 
  activeItem = '태풍', 
  categories = [], 
  onItemClick // 메뉴 클릭 시 실행될 함수 (페이지 이동용)
}) => {
  // 현재 열려있는 메인 카테고리 관리 (기본값은 activeItem이 포함된 카테고리나 첫 번째 카테고리)
  const initialCategory = categories.find(cat => cat.items.includes(activeItem))?.title || categories[0]?.title;
  const [openCategory, setOpenCategory] = useState(initialCategory);

  const handleCategoryClick = (title) => {
    setOpenCategory(openCategory === title ? '' : title);
  };

  return (
    <div className="w-80 border-t border-gray-300 bg-white font-sans">
      {/* 백틱 처리 수정: 변수 그대로 출력 */}
      <h2 className="p-4 text-xl font-bold text-gray-800">{nowPage}</h2>
      
      <div className="border-b border-gray-200">
        {categories.map((cat) => (
          <div key={cat.title} className="border-b border-gray-100 last:border-none">
            {/* 메인 카테고리 헤더 */}
            <button
              onClick={() => handleCategoryClick(cat.title)}
              className={`flex w-full items-center justify-between p-4 text-left font-bold transition-colors ${
                openCategory === cat.title ? 'text-[#003d7a] border-b-2 border-[#003d7a]' : 'text-gray-700'
              }`}
            >
              <span>{cat.title}</span>
              {openCategory === cat.title ? (
                <ChevronUp size={20} className="text-[#003d7a]" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {/* 서브 메뉴 리스트 (아코디언 내용) */}
            {openCategory === cat.title && cat.items.length > 0 && (
              <ul className="bg-white py-2">
                {cat.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onItemClick && onItemClick(cat.title, item)}
                      className={`relative flex w-[90%] mx-auto my-1 items-center rounded-lg p-3 text-left transition-all ${
                        activeItem === item
                          ? 'bg-[#edf2f7] font-bold text-[#003d7a]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2 text-xs opacity-60">•</span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSideBar;