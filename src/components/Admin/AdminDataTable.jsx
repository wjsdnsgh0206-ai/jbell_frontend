// src/components/admin/AdminDataTable.jsx
import React from 'react';

/**
 * [공통] 관리자용 데이터 테이블 컴포넌트
 * @param {Array} columns - 테이블 헤더 및 컬럼 구성 정의 [{ key, header, width, render, className }]
 * @param {Array} data - 테이블 바디에 표시할 실제 데이터 배열
 * @param {Array} selectedIds - 현재 체크박스로 선택된 행들의 ID 배열 (부모의 State)
 * @param {Function} onSelectionChange - 체크박스 상태가 변할 때 부모의 State를 변경할 함수
 * @param {Function} onRowClick - 행(Row) 자체를 클릭했을 때 실행할 함수 (예: 상세페이지 이동)
 * @param {string} rowKey - 데이터의 고유 키값 컬럼명 (예: 'id', 'contentId')
 */
const AdminDataTable = ({ 
  columns = [], 
  data = [], 
  selectedIds = [], 
  onSelectionChange, 
  onRowClick, 
  rowkey = 'id',
}) => {

  // [로직] 전체 선택/해제 핸들러
  const handleSelectAll = (e) => {
    // 헤더 체크박스가 선택되면 현재 페이지의 모든 데이터 ID를 부모에게 전달
    if (e.target.checked) {
      // row[rowKey]를 사용하여 동적으로 ID 추출
      onSelectionChange(data.map(item => item[rowKey]))
    } else {
      onSelectionChange([]); // 해제 시 빈 배열 전달
    }
  };

  // [로직] 개별 행 선택/해제 핸들러
  const handleSelectRow = (e, id) => {
    e.stopPropagation(); // ★중요: 체크박스 클릭 시 행 클릭 이벤트(onRowClick)가 발생하는 것을 방지
    
    if (selectedIds.includes(id)) {
      // 이미 선택된 ID면 배열에서 제거
      onSelectionChange(selectedIds.filter(item => item !== id));
    } else {
      // 선택되지 않은 ID면 기존 배열에 추가
      onSelectionChange([...selectedIds, id]);
    }
  };

  // 데이터가 없을 때 테이블을 가득 채우기 위한 컬럼 수 계산 (체크박스 컬럼 + 데이터 컬럼들)
  const colSpanCount = columns.length + 1;

  // [디자인] 체크박스 공통 스타일 
  const checkboxClass = `
    w-5 h-5 rounded cursor-pointer transition-all
    border-2 border-graygray-40 
    bg-white 
    text-admin-primary focus:ring-2 focus:ring-admin-primary/30
    appearance-none checked:bg-admin-primary
  `;

  return (
    <div className="w-full overflow-hidden border border-admin-border rounded-lg bg-admin-surface shadow-adminCard">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          
          {/* 1. 테이블 헤더 영역 */}
          <thead className="bg-graygray-5 border-b border-admin-border text-admin-text-secondary">
            <tr>
              {/* 전체 선택 체크박스 */}
              <th className="px-6 py-4 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  // 모든 데이터가 선택되었을 때만 체크 표시
                  checked={data.length > 0 && selectedIds.length === data.length}
                  className={checkboxClass}
                />
              </th>
              {/* 동적 컬럼 헤더 생성 */}
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

          {/* 2. 테이블 바디 영역 */}
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {data.length === 0 ? (
              /* 데이터가 없는 경우 */
              <tr>
                <td colSpan={colSpanCount} className="px-6 py-32 text-center text-detail-m text-graygray-40">
                  데이터가 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              /* 데이터가 있는 경우 루프 실행 */
              data.map((row) => {
                // 변수 하나에 현재 행의 ID값을 담아두면 쓰기 편합니다.
                const currentRowId = row[rowKey];

                return (
                  <tr 
                    key={currentRowId}  // ★ row.id 대신 사용
                    className={`hover:bg-blue-50 transition-colors group ${selectedIds.includes(currentRowId) ? 'bg-blue-100' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(currentRowId)} // ★ 식별자 일치
                        onChange={(e) => handleSelectRow(e, currentRowId)} // ★ 식별자 일치
                        className={checkboxClass}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={`${currentRowId}-${col.key}`} className={`px-6 py-4 text-admin-text-primary text-detail-m ${col.className || 'text-center'}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataTable;