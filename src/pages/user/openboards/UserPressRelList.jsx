import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection';
import SearchBarTemplate from '@/components/shared/SearchBarTemplate';
import { pressService } from '@/services/api'; // API 서비스 임포트


// 보도자료 목록 페이지 //

const UserPressRelList = () => {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [pressList, setPressList] = useState([]); // 서버에서 받은 데이터 저장
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 전체 개수 (페이지네이션용)
  const itemsPerPage = 10; // 한 페이지당 보여줄 게시글 수

  const [searchCategory, setSearchCategory] = useState('선택');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState({ category: '선택', term: '' });

 // --- [추가] 서버에서 데이터 가져오는 함수 ---
  const fetchList = useCallback(async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const data = await pressService.getPressList({ offset, limit: itemsPerPage });
      

      // BoardListSection이 이해할 수 있는 데이터 형식으로 변환
      const formatted = data.map((item, index) => {
        // 1. 실제 파일 배열이 있으면 그것을 쓰고, 없으면 빈 배열 생성
        // 2. 만약 fileCount만 있다면 그 숫자만큼 빈 객체를 채운 배열 생성
        const fileArray = item.fileList && item.fileList.length > 0 
          ? item.fileList 
          : new Array(item.fileCount || 0).fill({});

        return {
          ...item,
          id: item.contentId,
          date: item.createdAt ? item.createdAt.split('T')[0] : '', 
          writer: '관리자', 
          author: '관리자',
          
          // 핵심: BoardListSection이 .length를 사용하므로 배열을 넘겨줌
          files: fileArray, 
          
          displayNo: offset + index + 1 
        };
      });

      // 2. 가공된 최종 데이터 확인 (표 형태로 깔끔하게 출력)
      console.table(formatted.map(f => ({
        ID: f.id,
        제목: f.title.substring(0, 10) + "...",
        파일수_files: f.files,
        파일수_fileCount: f.fileCount,
        파일리스트_길이: f.fileList.length
      })));

      setPressList(formatted);
      
      if(totalItems === 0 && data.length > 0) setTotalItems(data.length); 

    } catch (error) {
      console.error("보도자료 로딩 실패:", error);
    }
  }, [currentPage, activeSearch, totalItems]);


  // --- [추가] 페이지가 바뀌면 데이터를 다시 불러옴 ---
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // --- 이벤트 핸들러 (Event Handlers) --- //

  // 검색 버튼 클릭 시 호출: 현재 입력된 값들을 activeSearch에 저장하고 1페이지로 이동
  const handleSearch = () => {
    setActiveSearch({ category: searchCategory, term: searchTerm });
    setCurrentPage(1);
  };

  // 초기화 핸들러: 모든 검색 조건과 페이지를 초기 상태로 리셋
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
            // item 자체가 이미 숫자 ID(예: 4476)이므로 바로 navigate에 넣어줍니다.
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