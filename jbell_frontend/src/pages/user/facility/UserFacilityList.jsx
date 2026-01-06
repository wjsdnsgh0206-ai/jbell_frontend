import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, RefreshCw } from 'lucide-react';

import PageBreadcrumb from "@/components/shared/PageBreadcrumb";
import FacilityListSection from "@/components/shared/FacilityListSection";
import { getFacilityList } from "./data"; // Mock Data 함수

const UserFacilityList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [filters, setFilters] = useState({
    facilityType: "전체",
    district: "전체",
    query: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 데이터 상태 관리
  const [allData, setAllData] = useState([]);       // 원본 데이터 (검색 기준)
  const [filteredData, setFilteredData] = useState([]); // 화면에 보여줄 데이터 (필터링 결과)

  // 2. 초기 데이터 로드 (컴포넌트 마운트 시)
  useEffect(() => {
    const data = getFacilityList(); // data.js에서 가져오기
    setAllData(data);
    setFilteredData(data); // 초기엔 전체 데이터 표시
  }, []);

  // 3. 핸들러 함수
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // [기능 추가] 프론트엔드 검색 필터링 로직
  const handleSearch = () => {
    let result = allData;

    // 1) 시설 유형 필터
    if (filters.facilityType !== "전체") {
      result = result.filter(item => item.type === filters.facilityType);
    }

    // 2) 시군구 필터 (주소에 포함 여부로 확인)
    if (filters.district !== "전체") {
      result = result.filter(item => item.address.includes(filters.district));
    }

    // 3) 시설명 검색
    if (filters.query) {
      result = result.filter(item => item.name.includes(filters.query));
    }

    setFilteredData(result);
    setCurrentPage(1); // 검색 후 1페이지로 이동
  };

  const handleReset = () => {
    setFilters({ facilityType: "전체", district: "전체", query: "" });
    setFilteredData(allData); // 전체 데이터로 복구
    setCurrentPage(1);
  };

  const handleDetail = (id) => {
    navigate(`/facility/detail/${id}`);
  };

  // 4. 페이징 계산 (filteredData 기준으로 계산)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "대피소 소개", path: "/facilityList", hasIcon: false },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0">
      <div className="w-full max-w-[1000px] flex flex-col">
        
        <PageBreadcrumb items={breadcrumbItems} />

        <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-heading-xl text-graygray-90">
              대피소 소개
            </h1>
            <p className="text-detail-m text-graygray-70">
              최종 정보 수정일: 2025년 12월 16일
            </p>
          </div>
        </header>

        {/* 3. 검색 필터 영역 */}
        <div className="bg-graygray-5 border border-graygray-20 p-4 md:p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
          
          <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:gap-3">
            {/* 시설 유형 선택 */}
            <div className="relative w-full md:w-40">
              <select 
                value={filters.facilityType}
                onChange={(e) => handleFilterChange('facilityType', e.target.value)}
                className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시설유형 전체</option>
                <option value="민방위대피시설">민방위대피시설</option>
                <option value="한파쉼터">한파쉼터</option>
                <option value="무더위쉼터">무더위쉼터</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-graygray-50" />
              </div>
            </div>

            {/* 시군구 선택 */}
            <div className="relative w-full md:w-32">
              <select 
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full h-12 px-4 pr-8 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시군구 전체</option>
                <option value="완산구">완산구</option>
                <option value="덕진구">덕진구</option>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // 엔터키 검색 지원
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