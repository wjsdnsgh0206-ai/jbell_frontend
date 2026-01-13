// src/components/admin/AdminSearchBox.jsx
// 조건(Select) + 검색어(Input) + 기간(Date - 추후 확장 대비) + 액션 버튼의 조합을 표준화
import React, { useState } from 'react';
import { Search, RotateCcw, Calendar } from 'lucide-react';

const AdminSearchBox = ({ 
  children,    // 부모에서 전달한 입력 필드들 (Select, Input 등)
  onSearch,    // 검색 버튼 함수
  onReset      // 초기화 버튼 함수
}) => {
  
  // 엔터키 감지 (검색 실행)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
      
      {/* 1. 좌측: 검색 조건 영역 */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        {/* 검색 조건 (Select) */}
        <div className="relative">
          <select
            name="category"
            value={searchParams.category}
            onChange={handleChange}
            className="h-10 pl-3 pr-8 text-sm border border-admin-border rounded bg-white text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all cursor-pointer min-w-[140px]"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 검색어 입력 (Input) */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="w-full h-10 pl-4 pr-10 text-sm border border-admin-border rounded bg-white text-admin-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all"
          />
          {/* 아이콘 장식 (기능 없음) */}
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* 2. 우측: 액션 버튼 영역 */}
      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        
        {/* 검색 버튼 */}
        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-2 px-6 h-10 bg-[#1890ff] hover:bg-[#096dd9] text-white text-sm font-medium rounded transition-colors shadow-sm active:scale-95 flex-1 md:flex-none"
        >
          <Search className="w-4 h-4" />
          <span>검색</span>
        </button>

        {/* 초기화 버튼 */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 h-10 bg-white border border-admin-border text-admin-text-secondary hover:bg-gray-50 hover:text-admin-text-primary text-sm font-medium rounded transition-colors flex-1 md:flex-none"
          title="검색 조건 초기화"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="md:hidden">초기화</span> {/* 모바일에서만 텍스트 노출 */}
        </button>
      </div>

    </div>
  );
};

export default AdminSearchBox;