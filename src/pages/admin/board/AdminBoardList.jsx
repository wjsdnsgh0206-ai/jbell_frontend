import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticeData } from '@/pages/user/openboards/BoardData';
import { Paperclip } from 'lucide-react';
import axios from 'axios';

// [공통 컴포넌트 임포트]
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const AdminBoardList = () => {
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // [State] 데이터 및 UI 상태
  const [posts, setPosts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // [State] 검색 및 정렬
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    title: '',
    author: '',
    isPublic: '',
    sort: 'desc',
  });

  // [수정] 초기 activeFilter 상태를 searchParams와 동일하게 설정
  const [activeFilter, setActiveFilter] = useState({ 
    title: '', 
    author: '', 
    isPublic: '', 
    sort: 'desc' 
  }); 

  // [State] 모달 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ 
    title: '', 
    message: '', 
    type: 'delete', 
    onConfirm: () => {} 
  });

  const [sortOrder, setSortOrder] = useState('latest'); 

  // [Logic] 데이터 필터링 및 정렬
  const filteredData = useMemo(() => {
    let result = [...posts];

    if (activeFilter.keyword) {
      // 통합 검색어가 있다면 제목이나 작성자에서 검색
      result = result.filter(post => 
        post.title.includes(activeFilter.keyword) || 
        post.author.includes(activeFilter.keyword)
      );
    }

    if (activeFilter.title) {
      result = result.filter(post =>
        post.title.includes(activeFilter.title)
      );
    }

    if (activeFilter.author) {
      result = result.filter(post =>
        post.author.includes(activeFilter.author)
      );
    }

    // [중요] activeFilter에 isPublic이 초기화되어 있지 않으면(undefined) 
    // undefined !== '' 가 True가 되어 빈 목록이 나오는 문제가 해결됨
    if (activeFilter.isPublic !== '') {
      result = result.filter(post =>
        String(post.isPublic) === activeFilter.isPublic
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return activeFilter.sort === 'desc'
        ? dateB - dateA
        : dateA - dateB;
    });

    return result;
  }, [posts, activeFilter]);

  // [Logic] 페이지네이션
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // [Event] 검색 관련 핸들러
  const handleSearch = () => {
    axios.get('/api/notice', {
      params: {
        keyword: searchParams.keyword
      }
    }).then(res => {
      setPosts(res.data);
      setCurrentPage(1);
    });
  };


  // 공지사항 정렬
  const handleSort = (order) => {
    setSortOrder(order);
    const newSort = order === 'latest' ? 'desc' : 'asc';
    
    setSearchParams(prev => ({
      ...prev,
      sort: newSort,
    }));
    setActiveFilter(prev => ({
      ...prev,
      sort: newSort,
    }));
  };

  const handleReset = () => {
    const resetState = {
      keyword: '',
      title: '',
      author: '',
      isPublic: '',
      sort: 'desc',
    };
    setSearchParams(resetState);
    setActiveFilter(resetState);
    setCurrentPage(1);
    setSortOrder('latest'); // 초기화 시 정렬 버튼 UI도 최신순으로 복귀

    // 3. [추가] 서버에서 전체 목록 다시 불러오기
    // 검색어가 없는 상태로 전체 데이터를 다시 가져와서 posts에 덮어씁니다.
    axios.get('/api/notice')
      .then(res => {
        setPosts(res.data);
      })
      .catch(err => {
        console.error("데이터 초기화 로드 실패:", err);
      });
  };

  // [Event] 삭제 및 상태 변경 핸들러
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택해주세요."); 
      return; 
    }
    setModalConfig({
      title: '선택 항목 삭제',
      message: `선택하신 ${selectedIds.length}건의 데이터를 정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
      type: 'delete',
      onConfirm: async () => { // async 추가
      try {
        // 1. 서버(DB)에 삭제 요청 전송 (반드시 비동기 처리)
        // 여러 개를 삭제할 경우 백엔드 API 설계에 따라 반복문을 돌리거나 배열을 한 번에 전송
        await Promise.all(
          selectedIds.map(id => axios.delete(`/api/notice/${id}`))
        );
        // 2. 서버 삭제 성공 후 프론트 상태 업데이트
        setPosts(prev => prev.filter(post => !selectedIds.map(String).includes(String(post.id))));
        setSelectedIds([]);
        setIsModalOpen(false);
        alert("삭제되었습니다.");
      } catch (err) {
        console.error("삭제 중 에러 발생:", err);
        alert("삭제에 실패했습니다. 서버 상태를 확인하세요.");
      }
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
      key: 'files', 
      header: '첨부', 
      width: '60px', 
      className: 'text-center',
      render: (_, row) => (
        <div className="flex justify-center text-graygray-40">
          {row && row.fileCount > 0 ? (
            <div className="flex items-center gap-1 font-mono text-[13px]">
              <Paperclip size={14} />{row.fileCount}
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
        // 데이터가 'Y' 문자열인지 확인합니다.
        isPublic === 'Y' ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">사용</span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">미사용</span>
        )
      )
    },
   
  ];



/** <================================================== UseEffect ==================================================> **/
  // axios for backend
  // 1) 공지사항(notice)
  useEffect(() => {
    axios.get('/api/notice')
      .then(res => {
        setPosts(res.data);
        });
  }, []);

/** <================================================== UseEffect ==================================================> **/




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
          </AdminSearchBox>
        </section>

        {/* 2. 데이터 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            {/* 왼쪽 묶음 */}
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0
                  ? `${selectedIds.length}개 선택됨`
                  : `전체 ${filteredData.length}건`}
              </span>

              {/* 정렬 버튼 위치 */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('latest')}
                  className={`px-3 py-1 rounded transition-colors ${
                    sortOrder === 'latest'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => handleSort('oldest')}
                  className={`px-3 py-1 rounded transition-colors ${
                    sortOrder === 'oldest'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                >
                  오래된순
                </button>
              </div>
            </div>

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