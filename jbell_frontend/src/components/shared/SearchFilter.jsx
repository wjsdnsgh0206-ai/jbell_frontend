// src/components/shared/SearchFilter.jsx
import { Search, ChevronDown, RefreshCw } from 'lucide-react'; // 아이콘 변경 (RefreshCw: 초기화)

const SearchFilter = ({ filters, onFilterChange, onSearch, onReset }) => {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full p-4 md:p-6 bg-white rounded-xl border border-graygray-10 shadow-sm">
      
      {/* 1. 셀렉트 박스 그룹 */}
      <div className="flex w-full md:w-auto gap-3">
        {/* 시설 유형 */}
        <div className="flex flex-col gap-1 w-1/2 md:w-[140px]">
          <label className="text-detail-s font-bold text-graygray-90">시설 유형</label>
          <div className="relative">
            <select
              value={filters.facilityType}
              onChange={(e) => onFilterChange('facilityType', e.target.value)}
              className="w-full h-10 px-3 pr-8 bg-graygray-0 border border-graygray-30 rounded-lg text-body-s appearance-none outline-none focus:border-secondary-50"
            >
              <option value="전체">전체</option>
              <option value="민방위대피시설">민방위대피시설</option>
              <option value="한파쉼터">한파쉼터</option>
              <option value="무더위쉼터">무더위쉼터</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-graygray-50 pointer-events-none" />
          </div>
        </div>

        {/* 시군구 */}
        <div className="flex flex-col gap-1 w-1/2 md:w-[140px]">
          <label className="text-detail-s font-bold text-graygray-90">시군구</label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => onFilterChange('district', e.target.value)}
              className="w-full h-10 px-3 pr-8 bg-graygray-0 border border-graygray-30 rounded-lg text-body-s appearance-none outline-none focus:border-secondary-50"
            >
              <option value="전체">전체</option>
              <option value="완산구">완산구</option>
              <option value="덕진구">덕진구</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-graygray-50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. 검색어 입력 */}
      <div className="flex flex-col gap-1 w-full md:flex-1">
        <label className="text-detail-s font-bold text-graygray-90">시설명</label>
        <div className="relative w-full">
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="시설명을 입력하세요"
            className="w-full h-10 pl-3 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s outline-none focus:border-secondary-50"
          />
          <button 
            onClick={onSearch}
            className="absolute right-2 top-2 p-1 hover:bg-graygray-5 rounded-md"
          >
            <Search className="w-4 h-4 text-graygray-50" />
          </button>
        </div>
      </div>

      {/* 3. 초기화 버튼 */}
      <button
        onClick={onReset}
        className="h-10 px-4 mt-auto flex items-center gap-2 bg-graygray-0 border border-graygray-30 rounded-lg hover:bg-graygray-5 transition-colors whitespace-nowrap"
      >
        <RefreshCw className="w-4 h-4 text-graygray-70" />
        <span className="text-body-s font-medium text-graygray-90 hidden md:inline">초기화</span>
      </button>
    </div>
  );
};

export default SearchFilter;