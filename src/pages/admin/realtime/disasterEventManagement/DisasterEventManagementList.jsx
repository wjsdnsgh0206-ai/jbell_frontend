'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, RotateCcw, Search } from "lucide-react";

// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

// [데이터 임포트]
import { initialDisasters } from "./DisasterEventData";

const DisasterEventManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // 1. 상태 관리 - 외부 데이터를 초기값으로 할당
  const [disasters, setDisasters] = useState(initialDisasters);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    disasterType: "전체",
    region: "전체",
    status: "전체",
    startDate: "2023-10-10",
    endDate: "2026-12-31",
  });

  // [필터링 로직]
  const filteredData = useMemo(() => {
    return disasters.filter((item) => {
      const matchType = filters.disasterType === "전체" || item.type === filters.disasterType;
      const matchRegion = filters.region === "전체" || item.region.includes(filters.region);
      const matchStatus = filters.status === "전체" || item.status === filters.status;
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate = itemDate >= filters.startDate && itemDate <= filters.endDate;

      return matchType && matchRegion && matchStatus && matchDate;
    });
  }, [disasters, filters]);

  // [페이지네이션 로직]
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", type: "confirm", onConfirm: () => {} });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // 핸들러들
  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setModalConfig({
      title: "노출 상태 변경",
      message: <p>해당 항목의 상태를 [{nextStatus ? "노출" : "비노출"}]로 변경하시겠습니까?</p>,
      type: nextStatus ? "confirm" : "delete",
      onConfirm: () => {
        setDisasters(prev => prev.map(item => item.id === id ? { ...item, isVisible: nextStatus } : item));
        setIsModalOpen(false);
      },
    });
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      disasterType: "전체",
      region: "전체",
      status: "전체",
      startDate: "2023-10-10",
      endDate: "2026-12-31",
    });
    setCurrentPage(1);
  };

  const columns = useMemo(() => [
    { key: "serialNumber", header: "산불일련번호", width: "160px", className: "text-center font-medium" },
    { key: "type", header: "유형", width: "100px", className: "text-center" },
    { key: "region", header: "발생 지역", width: "180px", className: "text-left" },
    { key: "content", header: "내용", className: "text-left whitespace-pre-wrap" },
    { key: "dateTime", header: "발생 일시", width: "180px", className: "text-center text-gray-500" },
    { 
      key: "status", header: "상태", width: "100px", className: "text-center",
      render: (val) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold border ${val === "진행중" ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
          {val}
        </span>
      )
    },
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
    { key: "actions", header: "상세", width: "80px", className: "text-center", render: (_, row) => <button onClick={() => navigate(`/admin/realtime/disaster/detail/${row.id}`)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 transition-colors">보기</button> }
  ], [navigate]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">재난 발생 관리</h2>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox searchParams={filters} setSearchParams={setFilters} onSearch={handleSearch} onReset={handleReset} showKeywordInput={false}>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-40">
                <select value={filters.disasterType} onChange={(e) => setFilters({ ...filters, disasterType: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                  <option value="전체">재난 유형</option>
                  <option value="산불">산불</option>
                  <option value="홍수">홍수</option>
                  <option value="지진">지진</option>
                  <option value="폭설">폭설</option>
                  <option value="태풍">태풍</option>
                  <option value="폭염">폭염</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
              <div className="relative w-40">
                <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                  <option value="전체">지역 전체</option>
                  <option value="전주시">전주시</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
              <div className="relative w-30">
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer font-bold text-admin-primary">
                  <option value="전체">상태</option>
                  <option value="진행중">진행중</option>
                  <option value="종료">종료</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center border border-admin-border rounded-md bg-white h-14 px-4">
                  <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="outline-none text-body-m bg-transparent cursor-pointer" />
                  <span className="mx-2 text-gray-400">~</span>
                  <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="outline-none text-body-m bg-transparent cursor-pointer" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="text-body-m-bold text-admin-text-secondary">
              {selectedIds.length > 0 ? <span className="text-admin-primary">{selectedIds.length}개 선택됨</span> : `전체 ${filteredData.length}건`}
            </div>
            <div className="flex gap-2">
              <button onClick={() => {}} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold">삭제</button>
              <button onClick={() => navigate("/admin/realtime/disaster/register")} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold">등록</button>
            </div>
          </div>

          <AdminDataTable 
            columns={columns} 
            data={paginatedData} 
            selectedIds={selectedIds} 
            onSelectionChange={setSelectedIds} 
            rowKey="id" 
          />

          <div className="mt-10">
            <AdminPagination 
              currentPage={currentPage} 
              totalItems={filteredData.length} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default DisasterEventManagementList;