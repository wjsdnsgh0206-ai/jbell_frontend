// src/components/admin/shared/AdminPagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AdminPagination = ({ 
  totalItems,      // 전체 데이터 개수
  itemCountPerPage = 10, // 한 페이지당 보여줄 개수
  pageCount = 5,   // 하단에 보여줄 페이지 번호 개수 (예: 1~5)
  currentPage,     // 현재 페이지 (1부터 시작)
  onPageChange     // 페이지 변경 핸들러 함수
}) => {
  
  const totalPages = Math.ceil(totalItems / itemCountPerPage);
  const startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1;
  const endPage = Math.min(startPage + pageCount - 1, totalPages);

  if (totalPages === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4 select-none">
      
      {/* 맨 처음으로 */}
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded border border-admin-border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
      >
        <ChevronsLeft className="w-4 h-4 text-gray-500" />
      </button>

      {/* 이전 페이지 */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded border border-admin-border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-gray-500" />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex gap-1">
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[32px] h-8 px-2 text-sm font-medium rounded border transition-colors
              ${currentPage === page 
                ? 'bg-admin-primary border-admin-primary text-white'  // 활성 상태
                : 'bg-white border-admin-border text-gray-600 hover:bg-gray-50' // 기본 상태
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 다음 페이지 */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-admin-border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>

      {/* 맨 끝으로 */}
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded border border-admin-border hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
      >
        <ChevronsRight className="w-4 h-4 text-gray-500" />
      </button>

    </div>
  );
};

export default AdminPagination;