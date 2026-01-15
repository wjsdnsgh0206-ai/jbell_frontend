// src/components/shared/SearchBarTemplate.jsx
import React from 'react';
import { Search, RefreshCw } from 'lucide-react'; 
import { Button } from '@/components/shared/Button';

const SearchBarTemplate = ({ 
  children,           // 👈 여기가 핵심! 페이지마다 다른 필터가 들어올 자리
  keyword,            // 검색어 상태
  onKeywordChange,    // 검색어 변경 핸들러
  onSearch,           // 검색 버튼 클릭 핸들러
  onReset,            // 초기화 버튼 클릭 핸들러
  placeholder = "검색어를 입력해주세요."
}) => {
  return (
    <div className="bg-graygray-5 border border-graygray-20 p-4 md:p-6 rounded-xl mb-10 flex flex-col lg:flex-row justify-center items-center gap-3">
      
      {/* 1. 동적 필터 영역 (페이지마다 다름) */}
      <div className="grid grid-cols-2 gap-2 w-full lg:flex lg:w-auto lg:gap-3 text-body-m">
        {children}
      </div>

      {/* 2. 공통 검색어 입력 영역 (삭제 버튼 포함) */}
      <div className="flex-1 relative w-full">
        <input 
          type="text" 
          value={keyword}
          onChange={onKeywordChange}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()} 
          placeholder={placeholder}
          className="w-full bg-graygray-0 border border-graygray-30 focus:border-blue-600 rounded-md px-5 py-3.5 text-body-m outline-none transition-all placeholder:text-graygray-40 text-graygray-90"
        />
        {/* 삭제 버튼 추가: keyword가 있을 때만 노출 */}
        {keyword && (
          <button 
            type="button" 
            onClick={() => onKeywordChange({ target: { value: '' } })} 
            className="absolute right-5 top-1/2 -translate-y-1/2 text-graygray-40 hover:text-graygray-60 transition-colors"
          >
            <span className="text-[20px] leading-none">✕</span>
          </button>
        )}
      </div>

      {/* 3. 공통 버튼 그룹 */}
      <div className="flex w-full lg:w-auto gap-2">
        <Button 
          variant="secondary"
          onClick={onSearch}
          size="flex"
          className="flex-1 lg:flex-none h-[54px] text-body-m-bold px-6"
        >
          <Search className="w-5 h-5 mr-1" />
          검색
        </Button>

        <Button 
          variant="tertiary"
          onClick={onReset}
          size="none"
          className="h-[54px] px-5 border border-graygray-60 text-graygray-90"
          title="초기화"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBarTemplate;