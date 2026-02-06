// src/pages/admin/safetyPolicy/AdminSafetyPolicyList.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, Loader2 } from 'lucide-react';

import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { safetyPolicyService } from '@/services/api';

const AdminSafetyPolicyList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State)
  // ==================================================================================
  const [data, setData] = useState([]);          // 리스트 데이터
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(false);     // 에러 상태

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택 ID

  // [검색 상태] keyword: 검색어, visibleYn: 공개 여부 필터
  const [searchParams, setSearchParams] = useState({ keyword: '', visibleYn: '' });

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  // ==================================================================================
  // 2. 데이터 조회 (API Call)
  // ==================================================================================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const params = {
        page: currentPage,
        size: itemsPerPage,
        keyword: searchParams.keyword,
        visibleYn: searchParams.visibleYn || undefined // 전체 조회 시 undefined 전송
      };

      const res = await safetyPolicyService.getSafetyPolicyList(params);

      if (res && res.data) {
        setData(res.data.list);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error("관리자 정책 목록 조회 에러:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParams]); // 검색 조건 변경 시(버튼 클릭 후) 재조회

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================================================================================
  // 3. 핸들러 (수정된 부분)
  // ==================================================================================

  // [개별 노출 토글] 핸들러 (API 연결 완료)
  const handleToggleVisible = useCallback((id, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    
    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>해당 항목을 <span className={`font-bold ${nextStatus === 'Y' ? 'text-admin-primary' : 'text-gray-500'}`}>[{nextStatus === 'Y' ? '노출' : '비노출'}]</span> 상태로 변경하시겠습니까?</p>
        </div>
      ),
      type: nextStatus === 'Y' ? 'confirm' : 'delete', // 디자인: 파랑(confirm) / 빨강(delete)
      onConfirm: async () => {
        try {
          // API 호출
          await safetyPolicyService.updateVisibility([id], nextStatus);
          
          // 화면 즉시 갱신 (Optimistic Update)
          setData(prev => prev.map(item => 
            item.contentId === id ? { ...item, visibleYn: nextStatus } : item
          ));
          setIsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert("상태 변경 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  }, []);

  // [추가] 일괄 노출/비노출 핸들러
  const handleBatchStatus = (isExpose) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const targetStatus = isExpose ? 'Y' : 'N';
    
    setModalConfig({
      title: `일괄 ${isExpose ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>선택하신 <span className="font-bold text-admin-primary">{selectedIds.length}개</span> 항목을 일괄 <span className="font-bold underline">{isExpose ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: isExpose ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await safetyPolicyService.updateVisibility(selectedIds, targetStatus);
          
          setData(prev => prev.map(item => 
            selectedIds.includes(item.contentId) ? { ...item, visibleYn: targetStatus } : item
          ));
          setSelectedIds([]);
          setIsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert("일괄 변경 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // 검색 & 초기화
  const handleSearch = () => { setCurrentPage(1); fetchData(); };
  const handleReset = () => {
    setSearchParams({ keyword: '', visibleYn: '' });
    setCurrentPage(1);
    setTimeout(() => fetchData(), 0);
  };

  // 페이지 이동
  const goDetail = (row) => navigate(`/admin/contents/adminSafetyPolicyDetail/${row.contentId}`);

  // [단건 삭제]
  const handleDeleteSingle = useCallback((row) => {
    setModalConfig({
      title: '정책 삭제',
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>선택하신 정책 <span className="font-bold">[{row.title}]</span>을(를) 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          await safetyPolicyService.deleteSafetyPolicies([row.contentId]);
          setIsModalOpen(false);
          fetchData(); // 목록 갱신
          setSelectedIds(prev => prev.filter(id => id !== row.contentId));
          alert("삭제되었습니다.");
        } catch (err) {
          console.error(err);
          alert("삭제 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  }, [fetchData]);

  // [일괄 삭제]
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">{selectedIds.length}개</span> 정책을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          await safetyPolicyService.deleteSafetyPolicies(selectedIds);
          setIsModalOpen(false);
          fetchData();
          setSelectedIds([]);
          alert("성공적으로 삭제되었습니다.");
        } catch (err) {
          console.error(err);
          alert("삭제 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };


  // ==================================================================================
  // 4. 테이블 컬럼 정의 (수정된 부분)
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'contentId', header: 'No', width: '80px', className: 'text-center' },
    { 
      key: 'title', header: '정책명', className: 'text-left',
      render: (val, row) => (
        <span className="cursor-pointer text-graygray-90 hover:text-admin-primary hover:underline font-bold" onClick={(e) => { e.stopPropagation(); goDetail(row); }}>
          {val}
        </span>
      )
    },
    { 
      key: 'source', 
      header: '출처', 
      width: '150px', 
      className: 'text-gray-600', 
      render: (val) => (
        <div style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          width: '130px' // 컬럼 width보다 약간 작게 설정
        }}>
          {val || '-'}
        </div>
      )
    },
    // [수정] 토글 스위치 컬럼
    { 
      key: 'visibleYn', 
      header: '노출여부', 
      width: '100px', 
      className: 'text-center',
      render: (val, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.contentId, val); }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              val === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
            } cursor-pointer hover:shadow-inner`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              val === 'Y' ? 'translate-x-6' : 'translate-x-0' 
            }`} />
          </button>
        </div>
      )
    },
    { 
      key: 'lastUpdateDate', 
      header: '최종 수정일시', 
      width: '180px', // 시간까지 표시되므로 너비 확장
      className: 'text-center text-gray-500 text-sm',
      render: (val) => {
        if (!val) return '-';
        // "2026-02-02T15:24:57" -> "2026-02-02 15:24"
        return val.replace('T', ' ').substring(0, 16);
      }
    },
    {
      key: 'actions', header: '관리', width: '160px', className: 'text-center',
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); goDetail(row); }} className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">보기</button>
          <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(row); }} className="bg-red-50 border border-red-200 rounded px-3 py-1 text-sm text-red-600 hover:bg-red-100">삭제</button>
        </div>
      )
    }
  ], [handleToggleVisible, handleDeleteSingle]);

  // ==================================================================================
  // 5. 렌더링 (UI 수정)
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight flex items-center gap-2">
          주요 안전정책 관리
        </h2>

        {/* [A] 검색 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
           <AdminSearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={handleSearch} onReset={handleReset}>
             <div className="relative w-full md:w-48">
               <select name="visibleYn" value={searchParams.visibleYn} onChange={(e) => setSearchParams(prev => ({ ...prev, visibleYn: e.target.value }))} className="w-full h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer appearance-none">
                 <option value="">상태 전체</option>
                 <option value="Y">공개</option>
                 <option value="N">비공개</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
             </div>
           </AdminSearchBox>
        </section>

        {/* [B] 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-center mb-6">
            
            {/* 좌측: 선택 정보 및 [추가] 일괄 처리 버튼 */}
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? <span className="text-admin-primary">{selectedIds.length}개 선택됨</span> : `전체 ${totalItems}건`}
              </span>
              
              {/* 일괄 처리 버튼 그룹 */}
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group hover:opacity-70 transition-opacity">
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group hover:opacity-70 transition-opacity">
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>

            {/* 우측: 등록/삭제 버튼 */}
            <div className="flex gap-2">
              <button onClick={handleDeleteSelected} className="px-6 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:bg-[#D60034] shadow-sm">선택 삭제</button>
              <button onClick={() => navigate('/admin/contents/adminSafetyPolicyAdd')} className="px-8 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 shadow-sm">신규 등록</button>
            </div>
          </div>

          {/* 테이블 및 페이지네이션 */}
          {loading ? <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin text-admin-primary" size={48} /></div> : 
           error ? <div className="flex justify-center items-center min-h-[300px] text-gray-500">데이터 로드 실패</div> : 
           <>
              <AdminDataTable columns={columns} data={data} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowKey="contentId" />
              <AdminPagination totalItems={totalItems} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
           </>
          }
        </section>
      </main>
      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AdminSafetyPolicyList;