// src/pages/admin/safetyPolicy/AdminSafetyPolicyList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
// [수정 1] 서비스 직접 import
import { safetyPolicyService } from '@/services/api'; 

const AdminSafetyPolicyList = () => {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      const params = {
        page: currentPage,
        size: 10,
        keyword: keyword
      };
      // [수정 2] 서비스 호출
      const res = await safetyPolicyService.getSafetyPolicyList(params);
      
      if (res && res.data) {
        setData(res.data.list);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      console.error("관리자 정책 목록 조회 에러:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, keyword]);

  // Columns Definition
  const columns = [
    { key: 'contentId', header: 'No', width: '80px', render: (val) => val },
    { key: 'title', header: '정책명', render: (val, row) => (
        <span 
          className="cursor-pointer text-graygray-90 hover:text-admin-primary hover:underline"
          onClick={() => navigate(`/admin/policy/${row.contentId}`)}
        >
          {val}
        </span>
      ) 
    },
    { key: 'source', header: '출처', width: '150px' },
    { key: 'createdAt', header: '등록일', width: '120px', render: (val) => val ? val.substring(0, 10) : '-' },
    { key: 'visibleYn', header: '상태', width: '100px', render: (val) => (
        <span className={`px-2 py-1 rounded text-xs ${val === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {val === 'Y' ? '공개' : '비공개'}
        </span>
      )
    },
  ];

  // Delete Handler
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
        // [수정 3] 서비스 호출 (일괄 삭제)
        await safetyPolicyService.deleteSafetyPolicies(selectedIds);
        
        setIsDeleteModalOpen(false);
        fetchData();
        setSelectedIds([]);
        alert("성공적으로 삭제되었습니다.");
    } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6 bg-admin-bg min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-graygray-90 flex items-center gap-2">
          <FileText size={24} /> 주요 안전정책 관리
        </h2>
        <button 
          onClick={() => navigate('/admin/policy/write')}
          className="bg-admin-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          신규 등록
        </button>
      </div>

      <AdminSearchBox onSearch={(k) => { setKeyword(k); setCurrentPage(1); }} />

      <div className="bg-white rounded-lg border border-admin-border p-4 mt-4">
        <div className="flex justify-end mb-2">
           <button 
             onClick={() => setIsDeleteModalOpen(true)}
             disabled={selectedIds.length === 0}
             className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50 disabled:opacity-50"
           >
             선택 삭제
           </button>
        </div>
        
        <AdminDataTable 
          columns={columns}
          data={data}
          keyField="contentId"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        <AdminPagination 
          totalItems={totalItems}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <AdminConfirmModal 
        isOpen={isDeleteModalOpen}
        title="정책 삭제"
        message={`선택한 ${selectedIds.length}개의 정책을 삭제하시겠습니까?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default AdminSafetyPolicyList;