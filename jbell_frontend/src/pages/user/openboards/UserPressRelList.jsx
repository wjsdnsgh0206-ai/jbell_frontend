import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';


const UserPressRelList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('선택');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. 데이터 샘플 
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

  // 3. 정렬 로직 
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPin !== b.isPin) return b.isPin ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });

  // 4. 페이징 계산 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedNotices.length / itemsPerPage);

  const handleDetailClick = (id) => {
    navigate(`/userPressRelDetail/${id}`);
  };

  const breadcrumbItems = [
        { label: "홈", path: "/", hasIcon: true },
        { label: "열린마당", path: "", hasIcon: false },
        { label: "보도자료", path: "", hasIcon: false }, // 리스트로 이동 가능하게 path 추가

      ];

  return (
    
      <div className="w-full">
        <PageBreadcrumb items={breadcrumbItems} />
       

        {/* ✅ 타이틀: 공지사항과 동일하게 text-3xl mb-10 설정 */}
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

        {/* 게시판 테이블 */}
        <div className="w-full mt-8 overflow-x-auto text-left"> 
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-100 text-sm font-bold text-gray-700 border-t-2 border-gray-800">
              <tr>
                <th className="py-4 px-2 w-16 md:w-20 font-bold">번호</th>
                <th className="py-4 px-4 text-center font-bold">제목</th>
                <th className="py-4 px-2 w-24 hidden sm:table-cell font-bold">등록인</th>
                <th className="py-4 px-2 w-20 hidden md:table-cell font-bold">파일수</th>
                <th className="py-4 px-2 w-32 hidden sm:table-cell font-bold">등록일자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white border-b border-gray-300"> 
              {currentItems.map((notice, index) => (
                <tr 
                  key={index} 
                  onClick={() => handleDetailClick(notice.id)}
                  className={`hover:bg-gray-50 transition cursor-pointer group ${notice.isPin ? 'bg-blue-50/40' : ''}`}
                >
                  <td className="py-4 text-center text-sm">
                    {notice.isPin ? (
                      <span className="inline-block border border-blue-500 text-blue-600 bg-white px-2 py-0.5 rounded-sm text-[11px] font-bold">공지</span>
                    ) : (
                      <span className="text-gray-500 font-medium">{notice.id}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-start ml-4">
                      <span className={`font-medium group-hover:text-blue-700 group-hover:underline line-clamp-1 transition-all ${notice.isPin ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}>
                        {notice.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600 hidden sm:table-cell">{notice.author}</td>
                  <td className="py-4 text-sm text-gray-500 hidden md:table-cell">{notice.files ? notice.files.length : 0}</td>
                  <td className="py-4 text-sm text-gray-500 hidden sm:table-cell">{notice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-1 mt-12">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition mr-2"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
            <button 
              key={pageNum} 
              onClick={() => setCurrentPage(pageNum)}
              className={`w-10 h-10 rounded font-medium transition ${currentPage === pageNum ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {pageNum}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition ml-2"
          >
            &gt;
          </button>
        </div>
      </div>
    
  );
};

export default UserPressRelList;