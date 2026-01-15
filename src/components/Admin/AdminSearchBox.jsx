// src/components/admin/AdminSearchBox.jsx
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

/**
 * [공통] 관리자용 검색/필터 박스 컴포넌트
 * - 조건 선택(Select) + 검색어 입력(Input) + 액션 버튼(검색/초기화)을 표준화한 UI입니다.
 * - 'children' 프롭스를 사용하여 각 페이지에 맞는 커스텀 필터를 유동적으로 삽입할 수 있습니다.
 * * @param {Array} options - (기본형) 별도의 children이 없을 때 사용할 단일 Select용 옵션 [{value, label}]
 * @param {Object} searchParams - 부모에서 관리하는 검색 상태 객체 (예: { keyword: '', category: '' })
 * @param {Function} setSearchParams - 검색 상태 변경 함수
 * @param {Function} onSearch - 검색 실행 함수 (검색 버튼 클릭 및 엔터키 입력 시 호출)
 * @param {Function} onReset - 초기화 실행 함수 (모든 필터 및 검색어 리셋)
 * @param {ReactNode} children - ★핵심: 2단 Select나 기간 선택기 등 페이지별 커스텀 필터를 끼워넣는 슬롯(Slot)
 */
const AdminSearchBox = ({ 
  options = [],        
  searchParams,        
  setSearchParams,     
  onSearch,            
  onReset,             
  children             
}) => {
  
  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  // 입력값 변경 공통 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between w-full">
      
      {/* 1. 좌측: 검색 조건 영역 (유동적 필터 + 검색어 입력) */}
      <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
        
        {/* [A] 커스텀 필터 Slot: 부모 태그 사이(<AdminSearchBox>...</AdminSearchBox>)에 작성한 내용이 주입됨 */}
        {children ? (
          children
        ) : (
          /* [B] 기본형 Select: 커스텀 필터(children)가 없을 때만 표시되는 기본 선택창 */
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

        {/* [C] 검색어 입력창: 모든 검색박스에 공통으로 들어가는 입력 영역 */}
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
          {/* 검색어가 있을 때만 노출되는 지우기(X) 버튼 */}
          {searchParams.keyword && (
             <button 
               onClick={() => setSearchParams(prev => ({ ...prev, keyword: '' }))}
               className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
             >
               ✕
             </button>
          )}
          {/* 돋보기 아이콘 (데코레이션) */}
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* 2. 우측: 액션 버튼 영역 (검색 / 초기화) */}
      <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
        {/* 검색 실행 버튼 */}
        <button
          onClick={onSearch}
          className="px-8 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          검색
        </button>

        {/* 초기화 버튼: 모든 검색 조건과 입력값을 리셋 */}
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