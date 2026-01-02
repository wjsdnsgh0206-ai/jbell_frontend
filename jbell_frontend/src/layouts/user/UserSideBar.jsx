import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const UserSideBar = () => {
  // 현재 탬  + 활성화된 메뉴 + 하위메뉴 + 메뉴 명 배열로 받아서 요소의 수만큼 반복 하여 배열로 반환 하면 여기서 자동으로 만들어줌
  // 현재 열려있는 메인 카테고리 관리 (기본값: '재난별행동요령')
  const [openCategory, setOpenCategory] = useState('재난별행동요령');

  const categories = [
    {
      title: '재난별행동요령',
      items: ['지진', '태풍', '호우', '홍수', '산사태'],
    },
    { title: '사고별행동요령', items: [] },
    { title: '생활안전행동요령', items: [] },
    { title: '재난약자행동요령', items: [] },
    { title: '긴급상황대처', items: [] },
  ];

  // 활성화된 서브 메뉴 아이템 (이미지상 '태풍')
  const activeItem = '태풍';

  return (
    <div className="w-80 border-t border-gray-300 bg-white font-sans">
      <h2 className="p-4 text-xl font-bold text-gray-800">행동요령</h2>
      
      <div className="border-b border-gray-200">
        {categories.map((cat) => (
          <div key={cat.title} className="border-b border-gray-100 last:border-none">
            {/* 메인 카테고리 헤더 */}
            <button
              onClick={() => setOpenCategory(openCategory === cat.title ? '' : cat.title)}
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