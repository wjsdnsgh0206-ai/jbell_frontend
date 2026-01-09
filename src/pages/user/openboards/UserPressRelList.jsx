import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import SearchBarTemplate from '@/components/shared/SearchBarTemplate'; // 공용 템플릿 추가
import { pressData } from './BoardData';

const UserPressRelList = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchCategory, setSearchCategory] = useState('선택');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '선택', term: '' });

  // --- 데이터 전처리 ---
  const cleanData = useMemo(() => {
    const seenTitles = new Set();
    return pressData.filter(item => {
      if (seenTitles.has(item.title)) return false;
      seenTitles.add(item.title);
      return true;
    });
  }, []);

  const filteredData = useMemo(() => {
    let result = [...cleanData];
    const { category, term } = activeSearch;
    const trimmedTerm = term.trim();

    if (trimmedTerm !== '') {
      result = result.filter(item => {
        if (category === '선택') {
          return (
            item.title?.includes(trimmedTerm) ||
            item.content?.includes(trimmedTerm) ||
            (item.writer || item.author)?.includes(trimmedTerm)
          );
        }
        if (category === '제목') return item.title?.includes(trimmedTerm);
        if (category === '내용') return item.content?.includes(trimmedTerm);
        if (category === '등록인') return (item.writer || item.author)?.includes(trimmedTerm);
        return true;
      });
    }
    return result;
  }, [cleanData, activeSearch]);

  const { currentItems, totalPages } = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paged = sorted.slice(indexOfFirstItem, indexOfLastItem);

    const finalItems = paged.map((item, index) => ({
      ...item,
      displayNo: indexOfFirstItem + index + 1
    }));

    return { 
      currentItems: finalItems, 
      totalPages: Math.ceil(sorted.length / itemsPerPage) || 1 
    };
  }, [filteredData, currentPage]);

  // --- 핸들러 ---
  const handleSearch = () => {
    setActiveSearch({ category: searchCategory, term: searchTerm });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchCategory('선택');
    setSearchTerm('');
    setActiveSearch({ category: '선택', term: '' });
    setCurrentPage(1);
  };

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      <main className="w-full">
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl text-graygray-90 pb-20">보도자료</h1>
        
        {/* --- 검색바 영역 (다른 페이지와 통일) --- */}
        <SearchBarTemplate
          keyword={searchTerm}
          onKeywordChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="검색어를 입력해주세요."
        >
          {/* 카테고리 필터: 모바일 col-span-2 적용 */}
          <div className="relative w-full col-span-2 lg:col-span-1 lg:w-32">
            <select 
              value={searchCategory} 
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full h-14 px-4 pr-10 bg-white border border-graygray-30 rounded-lg text-body-s text-graygray-90 outline-none focus:border-secondary-50 cursor-pointer appearance-none"
            >
              <option value="선택">선택</option>
              <option value="제목">제목</option>
              <option value="내용">내용</option>
              <option value="등록인">등록인</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown size={16} className="text-graygray-50" />
            </div>
          </div>
        </SearchBarTemplate>

        {/* --- 리스트 출력 영역 --- */}
        <div className="mt-2"> {/* 검색바와의 적절한 간격 확보 */}
          <BoardListSection 
            items={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onRowClick={(id) => navigate(`/userPressRelDetail/${id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default UserPressRelList;