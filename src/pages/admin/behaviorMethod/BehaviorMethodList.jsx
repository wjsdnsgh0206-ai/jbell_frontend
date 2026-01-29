// src/pages/admin/behaviorMethod/BehaviorMethodList.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Loader2 } from 'lucide-react'; // 로딩 아이콘

// [API & Utils]
import { behaviorMethodService } from '@/services/api';

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const BehaviorMethodList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext(); // Layout에서 전달받은 context

  // ==================================================================================
  // 1. 상태 관리 (State)
  // ==================================================================================
  const [guides, setGuides] = useState([]);      // 전체 데이터 (DB)
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(false);     // 에러 상태
  const [onlyLatest, setOnlyLatest] = useState(true); // 최신 데이터만 보기 토글 (기본값 TRUE)

  const [selectedIds, setSelectedIds] = useState([]); // 체크박스 선택 ID
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const itemsPerPage = 10;

  // [필터 상태]
  const [selectedCategory, setSelectedCategory] = useState("all"); // 구분 (1단)
  const [selectedType, setSelectedType] = useState("all");         // 유형 (2단)

  // [검색 상태] (AdminSearchBox 연동)
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  // ==================================================================================
  // 2. 데이터 조회 (API Call)
  // ==================================================================================
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // API 호출 시 현재 선택된 카테고리와 토글 상태를 정확히 전달
      const data = await behaviorMethodService.getAdminBehaviorList({ 
        contentType: selectedCategory, 
        onlyLatest: onlyLatest ? 'Y' : 'N' 
      });
      
      setGuides(data || []);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, onlyLatest]); // ★ 중요: 의존성 추가 (카테고리나 토글이 바뀔 때 함수 갱신)

  useEffect(() => {
    fetchData();
    setBreadcrumbTitle(""); 
  }, [fetchData, setBreadcrumbTitle]); // ★ fetchData가 위에서 갱신되므로 자동으로 재실행됨

  // 1단 필터: '자연재난', '사회재난' 등 명칭으로 표시
  const categoryOptions = useMemo(() => {
    if (!guides.length) return [{ value: "all", label: "구분 전체" }];
    const categories = [...new Set(guides.map(item => item.groupName).filter(Boolean))];
    return [{ value: "all", label: "구분 전체" }, ...categories.map(c => ({ value: c, label: c }))];
  }, [guides]);

  // 2단 필터: '태풍', '지진' 등 명칭으로 표시
  const typeOptions = useMemo(() => {
    if (selectedCategory === "all") return [{ value: "all", label: "유형 전체" }];
    const types = guides
      .filter(item => item.groupName === selectedCategory)
      .map(item => item.contentTypeName)
      .filter(Boolean);
    const uniqueTypes = [...new Set(types)];
    return [{ value: "all", label: "유형 전체" }, ...uniqueTypes.map(t => ({ value: t, label: t }))];
  }, [guides, selectedCategory]);

  // [필터링 실행]
  const filteredData = useMemo(() => {
    return guides.filter(item => {
      // 1. 카테고리/유형 필터링 (서버에서 이미 필터링해왔으므로 검색어 위주로 수행)
      // 단, selectedCategory가 'all'일 때는 전체가 서버에서 오므로 클라이언트 필터 유지
      const [itemCat, itemType] = item.contentType?.split('-') || [];
      
      const isCategoryMatch = selectedCategory === "all" || itemCat === selectedCategory;
      const isTypeMatch = selectedType === "all" || itemType === selectedType;
      
      // 검색어 필터링
      const matchesSearch = item.title.includes(appliedKeyword) || 
                            (item.body && item.body.includes(appliedKeyword));

      // ★ [수정] 클라이언트 측 isLatest 필터링 제거
      // 서버에서 이미 onlyLatest 조건에 맞춰서 데이터를 보내주므로, 
      // 프론트에서는 검색어와 타입 일치 여부만 확인하면 됩니다.
      
      return isCategoryMatch && isTypeMatch && matchesSearch;
    });
  }, [guides, selectedCategory, selectedType, appliedKeyword]); // onlyLatest 제거 (서버가 이미 처리함)

  // [페이지네이션]
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // ==================================================================================
  // 4. 이벤트 핸들러
  // ==================================================================================
  
  // 검색 버튼 클릭
  const handleSearch = () => {
    setAppliedKeyword(searchParams.keyword);
    setCurrentPage(1);
  };

  // 초기화 버튼 클릭
  const handleReset = () => {
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSelectedCategory("all");
    setSelectedType("all");
    setOnlyLatest(true)
    setCurrentPage(1);
  };

  // 상세 페이지 이동
  const goDetail = (row) => {
    navigate(`/admin/behaviorMethodDetail/${row.contentId}`);
  };

  // 선택된 항목 이름 가져오기 (메시지용)
  const getSelectedNames = () => {
    return guides
      .filter(item => selectedIds.includes(item.contentId))
      .map(item => item.title)
      .join(", ");
  };

  // [삭제] 핸들러 (API 호출)
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    
    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">{selectedIds.length}개</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          await behaviorMethodService.deleteBehaviorMethods(selectedIds);
          // 성공 시 UI 반영
          setGuides(prev => prev.filter(item => !selectedIds.includes(item.contentId)));
          setSelectedIds([]);
          setIsModalOpen(false);
          alert("삭제되었습니다.");
        } catch (err) {
          console.error(err);
          alert("삭제 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // [일괄 노출/비노출] 핸들러 (API 호출)
  const handleBatchStatus = (isExpose) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const targetStatus = isExpose ? 'Y' : 'N';
    
    setModalConfig({
      title: `일괄 ${isExpose ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>선택하신 항목을 일괄 <span className="font-bold underline">{isExpose ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: isExpose ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await behaviorMethodService.updateVisibility(selectedIds, targetStatus);
          
          setGuides(prev => prev.map(item => 
            selectedIds.includes(item.contentId) ? { ...item, visibleYn: targetStatus } : item
          ));
          setSelectedIds([]);
          setIsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert("상태 변경 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  };

  // [개별 노출 토글] 핸들러
  // AdminDataTable의 컬럼 정의 안에서 호출됨
  const handleToggleVisible = useCallback((id, currentStatus) => {
    const nextStatus = currentStatus === 'Y' ? 'N' : 'Y';
    
    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-1 text-left">
          <p>해당 항목을 <span className={`font-bold ${nextStatus === 'Y' ? 'text-admin-primary' : 'text-gray-500'}`}>[{nextStatus === 'Y' ? '노출' : '비노출'}]</span> 상태로 변경하시겠습니까?</p>
        </div>
      ),
      type: nextStatus === 'Y' ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await behaviorMethodService.updateVisibility([id], nextStatus);
          
          setGuides(prev => prev.map(item => 
            item.contentId === id ? { ...item, visibleYn: nextStatus } : item
          ));
          setIsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert("상태 변경 중 오류가 발생했습니다.");
        }
      }
    });
    setIsModalOpen(true);
  }, []); // 의존성 없음 (setState 함수형 업데이트 사용)

  // 일괄 삭제 기능 핸들러
  const handleCleanupOldData = async () => {
    if (window.confirm("현재 사용되지 않는 과거 동기화 데이터를 모두 삭제하시겠습니까?")) {
      // API 호출: DELETE /behaviorMethod/cleanup
      // 서버에서는 WHERE regType = 'API' AND lastSyncYn = 'N' 인 데이터를 삭제
      await behaviorMethodService.cleanupOldData();
      fetchData(); // 재조회
    }
  };

  // ==================================================================================
  // 5. 테이블 컬럼 정의 (AdminDataTable용)
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'contentId', header: 'No', width: '60px', className: 'text-center' },
    { 
      key: 'contentType', 
      header: '재난구분/유형', 
      className: 'text-center',
      render: (val, row) => {
        // 이제 row.groupName(자연재난)과 row.contentTypeName(태풍)을 직접 사용
        return (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-gray-500 text-xs">{row.groupName || '구분 없음'}</span>
            <span className="font-bold text-admin-primary">{row.contentTypeName || val}</span>
          </div>
        );
      }
    },
    { key: 'title', header: '제목', width: '200px', className: 'text-center' },
    { 
      key: 'body', 
      header: '내용', 
      className: 'text-left',
      render: (text) => (
        <div className="truncate max-w-[300px] text-gray-600" title={text?.replace(/<[^>]*>?/gm, '')}>
          {text?.replace(/<[^>]*>?/gm, '')}
        </div>
      )
    },
    { 
      key: 'visibleYn', 
      header: '노출여부', 
      width: '100px',
      className: 'text-center',
      render: (val, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 행 클릭 방지
              handleToggleVisible(row.contentId, val);
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              val === 'Y' ? 'bg-admin-primary' : 'bg-gray-300'
            } cursor-pointer hover:shadow-inner`}
          >
            <div 
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                val === 'Y' ? 'translate-x-6' : 'translate-x-0' 
              }`} 
            />
          </button>
        </div>
      )
    },
    { 
      key: 'createdAt', 
      header: '등록일', 
      width: '120px', 
      className: 'text-center text-gray-500 text-sm',
      render: (date) => date ? date.substring(0, 10) : '-' 
    },
    {
      key: 'actions',
      header: '상세',
      width: '80px',
      className: 'text-center',
      render: (_, row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            goDetail(row);
          }} 
          className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
        >
          보기
        </button>
      )
    }
  ], [handleToggleVisible]); // goDetail은 함수라 제외 혹은 의존성 추가

  // ==================================================================================
  // 6. 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">행동요령 목록</h2>

        {/* [A] 검색 영역 (AdminSearchBox) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 1. 커스텀 필터: 카테고리 선택 */}
            <div className="relative w-full md:w-48">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                className="w-full h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer appearance-none"
              >
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 2. 커스텀 필터: 유형 선택 */}
            <div className="relative w-full md:w-48">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)} 
                className="w-full h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer appearance-none"
              >
                {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 3. 커스텀 필터: 이력 보기 토글 (여기에 추가!) */}
            {/* mb-4 제거, h-14로 높이를 맞춰서 select 박스와 정렬 */}
            <div className="flex items-center h-14 px-2">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={!onlyLatest} 
                  onChange={() => setOnlyLatest(!onlyLatest)} 
                  className="sr-only peer"
                />
                {/* 토글 스위치 디자인 */}
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all 
                              peer-checked:bg-admin-primary transition-colors"></div>
                {/* 라벨 텍스트 */}
                <span className="ml-3 text-body-m font-medium text-gray-700 whitespace-nowrap">
                  과거 이력 포함
                </span>
              </label>
            </div>

          </AdminSearchBox>
        </section>

        {/* [B] 테이블 및 액션 버튼 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            
            {/* 좌측: 선택 정보 및 일괄 처리 */}
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>

              {/* 일괄 처리 버튼들 */}
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

            {/* 우측: 등록/삭제 버튼 */}
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
               <button 
                onClick={() => navigate('/admin/contents/behaviorMethodAdd')}
                className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
            </div>
          </div>

          {/* [C] 데이터 테이블 (Loading 처리) */}
          {loading ? (
             <div className="flex justify-center items-center min-h-[400px]">
               <Loader2 className="animate-spin text-admin-primary" size={48} />
             </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[300px] text-gray-500">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </div>
          ) : (
             <>
                <AdminDataTable 
                  columns={columns}
                  data={currentData}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onRowClick={goDetail}
                  rowKey="contentId" // ★ DB의 Unique Key 지정
                />
                
                {/* [D] 페이지네이션 */}
                <AdminPagination 
                  totalItems={filteredData.length}
                  itemCountPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
             </>
          )}
        </section>
      </main>

      {/* [E] 확인 모달 */}
      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

export default BehaviorMethodList;