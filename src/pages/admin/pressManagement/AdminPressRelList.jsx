// src/pages/admin/pressManagement/AdminPressRelList.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { pressService } from '@/services/api';
import { X, ChevronDown, RotateCcw, Calendar, Paperclip, Search } from 'lucide-react';

// [공통 컴포넌트] 팀원들과 공유할 핵심 부품들
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 보도자료 목록 페이지
 * - 공통 컴포넌트(Table, SearchBox, Pagination) 사용 예시 포함
 */
// 토스트용 성공 아이콘 컴포넌트
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
// 줄임말 검색 지원용 사전 (필요할 때마다 추가 가능)
const SEARCH_ALIAS = {
  "행안부": "행정안전부",
  "전북": "전북안전대책본부",
  "복지부": "보건복지부",
};

const AdminPressRelList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  //  상태 관리 (State Management) @@
  // ==================================================================================
 const [pressRels, setPressRels] = useState([]); // ★ 초기값 빈 배열 @@
  const [totalCount, setTotalCount] = useState(0); // 서버에서 받은 전체 개수 관리@@
  const [selectedIds, setSelectedIds] = useState([]);      // 테이블에서 선택된 체크박스 ID들
  const [currentPage, setCurrentPage] = useState(1);       // 현재 페이지
  const [startDate, setStartDate] = useState(""); // 추가: 시작일 상태
  const [endDate, setEndDate] = useState("");     // 추가: 종료일 상태
  const itemsPerPage = 10;                                 // 페이지당 항목 수
  // 호버 상태 관리
  const [hoveredFileId, setHoveredFileId] = useState(null);

  // [상태] 필터 관리 @@

  const [selectedPublicStatus, setSelectedPublicStatus] = useState("all"); // 구분 (노출/비노출)
  const [searchType, setSearchType] = useState("all"); // 기본값 '전체'

  // [검색 상태] SearchBox에서 관리할 검색어
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState(''); // '검색' 버튼 클릭 시 확정된 검색어

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  // [브레드크럼 상태]
  const { setBreadcrumbTitle } = useOutletContext();

  // [토스트를 위한 상태] @@ 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /// ==================================================================================
  //  데이터 불러오기 (API 호출) ★ 추가
  // ==================================================================================
  // [AdminPressRelList.jsx] 73번 라인 부근 fetchList 수정
// [수정] 데이터 불러오기 부분
const fetchList = useCallback(async () => {
  try {
    const params = {
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
    };
    
    const response = await pressService.getPressList(params);
if (response) {
  const mappedData = response.map(item => ({
    ...item,
    id: item.contentId // AdminDataTable의 key 기준이 'id'인 경우 필수!
  }));
  setPressRels(mappedData);
  setTotalCount(response.length); // 임시로 현재 길이 세팅
}
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
}, [currentPage]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  
  // ==================================================================================
  //  필터링 로직 (Filtering Logic) @@
  // ==================================================================================

  // [최적화] 상세 이동 함수 (useCallback 적용) @@
  const goDetail = useCallback((id) => {
    navigate(`/admin/contents/pressRelDetail/${id}`);
  }, [navigate]);

  // 토스트 실행 함수
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // 2초 뒤에 사라짐
  };

  // [옵션 1] 구분(출처 기관) 자동 추출
  const categoryOptions = useMemo(() => {
    // 1. 전체 데이터에서 source를 기반으로 객체 배열 생성
    const categories = pressRels.map(item => ({
      value: item.source, // 실제 필터링에 사용할 값 (기관명)
      label: item.source  // 화면에 표시할 이름 (기관명)
    }));

    // 2. filter와 findIndex를 사용하여 중복 제거 (작성하신 패턴 적용)
    const uniqueCategories = categories.filter(
      (opt, index, self) => 
        index === self.findIndex((t) => t.value === opt.value)
    );

    // 3. '전체' 옵션 추가 후 반환
    return [{ value: "all", label: "구분 전체" }, ...uniqueCategories];
  }, [pressRels]); // pressRels 데이터가 변경될 때마다 최신화
  
// ==================================================================================
//  데이터 가공 (Filtering & Sorting)
// ==================================================================================

// 1) 필터링 및 정렬된 전체 데이터
// [수정] 데이터 가공 (Filtering & Sorting)
const filteredData = useMemo(() => {
  const rawTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
  const searchTerm = SEARCH_ALIAS[rawTerm] || rawTerm;

  return pressRels.filter(item => {
    // [A] 노출여부 필터 (item.visibleYn으로 수정)
    const isPublicMatch = selectedPublicStatus === "all" || 
      (selectedPublicStatus === "visible" && item.visibleYn === 'Y') ||
      (selectedPublicStatus === "hidden" && item.visibleYn === 'N');

    // [B] 날짜 필터 (item.createdAt 사용)
    const itemDateOnly = item.createdAt ? item.createdAt.split('T')[0] : ""; // 'T' 기준 분리
    const isStartMatch = !startDate || itemDateOnly >= startDate;
    const isEndMatch = !endDate || itemDateOnly <= endDate;
    
    // [C] 상세 검색 매칭 (item.contentId, item.body 사용)
    let isSearchMatch = true;
    if (searchTerm) {
      const title = (item.title || "").replace(/\s+/g, "").toLowerCase();
      const source = (item.source || "").replace(/\s+/g, "").toLowerCase();
      const content = (item.body || "").replace(/\s+/g, "").toLowerCase(); // content -> body
      const id = String(item.contentId || "").toLowerCase();

      if (searchType === "all") {
        isSearchMatch = title.includes(searchTerm) || 
                        source.includes(searchTerm) || 
                        id.includes(searchTerm) ||
                        content.includes(searchTerm);
      } else if (searchType === "title") {
        isSearchMatch = title.includes(searchTerm);
      } else if (searchType === "source") {
        isSearchMatch = source.includes(searchTerm);
      } else if (searchType === "content") {
        isSearchMatch = content.includes(searchTerm);
      }
    }

    return isPublicMatch && isStartMatch && isEndMatch && isSearchMatch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}, [pressRels, appliedKeyword, searchType, selectedPublicStatus, startDate, endDate]);

  // 2) 현재 페이지 슬라이싱
  const currentData = useMemo(() => {
    const size = 10; 
    const page = Number(currentPage) || 1;
    const startIndex = (page - 1) * size;
    return filteredData.slice(startIndex, startIndex + size);
}, [currentPage, filteredData]);


// ==================================================================================
//  테이블 컬럼 정의 (수정 완료 버전)
// ==================================================================================
const columns = useMemo(() => [
  {
    key: 'no',
    header: 'NO',
    width: '60px',
    className: 'text-center',
    render: (_, row) => {
      // row.id 대신 row.contentId 사용
      const index = currentData.findIndex(item => item.contentId === row.contentId);
      const total = filteredData.length;
      const calculatedNo = total - (currentPage - 1) * itemsPerPage - index;
      return <span>{calculatedNo}</span>;
    }
  },
  { key: 'contentId', header: '관리번호ID', width: '130px', className: 'text-center' }, 
  { 
    key: 'regType', 
    header: '등록방식', 
    width: '120px',
    className: 'text-center',
    render: (val) => (
      <div className="flex justify-center">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${
          val === '직접등록' 
            ? 'bg-purple-100 text-purple-400 border-purple-200' 
            : 'bg-orange-100 text-orange-400 border-orange-200'
        }`}>
          {val || '직접등록'}
        </span>
      </div>
    )
  }, 
  { key: 'source', header: '출처', width: '180px', className: 'text-center' },
  { key: 'title', header: '제목', className: 'text-center' },
  { 
  key: 'userId', 
  header: '등록인', 
  className: 'text-center',
  // val(데이터값)에 상관없이 무조건 '관리자' 텍스트 반환
  render: () => <span>관리자</span> 
},
  { 
    key: 'fileList', 
    header: '파일', 
    className: 'text-center',
    render: (fileList, row) => {
      // 데이터 구조 확인: fileList가 배열인지 체크
      const files = Array.isArray(fileList) ? fileList : [];
      const hasFiles = files.length > 0;
      const rowIndex = (currentData || []).findIndex(item => item.contentId === row.contentId);
      const isLastRows = rowIndex >= (currentData?.length || 0) - 2;

      return (
        <div className="flex justify-center items-center">
          {hasFiles && (
            <div className="relative inline-flex items-center justify-center">
              <div 
                className="p-1 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 rounded"
                onMouseEnter={() => setHoveredFileId(row.contentId)}
                onMouseLeave={() => setHoveredFileId(null)}
              >
                <Paperclip size={18} />
              </div>
              
              {hoveredFileId === row.contentId && (
                <div className={`absolute left-1/2 -translate-x-1/2 z-[1000] pointer-events-none ${
                  isLastRows ? 'bottom-full mb-2' : 'top-full mt-2'
                }`}>
                  <div className="bg-[#333] text-white text-[12px] py-2.5 px-4 rounded-lg shadow-2xl min-w-[200px] text-left border-t-2 border-blue-500">
                    <div className="pb-1.5 mb-1.5 font-bold text-blue-300 flex items-center justify-between border-b border-white/10">
                      <span>첨부파일</span>
                      <span>{files.length}개</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {files.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0 mt-1.5"></span>
                          {/* f.name 또는 f.file_name 둘 다 대응 */}
                          <span className="break-all">{f.name || f.file_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  },
  { 
    key: 'createdAt', 
    header: '등록일시', 
    width: '120px', 
    className: 'text-center', 
    render: (val) => {
      if (!val) return "-";
      // 2026-01-08T18:00:00 형식을 2026-01-08 18:00:00로 변환 후 줄바꿈
      const formatted = val.replace('T', ' ').substring(0, 19);
      const dateParts = formatted.split(' ');
      return (
        <div className="flex flex-col items-center justify-center leading-tight text-[13px]">
          {dateParts.map((part, i) => (
            <span key={i} className="block">{part}</span>
          ))}
        </div>
      );
    }
  },
  { 
    key: 'visibleYn', 
    header: '노출여부', 
    width: '100px',
    className: 'text-center',
    render: (val) => (
      <div className="flex justify-center">
        <span 
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${
            val === 'Y' 
              ? 'bg-blue-50 text-blue-600 border-blue-200' 
              : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}
        >
          {val === 'Y' ? '노출' : '비노출'}
        </span>
      </div>
    )
  },
  {
    key: 'actions',
    header: '상세',
    width: '80px',
    className: 'text-center',
    render: (_, row) => (
      <button 
        onClick={() => goDetail(row.contentId)} // row.content_id -> row.contentId
        className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 whitespace-nowrap"
      >
        보기
      </button>
    )
  }
], [filteredData.length, currentPage, itemsPerPage, currentData, hoveredFileId, goDetail]);
  // ==================================================================================
  // 5. 이벤트 핸들러 (Event Handlers)
  // ==================================================================================
  const handleSearch = () => {
   // 날짜 유효성 체크: 시작일이 종료일보다 늦으면 경고 후 중단
    if (startDate && endDate && startDate > endDate) {
      alert("시작일은 종료일보다 이전이어야 합니다.");
      return;
    }

    setAppliedKeyword(searchParams.keyword); // 검색 버튼을 눌러야 실제 필터링 적용
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleReset = () => {
  // 1. 검색어 입력창 & 확정 검색어 초기화
  setSearchParams({ keyword: '' });
  setAppliedKeyword('');
  
  // 2. [수정] 잘못된 함수명 변경 (setSelectedCategory -> setSearchType)
  setSearchType("all"); 
  setSelectedPublicStatus("all");
  
  // 3. 날짜 초기화 
  setStartDate(""); 
  setEndDate(""); 
  
  // 4. 페이지 및 선택 항목 초기화
  setCurrentPage(1);
  setSelectedIds([]);
};

  // 선택된 항목들의 이름 목록 가져오기 (메시지 표시용) @@
  const getAllSelectedItemsList = () => {
    const selectedItems = pressRels.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title).join(", ");
  };

  // [삭제] 핸들러 @@
  // [삭제] 핸들러 수정
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");

    // 선택된 항목들의 제목 추출
    const selectedTitles = pressRels
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.title);

    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-3 text-left">
          <div>
            <p className="mb-2">선택하신 <span className="text-red-600 font-bold">{selectedIds.length}개</span> 항목을 정말 삭제하시겠습니까?</p>
            {/* 제목 리스트 추가 */}
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
              {selectedTitles.map((title, idx) => (
                <p key={idx} className="text-sm text-gray-600 mb-1 flex items-start gap-2">
                  <span className="shrink-0 mt-1.5 w-1 h-1 bg-gray-400 rounded-full"></span>
                  {title}
                </p>
              ))}
            </div>
          </div>
          <p className="text-body-s text-graygray-50">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: async () => {
        try {
          await pressService.admin.delete(selectedIds);
          setSelectedIds([]);
          setIsModalOpen(false);
          triggerToast("선택한 항목이 삭제되었습니다.");
          fetchList();
        } catch (error) {
          alert("삭제 실패");
        }
      }
    });
    setIsModalOpen(true);
  };



  // [수정] 일괄 상태 변경 핸들러
// [수정] 일괄 상태 변경 핸들러
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    
    // 선택된 항목들의 데이터 추출
    const selectedItems = pressRels.filter(item => selectedIds.includes(item.id));
    const selectedTitles = selectedItems.map(item => item.title);

    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-3 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{selectedItems.length}개]</span> 항목을 일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
          {/* 제목 리스트 추가 */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
            {selectedTitles.map((title, idx) => (
              <p key={idx} className="text-sm text-gray-600 mb-1 flex items-start gap-2">
                <span className="shrink-0 mt-1.5 w-1 h-1 bg-blue-400 rounded-full"></span>
                {title}
              </p>
            ))}
          </div>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          // API 연동 로직 (필요 시 수정)
          setPressRels(prev => prev.map(item => 
            selectedIds.includes(item.id) 
              ? { ...item, visibleYn: status ? 'Y' : 'N' } 
              : item
          ));
          setSelectedIds([]); 
          setIsModalOpen(false);
          triggerToast(`선택한 항목이 ${status ? '노출' : '비노출'} 처리되었습니다.`);
        } catch (error) {
          alert("상태 변경 실패");
        }
      }
    });
    setIsModalOpen(true);
  };
  
  // ==================================================================================
  // 6. UI 렌더링
  // ==================================================================================
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      {/* 토스트 알림 */}
        {showToast && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500">
            <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
              <SuccessIcon fill="#4ADE80" />
              <span className="font-bold text-[16px]">{toastMessage}</span>
            </div>
          </div>
        )}
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">보도자료 목록</h2>

        {/* [A] 검색 영역 (SearchBox + Custom Filters) @@ */}
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/*: 노출여부 필터 @@*/}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedPublicStatus} 
                onChange={(e) => {
                  setSelectedPublicStatus(e.target.value);
                  setCurrentPage(1);
                }} 
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none transition-all cursor-pointer"
              >
                <option value="all">노출여부 전체</option>
                <option value="visible">노출</option>
                <option value="hidden">비노출</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 검색 조건 필터 @@ */}
              <div className="relative w-full md:w-40">
                <select 
                  value={searchType} 
                  onChange={(e) => setSearchType(e.target.value)} 
                  className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none cursor-pointer"
                >
                  <option value="all">전체</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="source">출처</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
              </div>

            {/* 기간 필터 영역 */}
            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center gap-2">
                
                {/* 시작일 영역 */}
                <div className="group relative flex items-center w-[130px]"> {/* 너비 고정으로 안정감 부여 */}
                  <input 
                    type="date" 
                    value={startDate} 
                    max={endDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setCurrentPage(1);
                    }} 
                    // appearance-none을 통해 브라우저 기본 아이콘 제거 시도
                    // pr-7을 주어 글자가 절대 아이콘을 침범하지 못하게 함
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar 
                    size={16} 
                    className="absolute right-0 text-graygray-30 transition-colors 
                              group-hover:text-admin-primary 
                              group-focus-within:text-admin-primary 
                              pointer-events-none" 
                  />
                </div>

                <span className="text-graygray-30 mx-1">-</span>

                {/* 종료일 영역 */}
                <div className="group relative flex items-center w-[130px]">
                  <input 
                    type="date" 
                    value={endDate} 
                    min={startDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setCurrentPage(1);
                    }} 
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar 
                    size={16} 
                    className="absolute right-0 text-graygray-30 transition-colors 
                              group-hover:text-admin-primary 
                              group-focus-within:text-admin-primary 
                              pointer-events-none" 
                  />
                </div>
                
              </div>
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
                onClick={() => navigate('/admin/contents/pressRelAdd')}
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
            totalItems={totalCount}
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

export default AdminPressRelList;