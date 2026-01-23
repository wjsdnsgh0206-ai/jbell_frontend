// src/pages/admin/codeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { AdminCommonCodeData } from '@/pages/admin/codeManagement/AdminCommonCodeData';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

// [공통 컴포넌트] 팀원들과 공유할 핵심 부품들
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 공통코드 목록 페이지
 * - 공통 컴포넌트(Table, SearchBox, Pagination) 사용 예시 포함
 * - 2단 필터링 (그룹 -> 상세) 및 정밀 검색 로직 구현
 */

// 토스트용 성공 아이콘 컴포넌트
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminCommonCodeList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================
  const [codes, setCodes] = useState(AdminCommonCodeData); // 전체 데이터
  const [selectedIds, setSelectedIds] = useState([]);      // 테이블에서 선택된 체크박스 ID들
  const [currentPage, setCurrentPage] = useState(1);       // 현재 페이지
  const itemsPerPage = 10;                                 // 페이지당 항목 수

  // [필터 상태] 그룹코드와 상세코드를 위한 State
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");

  // [검색 상태] SearchBox에서 관리할 검색어
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState(''); // '검색' 버튼 클릭 시 확정된 검색어

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  // [브레드크럼 상태]
  const { setBreadcrumbTitle } = useOutletContext();

  // [토스트 관련 상태] 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setBreadcrumbTitle(""); // 목록 페이지는 URL 매핑값을 따르도록 초기화
  }, [setBreadcrumbTitle]);

  // 3. [추가] 토스트 실행 함수
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // 2초 뒤 사라짐
  };

  // ==================================================================================
  // 2. 필터링 로직 (Filtering Logic)
  // ==================================================================================
  
  // 그룹코드가 변경되면 하위 상세코드는 '전체'로 초기화
  useEffect(() => {
    setSelectedSub("all");
  }, [selectedGroup]);

  // [옵션 생성 1] 전체 데이터에서 '그룹코드' 목록 추출 (중복 제거)
  const groupOptions = useMemo(() => {
    const groups = codes.map(c => ({ value: c.groupCode, label: `${c.groupCode}(${c.groupName})` }));
    const uniqueGroups = groups.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
    return [{ value: "all", label: "그룹코드 전체" }, ...uniqueGroups];
  }, [codes]);

  // [옵션 생성 2] 선택된 그룹에 속하는 '상세코드' 목록만 추출 (유동적 변경)
  const subOptions = useMemo(() => {
    if (selectedGroup === "all") return [{ value: "all", label: "상세코드 전체" }];
    
    const subs = codes
      .filter(c => c.groupCode === selectedGroup && c.subCode !== '-') // '-'는 그룹코드 자체이므로 제외
      .map(c => ({ value: c.subCode, label: `${c.subCode}(${c.subName})` }));
      
    const uniqueSubs = subs.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
    return [{ value: "all", label: "상세코드 전체" }, ...uniqueSubs];
  }, [codes, selectedGroup]);

  // ==================================================================================
  // 3. 데이터 가공 (Filtering & Sorting)
  // ==================================================================================
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    
    return codes.filter(code => {
      // 1. 필터 조건 확인 (2단 Select)
      const isGroupMatch = selectedGroup === "all" || code.groupCode === selectedGroup;
      const isSubMatch = selectedSub === "all" || code.subCode === selectedSub;
      
      if (!searchTerm) return isGroupMatch && isSubMatch;

      // 2. 검색어 조건 확인 (모든 텍스트 필드를 합쳐서 검색하는 'Target String' 방식)
      const targetString = [code.groupName, code.groupCode, code.subName, code.subCode, code.desc]
        .join("")
        .replace(/\s+/g, "")
        .toLowerCase();
        
      return isGroupMatch && isSubMatch && targetString.includes(searchTerm);
    }).sort((a, b) => {
      // 3. 정렬 로직 (그룹코드 알파벳순 -> 내부 순서 숫자순)
      if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
  }, [codes, appliedKeyword, selectedGroup, selectedSub]);

  // 현재 페이지에 보여줄 데이터 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 4. 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'groupCode', header: '그룹코드ID', width: '150px', className: 'text-center' },
    { key: 'groupName', header: '그룹코드명', width: '150px', className: 'text-center' },
    { key: 'subCode', header: '상세코드ID', width: '150px', className: 'text-center' },
    { key: 'subName', header: '상세코드명', width: '150px', className: 'text-center' },
    { 
      key: 'desc', 
      header: '코드 설명',
      width: '300px', 
      className: 'text-center py-4', 
      render: (text) => (
        <div className="flex justify-center items-center w-full min-h-[3rem]">
          <div 
            className="text-center leading-[1.5] break-all px-4" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '2', 
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              whiteSpace: 'normal',
              wordBreak: 'keep-all' 
            }}
            title={text}
          >
            {text}
          </div>
        </div>
      ) 
},
    { 
      key: 'date', 
      header: '등록일시', 
      width: '150px', 
      className: 'text-center', 
      render: (val) => {
      if (!val) return "-";
      const parts = val.toString().split(' '); 
      return (
        <div className="flex flex-col items-center justify-center leading-tight">
          {parts.length > 0 ? (
            parts.map((p, i) => <span key={i} className="block">{p}</span>)
          ) : (
            <span>{val}</span>
          )}
        </div>
      );
    }
    },
    { key: 'order', header: '순서', width: '60px', className: 'text-center' },
    { 
      key: 'visible', 
      header: '사용여부', 
      width: '80px',
      className: 'text-center',
      // 커스텀 렌더링: 사용여부를 시각적인 뱃지/토글 형태로 표시
      render: (visible) => (
        <>
         {/* 토글 아이콘 설정 */}
          {/* <div className="flex justify-center">
            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${visible ? 'bg-admin-primary' : 'bg-graygray-30'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${visible ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div> */}
          
          {/* 배지 아이콘 설정 */}
          <div className="flex justify-center">
            {visible ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">사용</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">미사용</span>
            )}
          </div>
        </>
      )
    },
    {
      key: 'actions',
      header: '상세',
      width: '80px',
      className: 'text-center',
      // 커스텀 렌더링: 상세보기 버튼
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const path = row.subCode === '-' 
              ? `/admin/system/groupCodeDetail/${row.id}` 
              : `/admin/system/subCodeDetail/${row.id}`;
            navigate(path);
          }}
          className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all whitespace-nowrap"
        >
          보기
        </button>
      )
    }
  ], [navigate]);

  // ==================================================================================
  // 5. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword); // 검색 버튼을 눌러야 실제 필터링 적용
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSelectedGroup("all");
    setSelectedSub("all");
    setCurrentPage(1);
  };

  // 선택된 항목들의 이름 목록 가져오기 (메시지 표시용)
  const getAllSelectedItemsList = () => {
    const selectedItems = codes.filter(code => selectedIds.includes(code.id));
    return selectedItems.map(item => item.subCode === '-' ? item.groupName : item.subName).join(", ");
  };

  // [삭제] 핸들러
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
        triggerToast("선택한 항목이 삭제되었습니다."); // 토스트 호출
      }
    });
    setIsModalOpen(true);
  };

  // [일괄 상태 변경] 핸들러 (사용/미사용)
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
      type: status ? 'confirm' : 'delete', // 기존 delete 타입 디자인 재활용
      onConfirm: () => {
        setCodes(prev => prev.map(code => selectedIds.includes(code.id) ? { ...code, visible: status } : code));
        setSelectedIds([]); 
        setIsModalOpen(false);
        triggerToast(`선택한 항목이 ${status ? '사용' : '미사용'} 처리되었습니다.`); // 토스트 호출
      }
    });
    setIsModalOpen(true);
  };

  // ==================================================================================
  // 6. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-nowrap min-h-screen bg-admin-bg font-sans antialiased text-graygray-90 overflow-hidden">
      {/* 토스트 알림 UI */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}
      
<main className="flex-1 min-w-0 p-10 overflow-x-auto">
        
        {/* [중요] 내부 컨테이너 너비 고정 */}
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">
            공통코드 관리
          </h2>

        {/* [A] 검색 영역 (SearchBox + Custom Filters) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* children 영역: 여기에 필요한 커스텀 필터(Select 등)를 자유롭게 추가하면 됩니다. */}
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

        {/* [B] 테이블 및 액션 버튼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            
            {/* 좌측: 선택된 개수 및 일괄 처리 버튼 */}
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>

              {/* 일괄 처리 버튼 그룹 */}
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

            {/* 우측: 삭제 및 등록 버튼 */}
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
            </div>
          </div>

          {/* [C] 데이터 테이블 (AdminDataTable) */}
          <AdminDataTable 
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowkey='id'
          />

          {/* [D] 페이지네이션 (AdminPagination) */}
          <AdminPagination 
            totalItems={filteredData.length}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
        </div>
      </main>

      {/* [E] 확인/삭제 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

export default AdminCommonCodeList;