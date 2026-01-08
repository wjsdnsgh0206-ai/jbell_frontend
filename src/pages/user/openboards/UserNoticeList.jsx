import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import { noticeData } from './BoardData';

// 공지사항 목록 페이지 //

const UserNoticeList = () => {
  const navigate = useNavigate();

  // --- 상태 관리 (State) --- //
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 보여줄 게시글 수

  const [searchCategory, setSearchCategory] = useState('선택');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '선택', term: '' });

  // --- 데이터 전처리 (Data Memoization) --- //
  // 1. 중복 제거: 제목이 중복된 데이터가 있을 경우 하나만 남기고 필터링
  const cleanData = useMemo(() => {
    const seenTitles = new Set();
    return noticeData.filter(item => {
      if (seenTitles.has(item.title)) return false;
      seenTitles.add(item.title);
      return true;
    });
  }, []);

  // 2. 검색 필터링: activeSearch 상태에 따라 데이터를 필터링
  const filteredData = useMemo(() => {
    let result = [...cleanData];
    const { category, term } = activeSearch;
    const trimmedTerm = term.trim();

    if (trimmedTerm !== '') {
      result = result.filter(item => {
        // '선택' 카테고리일 경우 제목, 내용, 등록자(writer/author) 전체에서 검색  
        if (category === '선택') {
          return (
            item.title?.includes(trimmedTerm) ||
            item.content?.includes(trimmedTerm) ||
            (item.writer || item.author)?.includes(trimmedTerm)
          );
        }
        // 특정 카테고리가 선택된 경우 해당 필드에서만 검색
        if (category === '제목') return item.title?.includes(trimmedTerm);
        if (category === '내용') return item.content?.includes(trimmedTerm);
        if (category === '등록인') return (item.writer || item.author)?.includes(trimmedTerm);
        return true;
      });
    }
    return result;
  }, [cleanData, activeSearch]);

  // 3. 정렬 및 페이지네이션 로직
  const { currentItems, totalPages } = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      if (a.isPin !== b.isPin) return a.isPin ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });
    // - 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paged = sorted.slice(indexOfFirstItem, indexOfLastItem);

    // - 번호 표시 로직: 고정 게시글은 '공지', 일반 게시글은 인덱스 번호 부여
    const normalItemsOnly = sorted.filter(n => !n.isPin);
    const finalItems = paged.map((item) => {
      if (item.isPin) return { ...item, displayNo: '공지' };
      const normalIndex = normalItemsOnly.findIndex(n => n.id === item.id);
      return { ...item, displayNo: normalIndex + 1 };
    });

    return {
      currentItems: finalItems,
      totalPages: Math.ceil(sorted.length / itemsPerPage) || 1
    };
  }, [filteredData, currentPage]);

  // --- 이벤트 핸들러 (Event Handlers) --- //

  // 검색 버튼 클릭 시 호출: 현재 입력된 값들을 activeSearch에 저장하고 1페이지로 이동
  const handleSearch = () => {
    setActiveSearch({ category: searchCategory, term: searchTerm });
    setCurrentPage(1);
  };
  // 브레드크럼(경로 표시) 데이터
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userNoticeList", hasIcon: false },
    { label: "공지사항", path: "/userNoticeList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      {/* 페이지 상단 경로 안내 */}
      {/* ==== 나중에 경로수정 해야함 === */}
      <button onClick={() => navigate("/admin/adminCommonCodeList")}>코드관리</button>
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">공지사항</h1>

        {/* --- 검색바 영역 --- */}
        {/* flex-col(모바일:세로), md:flex-row(데스크탑:가로)로 반응형 배치 */}
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center gap-3">
          {/* 카테고리 선택 드롭다운 */}
          <div className="relative w-full md:w-32">
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="appearance-none border border-gray-300 rounded px-4 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm pr-10"
            >
              <option value="선택">선택</option>
              <option value="제목">제목</option>
              <option value="내용">내용</option>
              <option value="등록인">등록인</option>
            </select>
            {/* 커스텀 화살표 아이콘 */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {/* 검색어 입력창 */}
          <div className="relative w-full md:flex-1 md:max-w-lg">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="검색어를 입력해주세요." 
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 text-sm bg-white outline-none"
            />
          </div>
          {/* 검색 버튼 */}
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm"
          >
            검색
          </button>
        </div>

         {/* --- 리스트 테이블 및 페이지네이션 컴포넌트 --- */} 
        <BoardListSection 
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={(id) => navigate(`/userNoticeDetail/${id}`)}
        />
      </main>
    </div>
  );
};

export default UserNoticeList;