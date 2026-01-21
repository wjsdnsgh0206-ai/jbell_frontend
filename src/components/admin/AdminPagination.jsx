// src/components/admin/AdminPagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * [공통] 관리자용 페이지네이션 컴포넌트
 * @param {Number} totalItems - 전체 데이터 개수 (예: 125개)
 * @param {Number} itemCountPerPage - 한 페이지당 보여줄 게시글 수 (기본 10개)
 * @param {Number} pageCount - 하단에 한 번에 보여줄 페이지 번호 개수 (기본 5개: [1,2,3,4,5])
 * @param {Number} currentPage - 사용자가 현재 보고 있는 페이지 번호
 * @param {Function} onPageChange - 페이지 번호 클릭 시 실행될 함수 (setState 전달)
 */
const AdminPagination = ({ 
  totalItems, 
  itemCountPerPage = 10, 
  pageCount = 5, 
  currentPage, 
  onPageChange 
}) => {
  
  // 1. 전체 페이지 수 계산 (예: 125개 데이터 / 10개씩 = 13페이지)
  const totalPages = Math.ceil(totalItems / itemCountPerPage);

  // 2. 현재 페이지가 속한 그룹의 시작 페이지 번호 계산
  // 예: currentPage가 7이고 pageCount가 5이면, (7-1)/5 = 1.2 -> floor(1.2)*5 + 1 = 6페이지 시작
  const startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1;

  // 3. 현재 페이지가 속한 그룹의 끝 페이지 번호 계산
  // totalPages를 넘지 않도록 최소값 처리
  const endPage = Math.min(startPage + pageCount - 1, totalPages);

  // 데이터가 아예 없으면 페이지네이션을 렌더링하지 않음
  if (totalPages === 0) return null;

  // 버튼 공통 스타일
  const btnBase = "p-2 rounded border border-admin-border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors";

  return (
    <div className="flex items-center justify-center gap-2 py-4 select-none">
      
      {/* [맨 처음으로] 버튼: 1페이지로 이동 */}
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={btnBase}
      >
        <ChevronsLeft className="w-4 h-4 text-gray-500" />
      </button>

      {/* [이전] 버튼: 현재 페이지 - 1로 이동 */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={btnBase}
      >
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>

      {/* [페이지 번호 목록] */}
      <div className="flex gap-1">
        {/* startPage부터 endPage까지 배열을 만들어 버튼 생성 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[32px] h-8 px-2 text-sm font-medium rounded border transition-colors
              ${currentPage === page 
                ? 'bg-admin-primary border-admin-primary text-white shadow-sm' // 현재 활성화된 페이지 스타일
                : 'bg-white border-admin-border text-gray-600 hover:bg-gray-50' // 일반 페이지 스타일
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* [다음] 버튼: 현재 페이지 + 1로 이동 */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={btnBase}
      >
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      {/* [맨 끝으로] 버튼: 마지막 페이지로 이동 */}
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={btnBase}
      >
        <ChevronsRight className="w-4 h-4 text-gray-500" />
      </button>

    </div>
  );
};

export default AdminPagination;