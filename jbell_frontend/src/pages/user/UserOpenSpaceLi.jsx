import React, { useState } from 'react';

const UserOpenSpaceLi = () => {
  // 검색 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('선택');

  // 데이터 샘플 (실제로는 API나 Props로 받을 수 있습니다)
  const notices = [
    { id: '공지', title: "행정안전부 재난안전데이터 공유플랫폼 안내", author: '관리자', files: 1, date: '2025-04-11', isPin: true },
    { id: '공지', title: "전북특별자치도 '25년도 11월 재난 현황 정리입니다", author: '관리자', files: 2, date: '2025-12-08', isPin: true },
    { id: 1, title: '전북특별자치도 새롭게 추가된 쉼터 목록입니다', author: '관리자', files: 2, date: '2025-12-06', isPin: false },
    { id: 2, title: '전북특별자치도 새롭게 추가된 대피소 목록입니다', author: '관리자', files: 3, date: '2025-11-25', isPin: false },
    { id: 3, title: '전북 특별자치도 겨울철 재난 대비 요령입니다', author: '관리자', files: 1, date: '2025-11-11', isPin: false },
    { id: 4, title: '겨울철 동파 대비, 이렇게 대비하세요', author: '관리자', files: 1, date: '2025-11-02', isPin: false },
    { id: 5, title: '한파정보 받고 부모님께 효도 안부전화드리기 캠페인', author: '관리자', files: 0, date: '2025-10-30', isPin: false },
    { id: 6, title: '전북자치도, 도민 누구나 안전보험 혜택 받는다!', author: '관리자', files: 1, date: '2025-10-20', isPin: false },
  ];

  return (
    /* <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
    */
      <>

      {/* 브레드크럼 (Breadcrumb) */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 flex items-center gap-2">
          <span>🏠 홈</span>
          <span className="text-gray-300">&gt;</span>
          <span>열린마당</span>
          <span className="text-gray-300">&gt;</span>
          <span className="font-semibold text-gray-800">공지사항</span>
        </div>
      </div>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-10 md:py-16">
        <h2 className="text-3xl font-bold mb-10 text-gray-900 tracking-tight">공지사항</h2>

        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center gap-3">
      <select 
        value={searchCategory} 
        onChange={(e) => setSearchCategory(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full md:w-32 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="선택">선택</option>
        <option value="제목">제목</option>
        <option value="내용">내용</option>
        <option value="등록인">등록인</option>
      </select>

      <div className="relative flex-1 max-w-lg">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력해주세요." 
          className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <button className="bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition active:scale-95">
        검색
      </button>
    </div>

    
    {/* 1. 겉을 감싸는 div에서 border와 shadow를 삭제하여 좌우를 개방합니다 */}
    <div className="w-full mt-8"> 
      <table className="w-full text-center border-collapse">
        {/* 2. 헤더: 선(border) 없이 배경색을 진하게(bg-gray-100) 설정 */}
        <thead className="bg-gray-100 text-sm font-bold text-gray-700">
          <tr>
            <th className="py-4 px-2 w-16 md:w-20">번호</th>
            <th className="py-4 px-4 text-center">제목</th>
            <th className="py-4 px-2 w-24 hidden sm:table-cell">등록인</th>
            <th className="py-4 px-2 w-20 hidden md:table-cell">파일수</th>
            <th className="py-4 px-2 w-32 hidden sm:table-cell">등록일자</th>
          </tr>
        </thead>
        
        {/* 3. 본문: 헤더 바로 아래부터 행 사이사이에 선을 넣습니다 (divide-y) */}
        <tbody className="divide-y divide-gray-200 bg-white"> 
          {notices.map((notice) => (
            <tr 
              key={notice.id} 
              className={`hover:bg-gray-50 transition cursor-pointer group ${notice.isPin ? 'bg-blue-50/30' : ''}`}
            >
              <td className="py-4 text-center text-sm">
            {notice.isPin ? (
              // rounded-sm으로 각을 살리고, border를 추가했습니다.
              <span className="inline-block border border-blue-500 text-blue-600 bg-white px-2 py-0.5 rounded-sm text-[11px] font-bold">
                공지
              </span>
            ) : (
              <span className="text-gray-500">{notice.id}</span>
            )}
          </td>

              {/* 제목 중앙 정렬 유지 */}
              <td className="py-4 px-4 text-center">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-medium text-gray-900 group-hover:text-blue-700 line-clamp-1">
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
              <td className="py-4 text-sm text-gray-500 hidden md:table-cell">{notice.files}</td>
              <td className="py-4 text-sm text-gray-500 hidden sm:table-cell">{notice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 4. 맨 아래만 선이 있도록 마감 처리 (중요) */}
      <div className="border-b border-gray-300"></div>
    </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-1 mt-12">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 transition">
            &lt;
          </button>
          <button className="w-10 h-10 bg-blue-900 text-white rounded font-bold shadow-md">1</button>
          {[2, 3, 4, 5].map((num) => (
            <button key={num} className="w-10 h-10 hover:bg-gray-100 rounded text-gray-600 transition">
              {num}
            </button>
          ))}
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 transition">
            &gt;
          </button>
        </div>
      </main>

      </>
  );
};

export default UserOpenSpaceLi;