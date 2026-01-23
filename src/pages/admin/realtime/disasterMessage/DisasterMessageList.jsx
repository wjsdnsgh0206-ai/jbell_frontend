'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Search, Calendar, Printer, Download } from 'lucide-react';

// [데이터]
import { initialMessageData } from "./DisasterMessageData";

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

/**
 * [관리자] 재난 문자 이력 목록 페이지
 */
const DisasterMessageList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  // ==================================================================================
  // 1. 상태 관리
  // ==================================================================================
  const [messages, setMessages] = useState(initialMessageData || []); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 필터 관련 상태
  const [searchParams, setSearchParams] = useState({ keyword: '' }); 
  const [appliedKeyword, setAppliedKeyword] = useState('');       
  const [senderName, setSenderName] = useState("");               
  const [selectedRegion, setSelectedRegion] = useState("전체");    
  
  // [데이터 필드에 맞춘 추가 필터 상태]
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 단계(구분) 필터
  const [selectedType, setSelectedType] = useState("전체");         // 유형 필터
  
  const [startDate, setStartDate] = useState("2026-01-01"); // 전주 데이터에 맞춰 초기값 조정
  const [endDate, setEndDate] = useState("2026-12-31");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 이력");
  }, [setBreadcrumbTitle]);

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/disasterMessageDetail/${id}`);
  }, [navigate]);

  // ==================================================================================
  // 2. 데이터 가공 (Filtering) - 데이터 구조에 맞춰 수정
  // ==================================================================================
  const filteredData = useMemo(() => {
    return messages.filter((item) => {
      // 1. 단계(구분) 필터
      const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
      // 2. 유형 필터
      const matchType = selectedType === "전체" || item.type === selectedType;
      // 3. 발송기관 필터
      const matchSender = !senderName || item.sender.includes(senderName);
      // 4. 내용 키워드 필터
      const matchKeyword = !appliedKeyword || item.content.includes(appliedKeyword);
      // 5. 지역 필터
      const matchRegion = selectedRegion === "전체" || item.region.includes(selectedRegion);
      // 6. 날짜 필터
      const itemDate = item.dateTime.split(" ")[0];
      const matchDate = itemDate >= startDate && itemDate <= endDate;

      return matchCategory && matchType && matchSender && matchKeyword && matchRegion && matchDate;
    }).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // 최신순 정렬 추가
  }, [messages, selectedCategory, selectedType, senderName, appliedKeyword, selectedRegion, startDate, endDate]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // ==================================================================================
  // 3. 테이블 컬럼 정의 (수정본)
  // ==================================================================================
  const columns = useMemo(() => [
    { 
      key: 'id', 
      header: 'ID', 
      width: '100px', 
      className: 'text-center text-gray-500 font-mono text-xs' 
    },
    { 
      key: 'category', 
      header: '구분', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${val === '긴급재난' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {val || '기타'}
        </span>
      )
    },
    { 
      key: 'type', 
      header: '유형', 
      width: '100px', 
      className: 'text-center',
      render: (val) => (
        <span className={`font-bold ${val === '실종자' ? 'text-orange-600' : 'text-blue-600'}`}>
          {val || '일반'}
        </span>
      )
    },
    { 
      key: 'sender', 
      header: '발송기관', 
      width: '140px', 
      className: 'text-center font-medium' 
    },
    { 
      key: 'content', 
      header: '재난 문자 본문 내용', 
      className: 'text-left px-4 truncate max-w-[500px]',
      render: (val) => (
        <span className="text-gray-700 leading-relaxed">{val}</span>
      )
    },
    { 
      key: 'dateTime', 
      header: '발송 일시', 
      width: '160px', 
      className: 'text-center text-gray-400 text-[13px]' 
    },
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
          <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer">
            보기
          </button>
        )
    }
  ], [goDetail]);

  // ==================================================================================
  // 4. 핸들러 (Handlers)
  // ==================================================================================
  const handleSearch = () => { 
    setAppliedKeyword(searchParams.keyword);
    setCurrentPage(1); 
  };

  const handleReset = () => { 
    setSearchParams({ keyword: '' });
    setAppliedKeyword('');
    setSenderName("");
    setSelectedRegion("전체");
    setSelectedCategory("전체");
    setSelectedType("전체");
    setStartDate("2026-01-01");
    setEndDate("2026-12-31");
    setCurrentPage(1); 
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    setModalConfig({
      title: '선택 항목 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{selectedIds.length}건]</span> 항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-gray-500">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setMessages(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: <p>선택하신 {selectedIds.length}건의 항목을 일괄 {status ? '노출' : '비노출'} 처리하시겠습니까?</p>,
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setMessages(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, isVisible: status } : item));
        setSelectedIds([]); 
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleToggleVisible = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    setModalConfig({
      title: '노출 상태 변경',
      message: <p>해당 항목의 상태를 [{nextStatus ? '노출' : '비노출'}]로 변경하시겠습니까?</p>,
      type: nextStatus ? 'confirm' : 'delete',
      onConfirm: () => {
        setMessages(prev => prev.map(item => item.id === id ? { ...item, isVisible: nextStatus } : item));
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // ==================================================================================
  // 5. UI 렌더링 (구조 유지)
  // ==================================================================================
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
            {/* 데이터 구분에 따른 단계 필터 */}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none cursor-pointer transition-all"
              >
                <option value="전체">단계 전체</option>
                <option value="안전안내">안전안내</option>
                <option value="긴급재난">긴급재난</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            {/* 데이터 구분에 따른 유형 필터 */}
            <div className="relative w-full md:w-40">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md bg-white focus:border-admin-primary outline-none cursor-pointer transition-all"
              >
                <option value="전체">유형 전체</option>
                <option value="기상">기상특보</option>
                <option value="실종자">실종자</option>
                <option value="화재">화재</option>
                <option value="교통통제">교통통제</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-full md:w-48">
              <input 
                type="text" 
                placeholder="발송 기관" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md focus:border-admin-primary outline-none transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-30" size={18} />
            </div>

            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all">
              <div className="flex items-center gap-2">
                <div className="group relative flex items-center w-[130px]">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 transition-colors group-hover:text-admin-primary pointer-events-none" />
                </div>
                <span className="text-graygray-30 mx-1">-</span>
                <div className="group relative flex items-center w-[130px]">
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="custom-date-input w-full outline-none bg-transparent pr-7 cursor-pointer text-body-m" 
                  />
                  <Calendar size={16} className="absolute right-0 text-graygray-30 transition-colors group-hover:text-admin-primary pointer-events-none" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* 하단 리스트 영역 */}
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
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">삭제</button>
              <button onClick={() => navigate('/admin/realtime/disasterMessageAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all shadow-sm cursor-pointer">등록</button>
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