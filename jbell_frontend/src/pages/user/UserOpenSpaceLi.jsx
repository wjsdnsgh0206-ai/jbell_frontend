import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserOpenSpaceLi = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('선택');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. 데이터 샘플 (files를 숫자가 아닌 배열 형태로 수정)
  const notices = [
    { id: 7, title: "행정안전부 재난안전데이터 공유플랫폼 안내", author: '관리자', files: [{name:'file1'}], date: '2025-04-11', isPin: true },
    { id: 8, title: "전북특별자치도 '25년도 11월 재난 현황 정리입니다", author: '관리자', files: [{name:'file1'}, {name:'file2'}], date: '2025-12-08', isPin: true },
    { id: 1, title: '전북특별자치도 새롭게 추가된 쉼터 목록입니다', author: '관리자', files: [{name:'file1'}, {name:'file2'}], date: '2025-12-06', isPin: false },
    { id: 2, title: '전북특별자치도 새롭게 추가된 대피소 목록입니다', author: '관리자', files: [{name:'file1'}, {name:'file2'}, {name:'file3'}], date: '2025-11-25', isPin: false },
    { id: 3, title: '전북 특별자치도 겨울철 재난 대비 요령입니다', author: '관리자', files: [{name:'file1'}], date: '2025-11-11', isPin: false },
    { id: 4, title: '겨울철 동파 대비, 이렇게 대비하세요', author: '관리자', files: [{name:'file1'}], date: '2025-11-02', isPin: false },
    { id: 5, title: '한파정보 받고 부모님께 효도 안부전화드리기 캠페인', author: '관리자', files: [], date: '2025-10-30', isPin: false },
    { id: 6, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
    { id: 7, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
    { id: 8, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
    { id: 9, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
    { id: 10, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
    { id: 11, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: [{name:'file1'}], date: '2025-10-20', isPin: false },
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
    navigate(`/userNoticeDetail/${id}`);
  };

  // 보도자료 목록으로 이동하는 함수
const goToPressRelease = () => {
  navigate('/userPressLi'); 
};

  return (
    <>
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
          <span className="cursor-pointer hover:text-gray-800 transition">🏠 홈</span>
          <span className="text-gray-300">&gt;</span>
          <span>열린마당</span>
          <span className="text-gray-300">&gt;</span>
          <span className="font-semibold text-gray-800">공지사항</span>
          <button onClick={"/userPressDetail"}></button>
        </div>
      </div>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-10 md:py-16">
        <h2 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight">공지사항</h2>

                {/* 보도자료 이동 임시 버튼 */}
          <button 
            onClick={goToPressRelease}
            className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition shadow-sm"
          >
            보도자료 목록 이동 테스트 →
          </button>
        

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
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <button className="bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm">
            검색
          </button>
        </div>

        {/* 게시판 테이블 */}
        <div className="w-full mt-8 overflow-x-auto"> 
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-100 text-sm font-bold text-gray-700 border-t-2 border-gray-800">
              <tr>
                <th className="py-4 px-2 w-16 md:w-20">번호</th>
                <th className="py-4 px-4 text-center">제목</th>
                <th className="py-4 px-2 w-24 hidden sm:table-cell">등록인</th>
                <th className="py-4 px-2 w-20 hidden md:table-cell">파일수</th>
                <th className="py-4 px-2 w-32 hidden sm:table-cell">등록일자</th>
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
                      <span className="inline-block border border-blue-500 text-blue-600 bg-white px-2 py-0.5 rounded-sm text-[11px] font-bold">
                        공지
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">{notice.id}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-start ml-4 justify-center">
                      <span className={`font-medium group-hover:text-blue-700 group-hover:underline line-clamp-1 transition-all ${notice.isPin ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}>
                        {notice.title}
                      </span>
                      <div className="flex gap-2 text-[11px] text-gray-400 mt-1 sm:hidden justify-center">
                        <span>{notice.author}</span>
                        <span>|</span>
                        <span>{notice.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600 hidden sm:table-cell">{notice.author}</td>
                  {/* 파일수 자동 인식 수정 부분: length 사용 */}
                  <td className="py-4 text-sm text-gray-500 hidden md:table-cell">
                    {notice.files ? notice.files.length : 0}
                  </td>
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
              className={`w-10 h-10 rounded font-medium transition ${
                currentPage === pageNum 
                ? 'bg-blue-900 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
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
      </main>
    </>
  );
};

export default UserOpenSpaceLi;