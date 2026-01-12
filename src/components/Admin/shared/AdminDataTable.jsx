// src/components/admin/shared/AdminDataTable.jsx
import React, { useState, useEffect } from 'react';

const AdminDataTable = ({ 
  columns = [],   // 테이블 컬럼 정의 [{ key, header, width, render? }]
  data = [],      // 실제 데이터 배열
  onRowClick,     // 행 클릭 시 이벤트 (상세보기 등)
}) => {
  // 체크박스 선택 상태 관리
  const [selectedIds, setSelectedIds] = useState([]);

  // 전체 선택 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 개별 선택 핸들러
  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 데이터가 바뀔 때 선택 초기화
  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  return (
    <div className="w-full overflow-hidden border border-admin-border rounded-lg bg-admin-surface shadow-adminCard">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          
          {/* 테이블 헤더 */}
          <thead className="bg-graygray-5 border-b border-admin-border text-admin-text-secondary">
            <tr>
              {/* 체크박스 컬럼 */}
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={data.length > 0 && selectedIds.length === data.length}
                  className="w-4 h-4 rounded border-admin-text-secondary focus:ring-admin-primary/20 cursor-pointer"
                />
              </th>
              
              {/* 동적 컬럼 렌더링 */}
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 whitespace-nowrap text-detail-m font-bold uppercase tracking-wider ${col.className || ''}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {data.length === 0 ? (
              // 데이터가 없을 때
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center text-detail-m text-graygray-40">
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              // 데이터가 있을 때
              data.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-graygray-5 transition-colors group"
                >
                  {/* 체크박스 */}
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary/20 cursor-pointer"
                    />
                  </td>

                  {/* 데이터 셀 */}
                  {columns.map((col) => (
                    <td 
                      key={`${row.id}-${col.key}`} 
                      className={`px-6 py-4 text-admin-text-primary text-detail-m ${onRowClick ? 'cursor-pointer' : ''}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {/* render 함수가 있으면 커스텀 렌더링, 없으면 텍스트 출력 */}
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* 하단 정보 (선택된 개수 등) */}
      {selectedIds.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 text-detail-s-bold text-blue-700">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {selectedIds.length}개 항목이 선택되었습니다.
          </span>
        </div>
      )}
    </div>
  );
};

export default AdminDataTable;