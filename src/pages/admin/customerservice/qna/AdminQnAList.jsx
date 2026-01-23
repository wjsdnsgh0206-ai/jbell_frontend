// src/pages/admin/customerservice/qna/AdminQnAList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// [API 서비스]
import { qnaService } from '@/services/api';

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
  const [inquiries, setInquiries] = useState([]); // 전체 데이터
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);       // 선택된 행 ID
  const [currentPage, setCurrentPage] = useState(1);        // 현재 페이지
  const itemsPerPage = 10;                                  // 페이지당 항목 수

  // [검색 및 필터 상태 통합 관리]
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: 'ALL',
    category: 'ALL',
    dateStart: '',
    dateEnd: ''
  });
  const [appliedFilters, setAppliedFilters] = useState(searchParams);   // [실제 적용된 검색 필터 (검색 버튼 클릭 시 업데이트)]

  // 데이터 불러오기 (API 연동)
  const fetchQnaList = async () => {
    try {
      setLoading(true);
      const data = await qnaService.getQnaList();
      // 백엔드에서 최신순 정렬해서 주지만, 혹시 모르니 프론트에서도 정렬 가능
      setInquiries(data); 
    } catch (error) {
      console.error("QnA 목록 조회 실패:", error);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQnaList();
  }, []);

  // 최신 글 3개 ID 계산
  const recentIds = useMemo(() => {
    if (!inquiries.length) return [];
    // createdAt 문자열 비교
    const sorted = [...inquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted.slice(0, 3).map(item => item.qnaId);
  }, [inquiries]);

  // 필터링 로직 (기존 유지, 날짜 비교 등)
  const filteredData = useMemo(() => {
    const { status, category, keyword, dateStart, dateEnd } = appliedFilters;
    const lowerKeyword = keyword.replace(/\s+/g, "").toLowerCase();

    return inquiries.filter((item) => {
      // 상태 필터
      if (status !== 'ALL' && item.status !== status) return false;
      // 유형 필터
      if (category !== 'ALL' && item.categoryName !== category) return false;
      // 날짜 필터
      if (dateStart || dateEnd) {
          const itemDate = item.createdAt ? item.createdAt.substring(0, 10) : "";
          if (dateStart && itemDate < dateStart) return false;
          if (dateEnd && itemDate > dateEnd) return false;
      }
      // 키워드 검색
      if (lowerKeyword) {
          const title = item.title || "";
          const user = item.userName || "";
          const matchTitle = title.replace(/\s+/g, "").toLowerCase().includes(lowerKeyword);
          const matchAuthor = user.replace(/\s+/g, "").toLowerCase().includes(lowerKeyword);
          if (!matchTitle && !matchAuthor) return false;
      }
      return true;
    });
  }, [inquiries, appliedFilters]);

  // 페이지네이션
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  
  // 검색 실행
  const handleSearch = () => {
    setAppliedFilters(searchParams);
    setCurrentPage(1);
  };

  // 초기화
  const handleReset = () => {
    const initialParams = { keyword: '', status: 'ALL', category: 'ALL', dateStart: '', dateEnd: '' };
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
    setSearchParams(prev => ({ ...prev, [name]: value }));
    setAppliedFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // 일괄 삭제 API 연동
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    if (window.confirm(`선택한 ${selectedIds.length}개 문의를 영구 삭제하시겠습니까?`)) {
      try {
        await qnaService.deleteQna(selectedIds);
        alert("삭제되었습니다.");
        setSelectedIds([]);
        fetchQnaList(); // 목록 새로고침
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // ==================================================================================
  // 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { 
      key: 'no', header: '번호', width: '80px', className: 'text-center text-gray-500',
      render: (_, row) => row.qnaId 
    },
    { 
      key: 'status', header: '상태', width: '100px', className: 'text-center',
      render: (status) => {
        let badgeClass = "bg-gray-50 text-gray-500 border-gray-200";
        if (status === '답변 처리중') badgeClass = "bg-orange-50 text-orange-600 border-orange-200";
        else if (status === '답변완료') badgeClass = "bg-blue-50 text-blue-600 border-blue-100";
        
        return (
          <span className={cn("inline-block px-2 py-1 text-xs font-bold rounded-sm min-w-[70px] border text-center", badgeClass)}>
            {status}
          </span>
        );
      }
    },
    { key: 'categoryName', header: '문의유형', width: '140px', className: 'text-center text-gray-600' },
    { 
      key: 'title', header: '제목', 
      render: (title, row) => (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 hover:underline"
          onClick={() => navigate(`/admin/contents/QnADetail/${row.qnaId}`)}
        >
          <span className="truncate max-w-[400px] text-gray-900">{title}</span>
          {recentIds.includes(row.qnaId) && (
            <span className="inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex-shrink-0">N</span>
          )}
        </div>
      )
    },
    { key: 'userName', header: '작성자', width: '100px', className: 'text-center text-gray-600' },
    { 
      key: 'createdAt', header: '등록일', width: '120px', className: 'text-center text-gray-500',
      render: (date) => date ? date.substring(0, 10) : '-' 
    },
    {
      key: 'actions', header: '상세', width: '80px', className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/contents/QnADetail/${row.qnaId}`);
          }}
          className="border border-gray-300 text-gray-700 rounded px-3 py-1 text-[12px] font-bold bg-white hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all"
        >
          조회
        </button>
      )
    }
  ], [navigate, recentIds]);

  // ==================================================================================
  // 5. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-gray-900">
      <main className="p-10">
        <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">1:1 문의 목록</h2>
        </div>

        {/* 검색 영역 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <AdminSearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={handleSearch} onReset={handleReset}>
            <div className="flex items-center gap-2">
              <input type="date" name="dateStart" value={searchParams.dateStart} onChange={handleChange} className="h-14 px-3 text-sm border border-gray-300 rounded-md outline-none" />
              <span className="text-gray-400">~</span>
              <input type="date" name="dateEnd" value={searchParams.dateEnd} onChange={handleChange} className="h-14 px-3 text-sm border border-gray-300 rounded-md outline-none" />
            </div>
            <div className="relative w-full md:w-40">
              <select name="status" value={searchParams.status} onChange={handleImmediateChange} className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md outline-none cursor-pointer">
                <option value="ALL">상태(전체)</option>
                <option value="답변대기">답변대기</option>
                <option value="답변완료">답변완료</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            <div className="relative w-full md:w-48">
              <select name="category" value={searchParams.category} onChange={handleImmediateChange} className="w-full appearance-none h-14 pl-5 pr-8 text-sm border border-gray-300 rounded-md outline-none cursor-pointer">
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

        {/* 리스트 영역 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-700">
                {selectedIds.length > 0 ? <span className="text-blue-600">{selectedIds.length}개 선택됨</span> : `전체 ${filteredData.length}건`}
              </span>
            </div>
            <button onClick={handleDeleteSelected} className="px-8 h-14 bg-red-400 text-white rounded-md font-bold hover:opacity-90 shadow-sm">
              삭제
            </button>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">데이터를 불러오는 중입니다...</div>
          ) : (
            <>
              <AdminDataTable 
                columns={columns} 
                data={currentData} 
                selectedIds={selectedIds} 
                onSelectionChange={setSelectedIds} 
                rowKey="qnaId"
                onRowClick={(row) => navigate(`/admin/contents/QnADetail/${row.qnaId}`)} 
              />
              <div className="mt-8">
                <AdminPagination totalItems={filteredData.length} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminQnAList;