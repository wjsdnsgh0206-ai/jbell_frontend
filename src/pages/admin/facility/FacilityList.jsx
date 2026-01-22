import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown } from 'lucide-react';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';
import { facilityService } from '@/services/api'; 

const FacilityList = () => {
  const navigate = useNavigate();

  // ==================================================================================
  // 1. 상태 관리 (State Management)
  // ==================================================================================
  const [facility, setFacility] = useState([]);      // 테이블에 표시할 리스트 데이터
  const [totalCount, setTotalCount] = useState(0);    // 백엔드에서 받은 전체 개수
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 서버 사이드 페이징을 위해 10개로 설정

  // [상태] 필터 및 검색
  const [selectedType, setSelectedType] = useState("all"); 
  const [searchParams, setSearchParams] = useState({ fcltNm: '', sggNm: '', roadNmAddr: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedParams, setAppliedParams] = useState({
    fcltNm: '',
    sggNm: '',
    roadNmAddr: ''
  });

  // [상태] 정렬 (기본값: 등록일 내림차순)
  const [sortConfig, setSortConfig] = useState({ key: 'reg_dt', direction: 'DESC' });

  // [모달 상태]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  const { setBreadcrumbTitle } = useOutletContext();

  useEffect(() => {
    setBreadcrumbTitle("");
  }, [setBreadcrumbTitle]);

  // [로직] 구분이 바뀌면 유형 초기화
  // useEffect(() => {
  //   setBreadcrumbTitle(""); // 목록 페이지는 URL 매핑값을 따르도록 초기화
  // }, [setBreadcrumbTitle]);
  // 



  // ==================================================================================
  // 2. 데이터 페칭 로직 (API 연동)
  // ==================================================================================
 const fetchFacilities = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await facilityService.getFacilityList({
      // 적용된(Applied) 검색 조건들을 보냄
      fcltNm: appliedParams.fcltNm,
      sggNm: appliedParams.sggNm,
      roadNmAddr: appliedParams.roadNmAddr,
      
      page: currentPage,
      limit: itemsPerPage, // 추가
      offset: (currentPage - 1) * itemsPerPage, // 백엔드 LIMIT/OFFSET용
      sortKey: sortConfig.key,
      sortOrder: sortConfig.direction
    });

    console.log("백엔드 요청 파라미터:", appliedParams);

    const resultData = response.data; 
    if (resultData) {
      const formattedList = (resultData.items || []).map(item => ({
        ...item,
        id: item.fcltId 
      }));
      setFacility(formattedList);
      setTotalCount(resultData.totalCount || 0);
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  } finally {
    setIsLoading(false);
  }
}, [appliedParams, currentPage, sortConfig]); // appliedParams를 의존성에 추가

   useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // ==================================================================================
  // 3. 테이블 컬럼 정의
  // ==================================================================================
  const columns = useMemo(() => [
  { key: 'fcltId', header: 'No', width: '80px', className: 'text-center' },
  { key: 'fcltSeCd', header: '유형구분', width: '120px', className: 'text-center' },
  { key: 'sggNm', header: '지역명', width: '120px', className: 'text-center' }, // 추가
  { key: 'fcltNm', header: '시설명', className: 'text-left font-bold pl-4' },
  { key: 'roadNmAddr', header: '도로명 주소', className: 'text-center pl-4' },
  { key: 'regDt', header: '등록일', width: '150px', className: 'text-center' }, // 추가
  {
    key: 'useYn', // visible -> useYn으로 변경
    header: '사용여부',
    width: '100px',
    render: (useYn, row) => {
      const isVisible = useYn === 'Y'; // 'Y'일 때 활성화 상태
      return (
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleVisible(row.fcltId, useYn);
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
              isVisible ? 'bg-admin-primary' : 'bg-gray-300'
            }`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition ${isVisible ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      );
    }
  },
  {
    key: 'actions',
    header: '상세',
    width: '80px',
    render: (_, row) => (
      <button 
        onClick={() => navigate(`/admin/facility/facilityDetail/${row.fcltId}`)} 
        className="border border-admin-border px-3 py-1 rounded hover:bg-gray-50 whitespace-nowrap text-body-s"
      >
        보기
      </button>
    )
  }
], [navigate]);

  // ==================================================================================
  // 4. 이벤트 핸들러
  // ==================================================================================
  // [A] 검색 실행 핸들러
  const handleSearch = () => {
  setAppliedParams({ ...searchParams }); // 입력된 값들을 적용용 상태로 복사
  setCurrentPage(1);
};

  // [B] 정렬 변경 핸들러 (오름차순/내림차순)
  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split('-');
    setSortConfig({ key, direction });
    setCurrentPage(1); // 정렬 변경 시 1페이지로 이동
  };

  const handleReset = () => {
    const resetValues = { fcltNm: '', sggNm: '', roadNmAddr: '' };
    setSearchParams(resetValues);
    setAppliedParams(resetValues); // 적용된 값도 초기화
    setSortConfig({ key: 'reg_dt', direction: 'DESC' });
    setCurrentPage(1);
  };

  const handleToggleVisible = (id, currentUseYn) => {
  const nextStatus = currentUseYn === 'Y' ? 'N' : 'Y'; // Y <-> N 토글
  
  setModalConfig({
    title: '노출 상태 변경',
    message: (
      <div className="flex flex-col gap-2 text-left">
        <p>상태를 <span className={`font-bold ${nextStatus === 'Y' ? 'text-admin-primary' : 'text-gray-500'}`}>
          [{nextStatus === 'Y' ? '노출' : '비노출'}]</span>로 변경하시겠습니까?</p>
      </div>
    ),
    type: nextStatus === 'Y' ? 'confirm' : 'delete',
    onConfirm: async () => {
      try {
        // TODO: 실제 운영 시에는 여기서 API를 호출해야 합니다.
        // await facilityService.updateStatus(id, nextStatus);
        
        setFacility(prev => prev.map(item => 
          item.fcltId === id ? { ...item, useYn: nextStatus } : item
        ));
        setIsModalOpen(false);
      } catch (error) {
        alert("상태 변경에 실패했습니다.");
      }
    }
  });
  setIsModalOpen(true);
};


 // 선택된 항목들의 이름 목록 가져오기 (메시지 표시용)
const getAllSelectedItemsList = () => {
  // guides -> facility 로 변경
  const selectedItems = facility.filter(item => selectedIds.includes(item.fcltId)); 
  // item.title -> item.fcltNm (시설명) 으로 변경
  return selectedItems.map(item => item.fcltNm).join(", ");
};

// [삭제] 핸들러 - 백엔드 연동 버전
const handleDeleteSelected = () => {
  if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
  
  const allNames = getAllSelectedItemsList();

  setModalConfig({
    title: '선택 항목 삭제',
    message: (
      <div className="flex flex-col gap-2 text-left">
        <p>선택하신 <span className="text-red-600 font-bold">[{allNames}]</span> 항목을 정말 삭제하시겠습니까?</p>
        <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
      </div>
    ),
    type: 'delete',
    onConfirm: async () => {
      try {
        // 1. 백엔드 API 호출 (DELETE /api/facility/delete)
        // selectedIds는 이미 [1, 2, 3] 형태의 배열이므로 그대로 전달합니다.
        const response = await facilityService.deleteFacilities(selectedIds);
        
        if (response.status === 'SUCCESS') {
          // 2. 모달 닫기
          setIsModalOpen(false);
          
          // 3. 알림창 표시
          alert("성공적으로 삭제되었습니다.");
          
          // 4. 상태 업데이트
          // 삭제 후 현재 페이지의 데이터가 모두 사라질 수 있으므로, 
          // 데이터를 다시 페칭하거나 현재 리스트에서 필터링합니다.
          setSelectedIds([]); // 선택 초기화
          fetchFacilities();  // 목록 재조회 (페이징/카운트 갱신을 위해 권장)
        } else {
          alert("삭제 실패: " + response.message);
        }
      } catch (error) {
        console.error("삭제 요청 중 오류 발생:", error);
        alert("서버 통신 중 오류가 발생했습니다.");
      }
    }
  });
  setIsModalOpen(true);
};


  

   return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">시설 관리 목록</h2>

        {/* [A] 검색 및 정렬 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={handleSearch}
            onReset={handleReset}
            showDefaultInput={false}
          >
            {/* 1. 시설명 검색 */}
            <div className="flex flex-col gap-2 flex-1 pb-[26px]">
              <label className="text-sm font-bold text-gray-600">시설명</label>
              <input 
                type="text"
                name="fcltNm" // 백엔드 #{fcltNm}과 매칭
                value={searchParams.fcltNm}
                onChange={(e) => setSearchParams({...searchParams, fcltNm: e.target.value})}
                placeholder="시설명을 입력하세요"
                className="w-full h-14 pl-5 pr-12 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary placeholder:text-gray-400 focus:border-admin-primary outline-none transition-all"
              />
            </div>

            {/* 2. 시군구 검색 (Select 또는 Input) */}
            <div className="flex flex-col gap-2 w-full md:w-48 pb-[26px]">
              <label className="text-sm font-bold text-gray-600">시군구</label>
              <input 
                type="text"
                name="sggNm" // 백엔드 #{sggNm}과 매칭
                value={searchParams.sggNm}
                onChange={(e) => setSearchParams({...searchParams, sggNm: e.target.value})}
                placeholder="예: 전주시"
                className="w-full h-14 pl-5 pr-12 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary placeholder:text-gray-400 focus:border-admin-primary outline-none transition-all"
              />
            </div>

            {/* 3. 도로명 주소 검색 */}
            <div className="flex flex-col gap-2 flex-[1.5] pb-[26px]">
              <label className="text-sm font-bold text-gray-600">도로명 주소</label>
              <input 
                type="text"
                name="roadNmAddr" // 백엔드 #{roadNmAddr}과 매칭
                value={searchParams.roadNmAddr}
                onChange={(e) => setSearchParams({...searchParams, roadNmAddr: e.target.value})}
                placeholder="도로명 또는 지번 주소 입력"
                className="w-full h-14 pl-5 pr-12 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary placeholder:text-gray-400 focus:border-admin-primary outline-none transition-all"
              />
            </div>

            {/* 정렬 셀렉트 박스 (기존 코드 유지) */}
            <div className="flex flex-col gap-2 w-full md:w-64 pb-[26px]">
              <label className="text-sm font-bold text-gray-600">정렬 기준</label>
              <div className="relative">
                <select 
                  value={`${sortConfig.key}-${sortConfig.direction}`} 
                  onChange={handleSortChange} 
                  className="w-full appearance-none h-14 pl-5 pr-10 border border-admin-border rounded-md bg-white outline-none focus:border-admin-primary cursor-pointer"
                >
                  <option value="reg_dt-DESC">등록일 최신순</option>
                  <option value="fclt_nm-ASC">시설명 가나다순</option>
                  <option value="sgg_nm-ASC">지역명 가나다순</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* [B] 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${totalCount.toLocaleString()}건`
                )}
              </span>
            </div>
                
            <div className="flex gap-2">
              <button 
                onClick={handleDeleteSelected} 
                className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
              <button onClick={() => navigate('/admin/facility/facilityAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold shadow-sm">
                등록
              </button>
            </div>
          </div>

          <AdminDataTable 
            rowKey="fcltId"
            columns={columns}
            data={facility} 
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            isLoading={isLoading}
          />

          <AdminPagination 
            totalItems={totalCount}
            itemCountPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      <AdminConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        {...modalConfig} 
      />
    </div>
  );
};

export default FacilityList;