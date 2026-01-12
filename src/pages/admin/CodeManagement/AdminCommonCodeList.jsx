// src/pages/admin/CodeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import { X, ChevronDown } from 'lucide-react';
import AdminCodeConfirmModal from './AdminCodeConfirmModal';

const AdminCommonCodeList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState(""); 
  const [selectedGroup, setSelectedGroup] = useState("그룹코드 전체");
  const [selectedSub, setSelectedSub] = useState("상세코드 전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  const itemsPerPage = 10;

  useEffect(() => {
    setCodes([...AdminCommonCodeData]);
  }, []);

  useEffect(() => {
    setSelectedSub("상세코드 전체");
  }, [selectedGroup]);

  // 필터/검색 적용 여부
  const isFiltered = useMemo(() => {
    return appliedSearch !== "" || selectedGroup !== "그룹코드 전체" || selectedSub !== "상세코드 전체";
  }, [appliedSearch, selectedGroup, selectedSub]);

  // 2. 데이터 필터링 및 정렬 로직
  const filteredData = useMemo(() => {
    const searchTerm = appliedSearch.replace(/\s+/g, "").toLowerCase();
    return codes.filter(code => {
      const isGroupMatch = selectedGroup === "그룹코드 전체" || code.groupCode === selectedGroup;
      const isSubMatch = selectedSub === "상세코드 전체" || code.subCode === selectedSub;
      if (!searchTerm) return isGroupMatch && isSubMatch;
      const targetString = [code.groupName, code.groupCode, code.subName, code.subCode, code.desc].join("").replace(/\s+/g, "").toLowerCase();
      return isGroupMatch && isSubMatch && targetString.includes(searchTerm);
    }).sort((a, b) => {
      if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
  }, [codes, appliedSearch, selectedGroup, selectedSub]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 3. 핸들러 함수들
  const handleSearch = () => { setAppliedSearch(searchInput); setCurrentPage(1); };
  const handleClearSearch = () => { 
    setSearchInput(""); setAppliedSearch(""); setSelectedGroup("그룹코드 전체"); setSelectedSub("상세코드 전체"); setCurrentPage(1); 
  };
  
  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));
  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    else setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
  };

  // 선택된 항목들의 이름을 모달에 보여주기 위한 함수
  const getAllSelectedItemsList = () => {
    const selectedItems = codes.filter(code => selectedIds.includes(code.id));
    return selectedItems.map(item => item.subCode === '-' ? item.groupName : item.subName).join(", ");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) { alert("삭제할 항목을 선택해주세요."); return; }
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
        setCodes(prev => prev.filter(code => !selectedIds.includes(code.id)));
        setSelectedIds([]); setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  // 일괄 사용/미사용 처리 핸들러
  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) { alert("항목을 먼저 선택해주세요."); return; }
    const allNames = getAllSelectedItemsList();
    setModalConfig({
      title: `일괄 ${status ? '사용' : '미사용'} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allNames}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{status ? '사용' : '미사용'}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setCodes(prev => prev.map(code => selectedIds.includes(code.id) ? { ...code, visible: status } : code));
        setSelectedIds([]); setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleViewDetail = (code) => {
    // 저장된 정보: View 버튼 클릭 시 상세 페이지 이동
    const path = code.subCode === '-' 
      ? `/admin/system/groupCodeDetail/${code.id}` 
      : `/admin/system/subCodeDetail/${code.id}`;
    navigate(path);
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <label className="relative flex items-center justify-center cursor-pointer select-none">
      <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={checked} onChange={onChange} />
      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-admin-primary border-admin-primary' : 'bg-white border-admin-border'}`}>
        {checked && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
      </div>
    </label>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">공통코드 목록</h2>

        {/* 1. 필터 영역 (디자인 및 포커스 색상 복구) */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 flex items-center gap-4 mb-8">
          <div className="flex flex-1 gap-4">
            <div className="relative w-72">
              <select value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }} className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-body-m outline-none bg-white focus:border-admin-primary focus:ring-1 focus:ring-admin-primary transition-all">
                <option value="그룹코드 전체">그룹코드 전체</option>
                {Array.from(new Map(AdminCommonCodeData.map(c => [c.groupCode, c.groupName]))).map(([code, name]) => (
                  <option key={code} value={code}>{`${code}(${name})`}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
            <div className="relative w-72">
              <select value={selectedSub} onChange={(e) => { setSelectedSub(e.target.value); setCurrentPage(1); }} className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-body-m outline-none bg-white focus:border-admin-primary focus:ring-1 focus:ring-admin-primary transition-all">
                <option value="상세코드 전체">상세코드 전체</option>
                {Array.from(new Map(codes.filter(c => (selectedGroup === "그룹코드 전체" || c.groupCode === selectedGroup) && c.subCode !== '-').map(c => [c.subCode, c.subName]))).map(([code, name]) => (
                  <option key={code} value={code}>{`${code}(${name})`}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>
            <div className="flex-1 relative">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="검색어를 입력해주세요" className="w-full border border-admin-border rounded-md px-5 h-14 text-body-m outline-none bg-white focus:border-admin-primary focus:ring-1 focus:ring-admin-primary transition-all" />
              {searchInput && <button onClick={handleClearSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-graygray-40"><X size={20} /></button>}
            </div>
          </div>
          <button onClick={handleSearch} className="px-8 h-14 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-bold rounded-md transition-all active:scale-95">검색</button>
        </section>

        {/* 2. 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} />
              <span className="text-body-m-bold text-admin-text-secondary">{selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `전체 ${filteredData.length}건`}</span>
              <div className="flex items-center ml-4 gap-4">
                {/* 일괄 사용/미사용 버튼 */}
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center group-hover:bg-blue-50 transition-all"><div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 사용</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition-all"><div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 미사용</span>
                </button>
              </div>
            </div>
            <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">삭제</button>
          </div>

          <div className="border border-admin-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-graygray-10 border-b border-admin-border text-admin-text-primary text-body-m-bold">
                  <th className="py-5 w-[80px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div></th>
                  <th className="py-5 px-2 text-center">그룹코드</th>
                  <th className="py-5 px-2 text-center">그룹명</th>
                  <th className="py-5 px-2 text-center">상세코드</th>
                  <th className="py-5 px-2 text-center">상세명</th>
                  <th className="py-5 px-6 text-center">코드설명</th>
                  <th className="py-5 px-2 text-center">등록일시</th>
                  <th className="py-5 px-2 text-center">순서</th>
                  <th className="py-5 px-4 text-center">사용여부</th>
                  <th className="py-5 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="text-body-m text-graygray-60">
                {currentData.length > 0 ? (
                  currentData.map((code) => {
                    const isSelected = selectedIds.includes(code.id);
                    return (
                      <tr key={code.id} className={`border-b border-graygray-5 last:border-0 hover:bg-graygray-5/50 transition-colors ${isSelected ? 'bg-blue-50/50' : 'bg-white'}`}>
                        <td className="py-5 text-center"><div className="flex justify-center"><CustomCheckbox checked={isSelected} onChange={() => setSelectedIds(prev => prev.includes(code.id) ? prev.filter(i => i !== code.id) : [...prev, code.id])} /></div></td>
                        <td className="py-5 text-center font-mono">{code.groupCode}</td>
                        <td className="py-5 text-center">{code.groupName}</td>
                        <td className="py-5 text-center font-mono">{code.subCode}</td>
                        <td className="py-5 text-center">{code.subName}</td>
                        <td className="py-5 px-6 text-left truncate max-w-[200px]">{code.desc}</td>
                        <td className="py-5 text-center text-graygray-50">{code.date}</td>
                        <td className="py-5 text-center text-graygray-50">{code.order}</td>
                        <td className="py-5 text-center">
                          <div className="flex justify-center">
                            {/* 읽기 전용 토글 */}
                            <div className={`w-12 h-6 flex items-center rounded-full p-1 shadow-inner cursor-default pointer-events-none transition-all ${code.visible ? 'bg-admin-primary' : 'bg-graygray-30'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${code.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                          </div>
                        </td>
                        <td className="py-5 text-center"><button onClick={() => handleViewDetail(code)} className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all">보기</button></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="py-32 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="mb-4 text-gray-200"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
                        <p className="text-[#111] text-[18px] font-bold mb-1">검색 결과가 없습니다.</p>
                        <p className="text-gray-400 text-[14px] mb-8">입력하신 검색어와 일치하는 코드가 존재하지 않습니다.</p>
                        <button onClick={handleClearSearch} className="px-8 py-3 bg-[#2563EB] text-white rounded-md text-[14px] font-bold hover:bg-[#1D4ED8] transition-all shadow-md active:scale-95">검색 초기화</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 3. 하단 검색 초기화 버튼 (검색 결과가 있을 때만 노출) */}
          {isFiltered && currentData.length > 0 && (
            <div className="flex justify-center mt-10">
              <button onClick={handleClearSearch} className="px-10 py-3.5 bg-[#2563EB] text-white rounded-md text-[16px] font-bold hover:bg-[#1D4ED8] transition-all shadow-md active:scale-95">검색 초기화</button>
            </div>
          )}

          {/* 4. 페이지네이션 */}
          {currentData.length > 0 && (
            <div className="py-14 flex justify-center items-center gap-3">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-5 py-2 text-body-m-bold ${currentPage === 1 ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-admin-primary cursor-pointer'}`}>〈 이전</button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-body-m-bold transition-all ${num === currentPage ? 'bg-secondary-50 text-white shadow-md font-bold' : 'text-graygray-50 hover:bg-graygray-10'}`}>{num}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-5 py-2 text-body-m-bold ${currentPage === totalPages ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-admin-primary cursor-pointer'}`}>다음 〉</button>
            </div>
          )}
        </section>
      </main>
      
      {/* 모달 */}
      <AdminCodeConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={modalConfig.onConfirm} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
    </div>
  );
};

export default AdminCommonCodeList;