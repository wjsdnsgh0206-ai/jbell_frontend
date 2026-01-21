// src/pages/user/facility/UserFacilityList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from 'lucide-react';

import PageBreadcrumb from "@/components/shared/PageBreadcrumb";
import FacilityListSection from "@/components/user/facility/FacilityListSection";
import SearchBarTemplate from "@/components/shared/SearchBarTemplate";
import { getFacilityList, facilityPageConfig } from "./data"; 

const UserFacilityList = () => {
  const navigate = useNavigate();
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
    if (filters.facilityType !== "전체") result = result.filter(item => item.type === filters.facilityType);
    if (filters.district !== "전체") result = result.filter(item => item.address.includes(filters.district));
    if (filters.query) result = result.filter(item => item.name.includes(filters.query));

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
        
        <PageBreadcrumb items={meta.breadcrumbs} />

        <header className="flex flex-col w-full gap-8 lg:gap-10 pb-20">
          <div className="flex flex-col gap-4">
            <h1 className="text-heading-xl text-graygray-90">
              {meta.title}
            </h1>
          </div>
        </header>

        <SearchBarTemplate
          keyword={filters.query}
          onKeywordChange={(e) => handleFilterChange('query', e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="시설명을 입력해주세요."
        >
          {/* 👇 여기에 이 페이지에 필요한 필터만 쏙 넣습니다. */}
          
          {/* 필터 1: 시설 유형 */}
          <div className="relative w-full lg:w-40">
            <select 
              value={filters.facilityType}
              onChange={(e) => handleFilterChange('facilityType', e.target.value)}
              className="w-full lg:min-w-fit h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="전체">시설유형 전체</option>
              {filterOptions.facilityTypes.map((type, idx) => (
                type !== "전체" && <option key={idx} value={type}>{type}</option>
              ))}
            </select>
            {/* 화살표 아이콘 등은 필요 시 추가 */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>

          {/* 필터 2: 시군구 */}
          <div className="relative w-full lg:w-auto">
            <select 
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full lg:min-w-fit h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="전체">시군구 전체</option>
              {filterOptions.districts.map((district, idx) => (
                district !== "전체" && <option key={idx} value={district}>{district}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>
          
        </SearchBarTemplate>

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