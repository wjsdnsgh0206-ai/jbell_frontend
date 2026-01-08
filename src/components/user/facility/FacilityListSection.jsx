import React from 'react';

const FacilityListSection = ({ items, currentPage, totalPages, onPageChange, onDetail }) => {
  return (
    <div className="w-full">
      {/* 1. Table Area */}
      <div className="w-full mt-4 bg-white border-t-2 border-graygray-90">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-center table-fixed border-collapse">
            
            {/* Header */}
            <thead className="bg-graygray-5 border-b border-graygray-10">
              <tr className="text-detail-m text-graygray-70">
                <th className="py-4 w-[20%] font-medium">유형</th>
                <th className="py-4 w-[40%] font-medium">시설명</th>
                <th className="py-4 w-[30%] font-medium">주소</th>
                {/* Hide detail button column on mobile since row click works */}
                <th className="py-4 w-[10%] font-medium text-center hidden md:table-cell">상세</th>
              </tr>
            </thead>
            
            {/* Body */}
            <tbody className="divide-y divide-graygray-10 border-b border-graygray-20">
              {items.length > 0 ? (
                items.map((facility) => (
                  <tr 
                    key={facility.id} 
                    // Navigate on row click
                    onClick={() => onDetail(facility.id)}
                    className="group hover:bg-graygray-5 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-2 text-detail-m text-graygray-70">
                      {facility.type}
                    </td>
                    <td className="py-4 px-4 text-left">
                       <span className="text-body-m text-graygray-90 font-medium group-hover:text-secondary-50 group-hover:underline transition-colors">
                         {facility.name}
                       </span>
                    </td>
                    <td className="py-4 px-4 text-left text-detail-m text-graygray-50 truncate">
                      {facility.address}
                    </td>
                    {/* PC View Button */}
                    <td className="py-4 text-center hidden md:table-cell">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          onDetail(facility.id);
                        }}
                        className="px-3 py-1.5 text-detail-m font-medium text-graygray-70 border border-graygray-20 rounded bg-white hover:border-secondary-50 hover:text-secondary-50 transition-all active:scale-95"
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-body-m text-graygray-40">
                    검색된 시설이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Pagination Area */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-10">
          <button 
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30"
            disabled={currentPage === 1}
          > &lt; </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button 
              key={pageNum} 
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded text-detail-m transition-all ${
                currentPage === pageNum 
                ? 'bg-secondary-50 text-white font-bold' 
                : 'text-graygray-70 hover:bg-graygray-5'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          <button 
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="w-8 h-8 flex items-center justify-center border border-graygray-20 rounded bg-white text-graygray-40 hover:bg-graygray-5 disabled:opacity-30"
            disabled={currentPage === totalPages}
          > &gt; </button>
        </div>
      )}
    </div>
  );
};

export default FacilityListSection;