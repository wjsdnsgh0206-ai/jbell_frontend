// src/pages/admin/CodeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import { ChevronDown } from 'lucide-react'; // 아이콘 추가

// 공용 컴포넌트 Import
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminCodeConfirmModal from './AdminCodeConfirmModal';

const AdminCommonCodeList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // [복구] 필터 상태 (그룹코드/상세코드)
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");

  // 검색 상태 (키워드만 관리)
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  // [복구] 실제 적용된 검색어 (검색 버튼 눌렀을 때만 반영)
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  // [복구] 그룹코드가 변경되면 상세코드 선택 초기화
  useEffect(() => {
    setSelectedSub("all");
  }, [selectedGroup]);

  // [복구] 그룹코드 옵션 동적 생성 (중복 제거)
  const groupOptions = useMemo(() => {
    const groups = codes.map(c => ({ value: c.groupCode, label: `${c.groupCode}(${c.groupName})` }));
    // 중복 제거
    const uniqueGroups = groups.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
    return [{ value: "all", label: "그룹코드 전체" }, ...uniqueGroups];
  }, [codes]);

  // [복구] 선택된 그룹에 따른 상세코드 옵션 동적 생성
  const subOptions = useMemo(() => {
    if (selectedGroup === "all") return [{ value: "all", label: "상세코드 전체" }];
    
    const subs = codes
      .filter(c => c.groupCode === selectedGroup && c.subCode !== '-')
      .map(c => ({ value: c.subCode, label: `${c.subCode}(${c.subName})` }));
      
    // 중복 제거
    const uniqueSubs = subs.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
    return [{ value: "all", label: "상세코드 전체" }, ...uniqueSubs];
  }, [codes, selectedGroup]);

  // 2. 테이블 컬럼 정의
  const columns = useMemo(() => [
    { key: 'groupCode', header: '그룹코드', width: '10%', className: 'text-center font-mono' }, // font-mono 추가
    { key: 'groupName', header: '그룹명', width: '15%', className: 'text-center' },
    { key: 'subCode', header: '상세코드', width: '10%', className: 'text-center font-mono' },
    { key: 'subName', header: '상세명', width: '15%', className: 'text-center' },
    { 
      key: 'desc', 
      header: '코드설명', 
      render: (text) => <div className="truncate max-w-[200px] text-left" title={text}>{text}</div> 
    },
    { key: 'date', header: '등록일시', width: '12%', className: 'text-center text-graygray-50' },
    { key: 'order', header: '순서', width: '8%', className: 'text-center text-graygray-50' },
    { 
      key: 'visible', 
      header: '사용여부', 
      width: '100px',
      className: 'text-center',
      render: (visible) => (
        <div className="flex justify-center">
          <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${visible ? 'bg-admin-primary' : 'bg-graygray-30'}`}>
             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${visible ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      header: '상세',
      width: '80px',
      className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const path = row.subCode === '-' 
              ? `/admin/system/groupCodeDetail/${row.id}` 
              : `/admin/system/subCodeDetail/${row.id}`;
            navigate(path);
          }}
          className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all"
        >
          보기
        </button>
      )
    }
  ], [navigate]);

  // 3. [복구] 데이터 필터링 및 정렬 로직 (Target String 방식)
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    
    return codes.filter(code => {
      // 2단 Select 필터 적용
      const isGroupMatch = selectedGroup === "all" || code.groupCode === selectedGroup;
      const isSubMatch = selectedSub === "all" || code.subCode === selectedSub;
      
      // 검색어 미입력 시 필터만 적용
      if (!searchTerm) return isGroupMatch && isSubMatch;

      // 정밀 검색 로직 (모든 텍스트 합쳐서 검색)
      const targetString = [code.groupName, code.groupCode, code.subName, code.subCode, code.desc]
        .join("")
        .replace(/\s+/g, "")
        .toLowerCase();
        
      return isGroupMatch && isSubMatch && targetString.includes(searchTerm);
    }).sort((a, b) => {
      // [복구] 정렬 로직
      if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
  }, [codes, appliedKeyword, selectedGroup, selectedSub]);

  // 4. 페이지네이션 데이터
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // 5. 핸들러 함수들
  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword); // 검색 버튼 눌러야 적용
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSelectedGroup("all");
    setSelectedSub("all");
    setCurrentPage(1);
  };

  // 헬퍼: 선택된 항목 이름 가져오기
  const getAllSelectedItemsList = () => {
    const selectedItems = codes.filter(code => selectedIds.includes(code.id));
    return selectedItems.map(item => item.subCode === '-' ? item.groupName : item.subName).join(", ");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    
    const allNames = getAllSelectedItemsList();
    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-graygray-50">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setCodes(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // [복구] 일괄 상태 변경 핸들러
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();
    
    setModalConfig({
      title: `일괄 ${status ? '사용' : '미사용'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '사용' : '미사용'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete', // 디자인 타입 재활용
      onConfirm: () => {
        setCodes(prev => prev.map(code => selectedIds.includes(code.id) ? { ...code, visible: status } : code));
        setSelectedIds([]); 
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">공통코드 목록</h2>

        {/* 1. 검색 영역 (SearchBox with Custom Filters) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* children으로 커스텀 필터 주입 -> AdminSearchBox가 받아서 렌더링 */}
            <div className="relative w-full md:w-72">
              <select 
                value={selectedGroup} 
                onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                {groupOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-full md:w-72">
              <select 
                value={selectedSub} 
                onChange={(e) => { setSelectedSub(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                {subOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        {/* 2. 테이블 및 액션 버튼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              {/* 선택 개수 표시 */}
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>

              {/* [복구] 일괄 처리 버튼 */}
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 사용</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 미사용</span>
                </button>
              </div>
            </div>

            {/* 삭제 및 등록 버튼 */}
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
               <button 
                onClick={() => navigate('/admin/system/groupCodeAdd')}
                className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          {/* 3. 데이터 테이블 (DataTable 컴포넌트 사용) */}
          <AdminDataTable 
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

          {/* 4. 페이지네이션 (Pagination 컴포넌트 사용) */}
          <AdminPagination 
            totalItems={filteredData.length}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      {/* 모달 */}
      <AdminCodeConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

export default AdminCommonCodeList;