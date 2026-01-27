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

  // [로직] 구분이 바뀌면 유형 초기화
    useEffect(() => {
      setBreadcrumbTitle(""); // 목록 페이지는 URL 매핑값을 따르도록 초기화
    }, [setBreadcrumbTitle]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const goDetail = useCallback((id) => {
    navigate(`/admin/contents/safetyEduDetail/${id}`); 
}, [navigate]);

  const getAllSelectedItemsList = () => {
    const selectedItems = eduList.filter(item => selectedIds.includes(item.id));
    return selectedItems.map(item => item.title).join(", ");
  };

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

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) return alert("항목을 먼저 선택해주세요.");
    const allNames = getAllSelectedItemsList();
    setModalConfig({
      title: `일괄 ${status ? '노출' : '비노출'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을 일괄 <span className="font-bold underline">{status ? '노출' : '비노출'}</span> 처리하시겠습니까?</p>
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

  /// ★ [정렬 로직 변경] createdAt 대신 orderNo 기준으로 정렬 (사용자 페이지와 동일하게)
  const filteredData = useMemo(() => {
    const searchTerm = appliedKeyword.replace(/\s+/g, "").toLowerCase();
    return eduList.filter(item => {
      const isPublicMatch = selectedPublicStatus === "all" || 
        (selectedPublicStatus === "visible" && item.isPublic === true) ||
        (selectedPublicStatus === "hidden" && item.isPublic === false);
      
      let isSearchMatch = true;
      if (searchTerm) {
        const title = (item.title || "").replace(/\s+/g, "").toLowerCase();
        const source = (item.source || "").replace(/\s+/g, "").toLowerCase();
        const author = (item.author || "").toLowerCase();
        const id = (item.mgmtId || "").toLowerCase();
        
        const contentMatch = item.sections?.some(sec => 
          sec.subTitle.replace(/\s+/g, "").toLowerCase().includes(searchTerm) ||
          sec.items.some(i => i.text.replace(/\s+/g, "").toLowerCase().includes(searchTerm))
        );

        if (searchType === "all") {
          isSearchMatch = title.includes(searchTerm) || source.includes(searchTerm) || id.includes(searchTerm) || author.includes(searchTerm) || contentMatch;
        } else if (searchType === "title") {
          isSearchMatch = title.includes(searchTerm);
        } else if (searchType === "source") {
          isSearchMatch = source.includes(searchTerm);
        } else if (searchType === "content") {
          isSearchMatch = contentMatch;
        }
      }
     return isPublicMatch && isSearchMatch;
    }).sort((a, b) => {
      // 순서가 지정되지 않은 항목은 맨 뒤로 보내고 싶다면 큰 숫자를 기본값으로 주는 것도 방법입니다.
const orderA = a.orderNo === '' || a.orderNo === undefined ? 9999 : Number(a.orderNo);
const orderB = b.orderNo === '' || b.orderNo === undefined ? 9999 : Number(b.orderNo);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 2순위: orderNo가 같다면 등록일시(createdAt) 내림차순 (최신순)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [eduList, appliedKeyword, searchType, selectedPublicStatus]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const columns = useMemo(() => [
    // ★ [추가] 노출 순서 컬럼
    { 
      key: 'orderNo', 
      header: '순서', 
      width: '80px', 
      className: 'text-center', 
      render: (val) => <span>{val || '-'}</span>
    },
    { key: 'mgmtId', header: 'ID', width: '130px', className: 'text-center' },
    { 
      key: 'regType', 
      header: '등록방식', 
      width: '110px', 
      className: 'text-center',
      render: (val) => (
        <div className="flex justify-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-bold border ${
            val === '직접등록' 
              ? 'bg-purple-50/50 text-purple-500 border-purple-100' 
              : 'bg-orange-50/50 text-orange-500 border-orange-100'
          }`}>
            {val || '직접등록'}
          </span>
        </div>
      )
    },
    { key: 'source', header: '출처', width: '180px', className: 'text-center' },
    { 
      key: 'title', 
      header: '시설명(교육명)', 
      className: 'text-center', 
      render: (val) => <span className="font-medium">{val}</span>
    },
    { key: 'author', header: '등록인', width: '90px', className: 'text-center' },
    { 
      key: 'createdAt', 
      header: '등록일시', 
      width: '140px', 
      className: 'text-center', 
      render: (val) => {
        if (!val) return "-";
        const [date, time] = val.split(' ');
        return (
          <div className="flex flex-col items-center justify-center leading-tight text-[13px] text-gray-500">
            <span className="block text-gray-500">{date}</span>
            <span className="block">{time}</span>
          </div>
        );
      }
    },
{ 
  key: 'isPublic', 
  header: '노출여부', 
  width: '90px', 
  className: 'text-center', 
  render: (isPublic, row) => (
    /* 여기서 클릭 이벤트 전파를 막아줍니다 */
    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
      <ToggleSwitch isOn={isPublic} onToggle={() => handleTogglePublic(row.id, isPublic)} />
    </div>
  ) 
},
    { 
      key: 'actions', 
      header: '관리', 
      width: '80px', 
      className: 'text-center', 
      render: (_, row) => (
        <button 
          onClick={() => goDetail(row.id)} 
          className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-blue-100 whitespace-nowrap"
        >
          보기
        </button>
      ) 
    }
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
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">시민안전교육 목록</h2>
        
        <section className="bg-admin-surface border border-admin-border rounded-xl p-8 mb-8">
          <AdminSearchBox 
            searchParams={searchParams} 
            setSearchParams={setSearchParams} 
            onSearch={() => { setAppliedKeyword(searchParams.keyword); setCurrentPage(1); }} 
            onReset={() => { 
              setSearchParams({ keyword: '' }); setAppliedKeyword(''); 
              setSearchType("all"); setSelectedPublicStatus("all"); 
              setCurrentPage(1); setSelectedIds([]); 
            }}
          >
            <div className="relative w-full md:w-48">
              <select value={selectedPublicStatus} onChange={(e) => { setSelectedPublicStatus(e.target.value); setCurrentPage(1); }} className="w-full appearance-none h-14 pl-5 pr-10 border border-admin-border rounded-md bg-white outline-none cursor-pointer text-body-m focus:border-admin-primary transition-all">
                <option value="all">노출여부 전체</option>
                <option value="visible">노출</option>
                <option value="hidden">비노출</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-full md:w-48">
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="w-full appearance-none h-14 pl-5 pr-10 border border-admin-border rounded-md bg-white outline-none cursor-pointer text-body-m focus:border-admin-primary transition-all">
                <option value="all">전체검색</option>
                <option value="title">시설명(교육명)</option>
                <option value="source">출처</option>
                <option value="content">내용(본문)</option>
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
              <button onClick={() => navigate('/admin/contents/safetyEduAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">등록</button>
            </div>
          </div>
          <AdminDataTable columns={columns} data={currentData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} rowKey="id" />
          <AdminPagination totalItems={filteredData.length} itemCountPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
        </section>
      </main>
      <AdminConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} {...modalConfig} />
    </div>
  );
};

export default AdminSafetyEduList;