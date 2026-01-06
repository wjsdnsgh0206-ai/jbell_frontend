import React from 'react';
/**
 * BoardListSection 컴포넌트
 * @param {Array} items - 현재 페이지에 표시될 게시글 배열
 * @param {number} currentPage - 현재 활성화된 페이지 번호
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 시 호출되는 함수
 * @param {function} onRowClick - 게시글 행 클릭 시 상세페이지로 이동하는 함수
 */
const BoardListSection = ({ items, currentPage, totalPages, onPageChange, onRowClick }) => {
  return (
    <div className="w-full">
      {/* --- 게시판 테이블 영역 --- */}
      {/* overflow-x-auto: 모바일 등 작은 화면에서 테이블이 넘칠 경우 가로 스크롤 허용 */}
      <div className="w-full mt-8 overflow-x-auto text-left"> 
        <table className="w-full text-center border-collapse">
          {/* 테이블 헤더: 최상단 굵은 선(border-t-2 border-gray-800)으로 포인트 */}
          <thead className="bg-gray-100 text-sm font-bold text-gray-700 border-t-2 border-gray-800">
            <tr>
              <th className="py-4 px-2 w-16 md:w-20 font-bold">번호</th>
              <th className="py-4 px-4 text-center font-bold">제목</th>
              <th className="py-4 px-2 w-24 hidden sm:table-cell font-bold">등록인</th>
              <th className="py-4 px-2 w-20 hidden md:table-cell font-bold">파일수</th>
              <th className="py-4 px-2 w-32 hidden sm:table-cell font-bold">등록일자</th>
            </tr>
          </thead>
          {/* 테이블 본문 */}
          <tbody className="divide-y divide-gray-200 bg-white border-b border-gray-300"> 
            {items.map((notice, index) => (
              <tr 
                /* key: 고유 ID와 인덱스를 조합하여 리렌더링 최적화 */
                key={`${notice.id}-${index}`} 
                onClick={() => onRowClick(notice.id)}
                /* 스타일: 
                   - hover:bg-gray-50: 마우스 올리면 배경색 변경
                   - notice.isPin: 고정 게시글(공지)인 경우 연한 파란색 배경 적용 
                */
                className={`hover:bg-gray-50 transition cursor-pointer group ${notice.isPin ? 'bg-blue-50/40' : ''}`}
              >
                {/* 1. 번호 열 */}
                <td className="py-4 text-center text-sm">
                  {notice.isPin ? (
                    /* 고정글일 경우 '공지' 뱃지 표시 */
                    <span className="inline-block border border-blue-500 text-blue-600 bg-white px-2 py-0.5 rounded-sm text-[11px] font-bold">공지</span>
                  ) : (
                    /* 일반글일 경우 계산된 번호 표시 */
                    <span className="text-gray-500 font-medium">{notice.displayNo}</span>
                  )}
                </td>
                {/* 2. 제목 열 */}
                <td className="py-4 px-4">
                  <div className="flex flex-col items-start ml-4">
                    {/* line-clamp-1: 제목이 너무 길면 한 줄 처리 후 말줄임표(...) */}
                    <span className={`font-medium group-hover:text-blue-700 group-hover:underline line-clamp-1 transition-all ${notice.isPin ? 'text-blue-900 font-semibold' : 'text-gray-900'}`}>
                      {notice.title}
                    </span>
                    {/* 모바일 전용 정보: sm:hidden을 통해 작은 화면에서만 작성자|날짜를 제목 아래 표시 */}
                    <div className="flex gap-2 text-[11px] text-gray-400 mt-1 sm:hidden">
                      <span>{notice.author}</span>
                      <span>|</span>
                      <span>{notice.date}</span>
                    </div>
                  </div>
                </td>
                {/* 3~5. 기타 정보 열 (반응형에 따라 숨김 처리) */}
                <td className="py-4 text-sm text-gray-600 hidden sm:table-cell">{notice.author}</td>
                {/* 파일이 있을 경우 개수 표시, 없으면 0 */}
                <td className="py-4 text-sm text-gray-500 hidden md:table-cell">{notice.files ? notice.files.length : 0}</td>
                <td className="py-4 text-sm text-gray-500 hidden sm:table-cell">{notice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- 페이지네이션 영역 --- */}
      <div className="flex justify-center items-center gap-1 mt-12">
        {/* [이전] 버튼: 1페이지보다 작아지지 않도록 처리 */}
        <button 
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition mr-2"
        > &lt; </button>

        {/* 페이지 번호 목록 생성 및 렌더링 */}
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
          <button 
            key={pageNum} 
            onClick={() => onPageChange(pageNum)}
            /* 현재 페이지인 경우 파란색 배경과 그림자 효과(shadow-md) 적용 */
            className={`w-10 h-10 rounded font-medium transition ${currentPage === pageNum ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {pageNum}
          </button>
        ))}
        {/* [다음] 버튼: 마지막 페이지를 넘지 않도록 처리 */}
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