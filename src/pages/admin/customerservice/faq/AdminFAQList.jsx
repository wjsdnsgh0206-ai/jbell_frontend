// src/pages/admin/customerservice/faq/AdminFAQList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { faqService } from '@/services/api';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

/**
 * [관리자] FAQ 목록 페이지
 * - AdminCommonCodeList.jsx의 구조와 디자인 시스템을 계승
 * - AdminFAQData.js 데이터를 기반으로 렌더링
 */
const AdminFAQList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================
  const [faqs, setFaqs] = useState([]); // 초기값 빈 배열로 변경
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 행 ID
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const itemsPerPage = 10;                            // 페이지당 항목 수

  // [필터 상태]
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // [검색 상태]
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  // [API 호출] FAQ 목록 조회
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      // 서비스 함수 호출
      const response = await faqService.getFaqList();
      
      // response 구조: { status: "SUCCESS", data: [...] }
      if (response && response.data) {
        setFaqs(response.data);
      }
    } catch (error) {
      console.error("목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // [API 호출] 일괄 공개/비공개 변경
  const handleBatchStatus = async (statusBoolean) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const statusText = statusBoolean ? '공개' : '비공개';
    
    if (confirm(`선택한 ${selectedIds.length}개를 ${statusText}로 변경하시겠습니까?`)) {
      try {
        const payload = {
            faqIds: selectedIds, 
            visibleYn: statusBoolean ? "Y" : "N"
        };
        // [수정] 서비스 함수 호출
        await faqService.updateFaqStatus(payload);
        
        alert('상태가 변경되었습니다.');
        fetchFaqs();
        setSelectedIds([]);
      } catch (error) {
        console.error("상태 변경 실패:", error);
        alert("오류가 발생했습니다.");
      }
    }
  };

   // [API 호출] 일괄 삭제 (백엔드 FaqBulkDelete DTO 대응)
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    if (confirm(`선택한 ${selectedIds.length}개를 삭제하시겠습니까?`)) {
      try {
        const payload = { faqIds: selectedIds }; 
        // [수정] 서비스 함수 호출
        await faqService.deleteFaq(payload);
        
        alert("삭제되었습니다.");
        fetchFaqs();
        setSelectedIds([]);
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // ==================================================================================
  // 2. 필터링 로직 (Filtering Logic)
  // ==================================================================================

  // [옵션 생성] 데이터에서 중복되지 않는 '카테고리' 목록 추출
  const categoryOptions = useMemo(() => {
    const categories = faqs.map(f => f.faqCategory);
    const uniqueCategories = [...new Set(categories)];
    return [{ value: "all", label: "전체 카테고리" }, ...uniqueCategories.map(c => ({ value: c, label: c }))];
  }, [faqs]);

  // [데이터 필터링 & 정렬]
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();

    return faqs.filter(item => {
      // 1. 카테고리 필터
      const isCategoryMatch = selectedCategory === "all" || item.faqCategory === selectedCategory;

      // 2. 상태 필터 (all, Y, N)
      const isStatusMatch = 
        selectedStatus === "all" ? true :
        selectedStatus === "Y" ? item.faqVisibleYn === true :
        item.status === false;

      if (!searchTerm) return isCategoryMatch && isStatusMatch;

      // 3. 검색어 필터 (JSON Content 내부 텍스트 추출)
      let contentText = "";
      if (Array.isArray(item.faqContent)) {
        contentText = item.faqContent.map(block => {
            if (block.type === 'text' || block.type === 'note') return block.value;
            if (block.type === 'list') return block.items.join(" ");
            if (block.type === 'table') {
                const headers = block.headers.join(" ");
                const rows = block.rows.map(row => row.join(" ")).join(" ");
                return headers + " " + rows;
            }
            return "";
        }).join(" ");
      }

      // 제목, 내용(추출된 텍스트), 작성자 통합 검색
      const targetString = [item.faqTitle, contentText, item.faqWrite]
        .join("")
        .replace(/\s+/g, "")
        .toLowerCase();

      return isCategoryMatch && isStatusMatch && targetString.includes(searchTerm);
    }).sort((a, b) => {
      // 4. 정렬 (Order 오름차순 -> ID 내림차순)
      if (a.faqDisplayOrder !== b.faqDisplayOrder) return (a.faqDisplayOrder || 999) - (b.faqDisplayOrder || 999);
      return b.faqId - a.faqId;
    });
  }, [faqs, appliedKeyword, selectedCategory, selectedStatus]);

  // [페이지네이션] 현재 페이지 데이터 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 3. 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { 
      key: 'faqId', // 실제로는 계산된 번호를 보여주기 위해 render 사용 권장
      header: '번호', 
      width: '60px', 
      className: 'text-center text-gray-500',
      render: (_, row) => {
        // 전체 데이터 기준 역순 번호 or 현재 페이지 기준 순번 등 선택 가능
        // 여기서는 데이터의 고유 ID 혹은 리스트 인덱스 사용
        return row.faqId; 
      }
    },
    { 
      key: 'faqCategory', 
      header: '분류', 
      width: '100px', 
      className: 'text-center',
      render: (cat) => (
        <span className="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded border border-slate-200">
          {cat}
        </span>
      )
    },
    { 
      key: 'faqTitle', 
      header: '질문(Q)', 
      render: (title, row) => (
        <div className="flex items-center cursor-pointer hover:text-blue-600" onClick={() => navigate(`/admin/contents/FAQDetail/${row.faqId}`)}>
          <span className="font-bold text-blue-600 mr-2">Q.</span>
          <span className="font-medium text-gray-900 truncate max-w-[400px]">{title}</span>
        </div>
      )
    },
    { key: 'faqWrite', header: '작성자', width: '100px', className: 'text-center text-gray-600' },
    { 
      key: 'faqUpdatedAt', 
      header: '수정일', 
      width: '120px', 
      className: 'text-center text-gray-500',
      // 날짜 포맷팅: YYYY-MM-DD (공백 기준 split 혹은 slice 사용)
      render: (date) => {
        if (!date) return '-';
        return date.split(' ')[0]; // '2025-01-02 15:30:00' -> '2025-01-02'
      }
    },
    { 
      key: 'faqVisibleYn', 
      header: '사용여부', 
      width: '100px',
      className: 'text-center',
      render: (status, row) => {
        // 문자열 'Y'와 정확히 비교하여 Boolean 값 생성
        const isActive = status === 'Y';

        return (
          <div 
            className="flex justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              // 현재 상태(status)를 인자로 함께 전달
              handleToggleStatus(row.faqId, status);
            }}
          >
            {/* status 대신 isActive 변수 사용 */}
            <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
               <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        );
      }
    },
    { 
      key: 'faqViewCount', 
      header: '조회수', 
      width: '80px', 
      className: 'text-center text-gray-600',
      render: (views) => views.toLocaleString()
    },
    {
      key: 'actions',
      header: '관리',
      width: '80px',
      className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/contents/FAQDetail/${row.faqId}`); // 상세/수정 페이지 이동
          }}
          className="border border-gray-300 text-graygray-70 rounded px-3 py-1 text-[12px] font-bold bg-white hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all"
        >
          수정
        </button>
      )
    }
  ], [navigate]);

  // ==================================================================================
  // 4. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  
  // 검색
  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSelectedCategory("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  // 개별 상태 토글
 const handleToggleStatus = async (targetFaqId, currentStatus) => {
    // 현재 "Y"면 "N"으로, "N"이면 "Y"로 변경할 값 설정
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    
    try {
      // 1. 백엔드 API 호출 (일괄 변경 API를 재활용하여 단건 처리)
      await faqService.updateFaqStatus({
        faqIds: [targetFaqId], // 리스트 형태여야 하므로 배열로 감쌈
        visibleYn: newStatus
      });

      // 2. 성공 시 화면(Local State) 업데이트
      setFaqs(prev => prev.map(item => 
        item.faqId === targetFaqId 
          ? { ...item, faqVisibleYn: newStatus } 
          : item
      ));
    } catch (error) {
      console.error("상태 변경 실패:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // ==================================================================================
  // 5. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* Title */}
        <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">FAQ 목록</h2>
        </div>

        {/* [A] 검색 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 1. 카테고리 필터 */}
            <div className="relative w-full md:w-60">
              <select 
                value={selectedCategory} 
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* 2. 상태 필터 */}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedStatus} 
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="all">상태(전체)</option>
                <option value="Y">사용(공개)</option>
                <option value="N">미사용(비공개)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 리스트 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* 좌측: 카운트 & 일괄 처리 */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-700">
                {selectedIds.length > 0 ? (
                  <span className="text-blue-600">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>

              {/* 일괄 처리 버튼 그룹 */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleBatchStatus(true)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600">일괄 사용</span>
                </button>

                <div className="w-[1px] h-3 bg-gray-300" />

                <button 
                  onClick={() => handleBatchStatus(false)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                     <div className="w-2 h-2 bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">일괄 미사용</span>
                </button>
              </div>
            </div>

            {/* 우측: CRUD 버튼 */}
            <div className="flex gap-2">
               <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-red-400 text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
              <button 
                onClick={() => navigate('/admin/contents/FAQAdd')}
                className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          {/* Table */}
          <AdminDataTable 
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowKey="faqId"
          />

          {/* Pagination */}
          <div className="mt-8">
            <AdminPagination 
                totalItems={filteredData.length}
                itemCountPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminFAQList;