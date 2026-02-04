'use no memo';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronDown, Search, Calendar } from 'lucide-react';
import { disasterApi } from '@/services/api';
import { DISASTER_OPTIONS } from "./MessagetTypeData";

// [공통 컴포넌트]
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const DisasterMessageList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const getFormattedDate = (date) => date.toISOString().split('T')[0];
  const todayStr = getFormattedDate(new Date());
  
  const defaultStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return getFormattedDate(date);
  }, []);

  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchParams, setSearchParams] = useState({ keyword: '' }); 
  const [appliedKeyword, setAppliedKeyword] = useState(''); 
  const [senderName, setSenderName] = useState(""); 
  const [selectedRegion, setSelectedRegion] = useState("전체"); 
  const [selectedCategory, setSelectedCategory] = useState("전체"); 
  const [selectedType, setSelectedType] = useState("전체"); 
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(todayStr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  // ==================================================================================
  // 2. 데이터 가져오기 및 매핑 (대문자 필드 대응 수정)
  // ==================================================================================
  const fetchMessages = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await disasterApi.getDisasterMessages();
    const rawData = response?.list || [];

    const mappedData = rawData.map(item => ({
      id: item.id || item.ID,
      category: item.EMRG_STEP_NM || item.emrgStepNm || '안전안내',
      type: item.DST_SE_NM || item.dstType || '기타', 
      sender: item.MNG_ORG_NM || item.mngOrgNm || "행정안전부",
      content: item.MSG_CN || item.msgCn || '',
      dateTime: item.CRT_DT || item.crtDt || '',
      region: item.RCPTN_RGN_NM || item.rcptnRgnNm || '',
      // [여기가 핵심!] DB의 visible_yn 값을 프론트 변수 isVisible에 넣어줌
      isVisible: item.visibleYn === 'Y' // 또는 item.visible_yn === 'Y'
    }));
    
    setMessages(mappedData);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    if (setBreadcrumbTitle) setBreadcrumbTitle("재난 문자 이력");
    fetchMessages();
  }, [setBreadcrumbTitle, fetchMessages]);

  const goDetail = useCallback((id) => {
    navigate(`/admin/realtime/disasterMessageDetail/${id}`);
  }, [navigate]);

  const handleSyncData = async () => {
    try {
      setIsLoading(true);
      await disasterApi.fetchAndSaveDisasterMessages({
        pageNo: 1,
        numOfRows: 30,
        rgnNm: '전북'
      });
      
      alert("최신 데이터 동기화 완료!");
      fetchMessages(); 
    } catch (error) {
      console.error("동기화 실패:", error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================================================
  // 3. 필터링 로직 (날짜 형식 대응 수정)
  // ==================================================================================
  const filteredData = useMemo(() => {
    return messages.filter((item) => {
      const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchType = selectedType === "전체" || item.type.includes(selectedType);
      const matchSender = !senderName || item.sender.includes(senderName);
      const matchKeyword = !appliedKeyword || (item.content && item.content.includes(appliedKeyword));
      const matchRegion = selectedRegion === "전체" || (item.region && item.region.includes(selectedRegion));
      
      // 날짜 비교 (YYYY-MM-DD 형식으로 통일)
      const itemDate = item.dateTime ? item.dateTime.split(" ")[0].replaceAll("/", "-") : "";
      const matchDate = !itemDate || (itemDate >= startDate && itemDate <= endDate);

      return matchCategory && matchType && matchSender && matchKeyword && matchRegion && matchDate;
    }).sort((a, b) => {
        const dateA = new Date(a.dateTime.replaceAll("/", "-"));
        const dateB = new Date(b.dateTime.replaceAll("/", "-"));
        return dateB - dateA;
    });
  }, [messages, selectedCategory, selectedType, senderName, appliedKeyword, selectedRegion, startDate, endDate]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  // ==================================================================================
  // 4. 핸들러 (동일)
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
    setStartDate(defaultStartDate);
    setEndDate(todayStr);
    setCurrentPage(1); 
  };

const handleToggleVisible = async (id, currentStatus) => {
  // currentStatus가 명확히 true일 때만 false로, 그 외(false, null, undefined)는 true로 설정
  const nextStatus = currentStatus === true ? false : true;
  const visibleYn = nextStatus ? 'Y' : 'N';

  setModalConfig({
    title: '노출 상태 변경',
    message: <p>해당 항목을 [{nextStatus ? '노출' : '비노출'}] 처리하시겠습니까?</p>,
    type: nextStatus ? 'confirm' : 'delete',
    onConfirm: async () => {
      try {
        // 1. 서버 API 호출 (비활성이면 'N'이 날아감)
        await disasterApi.updateVisibility([id], visibleYn);
        
        // 2. 로컬 상태 업데이트 (화면에 즉시 반영)
        setMessages(prev => prev.map(item => 
          item.id === id ? { ...item, isVisible: nextStatus } : item
        ));
        
        console.log(`ID ${id} 상태 변경 완료: ${visibleYn}`);
      } catch (error) {
        alert("상태 변경에 실패했습니다.");
      }
      setIsModalOpen(false);
    }
  });
  setIsModalOpen(true);
};

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

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    setModalConfig({
      title: '선택 항목 삭제',
      message: <p>선택하신 [{selectedIds.length}건] 항목을 비노출 삭제하시겠습니까?</p>,
      type: 'delete',
      onConfirm: async () => {
        try {
          await disasterApi.deleteDisasters(selectedIds);
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
const columns = useMemo(() => [
    { 
      key: 'id', 
      header: 'NO', 
      width: '100px', 
      className: 'text-center',
      // val은 item.id 값이고, row는 해당 행의 전체 데이터야

    
    },
    { 
      key: 'category', 
      header: '구분', 
      width: '120px', 
      className: 'text-center',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-[11px] font-bold ${val === '긴급재난' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {val}
        </span>
      )
    },
    { key: 'type', header: '유형', width: '100px', className: 'text-center' },
    { key: 'sender', header: '발송기관', width: '140px', className: 'text-center' },
    { 
      key: 'content', 
      header: '재난 문자 본문 내용', 
      className: 'text-left px-4 truncate max-w-[500px]',
      render: (val) => <span className="text-gray-700">{val}</span>
    },
    { key: 'dateTime', header: '발송 일시', width: '160px', className: 'text-center' },
    { 
      key: 'isVisible', 
      header: '노출', 
      width: '90px',
      className: "text-center",
      render: (visible, row) => (
        <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVisible(row.id, visible);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${visible ? "bg-admin-primary" : "bg-gray-300"}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${visible ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
        </div>
      )
    },
    {
        key: 'actions',
        header: '관리',
        width: '120px',
        className: 'text-center',
        render: (_, row) => (
          <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-all cursor-pointer font-normal">
            보기
          </button>
        )
    }
  ], [goDetail]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-heading-l text-admin-text-primary tracking-tight font-bold">재난 문자 이력</h2>
            <button onClick={handleSyncData} className="px-6 h-12 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-all cursor-pointer shadow-sm flex items-center gap-2">
                최신 데이터 동기화
            </button>
        </div>

        {/* 검색 섹션 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={handleSearch}
            onReset={handleReset}
          >
            <div className="relative w-full md:w-40">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none cursor-pointer"
              >
                <option value="전체">단계 전체</option>
                {DISASTER_OPTIONS.CATEGORIES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-full md:w-40">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none h-14 pl-5 pr-8 text-body-m border border-admin-border rounded-md bg-white text-admin-text-primary focus:border-admin-primary outline-none cursor-pointer"
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
                className="w-full h-14 pl-5 pr-10 text-body-m border border-admin-border rounded-md outline-none focus:border-admin-primary placeholder:text-graygray-30"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-30" size={18} />
            </div>

            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center gap-2">
                <div className="group relative flex items-center w-[125px]">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="custom-date-input w-full outline-none bg-transparent pr-1 text-body-m cursor-pointer" 
                  />
                  <Calendar size={16} className="text-graygray-30 group-hover:text-admin-primary pointer-events-none shrink-0" />
                </div>
                <span className="text-graygray-30 mx-1">-</span>
                <div className="group relative flex items-center w-[125px]">
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="custom-date-input w-full outline-none bg-transparent pr-1 text-body-m cursor-pointer" 
                  />
                  <Calendar size={16} className="text-graygray-30 group-hover:text-admin-primary pointer-events-none shrink-0" />
                </div>
              </div>
            </div>
          </AdminSearchBox>
        </section>

        {/* 리스트 섹션 */}
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
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm">삭제</button>
              <button onClick={() => navigate('/admin/realtime/disasterMessageAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md hover:opacity-90 font-bold active:scale-95 transition-all cursor-pointer shadow-sm">등록</button>
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