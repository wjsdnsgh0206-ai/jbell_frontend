// src/pages/admin/customerservice/faq/AdminFAQList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Edit2, 
  CheckCircle, 
  XCircle, 
  HelpCircle 
} from 'lucide-react';
import AdminFAQAdd from './AdminFAQAdd';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 샘플 데이터에 'order' 필드 추가 (낮을수록 상단 노출)
const initialFaqs = [
  { id: 1, category: '회원/계정', title: '비밀번호를 분실했습니다. 어떻게 찾나요?', author: '관리자', date: '2025-01-08', views: 120, status: true, order: 1 },
  { id: 2, category: '결제/환불', title: '카드 결제 영수증은 어디서 출력하나요?', author: '운영팀', date: '2025-01-07', views: 85, status: true, order: 2 },
  { id: 3, category: '이용문의', title: '서비스 이용 시간은 어떻게 되나요?', author: 'CS팀', date: '2025-01-05', views: 340, status: true, order: 3 },
  { id: 4, category: '회원/계정', title: '회원 탈퇴는 어디서 하나요?', author: '관리자', date: '2025-01-04', views: 55, status: false, order: 10 },
  { id: 5, category: '시스템', title: '사이트 접속이 원활하지 않습니다.', author: '개발팀', date: '2025-01-02', views: 12, status: true, order: 5 },
  { id: 6, category: '결제/환불', title: '환불 규정이 궁금합니다.', author: '운영팀', date: '2024-12-30', views: 210, status: true, order: 4 },
  { id: 7, category: '기타', title: '제휴 문의는 어떻게 하나요?', author: '마케팅', date: '2024-12-28', views: 40, status: false, order: 99 },
  { id: 8, category: '이용문의', title: '모바일 앱 설치가 안됩니다.', author: 'CS팀', date: '2024-12-25', views: 90, status: true, order: 6 },
  { id: 9, category: '회원/계정', title: '개명으로 인한 이름 변경 요청', author: '관리자', date: '2024-12-20', views: 33, status: true, order: 7 },
  { id: 10, category: '시스템', title: '화면이 깨져서 보입니다.', author: '개발팀', date: '2024-12-15', views: 18, status: true, order: 8 },
  { id: 11, category: '기타', title: '페이지네이션 테스트용 데이터 1', author: '테스터', date: '2024-12-10', views: 5, status: true, order: 9 },
  { id: 12, category: '기타', title: '페이지네이션 테스트용 데이터 2', author: '테스터', date: '2024-12-10', views: 3, status: true, order: 11 },
];

const FaqListPage = () => {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [selectedIds, setSelectedIds] = useState([]);
  const [view, setView] = useState('list');
  
  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // --- 페이지네이션 상태 ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // --- 로직: 데이터 추가 ---
  const handleAddFaq = (newData) => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    
    // 한국 시간(KST) 기준 날짜 생성
    const kstDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    const today = kstDate.toISOString().split('T')[0];

    // 등록된 order 값 저장 (없으면 기본값 1)
    const newFaq = {
      id: newId,
      category: newData.category,
      title: newData.title,
      content: newData.content,
      author: '관리자', 
      date: today,
      views: 0,
      status: newData.status,
      order: Number(newData.order) || 1, // 숫자형으로 변환하여 저장
    };

    // 새 데이터를 배열에 추가
    setFaqs([newFaq, ...faqs]);
    setView('list');
  };

  // --- 로직: 필터링 및 정렬 ---
  const filteredData = useMemo(() => {
    // 검색 및 필터링
    const filtered = faqs.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;

      const matchesStatus = 
        filterStatus === 'All' ? true :
        filterStatus === 'Y' ? item.status === true :
        item.status === false;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // 정렬 로직 추가 (order 오름차순 -> id 내림차순)
    return filtered.sort((a, b) => {
      // 1순위: 노출 순서 (숫자가 작을수록 먼저)
      const orderDiff = (a.order || 999) - (b.order || 999);
      if (orderDiff !== 0) return orderDiff;
      
      // 2순위: ID (최신순, 숫자가 클수록 먼저) - 순서가 같을 경우
      return b.id - a.id;
    });

  }, [faqs, searchQuery, filterCategory, filterStatus]);

  // --- 로직: 필터 변경 시 페이지 리셋 ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus]);

  // --- 로직: 페이지네이션 계산 ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- 로직: 선택 ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- 로직: 액션 ---
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    if (confirm(`선택한 ${selectedIds.length}개의 FAQ를 삭제하시겠습니까?`)) {
      setFaqs((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
      setSelectedIds([]);
    }
  };

  const handleBatchStatus = (newStatus) => {
    if (selectedIds.length === 0) {
      alert('상태를 변경할 항목을 선택해주세요.');
      return;
    }
    const actionName = newStatus ? '공개(사용)' : '비공개(미사용)';
    if (confirm(`선택한 ${selectedIds.length}개의 항목을 [${actionName}] 상태로 변경하시겠습니까?`)) {
        setFaqs((prev) => prev.map((item) => 
            selectedIds.includes(item.id) ? { ...item, status: newStatus } : item
        ));
        setSelectedIds([]);
    }
  };

  const handleToggleStatus = (id) => {
    setFaqs((prev) => prev.map((n) => 
      n.id === id ? { ...n, status: !n.status } : n
    ));
  };

  if (view === 'add') {
    return (
      <AdminFAQAdd 
        onCancel={() => setView('list')} 
        onSave={handleAddFaq} 
      />
    );
  }

  return (
    <div className="w-full bg-white p-6 font-sans text-slate-800">
      
      {/* 1. Header */}
      <div className="mb-6">
        <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <span>고객지원 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-gray-900 font-bold">FAQ(자주 묻는 질문) 관리</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">FAQ 관리</h2>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 w-full">
        <select 
          className="h-10 border border-gray-300 rounded-sm px-3 text-sm min-w-[130px] focus:border-blue-500 focus:outline-none bg-white text-gray-600"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">전체 카테고리</option>
          <option value="회원/계정">회원/계정</option>
          <option value="결제/환불">결제/환불</option>
          <option value="이용문의">이용문의</option>
          <option value="시스템">시스템</option>
          <option value="기타">기타</option>
        </select>

        <select 
          className="h-10 border border-gray-300 rounded-sm px-3 text-sm min-w-[135px] focus:border-blue-500 focus:outline-none bg-white text-gray-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">상태(전체)</option>
          <option value="Y">사용(공개)</option>
          <option value="N">미사용(비공개)</option>
        </select>

        <select className="h-10 border border-gray-300 rounded-sm px-3 text-sm min-w-[110px] focus:border-blue-500 focus:outline-none bg-white text-gray-600">
          <option>제목+내용</option>
          <option>제목</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <input 
            type="text"
            className="h-10 w-full border border-gray-300 rounded-sm px-3 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
            placeholder="검색어를 입력해주세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button className="h-10 px-6 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-sm flex items-center gap-1 transition-colors">
          <Search className="w-4 h-4" /> 검색
        </button>
      </div>

      {/* 3. Action Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
             {/* ... 선택 및 일괄 처리 버튼 ... */}
            <div className="flex items-center gap-2">
                <input 
                type="checkbox" 
                className="w-4 h-4 border-gray-300 text-blue-600 rounded focus:ring-blue-500"
                onChange={handleSelectAll}
                checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                id="selectAll"
                />
                <label htmlFor="selectAll" className="text-sm text-gray-600 cursor-pointer select-none">
                {selectedIds.length > 0 ? (
                    <span className="font-bold text-blue-600">{selectedIds.length}개 선택됨</span>
                ) : (
                    `총 ${filteredData.length}건`
                )}
                </label>
            </div>
            
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                    <button onClick={() => handleBatchStatus(true)} className="text-xs flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium">
                        <CheckCircle className="w-3 h-3" /> 공개 처리
                    </button>
                    <button onClick={() => handleBatchStatus(false)} className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium">
                        <XCircle className="w-3 h-3" /> 비공개 처리
                    </button>
                    <button onClick={handleDeleteSelected} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
                        <Trash2 className="w-3 h-3" /> 삭제
                    </button>
                </div>
            )}
        </div>

        <div className="flex gap-2">
           <button className="h-8 px-4 border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 rounded-sm transition-colors">
            엑셀 다운로드
          </button>
          <button 
            onClick={() => setView('add')}
            className="h-8 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-sm flex items-center gap-1 transition-colors shadow-sm"
          >
            <Edit2 className="w-3 h-3" /> 신규 등록
          </button>
        </div>
      </div>

      {/* 4. Table Area */}
      <div className="w-full overflow-x-auto border-t border-gray-800 min-h-[300px]">
        <table className="w-full text-sm text-left border-b border-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-[#f8f9fa] border-b border-gray-300">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-[50px]"></th>
              <th scope="col" className="px-4 py-3 text-center w-[60px] font-semibold text-gray-600">번호</th>
              {/* [UI 추가] 노출 순서 컬럼을 확인하고 싶다면 아래 주석 해제 */}
              {/* <th scope="col" className="px-4 py-3 text-center w-[80px] font-semibold text-gray-600">순서</th> */}
              <th scope="col" className="px-4 py-3 text-center w-[120px] font-semibold text-gray-600">분류</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 min-w-[300px]">질문(Q)</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">작성자</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">수정일</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">사용여부</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">조회수</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <HelpCircle className="w-10 h-10 text-gray-300 mb-2" />
                    <p>등록된 FAQ 데이터가 없습니다.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-gray-300 text-blue-600 rounded focus:ring-blue-500"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{item.id}</td>
                  {/* <td className="px-4 py-3 text-center text-gray-500">{item.order}</td> */}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded border border-slate-200">
                        {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    <div className="flex items-center">
                        <span className="font-bold text-blue-600 mr-2">Q.</span>
                        <span className="cursor-pointer hover:text-blue-600 hover:underline">
                        {item.title}
                        </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.author}</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-xs">{item.date}</td>
                  <td className="px-4 py-3 text-center">
                    <div 
                      onClick={() => handleToggleStatus(item.id)}
                      className={cn(
                        "relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out mx-auto",
                        item.status ? "bg-blue-600" : "bg-gray-300"
                      )}
                    >
                      <div 
                        className={cn(
                          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out",
                          item.status ? "translate-x-5" : "translate-x-0"
                        )} 
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="px-3 py-1 border border-gray-300 bg-white text-xs text-gray-600 rounded-sm hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      수정
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-center mt-6 select-none">
          <nav className="inline-flex -space-x-px" aria-label="Pagination">
            
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 text-sm font-medium border z-10",
                  currentPage === pageNum
                    ? "text-white bg-blue-900 border-blue-900" 
                    : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50"
                )}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © The Government of the Republic of Korea. All rights reserved.
      </div>

    </div>
  );
};

export default FaqListPage;