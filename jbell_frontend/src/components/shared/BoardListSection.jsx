import React from 'react';

const BoardListSection = ({ items, currentPage, totalPages, onPageChange, onRowClick }) => {
  return (
    <div className="w-full">
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
            {items.map((notice, index) => (
              <tr 
                key={index} 
                onClick={() => onRowClick(notice.id)}
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
                    {/* 공지사항에 있던 모바일용 서브 정보 (author, date) 유지 */}
                    <div className="flex gap-2 text-[11px] text-gray-400 mt-1 sm:hidden">
                      <span>{notice.author}</span>
                      <span>|</span>
                      <span>{notice.date}</span>
                    </div>
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
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition mr-2"
        > &lt; </button>
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
          <button 
            key={pageNum} 
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded font-medium transition ${currentPage === pageNum ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {pageNum}
          </button>
        ))}
        <button 
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition ml-2"
        > &gt; </button>
      </div>
    </div>
  );
};

export default BoardListSection;