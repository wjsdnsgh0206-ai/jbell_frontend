"use no memo";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, RotateCcw, Calendar, Search } from "lucide-react";
import axios from 'axios';

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
  const [weatherNews, setWeatherNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const defaultStartDate = sevenDaysAgo.toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    newsType: "전체",
    // region 필터 삭제
    level: "전체",
    startDate: defaultStartDate,
    endDate: today,
  });

  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "confirm", onConfirm: () => {} });

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/disaster/dashboard/weatherWarnings');
      const allRawData = res.data?.data || res.data || [];
      
      const mappedData = allRawData.map(item => {
        const rawTime = String(item.PRSNTN_TM || "");
        const formattedDate = rawTime.length >= 8 
          ? `${rawTime.substring(0, 4)}-${rawTime.substring(4, 6)}-${rawTime.substring(6, 8)} ${rawTime.substring(8, 10)}:${rawTime.substring(10, 12)}`
          : "0000-00-00 00:00";

        return {
          id: item.PRSNTN_SN,
          level: item.TTL?.includes('경보') ? '위험' : (item.TTL?.includes('주의보') ? '주의' : '보통'),
          type: item.TTL?.split(' ')[0] || "기타",
          title: item.TTL,
          content: item.SPNE_FRMNT_PRCON_CN || item.RLVT_ZONE,
          dateTime: formattedDate,
          isVisible: true,
          raw: item
        };
      });

      setWeatherNews(mappedData);
    } catch (error) {
      console.error("관리자 데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("기상 특보 관리");
    fetchAdminData();
  }, [setBreadcrumbTitle, fetchAdminData]);

  // ==================================================================================
  // 2. 필터링 로직 (region 매칭 로직 삭제)
  // ==================================================================================
  const filteredData = useMemo(() => {
    return weatherNews.filter((item) => {
      const matchType = filters.newsType === "전체" || item.type.includes(filters.newsType);
      const matchLevel = filters.level === "전체" || item.level === filters.level;
      
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate = itemDate >= filters.startDate && itemDate <= filters.endDate;
      
      const keyword = searchParams.keyword.trim().toLowerCase();
      const matchKeyword = !keyword || 
                           item.title.toLowerCase().includes(keyword) || 
                           item.content.toLowerCase().includes(keyword) ||
                           String(item.id).includes(keyword);

      return matchType && matchLevel && matchDate && matchKeyword;
    });
  }, [weatherNews, filters, searchParams.keyword]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // ==================================================================================
  // 3. 핸들러
  // ==================================================================================
  const handleSearch = () => setCurrentPage(1);

  const handleReset = () => {
    setFilters({ 
      newsType: "전체", 
      level: "전체", 
      startDate: defaultStartDate, 
      endDate: today 
    });
    setSearchParams({ keyword: '' });
    setCurrentPage(1);
  };

  const getAllSelectedItemsList = () => {
    const selectedItems = weatherNews.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => (item.title || "").substring(0, 10) + "...").join(", ");
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();
    
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setWeatherNews(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, isVisible: status } : item));
        setSelectedIds([]); 
        setIsModalOpen(false);
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
    const allNames = getAllSelectedItemsList();

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setWeatherNews(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/weatherNewsDetail/${id}`);
  }, [navigate]);

  const columns = useMemo(() => [
    { key: "id", header: "발표번호", width: "180px", className: "text-center" },
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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">기상 특보 관리</h2>

        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 특보 유형 셀렉트 */}
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

            {/* 지역 선택 셀렉트 삭제됨 */}

            {/* 경보 수준 셀렉트 */}
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
            <AdminPagination currentPage={currentPage} totalItems={filteredData.length} itemCountPerPage={itemsPerPage} onPageChange={setCurrentPage} />
          </div>
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default WeatherNewsList;