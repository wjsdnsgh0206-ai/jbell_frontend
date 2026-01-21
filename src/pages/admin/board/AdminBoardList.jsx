import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticeData } from '@/pages/user/openboards/BoardData'; // 공지사항 데이터
import { Paperclip } from 'lucide-react';

// [공통 컴포넌트 임포트]
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const AdminBoardList = () => {
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // [State] 데이터 및 UI 상태
  const [posts, setPosts] = useState(noticeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // [State] 검색 및 정렬
  // AdminSearchBox와 호환되도록 구조 변경 (keyword: 검색어, sort: 정렬순서)
  const [searchParams, setSearchParams] = useState({ keyword: '', sort: 'desc' });
  const [activeFilter, setActiveFilter] = useState({ keyword: '', sort: 'desc' }); // 실제 적용된 필터

  // [State] 모달 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    title: '', 
    message: '', 
    type: 'delete', 
    onConfirm: () => {} 
  });

  // [Logic] 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    const { keyword, sort } = activeFilter;
    const searchTerm = keyword.replace(/\s+/g, "").toLowerCase();
    
    let result = posts.filter(post => {
      if (!searchTerm) return true;
      const targetString = [post.title, post.author, post.content].join("").replace(/\s+/g, "").toLowerCase();
      return targetString.includes(searchTerm);
    });

    return result.sort((a, b) => {
      // 상단 고정(isPin) 우선 정렬 로직 추가 가능 (필요 시)
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [posts, activeFilter]);

  // [Logic] 페이지네이션
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // [Event] 검색 관련 핸들러
  const handleSearch = () => {
    setActiveFilter(searchParams);
    setCurrentPage(1);
  };

  const handleReset = () => {
    const resetState = { keyword: '', sort: 'desc' };
    setSearchParams(resetState);
    setActiveFilter(resetState);
    setCurrentPage(1);
  };

  // [Event] 삭제 및 상태 변경 핸들러
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      // alert 대신 모달을 띄우거나 간단한 경고 처리 (여기선 alert 유지)
      alert("삭제할 항목을 선택해주세요."); 
      return; 
    }
    setModalConfig({
      title: '선택 항목 삭제',
      message: `선택하신 ${selectedIds.length}건의 데이터를 정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
      type: 'delete',
      onConfirm: () => {
        setPosts(prev => prev.filter(post => !selectedIds.includes(post.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // [Definition] AdminDataTable 컬럼 정의
  const columns = [
    { 
      key: 'id', 
      header: '번호', 
      width: '80px', 
      className: 'text-graygray-40 font-mono text-center' 
    },
    { 
      key: 'title', 
      header: '제목', 
      render: (value, row) => (
        <div className="flex items-center gap-2 cursor-pointer">
          {row.isPin && (
            <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[11px] font-bold rounded border border-red-100 flex-shrink-0">
              공지
            </span>
          )}
          <span className="truncate font-medium hover:text-admin-primary hover:underline">
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'author', 
      header: '등록자', 
      width: '100px',
      className: 'text-center'
    },
    { 
      key: 'createdAt', 
      header: '등록일시', 
      width: '120px', 
      className: 'text-graygray-40 text-[13px] text-center' 
    },
    { 
      key: 'views', 
      header: '조회수', 
      width: '80px', 
      className: 'font-mono text-center',
      render: (value) => value.toLocaleString()
    },
    { 
      key: 'files', 
      header: '첨부', 
      width: '60px', 
      className: 'text-center',
      render: (files) => (
        <div className="flex justify-center text-graygray-40">
          {files?.length > 0 ? (
            <div className="flex items-center gap-1 font-mono text-[13px]">
              <Paperclip size={14} />{files.length}
            </div>
          ) : "-"}
        </div>
      )
    },
    { 
      key: 'isPublic', 
      header: '상태', 
      width: '80px', 
      className: 'text-center',
      render: (isPublic) => (
        isPublic ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">사용</span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">미사용</span>
        )
      )
    },
    {
      key: 'manage',
      header: '관리',
      width: '80px',
      className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // 행 클릭 이벤트 방지
            navigate(`/admin/board/noticeDetail/${row.id}`);
          }}
          className="border border-gray-300 text-[#666] rounded px-3 py-1 text-[12px] font-bold bg-white hover:bg-admin-primary hover:text-white hover:border-admin-primary transition-all"
        >
          보기
        </button>
      )
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">공지사항 관리</h2>

        {/* 1. 공용 검색 박스 */}
        <section className="mb-8 p-8 bg-admin-surface border border-admin-border rounded-xl shadow-adminCard">
          <AdminSearchBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 커스텀 필터 슬롯: 정렬 기능 추가 */}
            <select
              name="sort"
              value={searchParams.sort}
              onChange={(e) => setSearchParams(prev => ({ ...prev, sort: e.target.value }))}
              className="h-14 pl-3 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer min-w-[120px]"
            >
              <option value="desc">최신순</option>
              <option value="asc">오래된순</option>
            </select>
          </AdminSearchBox>
        </section>

        {/* 2. 데이터 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <span className="text-body-m-bold text-admin-text-secondary">
              {selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `전체 ${filteredData.length}건`}
            </span>
            
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/admin/contents/adminBoardRegister')}
                className="px-8 h-12 bg-[#1890FF] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
            </div>
          </div>

          <AdminDataTable
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(row) => navigate(`/admin/contents/adminBoardDetail/${row.id}`, { state: row })}
            rowKey="id"
          />

          <AdminPagination
            totalItems={filteredData.length}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      
      {/* 3. 공용 컨펌 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={modalConfig.onConfirm} 
        title={modalConfig.title} 
        message={modalConfig.message} 
        type={modalConfig.type} 
      />
    </div>
  );
};

export default AdminBoardList;