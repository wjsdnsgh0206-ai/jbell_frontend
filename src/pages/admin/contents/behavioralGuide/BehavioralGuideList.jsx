// src/pages/admin/behavioralGuide/BehavioralGuideList.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { BehavioralGuideData } from './BehavioralGuideData';
import { ChevronDown } from 'lucide-react'; // 아이콘

// [공통 컴포넌트] 팀원들과 공유할 핵심 부품들
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 공통코드 목록 페이지
 * - 공통 컴포넌트(Table, SearchBox, Pagination) 사용 예시 포함
 * - 2단 필터링 (그룹 -> 상세) 및 정밀 검색 로직 구현
 */
const BehavioralGuideList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State Management) @@
  // ==================================================================================
  const [guides, setGuides] = useState(BehavioralGuideData); // 전체 데이터 @@
  const [selectedIds, setSelectedIds] = useState([]);      // 테이블에서 선택된 체크박스 ID들
  const [currentPage, setCurrentPage] = useState(1);       // 현재 페이지
  const itemsPerPage = 10;                                 // 페이지당 항목 수

  // [상태] 필터 관리 @@
  const [selectedCategory, setSelectedCategory] = useState("all"); // 구분 (자연/사회)
  const [selectedType, setSelectedType] = useState("all");         // 유형 (지진/태풍/...)

  // [검색 상태] SearchBox에서 관리할 검색어
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState(''); // '검색' 버튼 클릭 시 확정된 검색어

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });
``
  // [브레드크럼 상태]
  const { setBreadcrumbTitle } = useOutletContext();

  // [로직] 구분이 바뀌면 유형 초기화
  useEffect(() => {
    setBreadcrumbTitle(""); // 목록 페이지는 URL 매핑값을 따르도록 초기화
  }, [setBreadcrumbTitle]);
  
  // ==================================================================================
  // 2. 필터링 로직 (Filtering Logic) @@
  // ==================================================================================

  // 로직: 카테고리(1단)가 바뀌면 -> 유형(2단)을 'all'로 초기화한다.
  useEffect(() => {
    setSelectedType("all");
  }, [selectedCategory]); 

  // [최적화] 상세 이동 함수 (useCallback 적용)
  const goDetail = useCallback((id) => {
    navigate(`/admin/contents/behavioralGuideDetail/${id}`);
  }, [navigate]);

  // [옵션 1] 재난 구분(대분류) 자동 추출 @@
  const categoryOptions = useMemo(() => {
    const categories = BehavioralGuideData.map(item => ({
      value: item.category,
      label: item.categoryName
    }));
    // 중복 제거
    const uniqueCategories = categories.filter(
      (opt, index, self) => index === self.findIndex((t) => t.value === opt.value)
    );
    return [{ value: "all", label: "구분 전체" }, ...uniqueCategories];
  }, []);
  
  // [옵션 2] 재난 유형(소분류) 자동 추출 @@
  const typeOptions = useMemo(() => {
    // 전체 선택일 때는 유형 필터를 비우거나 전체를 보여줌
    if (selectedCategory === "all") return [{ value: "all", label: "유형 전체" }];

    const filteredByType = BehavioralGuideData.filter(
      (item) => item.category === selectedCategory
    );
    const options = filteredByType.map((item) => ({
      value: item.type,
      label: item.typeName,
    }));
    const uniqueOptions = options.filter(
      (opt, index, self) => index === self.findIndex((t) => t.value === opt.value)
    );
    return [{ value: "all", label: "유형 전체" }, ...uniqueOptions];
  }, [selectedCategory]);

  // ==================================================================================
  // 3. 데이터 가공 (Filtering & Sorting) @@
  // ==================================================================================
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    
      return guides.filter(item => {
        // 1. 필터 조건 확인 (키값 변경: category, type)
        const isCategoryMatch = selectedCategory === "all" || item.category === selectedCategory;
        const isTypeMatch = selectedType === "all" || item.type === selectedType;
        
        if (!searchTerm) return isCategoryMatch && isTypeMatch;

        // 2. 검색어 조건 확인 (제목, 카테고리명 포함)
        const targetString = [item.categoryName, item.typeName, item.title, item.actRmks]
          .join("")
          .replace(/\s+/g, "")
          .toLowerCase();
          
        return isCategoryMatch && isTypeMatch && targetString.includes(searchTerm);
      }).sort((a, b) => {
        // 3. 정렬 로직 (최신 등록순)
        return new Date(b.date) - new Date(a.date);
      });
  }, [guides, appliedKeyword, selectedCategory, selectedType]); // 의존성 배열에 필터 상태 추가 @@

  // 현재 페이지에 보여줄 데이터 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 4. 테이블 컬럼 정의 (Table Columns)
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'id', header: 'No', width: '60px', className: 'text-center' },
    { key: 'categoryName', header: '재난구분', width: '100px', className: 'text-center' }, // 예: 자연재난
    { key: 'typeName', header: '재난유형', width: '100px', className: 'text-center' }, // 예: 지진, 태풍
    { key: 'title', header: '행동요령 제목', width: '200px', className: 'text-center' },
    { key: 'actRmks', header: '콘텐츠 내용', className: 'text-center' },
    { 
      key: 'visible', 
      header: '노출여부', 
      width: '100px',
      className: 'text-center',
      render: (visible, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // ID와 현재 visible 상태를 같이 넘겨줍니다.
              handleToggleVisible(row.id, visible);
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              visible ? 'bg-admin-primary' : 'bg-gray-300'
            } cursor-pointer hover:shadow-inner`}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                visible ? 'translate-x-6' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>
      )
    },
    { key: 'date', header: '등록일', width: '150px', className: 'text-center text-gray-500' },
    {
        key: 'actions',
        header: '상세/수정',
        width: '80px',
        className: 'text-center',
        render: (_, row) => (
        <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-200 whitespace-nowrap">
            보기
        </button>
        )
    }
  ], [goDetail]);

  // ==================================================================================
  // 5. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword); // 검색 버튼을 눌러야 실제 필터링 적용
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSelectedCategory("all");
    setSelectedType("all");
    setCurrentPage(1);
  };

  // 선택된 항목들의 이름 목록 가져오기 (메시지 표시용)
  const getAllSelectedItemsList = () => {
    const selectedItems = guides.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title).join(", ");
  };

  // [삭제] 핸들러
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    const allNames = getAllSelectedItemsList();

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-graygray-50">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setGuides(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // [일괄 상태 변경] 핸들러 (노출/비노출)
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();
    
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete', // 기존 delete 타입 디자인 재활용
      onConfirm: () => {
        setGuides(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, visible: status } : item));
        setSelectedIds([]); 
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };
  
  // 개별 노출 상태 토글 핸들러 (모달 버전)
  const handleToggleVisible = (id, currentStatus) => {
    // 현재 상태의 반대값 (변경될 상태)
    const nextStatus = !currentStatus;
    
    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>해당 항목의 상태를 <span className={`font-bold ${nextStatus ? 'text-admin-primary' : 'text-gray-500'}`}>[{nextStatus ? '노출' : '비노출'}]</span>로 변경하시겠습니까?</p>
          <p className="text-body-s text-graygray-50">* 변경 즉시 사용자 화면에 반영됩니다.</p>
        </div>
      ),
      type: nextStatus ? 'confirm' : 'delete', // 디자인 톤 맞추기 (노출-파랑, 미노출-회색/빨강)
      onConfirm: () => {
        // 실제 데이터 업데이트 로직
        setGuides(prev => prev.map(item => 
          item.id === id ? { ...item, visible: nextStatus } : item
        ));
        setIsModalOpen(false); // 모달 닫기
      }
    });
    
    setIsModalOpen(true); // 모달 열기
  };
  // console.log(`${id}번 항목의 노출 상태가 변경되었습니다.`);
  
  // ==================================================================================
  // 6. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">행동요령 목록</h2>

        {/* [A] 검색 영역 (SearchBox + Custom Filters) @@ */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 1단 필터: 재난 구분 (유동적) @@ */}
            <div className="relative w-full md:w-48">
              <select 
              value={selectedCategory} 
              onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }} 
              className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
            

            {/* 2단 필터: 재난 유형 (selectedType 연결) @@ */}
            <div className="relative w-full md:w-48">
              <select 
                value={selectedType} 
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }} 
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 테이블 및 액션 버튼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            
            {/* 좌측: 선택된 개수 및 일괄 처리 버튼 */}
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>

              {/* 일괄 처리 버튼 그룹 */}
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>

            {/* 우측: 삭제 및 등록 버튼 */}
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
               <button 
                onClick={() => navigate('/admin/contents/behavioralGuideAdd')}
                className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          {/* [C] 데이터 테이블 (AdminDataTable) */}
          <AdminDataTable 
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

          {/* [D] 페이지네이션 (AdminPagination) */}
          <AdminPagination 
            totalItems={filteredData.length}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      {/* [E] 확인/삭제 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

export default BehavioralGuideList;