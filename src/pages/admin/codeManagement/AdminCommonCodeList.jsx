import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { codeService } from '@/services/api'; // [수정] codeService 임포트
import { X, ChevronDown, RotateCcw } from 'lucide-react';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// 토스트용 성공 아이콘 컴포넌트
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminCommonCodeList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedSub, setSelectedSub] = useState("all");
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null); // 'group' | 'sub' | null

  // 2. 외부 클릭 시 드롭다운 닫기 로직
useEffect(() => {
  const closeAll = () => setOpenDropdown(null);
  window.addEventListener('click', closeAll);
  return () => window.removeEventListener('click', closeAll);
}, []);

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      // 백엔드: @GetMapping("/all") 호출
      const data = await codeService.getAllCodes(); 
      
      const dataWithId = data.map((item) => ({
        ...item,
        // 체크박스 선택을 위한 고유 ID 생성 (그룹코드와 상세코드 조합)
        id: item.subCode === '-' ? `GROUP_${item.groupCode}` : `${item.groupCode}_${item.subCode}`
      }));
      setCodes(dataWithId);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setBreadcrumbTitle("");
    fetchCodes();
  }, [setBreadcrumbTitle, fetchCodes]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

// 그룹코드 옵션 생성
const groupOptions = useMemo(() => {
  if (!codes || codes.length === 0) return [{ value: "all", label: "그룹코드 전체" }];
  const groupMap = new Map();
  codes.forEach(item => {
    if (!groupMap.has(item.groupCode) || item.subCode === '-') {
      groupMap.set(item.groupCode, item.groupName);
    }
  });

  return [
    { value: "all", label: "그룹코드 전체" },
    ...Array.from(groupMap.entries()).map(([code, name]) => ({
      value: code,
      label: name && name !== '-' ? `${code} (${name})` : code // 전체 이름 사용
    }))
  ];
}, [codes]);

// 상세코드 옵션 생성
const subOptions = useMemo(() => {
  if (selectedGroup === "all") return [{ value: "all", label: "상세코드 전체" }];
  const subs = codes
    .filter(c => c.groupCode === selectedGroup && c.subCode !== '-')
    .map(c => ({
      value: c.subCode,
      label: `${c.subCode} (${c.subName || '-'})` // 전체 이름 사용
    }));
  const uniqueSubs = subs.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
  return [{ value: "all", label: "상세코드 전체" }, ...uniqueSubs];
}, [codes, selectedGroup]);

  // 데이터 필터링
 // [수정] 데이터 필터링 로직
const filteredData = useMemo(() => {
  // 1. 검색어 정규화: 양 끝 공백 제거 및 소문자화
  const searchTerm = appliedKeyword.trim().toLowerCase();

  return codes.filter(code => {
    // 2. 그룹/상세 코드 드롭다운 필터 (기존 로직 유지)
    const isGroupMatch = selectedGroup === "all" || code.groupCode === selectedGroup;
    const isSubMatch = selectedSub === "all" || code.subCode === selectedSub;
    
    if (!isGroupMatch || !isSubMatch) return false;

    // 3. 텍스트 검색 필터 (키워드가 없을 때는 통과)
    if (!searchTerm) return true;

    // 검색 대상 필드들을 합침 (각 필드 사이에 공백을 주어 단어 단위 검색 지원)
    const searchFields = [
      code.groupName,
      code.groupCode,
      code.subName,
      code.subCode,
      code.desc
    ].map(val => (val || "").toLowerCase());

    // 어느 한 필드라도 검색어를 포함하고 있는지 확인
    return searchFields.some(field => field.includes(searchTerm));
  }).sort((a, b) => {
    if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
    return (a.order || 0) - (b.order || 0);
  });
}, [codes, appliedKeyword, selectedGroup, selectedSub]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // 테이블 컬럼 정의
  // 4. 테이블 컬럼 정의 수정
const columns = useMemo(() => [
  { key: 'groupCode', header: '그룹코드ID', width: '150px', className: 'text-center' },
  { key: 'groupName', header: '그룹코드명', width: '150px', className: 'text-center' },
  { key: 'subCode', header: '상세코드ID', width: '150px', className: 'text-center' },
  { 
    key: 'subName', 
    header: '상세코드명', 
    width: '150px', 
    className: 'text-center', 
    render: (val) => (val === '-' || !val ? '-' : val) // 데이터 없으면 - 표시
  },
  { 
    key: 'desc', 
    header: '코드 설명',
    width: '300px', 
    className: 'text-center py-4', 
    render: (text) => (
      <div className="flex justify-center items-center w-full min-h-[3rem]">
        <div className="text-center leading-[1.5] break-all px-4 line-clamp-2" title={text}>
          {text || "-"} {/* 데이터 없으면 - 표시 */}
        </div>
      </div>
    ) 
  },
  { 
    key: 'createdAt', 
    header: '등록일시', 
    width: '150px', 
    className: 'text-center', 
    render: (val) => {
      if (!val) return "-";
      const formatted = val.replace('T', ' ').split('.')[0];
      const parts = formatted.split(' '); 
      return (
        <div className="flex flex-col items-center justify-center leading-tight">
          {parts.map((p, i) => <span key={i} className={i === 1 ? "text-gray-400" : ""}>{p}</span>)}
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
    render: (visible) => (
      <div className="flex justify-center">
        {visible === true ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">사용</span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">미사용</span>
        )}
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
          // [중요] route-sh.jsx의 path와 동일하게 맞춰야 합니다.
          const path = row.subCode === '-' 
            ? `/admin/system/groupCodeDetail/${row.groupCode}` 
            : `/admin/system/subCodeDetail/${row.groupCode}/${row.subCode}`;
          navigate(path);
        }}
        className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all whitespace-nowrap"
      >
        보기
      </button>
    )
  }
], [navigate]);

  // [수정] 검색 핸들러: 입력값이 없어도 검색을 누르면 전체 리스트가 나오도록 보완
const handleSearch = () => {
  setAppliedKeyword(searchParams.keyword || ""); 
  setCurrentPage(1); 
};

// [수정] 리셋 핸들러: 모든 상태를 초기화
const handleReset = () => {
  setSearchParams({ keyword: '' }); // 입력창 비우기
  setAppliedKeyword('');           // 적용된 검색어 비우기
  setSelectedGroup("all");         // 드롭다운 초기화
  setSelectedSub("all");           // 드롭다운 초기화
  setCurrentPage(1);               // 1페이지로 이동
};
  // 1. 선택된 항목들의 이름 목록 가져오기 (메시지 표시용)
  const getAllSelectedItemsList = () => {
    const selectedItems = codes.filter(code => selectedIds.includes(code.id));
    return selectedItems.map(item => item.subCode === '-' ? item.groupName : item.subName).join(", ");
  };

  // 2. 삭제 핸들러 (기존 빈 함수를 아래 내용으로 교체)
  const handleDeleteSelected = () => {
  if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
  
  const hasGroupCode = selectedIds.some(id => id.startsWith("GROUP_"));
  const allNames = getAllSelectedItemsList();

  setModalConfig({
    title: '선택 항목 삭제',
    message: (
      <div className="flex flex-col gap-2 text-left">
        <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
        {hasGroupCode && (
          <p className="text-[14px] text-red-500 font-bold bg-red-50 p-2 rounded mt-1">
            ⚠️ 주의: 그룹코드 삭제 시 해당 그룹 내 모든 상세코드가 먼저 삭제됩니다.
          </p>
        )}
        <p className="text-[13px] text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
      </div>
    ),
    type: 'delete',
    onConfirm: async () => {
      try {
        // 1. 상세코드(ITEM)와 그룹코드(GROUP)를 분리
        const itemsToDelete = currentData.filter(codeInfo => codeInfo.subName);
        const groupsToDelete = currentData.filter(codeInfo => !codeInfo.subName);
        
        // 2. 상세코드 먼저 삭제 (자식 먼저 삭제)
        for await (const codeInfo of itemsToDelete) {
          await codeService.deleteItem(codeInfo.groupCode, codeInfo.subCode);
        }

        // 3. 그룹코드 삭제 (부모 삭제)
        for await (const codeInfo of groupsToDelete) {
          await codeService.deleteGroup(codeInfo.groupCode); 
        }

        await fetchCodes();
        setSelectedIds([]);
        setIsModalOpen(false);
        triggerToast("선택한 항목이 삭제되었습니다.");
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        // 서버에서 보낸 에러 메시지가 있으면 표시
        const errMsg = error.response?.data?.message || "상세코드가 존재하여 그룹코드를 삭제할 수 없습니다.";
        alert(errMsg);
      }
    }
  });
  setIsModalOpen(true);
};

  // 3. 일괄 상태 변경 핸들러 (기존 빈 함수를 아래 내용으로 교체)
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();
    
    setModalConfig({
      title: `일괄 ${status ? '사용' : '미사용'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-[#2563EB] font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '사용' : '미사용'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete', 
      onConfirm: () => {
        // 실제 API 연동 시: await codeService.updateStatus(selectedIds, status);
        setCodes(prev => prev.map(code => selectedIds.includes(code.id) ? { ...code, visible: status } : code));
        setSelectedIds([]); 
        setIsModalOpen(false);
        triggerToast(`선택한 항목이 ${status ? '사용' : '미사용'} 처리되었습니다.`);
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV']">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <SuccessIcon />
            <span className="font-bold">{toastMessage}</span>
          </div>
        </div>
      )}
      
      <main className="p-10">
        <h2 className="text-[32px] font-bold mb-10">공통코드 관리</h2>

        <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <AdminSearchBox 
  searchParams={searchParams}
  setSearchParams={setSearchParams}
  onSearch={handleSearch}
  onReset={handleReset}
>
{/* 그룹코드 커스텀 선택바 */}
<div className="relative w-full md:w-[300px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
  <div 
    onClick={() => setOpenDropdown(openDropdown === 'group' ? null : 'group')}
    className={`w-full h-14 pl-5 pr-12 text-[15px] border bg-white text-[#111] flex items-center cursor-pointer transition-all duration-200 z-20 relative
      ${openDropdown === 'group' 
        ? 'border-admin-primary border-b-transparent rounded-t-md' // 하단 테두리를 투명하게 변경
        : 'border-admin-border rounded-md'
      }`}
  >
    <span className="truncate">
      {groupOptions.find(opt => opt.value === selectedGroup)?.label || "그룹코드 전체"}
    </span>
    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${openDropdown === 'group' ? 'rotate-180 text-admin-primary' : ''}`} size={18} />
  </div>

  {/* 옵션 박스 */}
  {openDropdown === 'group' && (
    <div className="absolute top-full left-0 w-[300px] max-h-[300px] overflow-y-auto bg-white border border-admin-primary border-t-0 rounded-b-md shadow-lg z-10 -mt-[1px]">
      {/* -mt-[1px]과 border-t-0(상단 테두리 제거)을 조합하여 경계선 완전 제거 */}
      {groupOptions.map(opt => (
        <div 
          key={opt.value}
          onClick={() => { setSelectedGroup(opt.value); setCurrentPage(1); setOpenDropdown(null); }}
          className={`px-5 py-4 text-[14px] hover:bg-[#F3F4F6] cursor-pointer truncate transition-colors ${selectedGroup === opt.value ? 'bg-blue-50 text-admin-primary font-bold' : 'text-[#444]'}`}
          title={opt.label}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )}
</div>

{/* 상세코드 커스텀 선택바 (동일 로직 적용) */}
<div className="relative w-full md:w-[300px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
  <div 
    onClick={() => setOpenDropdown(openDropdown === 'sub' ? null : 'sub')}
    className={`w-full h-14 pl-5 pr-12 text-[15px] border bg-white text-[#111] flex items-center cursor-pointer transition-all duration-200 z-20 relative
      ${openDropdown === 'sub' 
        ? 'border-admin-primary border-b-transparent rounded-t-md' 
        : 'border-admin-border rounded-md'
      }`}
  >
    <span className="truncate">
      {subOptions.find(opt => opt.value === selectedSub)?.label || "상세코드 전체"}
    </span>
    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${openDropdown === 'sub' ? 'rotate-180 text-admin-primary' : ''}`} size={18} />
  </div>

  {/* 옵션 박스 */}
  {openDropdown === 'sub' && (
    <div className="absolute top-full left-0 w-[300px] max-h-[300px] overflow-y-auto bg-white border border-admin-primary border-t-0 rounded-b-md shadow-lg z-10 -mt-[1px]">
      {subOptions.map(opt => (
        <div 
          key={opt.value}
          onClick={() => { setSelectedSub(opt.value); setCurrentPage(1); setOpenDropdown(null); }}
          className={`px-5 py-4 text-[14px] hover:bg-[#F3F4F6] cursor-pointer truncate transition-colors ${selectedSub === opt.value ? 'bg-blue-50 text-admin-primary font-bold' : 'text-[#444]'}`}
          title={opt.label}
        >
          {opt.label}
        </div>
      ))}
    </div>
  )}
</div>
</AdminSearchBox>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
  {/* [수정] justify-between items-end로 변경하여 버튼들과 수평을 맞춤 */}
  <div className="flex justify-between items-end mb-6">
    
    {/* 좌측: 선택된 개수 및 일괄 처리 버튼 */}
    <div className="flex items-center gap-4">
      <span className="text-[15px] font-bold text-gray-600 min-w-[100px]">
        {selectedIds.length > 0 ? (
          <span className="text-[#2563EB]">{selectedIds.length}개 선택됨</span>
        ) : (
          `전체 ${filteredData.length}건`
        )}
      </span>

      {/* [복구] 일괄 처리 버튼 그룹 */}
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

    {/* 우측: 삭제 버튼 */}
    <button 
      onClick={handleDeleteSelected} 
      className="px-8 h-12 bg-[#E1421F] text-white rounded-md font-bold hover:bg-[#c1381a] transition-all shadow-sm active:scale-95"
    >
      삭제
    </button>
  </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400 font-bold">로딩 중...</div>
          ) : (
            <>
              <AdminDataTable columns={columns} data={currentData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowkey='id' />
              <AdminPagination totalItems={filteredData.length} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
            </>
          )}
        </section>
      </main>

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AdminCommonCodeList;