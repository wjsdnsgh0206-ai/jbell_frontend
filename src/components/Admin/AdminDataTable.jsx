// src/components/admin/AdminDataTable.jsx
import React from 'react';

const AdminDataTable = ({ 
  columns = [],   // 테이블 컬럼 정의 [{ key, header, width, render? }]
  data = [],      // 실제 데이터 배열
  selectedIds = [], // 부모에서 관리되는 선택된 ID 목록
  onSelectionChange, // 선택 변경 시 실행될 함수
  onRowClick,     // 행 클릭 시 이벤트 (상세보기 등)
}) => {

  // 전체 선택/해제 핸들러
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(data.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  // 개별 선택/해제 핸들러
  const handleSelectRow = (e, id) => {
    e.stopPropagation(); // 행 클릭 이벤트 전파 방지
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(item => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  // 데이터가 없을 때 표시할 컬럼 수 계산
  const colSpanCount = columns.length + 1; // 체크박스 포함

  return (
    <div className="w-full overflow-hidden border border-admin-border rounded-lg bg-admin-surface shadow-adminCard">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* 헤더 */}
          <thead className="bg-graygray-5 border-b border-admin-border text-admin-text-secondary">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={data.length > 0 && selectedIds.length === data.length}
                  className={`
                        w-5 h-5 rounded cursor-pointer transition-all
                        /* 1. 테두리 굵기 및 색상 강조 */
                        border-2 border-graygray-40 
                        /* 2. 배경색 설정 (체크되지 않았을 때) */
                        bg-white 
                        /* 3. 체크되었을 때의 색상 및 포커스 */
                        text-admin-primary focus:ring-2 focus:ring-admin-primary/30
                        /* 4. 브라우저 기본 스타일 강제 제어 (선택 사항) */
                        appearance-none checked:bg-admin-primary
                      `}
                />
              </th>
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

          {/* 바디 */}
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {data.length === 0 ? (
              <tr>
                <td colSpan={colSpanCount} className="px-6 py-32 text-center text-detail-m text-graygray-40">
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-graygray-5 transition-colors group ${selectedIds.includes(row.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) => handleSelectRow(e, row.id)}
                      className={`
                        w-5 h-5 rounded cursor-pointer transition-all
                        /* 1. 테두리 굵기 및 색상 강조 */
                        border-2 border-graygray-40 
                        /* 2. 배경색 설정 (체크되지 않았을 때) */
                        bg-white 
                        /* 3. 체크되었을 때의 색상 및 포커스 */
                        text-admin-primary focus:ring-2 focus:ring-admin-primary/30
                        /* 4. 브라우저 기본 스타일 강제 제어 (선택 사항) */
                        appearance-none checked:bg-admin-primary
                      `}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={`${row.id}-${col.key}`} className="px-6 py-4 text-admin-text-primary text-detail-m text-center">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataTable;