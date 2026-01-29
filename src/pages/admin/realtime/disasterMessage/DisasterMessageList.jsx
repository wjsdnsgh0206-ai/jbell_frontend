'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Search, Calendar, Clock } from 'lucide-react';
import axios from "axios";
import { disasterApi } from '@/services/api';
import { DISASTER_OPTIONS } from "./MessagetTypeData";


// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';



/**
 * [관리자] 재난 문자 이력 목록 페이지
 * 백엔드 API 연동 및 최근 7일 데이터 자동 필터링 적용
 */
const DisasterMessageList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [messages, setMessages] = useState([]); // 백엔드 데이터를 담을 상태
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 필터 관련 상태
  const [searchParams, setSearchParams] = useState({ keyword: '' }); 
  const [appliedKeyword, setAppliedKeyword] = useState(''); 
  const [senderName, setSenderName] = useState(""); 
  const [selectedRegion, setSelectedRegion] = useState("전체"); 
  const [selectedCategory, setSelectedCategory] = useState("전체"); 
  const [selectedType, setSelectedType] = useState("전체"); 

  // [날짜 필터] 오늘 기준 7일 전으로 초기값 설정
  const getFormattedDate = (date) => date.toISOString().split('T')[0];
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(getFormattedDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState(getFormattedDate(today));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  // ==================================================================================
  // 2. 데이터 가져오기 (API 연동)
  // ==================================================================================
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      // 1. API 호출
      const response = await disasterApi.getDisasterMessages();
      
      // 2. 데이터 추출 (공통 DTO 대응)
      // response가 배열이면 그대로 사용, 객체라면 그 안의 data나 list 필드 확인
      let rawData = [];
      if (Array.isArray(response)) {
        rawData = response;
      } else if (response && Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response && Array.isArray(response.list)) {
        rawData = response.list;
      }

      // 3. 매핑 로직 (rawData가 배열인 것이 보장됨)
      const mappedData = rawData.map(item => ({
        id: item.sn || item.id,
        category: item.emrgStepNm || '안전안내',
        type: item.dstType || '기타', 
        sender: item.mngOrgNm || "행정안전부", // DB 필드가 있다면 매핑
        content: item.msgCn || '',
        dateTime: item.crtDt || '',
        region: item.rcptnRgnNm || '',
        isVisible: item.visibleYn === 'Y'
      }));
      
      setMessages(mappedData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setMessages([]); // 에러 발생 시 빈 배열로 초기화하여 렌더링 에러 방지
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
  if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 이력");
  fetchMessages(); // 이제 안전하게 호출 가능합니다.
}, [setBreadcrumbTitle, fetchMessages]);

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/disasterMessageDetail/${id}`);
  }, [navigate]);

  // ==================================================================================
  // 3. 데이터 가공 (Filtering & Sorting)
  // ==================================================================================
  const filteredData = useMemo(() => {
    return messages.filter((item) => {
      const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchType = selectedType === "전체" || item.type.includes(selectedType);
      const matchSender = !senderName || item.sender.includes(senderName);
      const matchKeyword = !appliedKeyword || item.content.includes(appliedKeyword);
      const matchRegion = selectedRegion === "전체" || item.region.includes(selectedRegion);
      
      // 날짜 비교 (dateTime: "yyyy/MM/dd HH:mm:ss")
      const itemDate = item.dateTime ? item.dateTime.split(" ")[0].replaceAll("/", "-") : "";
      const matchDate = itemDate >= startDate && itemDate <= endDate;

      return matchCategory && matchType && matchSender && matchKeyword && matchRegion && matchDate;
    }).sort((a, b) => new Date(b.dateTime.replaceAll("/", "-")) - new Date(a.dateTime.replaceAll("/", "-")));
  }, [messages, selectedCategory, selectedType, senderName, appliedKeyword, selectedRegion, startDate, endDate]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // ==================================================================================
  // 4. 테이블 컬럼 정의
  // ==================================================================================
  const columns = useMemo(() => [
    { key: 'id', header: 'ID', width: '100px', className: 'text-center text-gray-500 font-mono text-xs' },
    { 
      key: 'category', 
      header: '구분', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold ${val === '긴급재난' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {val || '안전안내'}
        </span>
      )
    },
    { key: 'type', header: '유형', width: '100px', className: 'text-center font-bold text-blue-600' },
    { key: 'sender', header: '발송기관', width: '140px', className: 'text-center font-medium' },
    { 
      key: 'content', 
      header: '재난 문자 본문 내용', 
      className: 'text-left px-4 truncate max-w-[500px]',
      render: (val) => <span className="text-gray-700">{val}</span>
    },
    { key: 'dateTime', header: '발송 일시', width: '160px', className: 'text-center text-gray-400 text-[13px]' },
    { 
      key: 'isVisible', 
      header: '노출', 
      width: '90px',
      render: (visible, row) => (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleToggleVisible(row.id, visible); }}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${visible ? 'bg-admin-primary' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${visible ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      )
    },
    {
        key: 'actions',
        header: '상세',
        width: '80px',
        className: 'text-center',
        render: (_, row) => (
          <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-50 transition-all cursor-pointer">
            보기
          </button>
        )
    }
  ], [goDetail]);

  // ==================================================================================
  // 5. 핸들러 (Handlers)
  // ==================================================================================
  const handleSearch = () => { 
    setAppliedKeyword(searchParams.keyword);
    setCurrentPage(1); 
  };

  const handleReset = () => { 
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSenderName("");
    setSelectedCategory("전체");
    setSelectedType("전체");
    setStartDate(getFormattedDate(sevenDaysAgo));
    setEndDate(getFormattedDate(today));
    setCurrentPage(1); 
  };

  const handleToggleVisible = async (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const visibleYn = nextStatus ? 'Y' : 'N';

    setModalConfig({
      title: '노출 상태 변경',
      message: <p>해당 항목을 [{nextStatus ? '노출' : '비노출'}] 처리하시겠습니까?</p>,
      type: nextStatus ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await disasterApi.updateVisibility([id], visibleYn);
          setMessages(prev => prev.map(item => item.id === id ? { ...item, isVisible: nextStatus } : item));
        } catch (error) {
          alert("상태 변경에 실패했습니다.");
        }
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // 삭제 및 일괄 처리 핸들러는 기존 디자인/로직 유지 (생략 가능하나 구조상 유지)
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const visibleYn = status ? 'Y' : 'N';

    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: <p>선택하신 {selectedIds.length}건을 일괄 {status ? '노출' : '비노출'} 처리하시겠습니까?</p>,
      type: status ? 'confirm' : 'delete',
      onConfirm: async () => {
        try {
          await disasterApi.updateVisibility(selectedIds, visibleYn);
          setMessages(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, isVisible: status } : item));
          setSelectedIds([]);
        } catch (error) {
          alert("일괄 변경 중 오류가 발생했습니다.");
        }
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // 일괄 삭제 (논리 삭제)
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    setModalConfig({
      title: '선택 항목 삭제',
      message: <p>선택하신 [{selectedIds.length}건] 항목을 비노출 삭제하시겠습니까?</p>,
      type: 'delete',
      onConfirm: async () => {
        try {
          await disasterApi.deleteDisasters(selectedIds);
          // 목록에서 즉시 제거 (논리 삭제이므로 화면에서만 안 보이게 처리하거나 새로고침)
          setMessages(prev => prev.filter(c => !selectedIds.includes(c.id)));
          setSelectedIds([]);
        } catch (error) {
          alert("삭제 처리 중 오류가 발생했습니다.");
        }
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight font-bold">재난 문자 이력</h2>
        
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            {/* 1. 단계(Category) Select */}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer"
              >
                <option value="전체">단계 전체</option>
                {DISASTER_OPTIONS.CATEGORIES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 2. 유형(Type) Select */}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white outline-none cursor-pointer"
              >
                <option value="전체">유형 전체</option>
                {DISASTER_OPTIONS.TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-full md:w-48">
              <input 
                type="text" 
                placeholder="발송 기관" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-30" size={18} />
            </div>

            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center w-[130px]">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full outline-none bg-transparent cursor-pointer text-body-m" />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 pointer-events-none" />
                </div>
                <span className="text-graygray-30 mx-1">-</span>
                <div className="relative flex items-center w-[130px]">
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full outline-none bg-transparent cursor-pointer text-body-m" />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 pointer-events-none" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? (
                  <span className="text-admin-primary">{selectedIds.length}개 선택됨</span>
                ) : (
                  `전체 ${filteredData.length}건`
                )}
              </span>
              {/* 일괄 처리 버튼들 유지 */}
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer">삭제</button>
              <button onClick={() => navigate('/admin/realtime/disasterMessageAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all cursor-pointer">등록</button>
            </div>
          </div>

          <AdminDataTable
            columns={columns}
            data={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            rowKey="id"
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

      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default DisasterMessageList;