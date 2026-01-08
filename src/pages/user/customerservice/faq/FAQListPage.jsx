// src/pages/user/customerservice/faq/FAQListPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import SearchBarTemplate from '@/components/shared/SearchBarTemplate';
import { faqData } from './data'; // 분리한 데이터 import

const FAQListPage = () => {
  const navigate = useNavigate();

  // --- Breadcrumb 데이터 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/faq", hasIcon: false },
    { label: "FAQ", path: "/faq", hasIcon: false },
  ];

  // --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' | 'oldest' | 'mostAsked'
  
  // 검색 상태
  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '전체', term: '' }); // 실제 적용된 검색어

  // --- 데이터 필터링 & 정렬 로직 (useMemo로 최적화) ---
  const processedData = useMemo(() => {
    let result = [...faqData];

    // 1. 검색 필터링
    if (activeSearch.term) {
      const term = activeSearch.term.trim();
      result = result.filter(item => {
        if (activeSearch.category === '제목') return item.question.includes(term);
        if (activeSearch.category === '내용') return item.answer.includes(term);
        // 전체 검색: 질문 또는 답변에 포함
        return item.question.includes(term) || item.answer.includes(term);
      });
    }

    // 2. 정렬 로직
    result.sort((a, b) => {
      if (sortOrder === 'mostAsked') return b.views - a.views; // 조회수 내림차순 (가상 필드 views가 있다고 가정하거나 data.js에 추가 필요)
      
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [activeSearch, sortOrder]);

  // --- 페이지네이션 계산 ---
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentItems = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- 핸들러 ---
  const handleSearch = () => {
    setActiveSearch({ category: searchCategory, term: searchTerm });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchCategory('전체');
    setSearchTerm('');
    setActiveSearch({ category: '전체', term: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0">
      <main className="w-full max-w-[1000px] flex flex-col">
        
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="flex flex-col w-full pb-20 text-heading-xl text-graygray-90">FAQ</h1>

        {/* --- 검색바 (SearchBarTemplate 적용) --- */}
        <SearchBarTemplate
          keyword={searchTerm}
          onKeywordChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="궁금한 내용을 입력해주세요."
        >
          {/* 카테고리 필터 */}
          <div className="relative w-full col-span-2 lg:w-32">
            <select 
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full lg:min-w-fit h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="전체">전체</option>
              <option value="제목">제목</option>
              <option value="내용">내용</option>
            </select>
            {/* 화살표 아이콘 등은 필요 시 추가 */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>
        </SearchBarTemplate>

        {/* --- 리스트 상단 컨트롤 (개수, 정렬) --- */}
        <div className="flex flex-row justify-between items-end pb-4 border-b border-graygray-90">
          <div className="text-body-m text-graygray-70 whitespace-nowrap">
            총 <span className="font-bold text-graygray-90">{totalItems}</span>건
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-detail-m text-graygray-50">
             <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setSortOrder('mostAsked')}
                className={`transition-colors ${sortOrder === 'mostAsked' ? "font-bold text-graygray-90" : "hover:text-graygray-90"}`}
              >
                인기질문
              </button>
              <span className="w-[1px] h-3 bg-graygray-30"></span>
              <button 
                onClick={() => setSortOrder('latest')}
                className={`transition-colors ${sortOrder === 'latest' ? "font-bold text-graygray-90" : "hover:text-graygray-90"}`}
              >
                최신순
              </button>
              <span className="w-[1px] h-3 bg-graygray-30"></span>
              <button 
                onClick={() => setSortOrder('oldest')}
                className={`transition-colors ${sortOrder === 'oldest' ? "font-bold text-graygray-90" : "hover:text-graygray-90"}`}
              >
                오래된순
              </button>
            </div>
            
            <div className="relative hidden sm:block">
              <select 
                className="appearance-none bg-white border border-graygray-20 rounded px-3 py-1.5 pr-8 text-detail-m text-graygray-70 font-medium focus:outline-none focus:border-secondary-50 cursor-pointer transition-colors shadow-sm"
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                value={itemsPerPage}
              >
                <option value={5}>5개씩 보기</option>
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
                <option value={30}>30개씩 보기</option>
              </select>
              {/* 화살표 아이콘을 추가하여 선택 박스임을 직관적으로 표시 */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={14} className="text-graygray-40" />
              </div>
            </div>
          </div>
        </div>

        {/* --- FAQ 리스트 --- */}
        <div className="flex flex-col gap-3 md:gap-5 pt-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/faq/${item.id}`)}
                className="border border-graygray-10 rounded-xl p-5 md:p-6 hover:shadow-sm hover:border-graygray-30 transition-all cursor-pointer bg-white active:bg-graygray-5 flex flex-col gap-4"
              >
                {/* 컨텐츠 영역: Q와 A 사이의 간격 제어 */}
                <div className="flex flex-col gap-3">
                  {/* 질문 (Q) */}
                  <div className="flex items-start gap-3">
                    <span className="text-heading-m text-secondary-50 leading-none mt-0.5 shrink-0">Q</span>
                    <h3 className="text-title-l text-graygray-90 leading-snug">{item.question}</h3>
                  </div>
                  
                  {/* 답변 미리보기 (A) */}
                  <div className="flex items-start gap-3 pl-1">
                    <span className="text-body-m-bold text-graygray-50 leading-none mt-1 shrink-0">A</span>
                    <p className="text-body-m text-graygray-70 line-clamp-2">{item.answer}</p>
                  </div>
                </div>

                {/* 메타 정보 영역: 상단 컨텐츠와 gap으로 간격 유지 (pt-4 mt-2 대신 pt-4 적용) */}
                <div className="flex items-center justify-between border-t border-graygray-5 pt-4">
                  <div className="flex items-center gap-3 text-detail-m text-graygray-50">
                    <span>{item.date}</span>
                    {item.views !== undefined && (
                      <>
                        <span className="hidden sm:inline text-graygray-30">|</span>
                        <span className="hidden sm:inline">조회 {item.views}</span>
                      </>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-graygray-5 text-graygray-70 text-detail-s rounded-full border border-graygray-10 shrink-0">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-center text-graygray-50 bg-graygray-5 rounded-lg border border-graygray-10 border-dashed">
              <AlertCircle className="w-8 h-8" />
              <span>검색 결과가 없습니다.</span>
            </div>
          )}
        </div>
        {/* --- 페이지네이션 (대피소 소개 페이지 스타일 통합) --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-12 select-none">
            {/* 이전 버튼 */}
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* 페이지 번호 그룹 */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-detail-m transition-all
                    ${currentPage === number 
                      ? 'bg-secondary-50 text-white font-bold shadow-sm' 
                      : 'text-graygray-70 hover:bg-graygray-5'
                    }`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default FAQListPage;