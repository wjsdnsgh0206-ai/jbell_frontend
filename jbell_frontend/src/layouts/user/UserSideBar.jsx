import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserSideBar = ({ nowPage, activeItem, categories = [] }) => {
  const navigate = useNavigate();
  
  const initialCategory = categories.find(cat => 
    cat.items && cat.items.some(item => item.name === activeItem)
  )?.title || categories[0]?.title;

  const [openCategory, setOpenCategory] = useState(initialCategory);

  const handleTitleClick = (cat) => {
    const hasSubItems = cat.items && cat.items.length > 0;

    // 1. 하위 메뉴가 있으면 아코디언 토글
    if (hasSubItems) {
      setOpenCategory(openCategory === cat.title ? '' : cat.title);
    }
    
    // 2. 타이틀 자체에 path가 있으면 해당 경로로 이동
    if (cat.path) {
      navigate(cat.path);
    }
  };

  return (
    <div className="w-80 border-t border-gray-300 bg-white font-sans h-full text-left">
      <h2 className="p-4 text-xl font-bold text-gray-800 border-b border-gray-50">{nowPage}</h2>
      
      <div className="border-b border-gray-200">
        {categories.map((cat) => {
          const hasSubItems = cat.items && cat.items.length > 0;
          const isSelected = openCategory === cat.title;

          return (
            <div key={cat.title} className="border-b border-gray-100 last:border-none">
              <button
                onClick={() => handleTitleClick(cat)}
                className={`flex w-full items-center justify-between p-4 text-left font-bold transition-all ${
                  isSelected && hasSubItems
                    ? 'text-[#003d7a] border-b-2 border-[#003d7a] bg-blue-50/30' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{cat.title}</span>
                
                {/* 하위 메뉴가 있을 때만 화살표 노출 */}
                {hasSubItems && (
                  isSelected ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>

              {/* 하위 메뉴 리스트 */}
              {hasSubItems && isSelected && (
                <ul className="bg-gray-50 py-2 border-t border-gray-50">
                  {cat.items.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`relative flex w-[90%] mx-auto my-1 items-center rounded-lg p-3 text-left transition-all ${
                          activeItem === item.name
                            ? 'bg-white font-bold text-[#003d7a] shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-2 text-xs opacity-60">•</span>
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSideBar;