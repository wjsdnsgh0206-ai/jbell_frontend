import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { safetyEduData } from '@/pages/user/openboards/BoardData'; 
import { ChevronDown } from 'lucide-react';

import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSearchBox from '@/components/admin/AdminSearchBox';
import AdminConfirmModal from '@/components/admin/AdminConfirmModal';

const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ToggleSwitch = ({ isOn, onToggle }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isOn ? 'bg-admin-primary' : 'bg-gray-300'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const AdminSafetyEduList = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useOutletContext();

  const [eduList, setEduList] = useState(safetyEduData); 
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedPublicStatus, setSelectedPublicStatus] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchParams, setSearchParams] = useState({ keyword: '' });
  const [appliedKeyword, setAppliedKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => { setBreadcrumbTitle(""); }, [setBreadcrumbTitle]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const goDetail = useCallback((id) => {
    navigate(`/admin/safetyEducation/detail/${id}`);
  }, [navigate]);

  // [추가] 선택된 항목들의 시설명 목록 가져오기 (보도자료 리스트 방식)
  const getAllSelectedItemsList = () => {
    const selectedItems = eduList.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title).join(", ");
  };

  // 1. 개별 토글 핸들러
  const handleTogglePublic = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const targetItem = eduList.find(item => item.id === id);

    setModalConfig({
      title: '노출 상태 변경',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>' <span className="font-bold text-admin-text-primary">{targetItem?.title}</span> ' 의 상태를 
            <span className={`font-bold ${nextStatus ? 'text-admin-primary' : 'text-[#FF003E]'} ml-1`}>
              [{nextStatus ? '노출' : '비노출'}]
            </span>로 변경하시겠습니까?
          </p>
          <p className="text-body-s text-graygray-50">* 변경 즉시 사용자 서비스 화면에 반영됩니다.</p>
        </div>
      ),
      type: nextStatus ? 'confirm' : 'delete',
      onConfirm: () => {
        setEduList(prev => prev.map(item => item.id === id ? { ...item, isPublic: nextStatus } : item));
        setIsModalOpen(false);
        triggerToast(`'${targetItem.title}' 노출 상태가 변경되었습니다.`);
      }
    });
    setIsModalOpen(true);
  };

  // 2. 일괄 상태 변경 핸들러 (항목 나열 추가)
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
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setEduList(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, isPublic: status } : item));
        setSelectedIds([]); 
        setIsModalOpen(false);
        triggerToast(`일괄 ${status ? '노출' : '비노출'} 처리가 완료되었습니다.`);
      }
    });
    setIsModalOpen(true);
  };

  // 3. 선택 삭제 핸들러 (항목 나열 추가)
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
        setEduList(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
        triggerToast("삭제되었습니다."); 
      }
    });
    setIsModalOpen(true);
  };

  // ... (filteredData, currentData, columns 정의는 이전과 동일)
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    return eduList.filter(item => {
      const isPublicMatch = selectedPublicStatus === "all" || 
        (selectedPublicStatus === "visible" && item.isPublic === true) ||
        (selectedPublicStatus === "hidden" && item.isPublic === false);
      let isSearchMatch = true;
      if (searchTerm) {
        const title = (item.title || "").replace(/\s+/g, "").toLowerCase();
        const summary = (item.summary || "").replace(/\s+/g, "").toLowerCase();
        const id = (item.mgmtId || "").toLowerCase();
        if (searchType === "all") isSearchMatch = title.includes(searchTerm) || summary.includes(searchTerm) || id.includes(searchTerm);
        else if (searchType === "title") isSearchMatch = title.includes(searchTerm);
        else if (searchType === "summary") isSearchMatch = summary.includes(searchTerm);
      }
      return isPublicMatch && isSearchMatch;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [eduList, appliedKeyword, searchType, selectedPublicStatus]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const columns = useMemo(() => [
    { key: 'no', header: 'NO', width: '60px', className: 'text-center', render: (_, row) => filteredData.length - ((currentPage - 1) * itemsPerPage) - currentData.findIndex(item => item.id === row.id) },
    { key: 'mgmtId', header: 'ID', width: '120px', className: 'text-center' },
    { key: 'title', header: '시설명(교육명)', width: '200px', className: 'text-left font-bold px-4' },
    { key: 'summary', header: '내용 요약', className: 'text-left text-gray-500 text-[13px] px-4 min-w-[300px]', render: (val) => <p className="line-clamp-2 leading-relaxed">{val}</p> },
    { key: 'author', header: '등록인', width: '100px', className: 'text-center' },
    { key: 'createdAt', header: '등록일시', width: '120px', className: 'text-center text-[13px]', render: (val) => <div className="leading-tight">{val.split(' ').map((v, i) => <span key={i} className="block">{v}</span>)}</div> },
    { key: 'isPublic', header: '노출여부', width: '100px', className: 'text-center', render: (isPublic, row) => <div className="flex justify-center"><ToggleSwitch isOn={isPublic} onToggle={() => handleTogglePublic(row.id, isPublic)} /></div> },
    { key: 'actions', header: '상세/수정', width: '80px', className: 'text-center', render: (_, row) => <button onClick={() => goDetail(row.id)} className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 whitespace-nowrap">보기</button> }
  ], [filteredData.length, currentPage, currentData, goDetail]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon fill="#4ADE80" />
            <span className="font-bold text-[16px]">{toastMessage}</span>
          </div>
        </div>
      )}
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">시민안전교육 시설 관리</h2>
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox searchParams={searchParams} setSearchParams={setSearchParams} onSearch={() => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); }} onReset={() => { setSearchParams({ keyword: '' }); setAppliedKeyword(''); setSearchType("all"); setSelectedPublicStatus("all"); setCurrentPage(1); setSelectedIds([]); }}>
            <div className="relative w-full md:w-48">
              <select value={selectedPublicStatus} onChange={(e) => { setSelectedPublicStatus(e.target.value); setCurrentPage(1); }} className="w-full appearance-none h-14 pl-5 pr-10 border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                <option value="all">노출여부 전체</option>
                <option value="visible">노출</option>
                <option value="hidden">비노출</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
            <div className="relative w-full md:w-48">
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="w-full appearance-none h-14 pl-5 pr-10 border border-admin-border rounded-md bg-white outline-none cursor-pointer">
                <option value="all">전체검색</option>
                <option value="title">시설명</option>
                <option value="content">내용</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
          </AdminSearchBox>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? <span className="text-admin-primary">{selectedIds.length}개 선택됨</span> : `전체 ${filteredData.length}건`}
              </span>
              <div className="flex items-center ml-4 gap-4 border-l pl-4 border-gray-200">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all"><div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all"><div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 비노출</span>
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">삭제</button>
              <button onClick={() => navigate('/admin/safetyEducation/add')} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">등록</button>
            </div>
          </div>
          <AdminDataTable columns={columns} data={currentData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
          <AdminPagination totalItems={filteredData.length} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        </section>
      </main>
      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AdminSafetyEduList;