import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import BoardListSection from '@/components/shared/BoardListSection'; // 공통 컴포넌트 임포트

const UserPressRelList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리 (기존 유지)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('선택');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. 데이터 샘플 (기존 유지)
  const notices = [
    { id: 1, title: "전북특별자치도 지진방재 국제세미나 개최", author: '관리자', files: [{name:'file1'}], date: '2025-11-11', isPin: false },
    { id: 2, title: "전북특별자치도, 2026년 재해예방사업 국비 1,054억 확보", author: '관리자', files: [{name:'file1'}], date: '2025-11-11', isPin: false },
    { id: 3, title: "전북특별자치도 여름철 자연재난 인명피해 '0명'", author: '관리자', files: [{name:'file1'}], date: '2025-11-11', isPin: false },
    { id: 4, title: '한가위 연휴기간 축제 전북도 민관합동점검 안전관리 총력!', author: '관리자', files: [{name:'file1'}], date: '2025-10-24', isPin: false },
    { id: 5, title: '전북자치도, 안전점검의 날 교통안전 캠페인 전개', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 6, title: '전북도, 상반기 안전신문고 우수 신고자 선정 포상', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 7, title: '전북특별자치도, 가을축제 안전관리 우리가 간다!', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 8, title: '전북자치도, 찾아가는 중대재해예방 컨설팅 완료', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 9, title: '전북자치도, 찾아가는 중대재해예방 컨설팅 완료', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 10, title: '전북자치도, 찾아가는 중대재해예방 컨설팅 완료', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 11, title: '전북자치도, 찾아가는 중대재해예방 컨설팅 완료', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
    { id: 12, title: '전북자치도, 찾아가는 중대재해예방 컨설팅 완료', author: '관리자', files: [{name:'file1'}], date: '2025-09-25', isPin: false },
  ];

  // 3. 정렬 로직 (기존 유지)
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPin !== b.isPin) return b.isPin ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });

  // 4. 페이징 계산 (기존 유지)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);

  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userPressRelList", hasIcon: false },
    { label: "보도자료", path: "/userPressRelList", hasIcon: false },
  ];

  return (
    <div className="w-full">
      <PageBreadcrumb items={breadcrumbItems} />

      <h2 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight text-left">보도자료</h2>

      {/* 검색바 영역 */}
      <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center gap-3">
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
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>

        <div className="relative flex-1 max-w-lg">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어를 입력해주세요." 
            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>

        <button className="bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm">
          검색
        </button>
      </div>

      {/* 🌟 컴포넌트화 적용: 테이블 및 페이지네이션 */}
      <BoardListSection 
        items={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRowClick={(id) => navigate(`/userPressRelDetail/${id}`)}
      />
    </div>
  );
};

export default UserPressRelList;