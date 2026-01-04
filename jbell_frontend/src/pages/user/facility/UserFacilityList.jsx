// src/pages/user/facility/UserFacilityList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 공통 컴포넌트 import
import ListPageTemplate from "@/components/shared/ListPageTemplate";
import SearchFilter from "@/components/shared/SearchFilter";
import FacilityTable from "@/components/shared/FacilityTable";
import Pagenation from "@/components/user/board/Pagination"; // 기존 페이지네이션

const UserFacilityList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리 (필터 통합)
  const [filters, setFilters] = useState({
    facilityType: "전체",
    district: "전체",
    query: ""
  });

  // [더미 데이터] 추후 API 데이터로 교체
  const facilityData = [
    { id: 1, type: "민방위대피시설", name: "전주 시민공원 대피소", address: "전주시 완산구 효자로 444" },
    { id: 2, type: "민방위대피시설", name: "완산구청 지하주차장", address: "전주시 완산구 효자로 225" },
    { id: 3, type: "한파쉼터", name: "효자1동 주민센터", address: "전주시 완산구 봉곡로 12" },
    { id: 4, type: "한파쉼터", name: "서부시장 경로당", address: "전주시 완산구 강변로 88" },
    { id: 5, type: "무더위쉼터", name: "삼천 도서관", address: "전주시 완산구 용리로 55" },
  ];

  // 2. 핸들러 함수
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    console.log("검색 실행:", filters);
    // API 호출 로직 추가
  };

  const handleReset = () => {
    setFilters({ facilityType: "전체", district: "전체", query: "" });
  };

  const handleDetail = (id) => {
    navigate(`/facility/detail/${id}`);
  };

  return (
    <ListPageTemplate
      title="대피소 소개"
      lastUpdated="2025년 12월 16일"
      breadcrumbItems={[
        { label: "홈", hasIcon: true },
        { label: "대피소 소개", hasIcon: false },
      ]}
    >
      {/* 1. 검색 필터 */}
      <SearchFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSearch={handleSearch} 
        onReset={handleReset} 
      />

      {/* 2. 리스트 테이블 */}
      <FacilityTable 
        data={facilityData} 
        onDetail={handleDetail} 
      />

      {/* 3. 페이지네이션 (중앙 정렬) */}
      <div className="flex justify-center mt-4">
        <Pagenation />
      </div>

    </ListPageTemplate>
  );
};

export default UserFacilityList;