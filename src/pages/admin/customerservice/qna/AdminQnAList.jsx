// src/pages/admin/customerservice/qna/AdminQnAList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// [데이터]
import { AdminQnAData } from './AdminQnAData';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * [관리자] 1:1 문의 목록 페이지
 */
const AdminQnAList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================
  const [inquiries, setInquiries] = useState(AdminQnAData); // 전체 데이터
  const [selectedIds, setSelectedIds] = useState([]);       // 선택된 행 ID
  const [currentPage, setCurrentPage] = useState(1);        // 현재 페이지
  const itemsPerPage = 10;                                  // 페이지당 항목 수

  // [검색 및 필터 상태 통합 관리]
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: 'ALL',
    type: 'ALL',
    dateStart: '',
    dateEnd: ''
  });

  // [실제 적용된 검색 필터 (검색 버튼 클릭 시 업데이트)]
  const [appliedFilters, setAppliedFilters] = useState(searchParams);

  // ==================================================================================
  // 최신 글 3개 ID 계산 로직
  // ==================================================================================
  const recentIds = useMemo(() => {
    const sorted = [...inquiries].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.slice(0, 3).map(item => item.id);
  }, [inquiries]);

  // ==================================================================================
  // 2. 필터링 로직
  // ==================================================================================
  const filteredData = useMemo(() => {
    const { status, type, keyword, dateStart, dateEnd } = appliedFilters;
    const lowerKeyword = keyword.replace(/\s+/g, "").toLowerCase();

    return inquiries.filter((item) => {
      // 1. 상태 필터
      if (status !== 'ALL' && item.status !== status) return false;
      
      // 2. 유형 필터
      if (type !== 'ALL' && item.type !== type) return false;

      // 3. 날짜 필터 (YYYY-MM-DD 비교)
      if (dateStart || dateEnd) {
          const itemDate = item.date.substring(0, 10); 
          if (dateStart && itemDate < dateStart) return false;
          if (dateEnd && itemDate > dateEnd) return false;
      }

      // 4. 키워드 검색 (제목 + 작성자)
      if (lowerKeyword) {
          const matchTitle = item.title.replace(/\s+/g, "").toLowerCase().includes(lowerKeyword);
          const matchAuthor = item.author.replace(/\s+/g, "").toLowerCase().includes(lowerKeyword);
          if (!matchTitle && !matchAuthor) return false;
      }

      return true;
    }).sort((a, b) => b.id - a.id); // 최신순 정렬
  }, [inquiries, appliedFilters]);

  // 현재 페이지 데이터 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 3. 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { 
      key: 'no', 
      header: '번호', 
      width: '80px', 
      className: 'text-center text-gray-500' 
    },
    { 
      key: 'status', 
      header: '상태', 
      width: '100px', 
      className: 'text-center',
      render: (status) => {
        let badgeClass = "";
        let label = "";

        switch (status) {
          case 'WAITING':
            badgeClass = "bg-gray-50 text-gray-500 border-gray-200";
            label = "답변대기";
            break;
          case 'PROCESSING':
            badgeClass = "bg-orange-50 text-orange-600 border-orange-200";
            label = "답변처리중";
            break;
          case 'ANSWERED':
            badgeClass = "bg-blue-50 text-blue-600 border-blue-100";
            label = "답변완료";
            break;
          default:
            badgeClass = "bg-gray-50 text-gray-500 border-gray-200";
            label = status;
        }

        return (
          <span className={cn(
            "inline-block px-2 py-1 text-xs font-bold rounded-sm min-w-[70px] border text-center",
            badgeClass
          )}>
            {label}
          </span>
        );
      }
    },
    { 
      key: 'type', 
      header: '문의유형', 
      width: '140px', 
      className: 'text-center text-gray-600' 
    },
    { 
      key: 'title', 
      header: '제목', 
      render: (title, row) => (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 hover:underline"
          onClick={() => navigate(`/admin/contents/QnADetail/${row.id}`)}
        >
          <span className="truncate max-w-[400px] text-gray-900">{title}</span>
         {/* 최신 글 3개에 N 뱃지 표시 */}
          {recentIds.includes(row.id) && (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex-shrink-0">
              N
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'author', 
      header: '작성자', 
      width: '100px', 
      className: 'text-center text-gray-600' 
    },
    { 
      key: 'date', 
      header: '등록일', 
      width: '120px', 
      className: 'text-center text-gray-500',
      render: (date) => date.substring(0, 10) // YYYY-MM-DD만 표시
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
            navigate(`/admin/contents/QnADetail/${row.id}`);
          }}
          className="border border-gray-300 text-[#666] rounded px-3 py-1 text-[12px] font-bold bg-white hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all"
        >
          조회
        </button>
      )
    }
  ], [navigate, recentIds]);

  // ==================================================================================
  // 4. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  
  // 검색 실행
  const handleSearch = () => {
    setAppliedFilters(searchParams);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    const initialParams = {
      keyword: '',
      status: 'ALL',
      type: 'ALL',
      dateStart: '',
      dateEnd: ''
    };
    setSearchParams(initialParams);
    setAppliedFilters(initialParams);
    setCurrentPage(1);
  };

  // 입력값 변경 (Select, Date 등)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // 선택 즉시 리스트 갱신
  const handleImmediateChange = (e) => {
    const { name, value } = e.target;
    
    // 1. UI 상태 업데이트
    setSearchParams(prev => ({ ...prev, [name]: value }));
    
    // 2. 필터 로직 상태 업데이트 (즉시 반영)
    setAppliedFilters(prev => ({ ...prev, [name]: value }));
    
    // 3. 페이지 초기화
    setCurrentPage(1);
  };

  // 일괄 삭제
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    if (confirm(`선택한 ${selectedIds.length}개 문의를 영구 삭제하시겠습니까?`)) {
      setInquiries(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  // ==================================================================================
  // 5. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F7FB] font-sans antialiased text-gray-900">
      <main className="p-10">
        
        {/* Title */}
        <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">1:1 문의 목록</h2>
        </div>

        {/* [A] 검색 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 1. 날짜 범위 선택 */}
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                name="dateStart"
                value={searchParams.dateStart}
                onChange={handleChange}
                className="h-14 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all"
              />
              <span className="text-gray-400">~</span>
              <input 
                type="date" 
                name="dateEnd"
                value={searchParams.dateEnd}
                onChange={handleChange}
                className="h-14 px-3 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* 2. 답변 상태 필터 */}
            <div className="relative w-full md:w-40">
              <select 
                name="status"
                value={searchParams.status} 
                onChange={handleImmediateChange}
                className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="ALL">상태(전체)</option>
                <option value="WAITING">답변대기</option>
                <option value="PROCESSING">답변처리중</option>
                <option value="ANSWERED">답변완료</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* 3. 문의 유형 필터 */}
            <div className="relative w-full md:w-48">
              <select 
                name="type"
                value={searchParams.type}
                onChange={handleImmediateChange}
                className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="ALL">문의유형(전체)</option>
                <option value="계정 및 회원정보">계정 및 회원정보</option>
                <option value="시스템 및 장애">시스템 및 장애</option>
                <option value="결제 및 서비스 이용">결제 및 서비스 이용</option>
                <option value="기능 제안 및 개선">기능 제안 및 개선</option>
                <option value="기타">기타</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 리스트 영역 (White Card) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            
            {/* 좌측: 카운트 & 정보 */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-700">
                {selectedIds.length > 0 ? (
                  <span className="text-blue-600">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>
            </div>

            {/* 우측: 버튼 그룹 */}
            <div className="flex gap-2">
               <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-red-400 text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
            </div>
          </div>

          {/* Table */}
          <AdminDataTable 
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(row) => navigate(`/admin/contents/QnADetail/${row.id}`)}
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

export default AdminQnAList;