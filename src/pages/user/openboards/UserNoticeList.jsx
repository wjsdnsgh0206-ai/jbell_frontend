// src/pages/user/openboards/UserNoticeList.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import SearchBarTemplate from "@/components/shared/SearchBarTemplate";
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

  // 1. 초기화 핸들러 함수 추가
  const handleReset = () => {
    setSearchCategory('선택'); // 카테고리 초기화
    setSearchTerm('');        // 입력창 비우기
    setActiveSearch({ category: '선택', term: '' }); // 검색 결과 리셋
    setCurrentPage(1);        // 1페이지로 이동
  };

  return (
    <div className="w-full px-5 md:px-0">
      {/* 페이지 상단 경로 안내 */}
      <PageBreadcrumb items={breadcrumbItems} />
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-20">공지사항</h1>

        {/* --- 검색바 영역 --- */}
        {/* --- 검색바 영역 병합 적용 --- */}
        <SearchBarTemplate
          keyword={searchTerm}
          onKeywordChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset} // 👈 이제 이 handleReset이 위에서 만든 함수를 가리킵니다.
          placeholder="검색어를 입력해주세요."
        >
          {/* 공지사항 전용 필터: 카테고리 선택 */}
          <div className="relative w-full col-span-2 lg:col-span-1 lg:w-32">
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full lg:min-w-fit h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="선택">선택</option>
              <option value="제목">제목</option>
              <option value="내용">내용</option>
              <option value="등록인">등록인</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-graygray-50" />
            </div>
          </div>
        </SearchBarTemplate>

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