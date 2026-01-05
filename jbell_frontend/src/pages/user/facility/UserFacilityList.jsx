// src/pages/user/facility/UserFacilityList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, RefreshCw } from 'lucide-react'; // 아이콘 추가

import PageBreadcrumb from "@/components/shared/PageBreadcrumb";
import FacilityListSection from "@/components/shared/FacilityListSection"; // 새로 만든 리스트 섹션

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

  // [더미 데이터]
  const facilityData = [
    { id: 1, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
    { id: 2, type: "민방위대피시설", name: "완산구청 지하주차장", address: "전주시 완산구 효자로 225" },
    { id: 3, type: "한파쉼터", name: "효자1동 주민센터", address: "전주시 완산구 봉곡로 12" },
    { id: 4, type: "한파쉼터", name: "서부시장 경로당", address: "전주시 완산구 강변로 88" },
    { id: 5, type: "무더위쉼터", name: "삼천 도서관", address: "전주시 완산구 용리로 55" },
    { id: 6, type: "무더위쉼터", name: "삼천 도서관 별관", address: "전주시 완산구 용리로 56" },
  ];

  // 2. 핸들러 함수
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log("검색 실행:", filters);
    setCurrentPage(1); // 검색 시 1페이지로 초기화
  };

  const handleReset = () => {
    setFilters({ facilityType: "전체", district: "전체", query: "" });
    setCurrentPage(1);
  };

  const handleDetail = (id) => {
    navigate(`/facility/detail/${id}`);
  };

  // 페이징 계산 (프론트엔드 처리 시)
  const totalPages = Math.ceil(facilityData.length / itemsPerPage);
  const currentItems = facilityData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "대피소 소개", path: "/facilityList", hasIcon: false },
  ];

  return (
    // 전체 레이아웃 래퍼
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0">
      
      {/* 내부 컨테이너 */}
      <div className="w-full max-w-[1000px] flex flex-col">
        
        {/* 1. 브레드크럼 */}
        <PageBreadcrumb items={breadcrumbItems} />

        {/* 2. 페이지 헤더 (요청하신 스타일 적용: Heading XL + mb-16) */}
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

        {/* 3. 검색 필터 영역 (UserNoticeList 스타일 적용) */}
        <div className="bg-graygray-5 border border-graygray-20 p-4 md:p-6 rounded-xl mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
          
          {/* 필터 그룹 (모바일에서 위아래로 쌓임, PC에서 가로배치) */}
          <div className="flex w-full md:w-auto gap-3">
            {/* 시설 유형 선택 */}
            <div className="relative w-1/2 md:w-40 shrink-0">
              <select 
                value={filters.facilityType}
                onChange={(e) => handleFilterChange('facilityType', e.target.value)}
                className="w-full h-12 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시설유형 전체</option>
                <option value="민방위대피시설">민방위대피시설</option>
                <option value="한파쉼터">한파쉼터</option>
                <option value="무더위쉼터">무더위쉼터</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-graygray-50" />
              </div>
            </div>

            {/* 시군구 선택 */}
            <div className="relative w-1/2 md:w-32 shrink-0">
              <select 
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full h-12 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 appearance-none outline-none focus:border-secondary-50 cursor-pointer"
              >
                <option value="전체">시군구 전체</option>
                <option value="완산구">완산구</option>
                <option value="덕진구">덕진구</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-graygray-50" />
              </div>
            </div>
          </div>

          {/* 검색어 입력 */}
          <div className="relative w-full md:flex-1 max-w-lg">
            <input 
              type="text" 
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
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

        {/* 4. 리스트 섹션 (테이블 + 페이지네이션 통합) */}
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