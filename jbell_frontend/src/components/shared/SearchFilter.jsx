import React from 'react';
import { Search, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/shared/Button'; // 만드신 Button 컴포넌트 경로

const SearchFilter = ({ 
  filters, 
  options, 
  onChange, 
  onSearch, 
  onReset 
}) => {
  return (
    <div className="bg-graygray-5 border border-graygray-20 p-4 md:p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
      
      <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
        {/* 시설 유형 선택 */}
        <div className="relative w-full md:w-40">
          <select 
            value={filters.facilityType}
            onChange={(e) => onChange('facilityType', e.target.value)}
            className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
          >
            <option value="전체">시설유형 전체</option>
            {options.facilityTypes
              .filter(type => type !== "전체")
              .map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-graygray-50" />
          </div>
        </div>

        {/* 시군구 선택 */}
        <div className="relative w-full md:w-32">
          <select 
            value={filters.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
          >
            <option value="전체">시군구 전체</option>
            {options.districts
              .filter(district => district !== "전체")
              .map((district, idx) => (
                <option key={idx} value={district}>{district}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-graygray-50" />
          </div>
        </div>
      </div>

      {/* 검색어 입력 */}
      <div className="relative w-full md:flex-1 max-w-lg">
        <input 
          type="text" 
          value={filters.query}
          onChange={(e) => onChange('query', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()} 
          placeholder="시설명을 입력해주세요." 
          className="w-full h-12 px-4 bg-white border border-graygray-30 rounded-lg text-body-s placeholder:text-graygray-40 outline-none focus:border-secondary-50"
        />
      </div>

      {/* 버튼 그룹 (Custom Button 적용) */}
      <div className="flex w-full md:w-auto gap-2">
        {/* 검색 버튼: Primary 스타일 + 높이 48px(h-12)로 조정 */}
        <Button 
          variant="primary"
          onClick={onSearch}
          className="flex-1 md:flex-none h-12"
        >
          <Search className="w-5 h-5" />
          검색
        </Button>

        {/* 초기화 버튼: Tertiary 스타일 + 높이 48px(h-12) + 패딩 조정 */}
        <Button 
          variant="tertiary"
          onClick={onReset}
          className="h-12 px-4"
          title="초기화"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};

export default SearchFilter;