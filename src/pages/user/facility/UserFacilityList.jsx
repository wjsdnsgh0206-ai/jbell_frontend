import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from 'lucide-react';

import PageBreadcrumb from "@/components/shared/PageBreadcrumb";
import FacilityListSection from "@/components/user/facility/FacilityListSection";
import SearchBarTemplate from "@/components/shared/SearchBarTemplate";
import { facilityPageConfig } from "./data"; 
import { facilityService, commonService } from "@/services/api"; // commonService 추가

const UserFacilityList = () => {
  const navigate = useNavigate();
  const { meta } = facilityPageConfig;

  // 1. 상태 관리
  const [filters, setFilters] = useState({
    facilityType: "", // 초기값 빈 문자열 (전체)
    district: "",     // 초기값 빈 문자열 (전체)
    query: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [facilityList, setFacilityList] = useState([]);
  const [loading, setLoading] = useState(false);

  // DB에서 가져올 옵션 상태
  const [districtOptions, setDistrictOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  // 2. 공통 코드 로드 (시군구 및 시설유형)
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // 시군구 코드 (AREA_JB)와 시설유형 코드 (SHELTER_TYPE) 병렬 호출
        const [distRes, typeRes] = await Promise.all([
          commonService.getCodeList('AREA_JB'),
          commonService.getCodeList('SHELTER_TYPE')
        ]);
        
        if (distRes?.data) setDistrictOptions(distRes.data);
        if (typeRes?.data) setTypeOptions(typeRes.data);
      } catch (error) {
        console.error("옵션 데이터 로드 실패:", error);
      }
    };
    loadOptions();
  }, []);

  // 3. 데이터 로드 함수 (서버 연동)
  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ctpvNm: "전북",
        sggNm: filters.district,     // DB에서 가져온 name 값
        fcltSeCd: filters.facilityType, // DB에서 가져온 code(ID) 값
        fcltNm: filters.query,
        page: currentPage,
        size: 10
      };

      const response = await facilityService.getFacilityList(params);
      const items = response.data?.items || [];
      const total = response.data?.total || 0;

      // UI 포맷에 맞게 매핑
      const formattedItems = items.map(item => ({
        ...item,
        id: item.fcltId,
        name: item.fcltNm,
        // 유형 이름은 옵션 리스트에서 찾아오거나 백엔드에서 받아온 값 사용
        type: typeOptions.find(t => t.code === item.fcltSeCd)?.name || "시설",
        address: item.roadNmAddr,
      }));

      setFacilityList(formattedItems);
      setTotalItems(total);
    } catch (error) {
      console.error("목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, typeOptions]);

  useEffect(() => {
    fetchFacilities();
  }, [currentPage, fetchFacilities]);

  // 4. 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchFacilities();
  };

  const handleReset = () => {
    setFilters({ facilityType: "", district: "", query: "" });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / 10);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0">
      <div className="w-full max-w-[1000px] flex flex-col">
        <PageBreadcrumb items={meta.breadcrumbs} />

        <header className="flex flex-col w-full gap-8 lg:gap-10 pb-20">
          <h1 className="text-heading-xl text-graygray-90">{meta.title}</h1>
        </header>

        <SearchBarTemplate
          keyword={filters.query}
          onKeywordChange={(e) => handleFilterChange('query', e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="시설명을 입력해주세요."
        >
          {/* 필터 1: 시설 유형 (DB 연동) */}
          <div className="relative w-full lg:w-48">
            <select 
              value={filters.facilityType}
              onChange={(e) => handleFilterChange('facilityType', e.target.value)}
              className="w-full h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="">시설유형 전체</option>
              {typeOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>{opt.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>

          {/* 필터 2: 시군구 (DB 연동) */}
          <div className="relative w-full lg:w-40">
            <select 
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="">시군구 전체</option>
              {districtOptions.map((opt) => (
                <option key={opt.code} value={opt.name}>{opt.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>
        </SearchBarTemplate>

        <FacilityListSection 
          items={facilityList}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onDetail={(id) => navigate(`/facility/detail/${id}`)}
        />
      </div>
    </div>
  );
};

export default UserFacilityList;