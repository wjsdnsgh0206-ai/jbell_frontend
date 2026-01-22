import React, { useState } from 'react';
import AdminSearchBox from '@/components/admin/AdminSearchBox'; // ★ 공용 컴포넌트 임포트
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const AdminSysOpAnalysis = () => {

  /** <====================================== 상태 관리 ======================================> **/
    // 1. 상태 관리
  const [searchParams, setSearchParams] = useState({
    category: 'all',
    keyword: ''
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  /** <====================================== 상태 관리 ======================================> **/

  // 임시 데이터 (실제 데이터 구조에 맞춰 logId 추가)
  const dummyData = [
    { logId: 1, loginId: 'admin_01', ip: '192.168.0.1', date: '2026-01-22 14:00', result: '성공', reason: '-' },
    { logId: 2, loginId: 'user_test', ip: '210.120.5.44', date: '2026-01-22 14:05', result: '실패', reason: '비밀번호 불일치' },
    { logId: 3, loginId: 'unknown', ip: '45.11.22.33', date: '2026-01-22 14:10', result: '보안의심', reason: '해외 IP 접속' },
  ];



  /** <====================================== 테이블 컬럼 정의 ======================================> **/
  // 2. 테이블 컬럼 정의
  const columns = [
    { key: 'loginId', header: '로그인 ID', width: '20%', className: 'text-center' },
    { key: 'ip', header: 'IP 주소', width: '20%', className: 'text-center' },
    { key: 'date', header: '발생일자', width: '20%', className: 'text-center' },
    { 
      key: 'result', 
      header: '결과', 
      width: '15%',
      className: 'text-center',
      render: (val) => (
        <span className={`font-bold ${
          val === '실패' ? 'text-red-500' : val === '보안의심' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'reason', header: '이유', width: '25%', className: 'text-center' }
  ];
  /** <====================================== 테이블 컬럼 정의 ======================================> **/



  /** <====================================== 핸들러 함수 ======================================> **/
  // 3. 핸들러 함수
  const handleSearch = () => {
    setCurrentPage(1);
    console.log('검색 실행:', searchParams);
  };

  const handleReset = () => {
    setSearchParams({ category: 'all', keyword: '' });
    setCurrentPage(1);
  };

  const handleDeleteLogs = () => {
    if (selectedIds.length === 0) return alert('삭제할 항목을 선택해주세요.');
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    console.log('삭제 ID 목록:', selectedIds);
    setIsModalOpen(false);
    setSelectedIds([]);
  };
  /** <====================================== 핸들러 함수 ======================================> **/



  return (
    <div className="p-6 space-y-6">
      {/* 상단 요약 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard title="전체 로그" value="1,248건" />
        <SummaryCard title="로그인 성공" value="892건" accent="green" />
        <SummaryCard title="로그인 실패" value="356건" accent="red" />
        <SummaryCard title="보안 의심" value="12건" accent="yellow" />
      </div>

      {/* 검색 영역 */}
      <div className="bg-white p-5 rounded-lg border border-admin-border">
        <AdminSearchBox
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          options={[
            { value: 'all', label: '전체' },
            { value: 'loginId', label: '로그인 ID' },
            { value: 'ip', label: 'IP 주소' }
          ]}
        />
      </div>
    
    <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
      {/* 액션 버튼 (예: 선택 삭제) */}
      <div className="flex justify-end">
        <button 
          onClick={handleDeleteLogs}
          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm font-semibold mb-8"
        >
          선택 삭제 ({selectedIds.length})
        </button>
      </div>

      {/* 데이터 테이블 영역 */}
      <AdminDataTable
        columns={columns}
        data={dummyData}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        rowKey="logId" // DataTable의 rowKey와 데이터의 ID 키를 일치시킴
      />

      {/* 페이지네이션 영역 */}
      <AdminPagination
        totalItems={1248}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemCountPerPage={10}
      />
    </section>

      {/* 삭제 확인 모달 */}
      <AdminConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="로그 삭제 확인"
        message={`선택하신 ${selectedIds.length}개의 보안 로그를 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        type="delete"
      />
    </div>
  );
};

// 내부 컴포넌트: SummaryCard
const SummaryCard = ({ title, value, accent = 'blue' }) => {
  const accentClasses = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
    yellow: 'border-l-yellow-500'
  };

  return (
    <div className={`bg-white p-6 rounded-lg border border-admin-border border-l-4 ${accentClasses[accent]} shadow-sm`}>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1 text-admin-text-primary">{value}</p>
    </div>
  );
};

export default AdminSysOpAnalysis;