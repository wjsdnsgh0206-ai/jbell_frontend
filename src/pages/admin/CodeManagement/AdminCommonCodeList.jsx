// src/pages/admin/CodeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import AdminDataTable from '@/components/admin/shared/AdminDataTable';
import AdminPagination from '@/components/admin/shared/AdminPagination';
import { Search, RotateCcw, X } from 'lucide-react'; // 아이콘 추가
import { AdminCommonCodeData } from './AdminCommonCodeData';

const AdminCommonCodeList = () => {
  // =========================================================================
  // 1. 상태 관리 (기존 로직 유지)
  // =========================================================================
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 검색 상태
  const [selectedGroup, setSelectedGroup] = useState("그룹코드 전체");
  const [selectedDetail, setSelectedDetail] = useState("상세코드 전체");
  const [searchInput, setSearchInput] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState(""); 

  // =========================================================================
  // 2. 데이터 처리 로직 (useMemo 활용)
  // =========================================================================
  const filteredData = useMemo(() => {
    return codes.filter(code => {
      const isGroupMatch = selectedGroup === "그룹코드 전체" || code.groupCode === selectedGroup;
      const isDetailMatch = selectedDetail === "상세코드 전체" || code.detailCode === selectedDetail;
      const isSearchMatch = !appliedSearch || 
        code.groupName.includes(appliedSearch) || 
        code.detailName.includes(appliedSearch) ||
        code.groupCode.includes(appliedSearch) ||
        (code.desc && code.desc.includes(appliedSearch));
      
      return isGroupMatch && isDetailMatch && isSearchMatch;
    });
  }, [codes, appliedSearch, selectedGroup, selectedDetail]);

  // 페이징 처리된 현재 페이지 데이터
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // =========================================================================
  // 3. 핸들러 함수
  // =========================================================================
  const handleSearch = () => { 
    setAppliedSearch(searchInput); 
    setCurrentPage(1); 
  };

  const handleReset = () => { 
    setSearchInput(""); 
    setAppliedSearch(""); 
    setSelectedGroup("그룹코드 전체");
    setSelectedDetail("상세코드 전체");
    setCurrentPage(1); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleToggleVisible = (id) => {
    setCodes(prev => prev.map(code => 
      code.id === id ? { ...code, visible: !code.visible } : code
    ));
  };

  const handleViewDetail = (row) => {
    console.log(`${row.id}번 상세 페이지 이동`, row);
  };

  // =========================================================================
  // 4. 테이블 컬럼 정의 (render 함수로 UI 커스터마이징)
  // =========================================================================
  const COLUMNS = [
    { key: 'groupCode', header: '그룹코드', width: '10%', className: 'text-center font-mono text-xs text-gray-500' },
    { key: 'groupName', header: '그룹코드명', width: '10%', className: 'text-center' },
    { key: 'detailCode', header: '상세코드', width: '10%', className: 'text-center font-mono text-xs text-gray-500' },
    { key: 'detailName', header: '상세코드명', width: '10%', className: 'text-center font-bold' },
    { key: 'desc', header: '코드설명', width: '25%', render: (text) => (
      <span className="block truncate max-w-[300px] text-gray-600" title={text}>{text}</span>
    )},
    { key: 'date', header: '등록일시', width: '12%', className: 'text-center text-xs text-gray-400' },
    { key: 'order', header: '순서', width: '8%', className: 'text-center' },
    { 
      key: 'visible', 
      header: '등록여부', 
      width: '10%', 
      className: 'text-center',
      render: (visible, row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id); }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            visible ? 'bg-admin-primary' : 'bg-gray-300'
          }`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              visible ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </button>
      )
    },
    { 
      key: 'detail', 
      header: '상세', 
      width: '10%', 
      className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleViewDetail(row); }}
          className="px-3 py-1 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          보기
        </button>
      )
    },
  ];

  // 옵션 리스트 생성 (중복 제거)
  const groupOptions = Array.from(new Map(codes.map(c => [c.groupCode, c.groupName])));
  const detailOptions = Array.from(new Map(codes.map(c => [c.detailCode, c.detailName])));

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-6">
      
      {/* 1. BreadCrumb */}
      <BreadCrumb />

      {/* 2. 검색 영역 (디자인 토큰 적용 + 3단 필터 유지) */}
      <section className="bg-white p-6 rounded-lg border border-admin-border shadow-admin-card">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
          
          {/* 검색 입력 그룹 */}
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto flex-1">
            
            {/* 그룹코드 Select */}
            <div className="relative min-w-[200px]">
              <select 
                value={selectedGroup} 
                onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
                className="w-full h-10 pl-3 pr-8 text-sm border border-admin-border rounded bg-white text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all cursor-pointer"
              >
                <option value="그룹코드 전체">그룹코드 전체</option>
                {groupOptions.map(([code, name]) => (
                  <option key={code} value={code}>{`${code} (${name})`}</option>
                ))}
              </select>
            </div>

            {/* 상세코드 Select */}
            <div className="relative min-w-[200px]">
              <select 
                value={selectedDetail} 
                onChange={(e) => { setSelectedDetail(e.target.value); setCurrentPage(1); }}
                className="w-full h-10 pl-3 pr-8 text-sm border border-admin-border rounded bg-white text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all cursor-pointer"
              >
                <option value="상세코드 전체">상세코드 전체</option>
                {detailOptions.map(([code, name]) => (
                  <option key={code} value={code}>{`${code} (${name})`}</option>
                ))}
              </select>
            </div>

            {/* 검색어 Input */}
            <div className="relative flex-1 min-w-[240px]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력해주세요"
                className="w-full h-10 pl-4 pr-10 text-sm border border-admin-border rounded bg-white text-admin-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all"
              />
              {searchInput && (
                <button 
                  onClick={() => setSearchInput("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 h-10 bg-admin-primary hover:bg-admin-primaryHover text-white text-sm font-medium rounded transition-colors shadow-sm active:scale-95 flex-1 xl:flex-none"
            >
              <Search className="w-4 h-4" />
              <span>검색</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 h-10 bg-white border border-admin-border text-admin-text-secondary hover:bg-gray-50 hover:text-admin-text-primary text-sm font-medium rounded transition-colors flex-1 xl:flex-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="xl:hidden">초기화</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. 리스트 영역 */}
      <section className="bg-white p-6 rounded-lg border border-admin-border shadow-admin-card min-h-[600px] flex flex-col">
        
        {/* 리스트 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-admin-text-primary">공통 코드 목록</h2>
            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
              총 {filteredData.length}건
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-admin-text-secondary border border-admin-border rounded hover:bg-gray-50 transition-colors">
              선택 삭제
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-admin-primary rounded hover:bg-admin-primaryHover shadow-sm transition-colors">
              신규 등록
            </button>
          </div>
        </div>

        {/* 4. 데이터 테이블 컴포넌트 */}
        <AdminDataTable 
          columns={COLUMNS}
          data={currentData}
          onRowClick={handleViewDetail}
        />
        
        {/* 5. 페이지네이션 컴포넌트 */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <AdminPagination 
            totalItems={filteredData.length}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

    </div>
  );
};

export default AdminCommonCodeList;