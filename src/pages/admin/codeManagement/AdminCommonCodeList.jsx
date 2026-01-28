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

  // [수정] axios 대신 codeService 사용 및 데이터 구조 처리
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

  // 필터 옵션 생성
  // 그룹코드 옵션 생성
const groupOptions = useMemo(() => {
  if (!codes || codes.length === 0) return [{ value: "all", label: "그룹코드 전체" }];

  // 1. 모든 데이터에서 유니크한 groupCode 추출
  const groupMap = new Map();
  
  // 2. 루프를 돌며 그룹 정보를 수집 (subCode가 '-'인 데이터가 있으면 그 이름을 우선 사용)
  codes.forEach(item => {
    if (!groupMap.has(item.groupCode) || item.subCode === '-') {
      groupMap.set(item.groupCode, item.groupName);
    }
  });

  // [수정] groupOptions 생성 로직 내의 label 부분
const options = Array.from(groupMap.entries()).map(([code, name]) => {
  const fullLabel = name && name !== '-' ? `${code} (${name})` : code;
  // 너무 길면 자르기 (예: 20자 이상이면 말줄임)
  const truncatedLabel = fullLabel.length > 25 ? fullLabel.substring(0, 22) + "..." : fullLabel;
  
  return {
    value: code,
    label: truncatedLabel
  };
});

  return [{ value: "all", label: "그룹코드 전체" }, ...options];
}, [codes]);

// 상세코드 옵션 생성
const subOptions = useMemo(() => {
  if (selectedGroup === "all") return [{ value: "all", label: "상세코드 전체" }];

  // 선택된 그룹에 속하고, 상세코드가 있는 것만 필터링
  const subs = codes
    .filter(c => c.groupCode === selectedGroup && c.subCode !== '-')
    .map(c => ({
      value: c.subCode,
      label: `${c.subCode} (${c.subName || '-'})`
    }));

  // 중복 제거
  const uniqueSubs = subs.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);

  return [{ value: "all", label: "상세코드 전체" }, ...uniqueSubs];
}, [codes, selectedGroup]);

  // 데이터 필터링
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    return codes.filter(code => {
      const isGroupMatch = selectedGroup === "all" || code.groupCode === selectedGroup;
      const isSubMatch = selectedSub === "all" || code.subCode === selectedSub;
      if (!searchTerm) return isGroupMatch && isSubMatch;
      const targetString = [code.groupName, code.groupCode, code.subName, code.subCode, code.desc]
        .join("").replace(/\s+/g, "").toLowerCase();
      return isGroupMatch && isSubMatch && targetString.includes(searchTerm);
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

  const handleSearch = () => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); };
  const handleReset = () => { setSearchParams({ keyword: '' }); setAppliedKeyword(''); setSelectedGroup("all"); setSelectedSub("all"); setCurrentPage(1); };

  // 삭제 및 일괄 처리 로직 (생략 - 기존 유지 가능하나 실제 API 연동은 추가 작업 필요)
  const handleDeleteSelected = () => { /* 삭제 API 연동 필요 */ };
  const handleBatchStatus = (status) => { /* 수정 API 연동 필요 */ };

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
  {/* 그룹코드 선택바 */}
 {/* 그룹코드 선택바 */}
<div className="relative w-full md:w-[300px] flex-shrink-0">
  <select 
    value={selectedGroup} 
    onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
    // [중요] w-full과 함께 스타일로 너비를 고정하여 팝업이 튀어나가지 않게 방어
    className="w-full appearance-none h-14 pl-5 pr-12 text-[15px] border border-[#E5E7EB] rounded-md bg-white text-[#111] focus:border-[#2563EB] outline-none cursor-pointer truncate"
    style={{ width: '100%' }} 
  >
    {groupOptions.map(opt => (
      <option key={opt.value} value={opt.value} className="truncate">
        {opt.label}
      </option>
    ))}
  </select>
  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
</div>

{/* 상세코드 선택바 */}
<div className="relative w-full md:w-[300px] flex-shrink-0">
  <select 
    value={selectedSub} 
    onChange={(e) => { setSelectedSub(e.target.value); setCurrentPage(1); }}
    className="w-full appearance-none h-14 pl-5 pr-12 text-[15px] border border-[#E5E7EB] rounded-md bg-white text-[#111] focus:border-[#2563EB] outline-none cursor-pointer truncate"
    style={{ width: '100%' }}
  >
    {subOptions.map(opt => (
      <option key={opt.value} value={opt.value} className="truncate">
        {opt.label}
      </option>
    ))}
  </select>
  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
</div>
</AdminSearchBox>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-gray-600">전체 {filteredData.length}건</span>
            <button onClick={handleDeleteSelected} className="px-8 h-12 bg-red-500 text-white rounded-md font-bold hover:bg-red-600 transition-all">삭제</button>
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