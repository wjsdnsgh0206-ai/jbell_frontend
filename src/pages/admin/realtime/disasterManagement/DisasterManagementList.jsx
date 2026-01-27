'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { Map, Activity, ChevronDown } from 'lucide-react';

// [데이터]
import { DisasterManagementData } from './DisasterManagementData';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 실시간 재난 관리 목록
 */
const DisasterManagementList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [disasters, setDisasters] = useState(DisasterManagementData || []);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  // 브레드크럼 초기화
  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/disasterManagementDetail/${id}`);
  }, [navigate]);

  // ==================================================================================
  // 2. 필터 옵션
  // ==================================================================================
  const categoryOptions = [
    { value: "all", label: "유형 전체" },
    { value: "지진", label: "지진" },
    { value: "호우·홍수", label: "호우·홍수" },
    { value: "산사태", label: "산사태" },
    { value: "태풍", label: "태풍" },
    { value: "산불", label: "산불" },
    { value: "한파", label: "한파" },
  ];

  // ==================================================================================
  // 3. 데이터 가공
  // ==================================================================================
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    
    return disasters.filter(item => {
      const isCategoryMatch = selectedCategory === "all" || item.category === selectedCategory;
      if (!searchTerm) return isCategoryMatch;

      const targetString = [item.category, item.dataSource, item.mapLayer]
        .join("").replace(/\s+/g, "").toLowerCase();
        
      return isCategoryMatch && targetString.includes(searchTerm);
    });
  }, [disasters, appliedKeyword, selectedCategory]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 4. 테이블 컬럼 정의
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'id', header: 'No', width: '60px', className: 'text-center' },
    { 
      key: 'category', 
      header: '재난유형', 
      width: '120px', 
      className: 'text-center',
      render: (val) => <span className="text-gray-800 ">{val}</span>
    },
    { 
      key: 'dataSource', 
      header: '연동 데이터 (API)', 
      className: 'text-left',
      render: (val) => (
        <div className="flex items-center gap-2 truncate max-w-[250px]" title={val}>
          <Activity size={14} className="text-admin-primary flex-shrink-0" />
          <span className="truncate text-[14px]">{val}</span>
        </div>
      )
    },
    { 
      key: 'mapLayer', 
      header: '지도 설정 정보', 
      className: 'text-left',
      render: (val) => (
        <div className="flex items-center gap-2 text-gray-700 truncate max-w-[250px]" title={val}>
          <Map size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate text-[14px]">{val}</span>
        </div>
      )
    },
    { 
      key: 'apiStatus', 
      header: 'API 상태', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <div className="flex justify-center">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            val === '정상' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {val}
          </span>
        </div>
      )
    },
    { 
      key: 'visibleYn', 
      header: '노출여부', 
      width: '100px',
      render: (val, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id, val); }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${val === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${val === 'Y' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      )
    },
    { key: 'updatedAt', header: '수정일', width: '120px', className: 'text-center text-gray-500' },
    {
        key: 'actions',
        header: '상세/수정',
        width: '100px',
        className: 'text-center ',
        render: (_, row) => (
          <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 transition-colors whitespace-nowrap">
            보기
          </button>
        )
    }
  ], [goDetail]);

  // ==================================================================================
  // 5. 핸들러 (Handlers)
  // ==================================================================================
  const handleSearch = () => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); };
  const handleReset = () => { setSearchParams({ keyword: '' }); setAppliedKeyword(''); setSelectedCategory("all"); setCurrentPage(1); };

  const getAllSelectedItemsList = () => {
    const selectedItems = disasters.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.category).join(", ");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    const allNames = getAllSelectedItemsList();

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제 시 API 연동 정보가 모두 제거됩니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setDisasters(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const targetStatus = status ? 'Y' : 'N';
    
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{selectedIds.length}개]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setDisasters(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, visibleYn: targetStatus } : item));
        setSelectedIds([]); 
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>해당 항목의 상태를 <span className={`font-bold ${nextStatus === 'Y' ? 'text-admin-primary' : 'text-gray-500'}`}>[{nextStatus === 'Y' ? '노출' : '비노출'}]</span>로 변경하시겠습니까?</p>
        </div>
      ),
      type: nextStatus === 'Y' ? 'confirm' : 'delete',
      onConfirm: () => {
        setDisasters(prev => prev.map(item => item.id === id ? { ...item, visibleYn: nextStatus } : item));
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // ==================================================================================
  // 6. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">재난 관리</h2>
        
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 사고속보 페이지와 동일하게 select 박스 배치 */}
            <div className="relative w-full md:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none cursor-pointer"
              >
                {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
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
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
              <button 
                onClick={() => navigate('/admin/realtime/disasterManagementAdd')} 
                className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          <AdminDataTable
            columns={columns}
            data={currentData}
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

      <AdminConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </div>
  );
};

export default DisasterManagementList;