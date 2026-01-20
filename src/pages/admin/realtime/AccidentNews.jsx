'use no memo';

// src/pages/admin/behavioralGuide/BehavioralGuideList.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown } from 'lucide-react';

// [데이터]
import { AccidentNewsData } from './AccidentNewsData';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 사고속보 목록 페이지
 */
const AccidentNews = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [guides, setGuides] = useState(AccidentNewsData || []); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 사용자 코드 카테고리에 맞춰 "all", "재난", "공사", "기타돌발"로 관리
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  // 브레드크럼 초기화
  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  const goDetail = useCallback((id) => {
    navigate(`/admin/contents/accidentNewsDetail/${id}`);
  }, [navigate]);

  // ==================================================================================
  // 2. 필터 옵션 (사용자 페이지 카테고리와 동기화)
  // ==================================================================================
  const categoryOptions = [
    { value: "all", label: "구분 전체" },
    { value: "재난", label: "🚨 재난 / 사고" },
    { value: "공사", label: "🚧 도로 공사" },
    { value: "기타돌발", label: "ℹ️ 기타 돌발" }
  ];

  // ==================================================================================
  // 3. 데이터 가공 (필터링 & 검색)
  // ==================================================================================
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    
    return guides.filter(item => {
      // 사용자 단의 category 필드 기준으로 필터링
      const isCategoryMatch = selectedCategory === "all" || item.category === selectedCategory;
      
      if (!searchTerm) return isCategoryMatch;

      // 검색 대상에 위치(roadName) 정보 추가
      const targetString = [item.type, item.content, item.roadName]
        .join("").replace(/\s+/g, "").toLowerCase();
        
      return isCategoryMatch && targetString.includes(searchTerm);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [guides, appliedKeyword, selectedCategory]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 4. 테이블 컬럼 정의 (위치 정보 및 사용자 단 필드 반영)
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'id', header: 'No', width: '60px', className: 'text-center' },
    { key: 'category', header: '구분', width: '100px', className: 'text-center' },
    { key: 'type', header: '유형', width: '120px', className: 'text-center' },
    { key: 'content', header: '사고내용(메시지)', className: 'text-left font-bold' },
    { key: 'roadName', header: '발생장소', width: '150px', className: 'text-center' },
    { 
      key: 'visible', 
      header: '노출여부', 
      width: '100px',
      render: (visible, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id, visible); }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? 'bg-admin-primary' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      )
    },
    { key: 'date', header: '발생일시', width: '150px', className: 'text-center text-gray-500' },
    {
        key: 'actions',
        header: '상세/수정',
        width: '100px',
        className: 'text-center',
        render: (_, row) => (
          <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 transition-colors whitespace-nowrap">
            보기
          </button>
        )
    }
  ], [goDetail]);

  // ==================================================================================
  // 5. 핸들러 (Handlers)
  // ==================================================================================
  const handleSearch = () => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); };
  const handleReset = () => { setSearchParams({ keyword: '' }); setAppliedKeyword(''); setSelectedCategory("all"); setCurrentPage(1); };

  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setModalConfig({
      title: '노출 상태 변경',
      message: `해당 항목의 상태를 [${nextStatus ? '노출' : '비노출'}]로 변경하시겠습니까?`,
      type: nextStatus ? 'confirm' : 'delete',
      onConfirm: () => {
        setGuides(prev => prev.map(item => item.id === id ? { ...item, visible: nextStatus } : item));
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    setModalConfig({
      title: '선택 항목 삭제',
      message: '선택하신 항목을 정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
      type: 'delete',
      onConfirm: () => {
        setGuides(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">
          사고속보 관리
        </h2>
        
        {/* 검색 섹션 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            <div className="flex gap-4">
              {/* 카테고리 필터 - 사용자 페이지와 동일하게 구성 */}
              <div className="relative w-full md:w-56">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none cursor-pointer"
                >
                  {categoryOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* 데이터 테이블 섹션 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected}
                className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-body-m-bold hover:bg-red-50 transition-colors"
              >
                선택 삭제
              </button>
            </div>
            <button 
              onClick={() => navigate('/admin/contents/accidentNewsWrite')}
              className="bg-admin-primary text-white px-6 py-2.5 rounded-lg text-body-m-bold hover:bg-blue-700 transition-all shadow-md"
            >
              사고속보 등록
            </button>
          </div>

          <AdminDataTable
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />

          <div className="mt-10">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </main>

      {/* 공통 모달 */}
      <AdminConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AccidentNews;