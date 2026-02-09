import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { codeService } from '@/services/api';
import { X, ChevronDown, RotateCcw } from 'lucide-react';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// 관리자 공통코드관리 목록 페이지//

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

useEffect(() => {
  const closeAll = () => setOpenDropdown(null);
  window.addEventListener('click', closeAll);
  return () => window.removeEventListener('click', closeAll);
}, []);

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await codeService.getAllCodes(); 
      
      const dataWithId = data.map((item) => ({
        ...item,
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

// 그룹코드 옵션
const groupOptions = useMemo(() => {
  if (!codes || codes.length === 0) return [{ value: "all", label: "그룹코드 전체" }];
  const groupMap = new Map();
  codes.forEach(item => {
    if (!groupMap.has(item.groupCode) || item.subCode === '-') {
      groupMap.set(item.groupCode, item.groupName);
    }
  });

   return [
    { value: "group_only", label: "그룹코드 전체" }, 
    ...Array.from(groupMap.entries()).map(([code, name]) => ({
      value: code,
      label: name && name !== '-' ? `${code} (${name})` : code
    }))
  ];
}, [codes]);

// 상세코드 옵션
const subOptions = useMemo(() => {

  if (selectedGroup === "all" || selectedGroup === "group_only") {
    return [{ value: "sub_only", label: "상세코드 전체" }];
  }

  const subs = codes
    .filter(c => c.groupCode === selectedGroup && c.subCode !== '-')
    .map(c => ({
      value: c.subCode,
      label: `${c.subCode} (${c.subName || '-'})`
    }));

  const uniqueSubs = subs.filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
  return [{ value: "sub_only", label: "상세코드 전체" }, ...uniqueSubs];
}, [codes, selectedGroup]);

// 데이터 필터링
const filteredData = useMemo(() => {
  const searchTerm = appliedKeyword.trim().toLowerCase();

  return codes
    .filter((code) => {
      // 그룹/상세 코드 선택에 따른 필터링
      if (selectedGroup === "all") {
        if (selectedSub === "sub_only" && code.subCode === '-') return false;
      } 
      else if (selectedGroup === "group_only") {
        if (code.subCode !== '-') return false;
      } 
      else {
        // 특정 그룹 선택
        if (code.groupCode !== selectedGroup) return false;

        // '상세코드 전체'를 선택했다면 해당 그룹의 모든 것
        if (selectedSub === "sub_only") {
          return true;
        }
        
        // 특정 상세코드 하나를 직접 선택 -> 그 코드와 부모(그룹 본체) 노출
        if (selectedSub !== "all") {
          if (code.subCode !== selectedSub && code.subCode !== '-') return false;
        }
      }

      // 검색어 필터링
      if (!searchTerm) return true;
      const searchFields = [
        code.groupName, code.groupCode, code.subName, code.subCode, code.desc
      ].map(val => (val || "").toLowerCase());
      return searchFields.some(field => field.includes(searchTerm));
    })
    .sort((a, b) => {
      if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
      if (a.subCode === '-') return -1;
      if (b.subCode === '-') return 1;
      return (a.order || 0) - (b.order || 0) || a.subCode.localeCompare(b.subCode);
    });
}, [codes, appliedKeyword, selectedGroup, selectedSub]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // 테이블 컬럼 정의
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
          {parts.map((p, i) => <span key={i} className={i === 1 ? "" : ""}>{p}</span>)}
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

  // 검색 핸들러
const handleSearch = () => {
  setAppliedKeyword(searchParams.keyword || ""); 
  setCurrentPage(1); 
};

// 리셋 핸들러: 모든 상태를 초기화
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

  // 2. 삭제 핸들러
//   const handleDeleteSelected = () => {
//   if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
  
//   const hasGroupCode = selectedIds.some(id => id.startsWith("GROUP_"));
//   const allNames = getAllSelectedItemsList();

//   setModalConfig({
//     title: '선택 항목 삭제',
//     message: (
//       <div className="flex flex-col gap-2 text-left">
//         <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
//         {hasGroupCode && (
//           <p className="text-[14px] text-red-500 font-bold bg-red-50 p-2 rounded mt-1">
//             ⚠️ 주의: 그룹코드 삭제 시 해당 그룹 내 모든 상세코드가 먼저 삭제됩니다.
//           </p>
//         )}
//         <p className="text-[13px] text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
//       </div>
//     ),
//     type: 'delete',
//     onConfirm: async () => {
//       try {
//         // 1. 상세코드(ITEM)와 그룹코드(GROUP)를 분리
//         const itemsToDelete = currentData.filter(codeInfo => codeInfo.subName);
//         const groupsToDelete = currentData.filter(codeInfo => !codeInfo.subName);
        
//         // 2. 상세코드 먼저 삭제 (자식 먼저 삭제)
//         for await (const codeInfo of itemsToDelete) {
//           await codeService.deleteItem(codeInfo.groupCode, codeInfo.subCode);
//         }

//         // 3. 그룹코드 삭제 (부모 삭제)
//         for await (const codeInfo of groupsToDelete) {
//           await codeService.deleteGroup(codeInfo.groupCode); 
//         }

//         await fetchCodes();
//         setSelectedIds([]);
//         setIsModalOpen(false);
//         triggerToast("선택한 항목이 삭제되었습니다.");
//       } catch (error) {
//         console.error("삭제 중 오류 발생:", error);
//         // 서버에서 보낸 에러 메시지가 있으면 표시
//         const errMsg = error.response?.data?.message || "상세코드가 존재하여 그룹코드를 삭제할 수 없습니다.";
//         alert(errMsg);
//       }
//     }
//   });
//   setIsModalOpen(true);
// };

  // 삭제 핸들러 
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    
    const selectedObjects = codes.filter(code => selectedIds.includes(code.id));

    const itemsToDelete = selectedObjects.filter(obj => obj.subCode !== '-');
    const groupsToDelete = selectedObjects.filter(obj => obj.subCode === '-');

    const hasGroupCode = groupsToDelete.length > 0;
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
          // 상세 코드(자식)부터 삭제
          for (const item of itemsToDelete) {
            await codeService.deleteItem(item.groupCode, item.subCode);
          }

          // 그 다음 그룹 코드(부모) 삭제
          for (const group of groupsToDelete) {
            await codeService.deleteGroup(group.groupCode);
          }

          await fetchCodes();
          setSelectedIds([]);
          setIsModalOpen(false);
          triggerToast("선택한 항목이 삭제되었습니다.");
        } catch (error) {
          console.error("삭제 중 오류 발생:", error);
          alert(error.response?.data?.message || "삭제 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // 일괄 상태 변경 핸들러
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    
    const selectedObjects = codes.filter(code => selectedIds.includes(code.id));
    const hasGroupCode = selectedObjects.some(obj => obj.subCode === '-');
    const allNames = getAllSelectedItemsList();
    
    setModalConfig({
      title: `일괄 ${status ? '사용' : '미사용'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-[#2563EB] font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '사용' : '미사용'}</span> 처리하시겠습니까?</p>
           {/* 미사용 처리 시 그룹코드가 포함되어 있다면 경고 메시지 표시 */}
          {!status && hasGroupCode && (
            <div className="text-[14px] text-red-500 font-bold bg-red-50 p-3 rounded-md mt-2 border border-red-100">
              <p>⚠️ 주의: 그룹코드 미사용 시 해당 그룹에 속한</p>
              <p className="ml-5">모든 상세코드도 목록에서 미사용으로 처리됩니다.</p>
            </div>
          )}
        </div>
      ),

      type: status ? 'confirm' : 'delete', 
      onConfirm: async () => {
        try {
          
          const selectedObjects = codes.filter(code => selectedIds.includes(code.id));
          
          for (const item of selectedObjects) {
            
            const isVisible = Boolean(status); 

            if (item.subCode === '-') {
              
              await codeService.updateGroup(item.groupCode, {
                groupCode: item.groupCode,
                groupName: item.groupName,
                desc: item.desc,
                order: item.order,
                visible: isVisible
              });
            } else {
              
              await codeService.updateItem(item.groupCode, item.subCode, {
                groupCode: item.groupCode,
                subCode: item.subCode,
                subName: item.subName,
                desc: item.desc,
                order: item.order,
                visible: isVisible
              });
            }
          }

          await fetchCodes();
          setSelectedIds([]); 
          setIsModalOpen(false);
          triggerToast(`선택한 항목이 ${status ? '사용' : '미사용'} 처리되었습니다.`);
        } catch (error) {
          console.error("상태 변경 중 오류 발생:", error);
          alert(error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen  font-['Pretendard_GOV']">
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
          className={`w-full h-14 pl-5 pr-12 text-[16px] border bg-white text-[#111] flex items-center cursor-pointer transition-all duration-200 z-20 relative
            ${openDropdown === 'group' 
              ? 'border-admin-primary border-b-transparent rounded-t-md' 
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
          {groupOptions.map(opt => (
            <div 
          key={opt.value}
          // 그룹 드롭다운 내부 
          onClick={() => { 
            setOpenDropdown(null);
            setSelectedGroup(opt.value);
            setSelectedSub("sub_only");
            setAppliedKeyword(searchParams.keyword);
            setCurrentPage(1); 
          }}
              className={`px-5 py-4 text-[14px] cursor-pointer truncate transition-colors 
          ${selectedGroup === opt.value 
            ? 'bg-blue-50 text-admin-primary font-bold' 
            : 'text-[#444] hover:bg-blue-50 hover:text-admin-primary'
          }`}
        title={opt.label}
      >
        {opt.label}
      </div>
          ))}
        </div>
      )}
    </div>

    <div className="relative w-full md:w-[300px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
      <div 
        onClick={() => setOpenDropdown(openDropdown === 'sub' ? null : 'sub')}
        className={`w-full h-14 pl-5 pr-12 text-[16px] border bg-white text-[#111] flex items-center cursor-pointer transition-all duration-200 z-20 relative
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
            // 상세코드 드롭다운 내부
            onClick={() => { 
              setOpenDropdown(null);
              setSelectedSub(opt.value);
              setAppliedKeyword(searchParams.keyword);
              setCurrentPage(1); 
            }}
            className={`px-5 py-4 text-[14px] cursor-pointer truncate transition-colors 
            ${selectedSub === opt.value 
              ? 'bg-blue-50 text-admin-primary font-bold' 
              : 'text-[#444] hover:bg-blue-50 hover:text-admin-primary'
            }`}
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
  <div className="flex justify-between items-end mb-6">
    
    {/* 좌측: 선택된 개수 및 일괄 처리 버튼 */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="!text-[17px] font-bold text-admin-text-secondary flex items-center">

          {selectedIds.length > 0 ? (
            <span className="text-[#2563EB]">{selectedIds.length}개 선택됨</span>
          ) : (
            `전체 ${filteredData.length}건`
          )}
        </span>
      </div>

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

      {/* 우측: 삭제 버튼 */}
      <button 
        onClick={handleDeleteSelected} 
        className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
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