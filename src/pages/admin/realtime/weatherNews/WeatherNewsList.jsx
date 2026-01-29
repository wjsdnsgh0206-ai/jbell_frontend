"use no memo";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, RotateCcw, Calendar, Search } from "lucide-react";
import { disasterApi } from '@/services/api';
import { WEATHER_OPTIONS } from "./WeatherTypeData";


// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";


const WeatherNewsList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [weatherNews, setWeatherNews] = useState([]); 
  const [totalCount, setTotalCount] = useState(0);

  // 기존 속성명 유지: filters
  const [filters, setFilters] = useState({
    newsType: "전체",
    region: "전체",
    level: "전체",
    startDate: "2023-10-10",
    endDate: "2026-12-31",
  });

  // AdminSearchBox용 키워드 상태
  const [searchParams, setSearchParams] = useState({ keyword: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "confirm", onConfirm: () => {} });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 관리");
  }, [setBreadcrumbTitle]);



  // API 호출 로직
  const fetchWeatherData = useCallback(async () => {
    try {
      const params = {
        ttl: filters.newsType === "전체" ? "" : filters.newsType,
        rlvtZone: filters.region === "전체" ? "" : filters.region,
        lvl: filters.level === "전체" ? "" : filters.level,
        startDate: filters.startDate,
        endDate: filters.endDate,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        keyword: searchParams.keyword // 통합 검색 키워드
      };

      const response = await disasterApi.getSavedWeatherWarnings(params);
      
      // 백엔드 Map 구조(list, totalCount)에 대응
      const mappedData = (response.list || []).map(item => ({
        id: String(item.prsntnSn),
        level: item.lvl || "보통",
        type: item.ttl || "기상특보",
        title: item.ttl || "-",
        content: item.rlvtZone || "-",
        dateTime: item.prsntnTm || "",
        isVisible: item.visibleYn === 'Y'
      }));

      setWeatherNews(mappedData);
      setTotalCount(response.totalCount || 0);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  }, [currentPage, filters, searchParams.keyword]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);


  // ==================================================================================
  // 2. 필터링 로직 (기존 속성명 및 로직 유지)
  // ==================================================================================
  const filteredData = weatherNews;
  const paginatedData = weatherNews;


  // ==================================================================================
  // 3. 핸들러
  // ==================================================================================
  const handleSearch = () => {
    setCurrentPage(1); // 페이지 초기화 시 fetchWeatherData 자동 실행
  };

  const handleReset = () => {
    setFilters({ 
      newsType: "전체", 
      region: "전체", 
      level: "전체", 
      startDate: "2023-10-10", 
      endDate: "2026-12-31" 
    });
    setSearchParams({ keyword: '' });
    setCurrentPage(1);
  };

  const getAllSelectedItemsList = () => {
    const selectedItems = weatherNews.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title.substring(0, 10) + "...").join(", ");
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: async () => {
      try {
        await disasterApi.updateWeatherVisibility(selectedIds, status ? 'Y' : 'N');
        fetchWeatherData(); // 데이터 재로드
        setSelectedIds([]); 
        setIsModalOpen(false);
      } catch (e) { alert("처리 중 오류가 발생했습니다."); }
    }
  });
  setIsModalOpen(true);
};

  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setModalConfig({
      title: "노출 상태 변경",
      message: <p>해당 항목의 상태를 [{nextStatus ? "노출" : "비노출"}]로 변경하시겠습니까?</p>,
      type: nextStatus ? "confirm" : "delete",
      onConfirm: () => {
        setWeatherNews(prev => prev.map(item => item.id === id ? { ...item, isVisible: nextStatus } : item));
        setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
      try {
        await disasterApi.deleteWeatherWarnings(selectedIds);
        fetchWeatherData();
        setSelectedIds([]);
        setIsModalOpen(false);
      } catch (e) { alert("삭제 실패"); }
    }
  });
  setIsModalOpen(true);
};

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/weatherNewsDetail/${id}`);
  }, [navigate]);

  const columns = useMemo(() => [
    { key: "id", header: "ID", width: "180px", className: "text-center" },
    { key: "level", header: "경보수준", width: "100px", className: "text-center" },
    { key: "type", header: "특보유형", width: "120px", className: "text-center" },
    { key: "title", header: "특보내용", width: "400px", className: "text-left px-4" },
    { key: "dateTime", header: "발효일시", width: "180px", className: "text-center text-gray-500" },
    { 
      key: "isVisible", header: "노출여부", width: "100px",
      render: (visible, row) => (
        <div className="flex justify-center">
          <button onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id, visible); }} className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? "bg-admin-primary" : "bg-gray-300"}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      )
    },
    { 
      key: "actions", header: "상세", width: "80px", className: "text-center", 
      render: (_, row) => (
        <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors font-normal">보기</button> 
      )
    }
  ], [goDetail]);

  // ==================================================================================
  // 4. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">기상 특보 관리</h2>

        {/* [A] 검색 영역: AdminSearchBox 사용 (보도자료 UI 스타일 그대로) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 특보 유형 */}
            <div className="relative w-full md:w-40">
              <select 
                value={filters.newsType} 
                onChange={(e) => {
                  setFilters({ ...filters, newsType: e.target.value });
                  setCurrentPage(1);
                }} 
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                <option value="전체">특보 유형 전체</option>
                {["한파", "건조", "호우", "폭염", "강풍", "대설"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 지역 선택 */}
            <div className="relative w-full md:w-40">
              <select 
                value={filters.region} 
                onChange={(e) => {
                  setFilters({ ...filters, region: e.target.value });
                  setCurrentPage(1);
                }} 
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                <option value="전체">지역 전체</option>
                {["전주시", "서울", "경기도"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 경보 수준 */}
            <div className="relative w-full md:w-40">
              <select 
                value={filters.level} 
                onChange={(e) => {
                  setFilters({ ...filters, level: e.target.value });
                  setCurrentPage(1);
                }} 
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-primary font-bold focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                <option value="전체">수준 전체</option>
                {["위험", "주의", "보통"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 발효 일시 기간 필터 */}
            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center gap-2">
                <div className="group relative flex items-center w-[130px]">
                  <input 
                    type="date" 
                    value={filters.startDate} 
                    onChange={(e) => {
                      setFilters({ ...filters, startDate: e.target.value });
                      setCurrentPage(1);
                    }} 
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 transition-colors group-hover:text-admin-primary pointer-events-none" />
                </div>
                <span className="text-graygray-30 mx-1">-</span>
                <div className="group relative flex items-center w-[130px]">
                  <input 
                    type="date" 
                    value={filters.endDate} 
                    onChange={(e) => {
                      setFilters({ ...filters, endDate: e.target.value });
                      setCurrentPage(1);
                    }} 
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 transition-colors group-hover:text-admin-primary pointer-events-none" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 리스트 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? <span className="text-admin-primary">{selectedIds.length}개 선택됨</span> : `전체 ${filteredData.length}건`}
              </span>
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">삭제</button>
              <button onClick={() => navigate("/admin/realtime/weatherNewsAdd")} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm">등록</button>
            </div>
          </div>

          <AdminDataTable columns={columns} data={paginatedData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowKey="id" />

          <div className="mt-10">
            <AdminPagination 
              currentPage={currentPage} 
              totalItems={totalCount} // filteredData.length 대신 서버 totalCount 사용
              itemCountPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default WeatherNewsList;