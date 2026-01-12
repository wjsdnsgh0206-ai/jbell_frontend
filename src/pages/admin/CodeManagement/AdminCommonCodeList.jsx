import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import { Button } from '@/components/shared/Button';
import AdminCodeConfirmModal from './AdminCodeConfirmModal';

const AdminCommonCodeList = () => {
  const navigate = useNavigate();
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
  const pageGroupSize = 5; 

  useEffect(() => {
    setCodes([...AdminCommonCodeData]);
  }, []);

  useEffect(() => {
    setSelectedSub("상세코드 전체");
  }, [selectedGroup]);

  // 검색/필터 적용 여부 체크
  const isFiltered = useMemo(() => {
    return appliedSearch !== "" || selectedGroup !== "그룹코드 전체" || selectedSub !== "상세코드 전체";
  }, [appliedSearch, selectedGroup, selectedSub]);

  const subOptions = useMemo(() => {
    let subData = codes.filter(c => c.subCode !== '-');
    if (selectedGroup !== "그룹코드 전체") {
      subData = subData.filter(c => c.groupCode === selectedGroup);
    }
    return Array.from(new Map(subData.map(c => [c.subCode, c.subName])));
  }, [codes, selectedGroup]);

  const filteredData = useMemo(() => {
    const filtered = codes.filter(code => {
      const isGroupMatch = selectedGroup === "그룹코드 전체" || code.groupCode === selectedGroup;
      const isSubMatch = selectedSub === "상세코드 전체" || code.subCode === selectedSub;
      const isSearchMatch = !appliedSearch || (() => {
        const n = appliedSearch.replace(/\s+/g, "").toLowerCase();
        const check = (t) => t?.toString().replace(/\s+/g, "").toLowerCase().includes(n);
        return check(code.groupName) || check(code.subName) || check(code.groupCode) || check(code.subCode) || check(code.desc);
      })();
      return isGroupMatch && isSubMatch && isSearchMatch;
    });

    return filtered.sort((a, b) => {
      if (a.groupCode !== b.groupCode) return a.groupCode.localeCompare(b.groupCode);
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
  }, [codes, appliedSearch, selectedGroup, selectedSub]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startPage = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handleSearch = () => { setAppliedSearch(searchInput); setCurrentPage(1); };
  
  const handleClearSearch = () => { 
    setSearchInput(""); setAppliedSearch(""); 
    setSelectedGroup("그룹코드 전체"); setSelectedSub("상세코드 전체"); 
    setCurrentPage(1); 
  };
  
  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));
  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    else setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
  };
  const handleSelectOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) { alert("삭제할 항목을 선택해주세요."); return; }
    setModalConfig({
      title: '선택 항목 삭제',
      message: `선택하신 ${selectedIds.length}개의 항목을 정말 삭제하시겠습니까?`,
      type: 'delete',
      onConfirm: () => {
        setCodes(prev => prev.filter(code => !selectedIds.includes(code.id)));
        setSelectedIds([]); setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) { alert("항목을 먼저 선택해주세요."); return; }
    setModalConfig({
      title: `일괄 ${status ? '노출' : '미노출'} 처리`,
      message: `선택하신 ${selectedIds.length}개의 항목을 일괄 처리하시겠습니까?`,
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setCodes(prev => prev.map(code => selectedIds.includes(code.id) ? { ...code, visible: status } : code));
        setSelectedIds([]); setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleToggleVisible = (id) => setCodes(prev => prev.map(code => code.id === id ? { ...code, visible: !code.visible } : code));
  
  const handleViewDetail = (code) => {
    const path = code.subCode === '-' ? `/admin/adminGroupCodeDetail/${code.id}` : `/admin/adminSubCodeDetail/${code.id}`;
    navigate(path);
  };

  const CustomCheckbox = ({ checked, onChange }) => (
    <label className="relative flex items-center justify-center cursor-pointer select-none">
      <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={checked} onChange={onChange} />
      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-300'}`}>
        {checked && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
      </div>
    </label>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10 text-left">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">공통 코드 관리</h2>
        
        {/* 상단 검색 섹션 (기존 스타일) */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex items-center gap-4 mb-8">
          <div className="relative w-72">
            <select value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }} className="appearance-none w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white font-medium">
              <option value="그룹코드 전체">그룹코드 전체</option>
              {Array.from(new Map(codes.map(c => [c.groupCode, c.groupName]))).map(([code, name]) => (
                <option key={code} value={code}>{`${code}(${name})`}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div className="relative w-72">
            <select value={selectedSub} onChange={(e) => { setSelectedSub(e.target.value); setCurrentPage(1); }} className="appearance-none w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white font-medium">
              <option value="상세코드 전체">상세코드 전체</option>
              {subOptions.map(([code, name]) => (
                <option key={code} value={code}>{`${code}(${name})`}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div className="flex-1 relative">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="검색어를 입력해주세요" className="w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] outline-none font-medium" />
            {searchInput && <button type="button" onClick={() => setSearchInput("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xl font-light">✕</button>}
          </div>
          <Button variant="none" size="none" onClick={handleSearch} className="px-8 h-14 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-bold rounded-md transition-all">검색</Button>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6 h-12">
            <div className="flex items-center bg-gray-50/50 px-4 py-2 rounded-lg border border-gray-100">
              <div className="flex items-center pr-4 border-r border-gray-300">
                <CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} />
                <span className="ml-3 font-bold text-[16px] text-[#111]">
                  {selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `총 ${filteredData.length}건`}
                </span>
              </div>
              <div className="flex items-center ml-4 gap-4">
                <button onClick={() => handleBatchStatus(true)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] flex items-center justify-center transition-all group-hover:bg-blue-50">
                    <div className="w-2.5 bg-[#2563EB] h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#111]">일괄 노출</span>
                </button>
                <div className="w-[1px] h-3 bg-gray-300" />
                <button onClick={() => handleBatchStatus(false)} className="flex items-center gap-2 group">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all group-hover:bg-gray-100">
                    <div className="w-2.5 bg-gray-400 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[15px] font-bold text-[#666]">일괄 미노출</span>
                </button>
              </div>
            </div>
            <button onClick={handleDeleteSelected} className="px-8 h-12 bg-[#FF003E] text-white rounded-md text-[15px] font-bold hover:bg-[#D90035] transition-all shadow-md active:scale-95">삭제</button>
          </div>

          {/* 테이블 본체 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-10">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F2F4F7] border-b border-gray-200 text-[#333] text-[15px]">
                  <th className="py-5 w-[80px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div></th>
                  <th className="py-5 px-2 font-bold text-center w-[150px]">그룹코드 ID</th>
                  <th className="py-5 px-2 font-bold text-center w-[150px]">그룹코드명</th>
                  <th className="py-5 px-2 font-bold text-center w-[150px]">상세코드 ID</th>
                  <th className="py-5 px-2 font-bold text-center w-[150px]">상세코드명</th>
                  <th className="py-5 px-4 font-bold text-center">코드 설명</th>
                  <th className="py-5 px-2 font-bold text-center w-[110px]">등록 일시</th>
                  <th className="py-5 px-2 font-bold text-center w-[70px]">순서</th>
                  <th className="py-5 px-4 font-bold text-center w-[100px]">노출 여부</th>
                  <th className="py-5 px-4 font-bold text-center w-[90px]">상세</th>
                </tr>
              </thead>
              <tbody className="text-[14px] font-medium text-[#4B5563]">
                {currentData.length > 0 ? (
                  currentData.map((code) => {
                    const isSelected = selectedIds.includes(code.id);
                    return (
                      <tr key={code.id} className={`border-b border-gray-100 last:border-0 transition-colors ${isSelected ? 'bg-[#F0F7FF]' : 'hover:bg-gray-50/50'}`}>
                        <td className="py-5 text-center"><div className="flex justify-center"><CustomCheckbox checked={isSelected} onChange={() => handleSelectOne(code.id)} /></div></td>
                        <td className="py-5 px-2 text-center truncate">{code.groupCode}</td>
                        <td className="py-5 px-2 text-center truncate">{code.groupName}</td>
                        <td className={`py-5 px-2 text-center truncate ${code.subCode === '-' ? 'text-gray-300' : ''}`}>{code.subCode}</td>
                        <td className={`py-5 px-2 text-center truncate ${code.subCode === '-' ? 'text-gray-300' : ''}`}>{code.subName}</td>
                        <td className="py-5 px-4 text-left"><div className="line-clamp-1 break-all" title={code.desc}>{code.desc}</div></td>
                        <td className="py-5 px-2 text-center text-gray-400 text-[12px] leading-tight whitespace-pre-line">{code.date.replace(' ', '\n')}</td>
                        <td className="py-5 px-2 text-center">{code.order}</td>
                        <td className="py-5 px-4">
                          <div className="flex justify-center">
                            <button onClick={() => handleToggleVisible(code.id)} className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-all duration-300 ${code.visible ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${code.visible ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex justify-center">
                            <button onClick={() => handleViewDetail(code)} className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95">보기</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="py-32 text-center">
                      {/* [개선] 일관성을 지킨 검색 결과 없음 UI */}
                      <div className="inline-flex flex-col items-center">
                        <div className="mb-4 text-gray-200">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <p className="text-[#111] text-[18px] font-bold mb-1">검색 결과가 없습니다.</p>
                        <p className="text-gray-400 text-[14px] mb-8">입력하신 검색어와 일치하는 코드가 존재하지 않습니다.</p>
                        {/* 결과 없을 때의 초기화 버튼: 기존 블루 버튼 스타일 적용 */}
                        <button onClick={handleClearSearch} className="px-8 py-3 bg-[#2563EB] text-white rounded-md text-[14px] font-bold hover:bg-[#1D4ED8] transition-all shadow-md active:scale-95">검색 초기화</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* [사용자 요청] 일관성을 지킨 하단 검색 초기화 버튼 */}
          {isFiltered && currentData.length > 0 && (
            <div className="flex justify-center mb-10">
              <button 
                onClick={handleClearSearch} 
                className="px-10 py-3.5 bg-white border border-gray-300 rounded-md text-[16px] font-bold text-[#666] hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm active:scale-95"
              >
                검색 초기화
              </button>
            </div>
          )}

          {/* 페이지네이션 (기존 스타일 유지) */}
          <div className="py-14 flex justify-center items-center gap-3">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-5 py-2 text-[15px] font-bold ${currentPage === 1 ? 'text-gray-200' : 'text-[#999] hover:text-[#333]'}`}>〈 이전</button>
            <div className="flex items-center gap-2">
              {pageNumbers.map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-[15px] font-bold transition-all ${num === currentPage ? 'bg-[#003366] text-white shadow-md' : 'text-[#666] hover:bg-gray-100'}`}>{num}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`px-5 py-2 text-[15px] font-bold ${currentPage === totalPages || totalPages === 0 ? 'text-gray-200' : 'text-[#999] hover:text-[#333]'}`}>다음 〉</button>
          </div>
        </section>
      </main>

      <AdminCodeConfirmModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={modalConfig.onConfirm}
        title={modalConfig.title} message={modalConfig.message} type={modalConfig.type}
      />
    </div>
  );
};

export default AdminCommonCodeList;