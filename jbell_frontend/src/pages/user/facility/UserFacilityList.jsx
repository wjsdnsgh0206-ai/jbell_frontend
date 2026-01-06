// src/pages/user/facility/UserFacilityList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, RefreshCw } from 'lucide-react';

import PageBreadcrumb from "@/components/shared/PageBreadcrumb";
import FacilityListSection from "@/components/user/facility/FacilityListSection";
// [변경] 설정 데이터(facilityPageConfig) 추가 import
import { getFacilityList, facilityPageConfig } from "./data"; 

const UserFacilityList = () => {
  const navigate = useNavigate();
  
  // config 데이터 구조 분해 할당 (사용하기 편하게)
  const { meta, filterOptions } = facilityPageConfig;

  // 1. 상태 관리
  const [filters, setFilters] = useState({
    facilityType: "전체",
    district: "전체",
    query: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [allData, setAllData] = useState([]);       
  const [filteredData, setFilteredData] = useState([]); 

  // 2. 초기 데이터 로드
  useEffect(() => {
    const data = getFacilityList();
    setAllData(data);
    setFilteredData(data);
  }, []);

  // 3. 핸들러 함수
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    let result = allData;

    if (filters.facilityType !== "전체") {
      result = result.filter(item => item.type === filters.facilityType);
    }

    if (filters.district !== "전체") {
      result = result.filter(item => item.address.includes(filters.district));
    }

    if (filters.query) {
      result = result.filter(item => item.name.includes(filters.query));
    }

    setFilteredData(result);
    setCurrentPage(1); 
  };

  const handleReset = () => {
    setFilters({ facilityType: "전체", district: "전체", query: "" });
    setFilteredData(allData); 
    setCurrentPage(1);
  };

  const handleDetail = (id) => {
    navigate(`/facility/detail/${id}`);
  };

  // 4. 페이징 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0">
      <div className="w-full max-w-[1000px] flex flex-col">
        
        {/* [변경] data.js의 meta 정보 사용 */}
        <PageBreadcrumb items={meta.breadcrumbs} />

        <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
          <div className="flex flex-col gap-4">
            {/* [변경] 타이틀과 날짜도 데이터에서 가져옴 */}
            <h1 className="text-heading-xl text-graygray-90">
              {meta.title}
            </h1>
            <p className="text-detail-m text-graygray-70">
              최종 정보 수정일: {meta.lastUpdated}
            </p>
          </div>
        </header>

        {/* 3. 검색 필터 영역 */}
        <div className="bg-graygray-5 border border-graygray-20 p-4 md:p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
          
          <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
            
            {/* [변경] 시설 유형 선택 (map으로 렌더링) */}
            <div className="relative w-full md:w-40">
              <select 
                value={filters.facilityType}
                onChange={(e) => handleFilterChange('facilityType', e.target.value)}
                className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시설유형 전체</option>
                {filterOptions.facilityTypes
                  .filter(type => type !== "전체") // '전체' 중복 방지 (선택사항)
                  .map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-graygray-50" />
              </div>
            </div>

            {/* [변경] 시군구 선택 (map으로 렌더링) */}
            <div className="relative w-full md:w-32">
              <select 
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시군구 전체</option>
                {filterOptions.districts
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
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
              placeholder="시설명을 입력해주세요." 
              className="w-full h-12 px-4 bg-white border border-graygray-30 rounded-lg text-body-s placeholder:text-graygray-40 outline-none focus:border-secondary-50"
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex w-full md:w-auto gap-2">
            <button 
              onClick={handleSearch}
              className="flex-1 md:flex-none h-12 px-6 bg-secondary-50 text-white text-body-m font-bold rounded-lg hover:bg-secondary-60 transition-colors shadow-sm active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              검색
            </button>
            <button 
              onClick={handleReset}
              className="h-12 px-4 bg-white border border-graygray-30 text-graygray-70 rounded-lg hover:bg-graygray-5 transition-colors active:scale-95"
              title="초기화"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4. 리스트 섹션 */}
        <FacilityListSection 
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onDetail={handleDetail}
        />

      </div>
    </div>
  );
};

export default UserFacilityList;