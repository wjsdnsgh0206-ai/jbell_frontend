// src/components/admin/AdminSearchBox.jsx
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const AdminSearchBox = ({ 
  options = [],        // (기본형) 단일 Select용 옵션
  searchParams,        // 검색 상태 객체 (keyword 포함)
  setSearchParams,     // 검색 상태 변경 함수
  onSearch,            // 검색 실행
  onReset,             // 초기화 실행
  children             // ★ 핵심: 부모에서 정의한 커스텀 필터들을 끼워넣을 Slot
}) => {
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between w-full">
      
      {/* 1. 좌측: 검색 조건 영역 (유동적) */}
      <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
        
        {/* [A] 커스텀 필터 Slot (children이 있으면 우선 렌더링) */}
        {children ? (
          children
        ) : (
          /* [B] 기본형 Select (children이 없을 때만 사용) */
          options.length > 0 && (
            <div className="relative">
              <select
                name="category"
                value={searchParams.category || ''}
                onChange={handleChange}
                className="h-14 pl-3 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer min-w-[140px]"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )
        )}

        {/* [C] 검색어 입력 (공통) */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력해주세요"
            className="w-full h-14 pl-5 pr-12 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary placeholder:text-gray-400 focus:border-admin-primary outline-none transition-all"
          />
          {searchParams.keyword && (
             // 검색어 지우기 버튼 (UX 추가)
             <button 
               onClick={() => setSearchParams(prev => ({ ...prev, keyword: '' }))}
               className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
             >
               ✕
             </button>
          )}
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* 2. 우측: 액션 버튼 영역 */}
      <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
        <button
          onClick={onSearch}
          className="px-8 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          검색
        </button>

        <button
          onClick={onReset}
          className="px-6 h-14 bg-white text-graygray-50 border border-admin-border font-bold rounded-md hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
        >
          <RotateCcw size={18} />
          초기화
        </button>
      </div>

    </div>
  );
};

export default AdminSearchBox;