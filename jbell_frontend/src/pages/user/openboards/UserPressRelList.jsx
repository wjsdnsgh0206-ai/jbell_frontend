import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import { pressData } from './BoardData';

// 보도자료 목록 페이지 //

const UserPressRelList = () => {
  const navigate = useNavigate();

  // --- 상태 관리 (State) --- //
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 검색 상태 관리
  const [searchCategory, setSearchCategory] = useState('선택');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '선택', term: '' });

  // --- 데이터 전처리 로직 (Memoization) --- //

  // 1. 중복 데이터 제거: 동일한 제목을 가진 데이터가 중복으로 들어오는 것을 방지
  const cleanData = useMemo(() => {
    const seenTitles = new Set();
    return pressData.filter(item => {
      if (seenTitles.has(item.title)) return false;
      seenTitles.add(item.title);
      return true;
    });
  }, []);

  // 2. 검색 필터링 로직: 확정된 검색 조건(activeSearch)에 맞춰 데이터 추출
  const filteredData = useMemo(() => {
    let result = [...cleanData];
    const { category, term } = activeSearch;
    const trimmedTerm = term.trim();

    if (trimmedTerm !== '') {
      result = result.filter(item => {
        // '선택'일 경우 제목 + 내용 + 등록인(writer 혹은 author) 전체를 검사
        if (category === '선택') {
          return (
            item.title?.includes(trimmedTerm) ||
            item.content?.includes(trimmedTerm) ||
            (item.writer || item.author)?.includes(trimmedTerm)
          );
        }
        // 특정 카테고리가 지정된 경우 해당 필드만 검사
        if (category === '제목') return item.title?.includes(trimmedTerm);
        if (category === '내용') return item.content?.includes(trimmedTerm);
        if (category === '등록인') return (item.writer || item.author)?.includes(trimmedTerm);
        return true;
      });
    }
    return result;
  }, [cleanData, activeSearch]);

  // 3. 정렬 및 페이지네이션
  const { currentItems, totalPages } = useMemo(() => {
    // - 정렬: 최신 날짜(date)가 위로 오도록 내림차순 정렬
    const sorted = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    // - 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paged = sorted.slice(indexOfFirstItem, indexOfLastItem);

    // - 목록 번호 부여: 현재 페이지와 인덱스를 계산하여 순번(displayNo) 생성
    const finalItems = paged.map((item, index) => ({
      ...item,
      displayNo: indexOfFirstItem + index + 1
    }));

    return { 
      currentItems: finalItems, 
      totalPages: Math.ceil(sorted.length / itemsPerPage) || 1 
    };
  }, [filteredData, currentPage]);

  // --- 이벤트 핸들러 (Event Handlers) --- //

  // 검색 실행: 사용자가 입력한 값을 확정 상태로 업데이트하고 1페이지로 리셋
  const handleSearch = () => {
    setActiveSearch({ category: searchCategory, term: searchTerm });
    setCurrentPage(1);
  };
  // 상단 경로 안내 데이터
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      {/* 상단 경로 안내 컴포넌트 */}
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">보도자료</h1>
        
        {/* --- 검색바 영역 (반응형: 모바일은 세로, 데스크탑은 가로) --- */}
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center gap-3">
          {/* 검색 카테고리 선택 */}
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
            {/* 커스텀 화살표 아이콘 아이콘 */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {/* 검색어 입력란 */}
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
          {/* 검색 실행 버튼 */}
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm text-sm"
          >
            검색
          </button>
        </div>
        {/* --- BoardListSection 출력 --- */}
        <BoardListSection 
          items={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowClick={(id) => navigate(`/userPressRelDetail/${id}`)}
        />
      </main>
    </div>
  );
};

export default UserPressRelList;