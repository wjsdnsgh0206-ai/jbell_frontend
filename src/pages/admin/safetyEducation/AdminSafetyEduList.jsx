// src/pages/admin/safetyEducation/AdminSafetyEduList.jsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { safetyEduService } from '@/services/api';
import { ChevronDown } from 'lucide-react';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

// [내부용 작은 컴포넌트]
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ToggleSwitch = ({ isOn, onToggle }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isOn ? 'bg-blue-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

/**
 * [관리자] 시민안전교육 목록 페이지
 * - 안전교육 콘텐츠 조회, 검색, 상태 변경 및 삭제 기능 제공
 * - 서버 사이드 페이지네이션 적용
 */
const AdminSafetyEduList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================

  // [데이터 상태]
  const [eduList, setEduList] = useState([]); 
  const [totalItems, setTotalItems] = useState(0); // 전체 개수

  // [선택 및 페이지네이션 상태]
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // [필터 및 검색 상태]
  const [selectedPublicStatus, setSelectedPublicStatus] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  // [UI 제어 상태: 모달 & 토스트]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setBreadcrumbTitle(""); 
  }, [setBreadcrumbTitle]);

  // ==================================================================================
  // 2. API 호출 (API Calls)
  // ==================================================================================

  // [API 호출] 목록 조회 (서버 사이드 필터링 & 페이징)
  const fetchList = useCallback(async () => {
    try {
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: appliedKeyword,
        searchType: searchType,
        isPublic: selectedPublicStatus
      };

      const response = await safetyEduService.getSafetyEduList(params);
      setEduList(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("목록 조회 실패:", error);
      triggerToast("데이터를 불러오는데 실패했습니다.");
    }
  }, [currentPage, appliedKeyword, searchType, selectedPublicStatus]);

  // 검색 조건이나 페이지 변경 시 데이터 재조회
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ==================================================================================
  // 3. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================

  // [UI] 토스트 메시지 출력
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // [이동] 상세 페이지 이동
  const goDetail = useCallback((id) => {
    navigate(`/admin/contents/safetyEduDetail/${id}`); 
  }, [navigate]);

  // [Helper] 선택된 항목들의 타이틀 추출
  const getAllSelectedItemsList = () => {
    const selectedItems = eduList.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title).join(", ");
  };

  // [API 호출] 단건 노출 상태 토글
  const handleTogglePublic = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const targetItem = eduList.find(item => item.id === id);
    
    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>' <span className="font-bold text-gray-900">{targetItem?.title}</span> ' 의 상태를 
            <span className={`font-bold ${nextStatus ? 'text-blue-600' : 'text-red-500'} ml-1`}>
              [{nextStatus ? '노출' : '비노출'}]
            </span>로 변경하시겠습니까?
          </p>
          <p className="text-sm text-gray-500">* 변경 즉시 사용자 서비스 화면에 반영됩니다.</p>
        </div>
      ),
      type: nextStatus ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          // 단건이지만 배열 형태로 API 호출
          await safetyEduService.updateVisibility([id], nextStatus);
          setIsModalOpen(false);
          triggerToast(`'${targetItem.title}' 노출 상태가 변경되었습니다.`);
          fetchList(); // 목록 새로고침
        } catch (error) {
          console.error("상태 변경 실패:", error);
          alert("상태 변경 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // [API 호출] 일괄 노출 상태 변경
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();

    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-blue-600 font-bold">[{allNames}]</span> 항목을 일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await safetyEduService.updateVisibility(selectedIds, status);
          setSelectedIds([]); 
          setIsModalOpen(false);
          triggerToast(`일괄 ${status ? '노출' : '비노출'} 처리가 완료되었습니다.`);
          fetchList(); // 목록 새로고침
        } catch (error) {
          console.error("일괄 변경 실패:", error);
          alert("처리 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // [API 호출] 일괄 삭제
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    const allNames = getAllSelectedItemsList();

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-sm text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          await safetyEduService.deleteSafetyEdus(selectedIds);
          setSelectedIds([]);
          setIsModalOpen(false);
          triggerToast("삭제되었습니다."); 
          fetchList(); // 목록 새로고침
        } catch (error) {
          console.error("삭제 실패:", error);
          alert("삭제 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // ==================================================================================
  // 4. 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { 
      key: 'orderNo', 
      header: '순서', 
      width: '80px', 
      className: 'text-center', 
      render: (val) => <span>{val || '-'}</span>
    },
    { key: 'mgmtId', header: 'ID', width: '130px', className: 'text-center' },
    { 
      key: 'regType', 
      header: '등록방식', 
      width: '110px', 
      className: 'text-center',
      render: (val) => {
        const displayLabel = val === 'DIRECT' ? '직접등록' : (val || '직접등록');
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border ${
              displayLabel === '직접등록' 
                ? 'bg-purple-50 text-purple-500 border-purple-100' 
                : 'bg-orange-50 text-orange-500 border-orange-100'
            }`}>
              {displayLabel}
            </span>
          </div>
        );
      }
},
    { key: 'source', header: '출처', width: '180px', className: 'text-center' },
    { 
      key: 'title', 
      header: '시설명(교육명)', 
      className: 'text-center', 
      render: (val) => <span className="font-medium">{val}</span>
    },
    { 
      key: 'author', 
      header: '등록인', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <span>{val === 'ADMIN_MASTER' ? '관리자' : val}</span>
      )
    },
    { 
      key: 'createdAt', 
      header: '등록일시', 
      width: '140px', 
      className: 'text-center', 
      render: (val) => {
        if (!val) return "-";
        // "YYYY-MM-DDTHH:mm:ss" 형태라면 T를 공백으로 치환하여 표시
        const displayDate = val.replace('T', ' ');
        const [date, time] = displayDate.split(' ');
        return (
          <div className="flex flex-col items-center justify-center leading-tight text-[13px] text-gray-500">
            <span className="block text-gray-500">{date}</span>
            <span className="block">{time}</span>
          </div>
        );
      }
    },
    { 
      key: 'isPublic', 
      header: '노출여부', 
      width: '90px', 
      className: 'text-center', 
      render: (isPublic, row) => (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch isOn={isPublic} onToggle={() => handleTogglePublic(row.id, isPublic)} />
        </div>
      ) 
    },
    { 
      key: 'actions', 
      header: '관리', 
      width: '80px', 
      className: 'text-center', 
      render: (_, row) => (
        <button 
          onClick={() => goDetail(row.id)} 
          className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-50 whitespace-nowrap"
        >
          보기
        </button>
      ) 
    }
  ], [eduList, goDetail]);

  // ==================================================================================
  // 5. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-sans antialiased text-gray-900">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="p-10">
        <h2 className="text-[32px] font-bold mt-2 mb-10 text-[#111] tracking-tight">시민안전교육 목록</h2>

        {/* [A] 검색 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={() => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); }} 
            onReset={() => { 
              setSearchParams({ keyword: '' }); setAppliedKeyword(''); 
              setSearchType("all"); setSelectedPublicStatus("all"); 
              setCurrentPage(1); setSelectedIds([]); 
            }}
          >
            {/* 1. 노출여부 필터 */}
            <div className="relative w-full md:w-48">
              <select value={selectedPublicStatus} onChange={(e) => { setSelectedPublicStatus(e.target.value); setCurrentPage(1); }} className="w-full appearance-none h-14 pl-5 pr-10 border border-gray-200 rounded-md bg-white outline-none cursor-pointer text-[15px] focus:border-blue-600 transition-all">
                <option value="all">노출여부 전체</option>
                <option value="visible">노출</option>
                <option value="hidden">비노출</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {/* 2. 검색 타입 선택 */}
            <div className="relative w-full md:w-48">
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="w-full appearance-none h-14 pl-5 pr-10 border border-gray-200 rounded-md bg-white outline-none cursor-pointer text-[15px] focus:border-blue-600 transition-all">
                <option value="all">전체검색</option>
                <option value="title">시설명(교육명)</option>
                <option value="source">출처</option>
                <option value="content">내용(본문)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>
        
        {/* [B] 리스트 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          {/* Action Bar */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-500">
                {selectedIds.length > 0 ? <span className="text-blue-600">{selectedIds.length}개 선택됨</span> : `전체 ${totalItems}건`}
              </span>
              {/* 일괄 처리 버튼 그룹 */}
              <div className="flex items-center ml-4 gap-4 border-l pl-4 border-gray-200">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all"><div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all"><div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>
            {/* 우측: CRUD 버튼 */}
            <div className="flex gap-2">
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">삭제</button>
              <button onClick={() => navigate('/admin/contents/safetyEduAdd')} className="px-8 h-14 bg-blue-600 text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">등록</button>
            </div>
          </div>
          
          {/* Table */}
          <AdminDataTable columns={columns} data={eduList} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowKey="id" />
          
          {/* Pagination */}
          <AdminPagination totalItems={totalItems} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        </section>
      </main>
      
      {/* Modal */}
      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AdminSafetyEduList;