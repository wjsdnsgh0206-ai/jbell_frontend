// src/pages/user/openboards/UserPressRelList.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import SearchBarTemplate from '@/components/shared/SearchBarTemplate';
import { pressService } from '@/services/api';

//사용자 보도자료 목록 페이지 //

// 줄임말 검색 지원용 사전 (필요할 때마다 추가 가능)
const SEARCH_ALIAS = {
  "행안부": "행정안전부",
  "전북": "전북재난안전대책본부",
  "전북안전": "전북재난안전대책본부",
  "전북안전대책본부": "전북재난안전대책본부",
  "복지부": "보건복지부",
};

const UserPressRelList = () => {
  const navigate = useNavigate();

  // 상태 관리 
  const [pressList, setPressList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [searchCategory, setSearchCategory] = useState('선택');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '선택', term: '' });

  const fetchList = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      const rawTerm = (activeSearch.term || '').trim();
      const processedTerm = SEARCH_ALIAS[rawTerm.replace(/\s+/g, "")] || rawTerm;

      const params = {
        offset,
        limit: itemsPerPage,
        searchCategory: activeSearch.category === '선택' ? '' : activeSearch.category,
        searchTerm: processedTerm,
        roleType: 'user'
      };

      const response = await pressService.getPressList(params);

      if (response && response.list) {
        const formatted = response.list.map((item, index) => {
          const fileArray = item.fileList && item.fileList.length > 0
            ? item.fileList
            : new Array(item.fileCount || 0).fill({});

          const offset = (currentPage - 1) * itemsPerPage;
          const sequentialNo = offset + index + 1;

          return {
            ...item,
            id: item.contentId,
            date: item.createdAt ? item.createdAt.split('T')[0] : '',
            writer: item.userName,
            author: item.userName,
            files: fileArray,
            displayNo: sequentialNo
          };
        })

        console.table(formatted.map(f => ({
          ID: f.id,
          제목: f.title.substring(0, 10) + "...",
          파일수_files: f.files,
          파일수_fileCount: f.fileCount,
          파일리스트_길이: f.fileList.length
        })));

        setPressList(formatted);
        setTotalItems(response.totalCount || 0);
      } else {
        // 데이터가 없는 경우 처리
        setPressList([]);
        setTotalItems(0);
      }

      // if (activeSearch.term) {
      //     setTotalItems(data.length); 
      // } else {

      //     if (totalItems === 0) setTotalItems(data.length); 
      // }

    } catch (error) {
      console.error("보도자료 로딩 실패:", error);
    }
  }, [currentPage, activeSearch, itemsPerPage]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 이벤트 핸들러

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

  // 브레드크럼(경로 표시) 데이터
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    <div className="w-full px-5 md:px-0">
      <main className="w-full">
        {/* 페이지 상단 경로 안내 */}
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl text-graygray-90 pb-20">보도자료</h1>

        {/* --- 검색바 영역 --- */}
        <SearchBarTemplate
          keyword={searchTerm}
          onKeywordChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onReset={handleReset}
          placeholder="검색어를 입력해주세요."
        >
          {/* 보도자료 전용 필터: 카테고리 선택 */}
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

        {/* --- 리스트 테이블 및 페이지네이션 컴포넌트 --- */}
        <div className="mt-2">
          <BoardListSection
            items={pressList}
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / itemsPerPage) || 1}
            onPageChange={setCurrentPage}
            onRowClick={(id) => {
              if (id) {
                navigate(`/userPressRelDetail/${id}`);
              } else {
                console.error("ID 값이 넘어오지 않았습니다.");
              }
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default UserPressRelList;