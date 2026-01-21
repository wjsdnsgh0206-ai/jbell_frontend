//src/pages/user/customerservice/qna/QnAListPage.jsx
import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronLeft, ChevronDown, Plus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import SearchBarTemplate from '@/components/shared/SearchBarTemplate';
import { Button } from '@/components/shared/Button';

const QnAListPage = () => {
  const navigate = useNavigate();

  // --- Breadcrumb 데이터 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
  ];

  // 샘플 데이터 (실제 프로젝트에선 data.js로 분리 추천)
  const inquiries = [
    { id: 1, status: 'progress', statusText: '답변대기', title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...', date: '2024.04.30', category: '계정 및 회원정보' },
    { id: 2, status: 'complete', statusText: '답변완료', title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?', date: '2024.05.01', category: '결제 및 서비스 이용' },
    { id: 3, status: 'receipt', statusText: '접수완료', title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.', date: '2024.06.01', category: '결제 및 서비스 이용' },
    { id: 4, status: 'waiting', statusText: '확인중', title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.', date: '2025.11.01', category: '시스템 및 장애' },
    // ... 데이터 생략
  ];

  // --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchCategory, setSearchCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '전체', term: '' });

  // --- 데이터 필터링 및 정렬 ---
  const processedData = useMemo(() => {
    let result = [...inquiries];
    if (activeSearch.term) {
      const term = activeSearch.term.trim();
      result = result.filter(item => {
        if (activeSearch.category === '제목') return item.title.includes(term);
        if (activeSearch.category === '내용') return item.content.includes(term);
        return item.title.includes(term) || item.content.includes(term);
      });
    }
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [activeSearch, sortOrder]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentItems = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // 배지 스타일 (FAQ와 톤 맞춤)
  const getStatusStyle = (status) => {
    switch (status) {
      case 'progress': return 'bg-orange-50 text-orange-600 border-orange-100'; 
      case 'complete': return 'bg-blue-50 text-blue-600 border-blue-100';      
      case 'receipt':  return 'bg-graygray-5 text-graygray-60 border-graygray-10'; 
      case 'waiting':  return 'bg-green-50 text-green-600 border-green-100';   
      default: return 'bg-graygray-5 text-graygray-40 border-graygray-10';
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 px-4 lg:px-0 bg-white">
      <main className="w-full max-w-[1000px] flex flex-col">
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="flex flex-col w-full pb-20 text-heading-xl text-graygray-90">1:1문의</h1>

        <SearchBarTemplate
          keyword={searchTerm}
          onKeywordChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="문의 제목이나 내용을 입력해주세요."
        >
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
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown size={16} className="text-graygray-50" />
            </div>
          </div>
        </SearchBarTemplate>

        {/* --- 2. 리스트 상단 컨트롤 바 (총 n건 / 정렬 / 문의하기) --- */}
        {/* FAQ와 동일하게 검색바 아래에 위치하며, 리스트와의 간격 확보를 위해 mb-0을 유지하거나 미세조정합니다. */}
        <div className="flex flex-row justify-between items-end pb-4 border-b border-graygray-90">
          <div className="text-body-m text-graygray-70 whitespace-nowrap">
            총 <span className="font-bold text-graygray-90">{totalItems}</span>건
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-detail-m text-graygray-50">
            {/* 정렬 버튼 */}
            <div className="flex items-center gap-2 sm:gap-3">
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

            {/* 개수 선택 (직관적인 박스형) */}
            <div className="relative hidden sm:block">
              <select 
                className="appearance-none bg-white border border-graygray-20 rounded px-3 py-1.5 pr-8 text-detail-m text-graygray-70 focus:outline-none focus:border-secondary-50 cursor-pointer transition-colors shadow-sm"
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                value={itemsPerPage}
              >
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={14} className="text-graygray-40" />
              </div>
            </div>

            {/* 문의하기 버튼 (컨트롤바 우측 배치) */}
            <Button 
              variant="secondary" 
              size="flex" 
              className="h-9 px-4 text-detail-m"
              onClick={() => navigate('/qna/form')}
            >
              <Plus size={14} className="mr-1" /> 문의하기
            </Button>
          </div>
        </div>

        {/* --- QnA(문의) 리스트 영역 --- */}
        {/* 1. border-t-2와 상단 컨트롤바 사이의 간격을 mt-8로 확보
          2. 리스트 하단과 페이지네이션 사이의 간격을 mb-16으로 확보 
        */}
        <div className="flex flex-col mb-16">
          {currentItems.length > 0 ? (
            <div className="flex flex-col gap-4 md:gap-5 pt-4"> {/* 선 바로 아래 첫 아이템과의 간격 */}
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/qna/${item.id}`)}
                  className="border border-graygray-10 rounded-xl p-5 md:p-6 hover:shadow-sm hover:border-graygray-30 transition-all cursor-pointer bg-white active:bg-graygray-5 flex flex-col gap-4"
                >
                  {/* 상단: 상태 배지 및 카테고리 */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[12px] font-bold rounded border ${getStatusStyle(item.status)}`}>
                      {item.statusText}
                    </span>
                    <span className="text-[12px] text-graygray-50 bg-white px-2 py-0.5 rounded border border-graygray-10">
                      {item.category}
                    </span>
                  </div>

                  {/* 중간: 질문 제목 및 내용 미리보기 */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-title-l text-graygray-90 font-bold leading-snug group-hover:text-secondary-50 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-body-m text-graygray-60 line-clamp-1 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {/* 하단: 메타 정보 영역 */}
                  <div className="flex items-center justify-between border-t border-graygray-5 pt-4">
                    <div className="text-detail-m text-graygray-50 tabular-nums">
                      <span>등록일: {item.date}</span>
                    </div>
                    <ChevronRight size={18} className="text-graygray-30 group-hover:text-secondary-50 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 검색 결과 없음 UI */
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center text-graygray-50 bg-graygray-5 rounded-lg border border-graygray-10 border-dashed mt-6">
              <AlertCircle className="w-8 h-8 text-graygray-30" />
              <span className="text-title-m">문의 내역이 없습니다.</span>
            </div>
          )}
        </div>

        {/* --- 페이지네이션 (대피소/FAQ 공통 스타일) --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-12 select-none">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

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

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default QnAListPage;