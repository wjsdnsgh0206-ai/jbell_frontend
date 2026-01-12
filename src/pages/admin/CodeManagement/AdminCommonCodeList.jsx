// src/pages/admin/CodeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import { Button } from '@/components/shared/Button';
import { Search, RotateCcw, X, ChevronDown } from 'lucide-react';

const AdminCommonCodeList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState(""); 
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [selectedGroup, setSelectedGroup] = useState("그룹코드 전체");
  const [selectedDetail, setSelectedDetail] = useState("상세코드 전체");

  const itemsPerPage = 10;

  // 2. 데이터 처리
  const groupOptions = useMemo(() => {
    return Array.from(new Map(AdminCommonCodeData.map(c => [c.groupCode, c.groupName])));
  }, []);

  const detailOptions = useMemo(() => {
    const filteredBase = selectedGroup === "그룹코드 전체" 
      ? AdminCommonCodeData 
      : AdminCommonCodeData.filter(c => c.groupCode === selectedGroup);
    return Array.from(new Map(filteredBase.map(c => [c.detailCode, c.detailName])));
  }, [selectedGroup]);

  const filteredData = useMemo(() => {
    return codes.filter(code => {
      const isGroupMatch = selectedGroup === "그룹코드 전체" || code.groupCode === selectedGroup;
      const isDetailMatch = selectedDetail === "상세코드 전체" || code.detailCode === selectedDetail;
      const isSearchMatch = !appliedSearch || 
        code.groupName.includes(appliedSearch) || 
        code.detailName.includes(appliedSearch) ||
        code.groupCode.includes(appliedSearch) ||
        (code.desc && code.desc.includes(appliedSearch));
      return isGroupMatch && isDetailMatch && isSearchMatch;
    });
  }, [codes, appliedSearch, selectedGroup, selectedDetail]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 3. 핸들러 함수
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  const handleSearch = () => { setAppliedSearch(searchInput); setCurrentPage(1); };
  const handleClearSearch = () => { setSearchInput(""); setAppliedSearch(""); setCurrentPage(1); };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return alert("삭제할 항목을 선택해주세요.");
    if (window.confirm(`선택한 ${selectedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      setCodes(prev => prev.filter(code => !selectedIds.includes(code.id)));
      setSelectedIds([]);
      showToast("삭제되었습니다.");
    }
  };

  const handleToggleVisible = (id) => {
    setCodes(prev => prev.map(code => code.id === id ? { ...code, visible: !code.visible } : code));
    showToast("상태가 변경되었습니다.");
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
        <BreadCrumb />
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">공통코드관리</h2>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 flex items-center gap-4 mb-8">
          <div className="flex flex-1 gap-4">
            <div className="relative w-72">
              <select 
                value={selectedGroup} 
                onChange={(e) => { setSelectedGroup(e.target.value); setSelectedDetail("상세코드 전체"); setCurrentPage(1); }}
                className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-body-m-bold outline-none focus:border-admin-primary bg-white text-admin-text-primary"
              >
                <option value="그룹코드 전체">그룹코드 전체</option>
                {groupOptions.map(([code, name]) => <option key={code} value={code}>{`${code}(${name})`}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-72">
              <select 
                value={selectedDetail} 
                onChange={(e) => { setSelectedDetail(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-body-m-bold outline-none focus:border-admin-primary bg-white text-admin-text-primary"
              >
                <option value="상세코드 전체">상세코드 전체</option>
                {detailOptions.map(([code, name]) => <option key={code} value={code}>{`${code}(${name})`}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="flex-1 relative">
              <input 
                type="text" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="검색어를 입력해주세요" 
                className="w-full border border-admin-border rounded-md px-5 h-14 text-body-m outline-none font-medium focus:border-admin-primary bg-white text-admin-text-primary"
              />
              {searchInput && (
                <button onClick={handleClearSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-graygray-40 hover:text-graygray-60 transition-colors">
                  <X size={20} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
          <button onClick={handleSearch} className="px-8 h-14 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-bold rounded-md transition-all active:scale-98 text-body-m-bold">검색</button>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <CustomCheckbox 
                checked={currentData.length > 0 && currentData.every(i => selectedIds.includes(i.id))} 
                onChange={(e) => {
                  const pIds = currentData.map(i => i.id);
                  if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...pIds])));
                  else setSelectedIds(prev => prev.filter(id => !pIds.includes(id)));
                }} 
              />
              <span className="text-body-m-bold text-admin-text-secondary">
                {selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `전체 ${filteredData.length}건`}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDeleteSelected} className="px-8 h-14 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-98 transition-all text-body-m-bold">삭제</button>
              <button onClick={() => navigate('/admin/system/groupCodeAdd')} className="px-8 h-14 bg-admin-primary text-white rounded-md font-bold hover:bg-admin-primaryHover active:scale-98 transition-all text-body-m-bold">신규 등록</button>
            </div>
          </div>

          <div className="border border-admin-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-graygray-10 border-b border-admin-border text-admin-text-primary text-body-m-bold">
                  <th className="py-5 w-[80px] text-center">선택</th>
                  <th className="py-5 px-2 text-center">그룹코드</th>
                  <th className="py-5 px-2 text-center">그룹명</th>
                  <th className="py-5 px-2 text-center">상세코드</th>
                  <th className="py-5 px-2 text-center">상세명</th>
                  <th className="py-5 px-6 text-center">코드설명</th>
                  <th className="py-5 px-2 text-center">등록일시</th>
                  <th className="py-5 px-4 text-center">등록여부</th>
                  <th className="py-5 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="text-body-m text-graygray-60">
                {currentData.map((code) => (
                  <tr key={code.id} className="border-b border-graygray-5 last:border-0 hover:bg-graygray-5/50 transition-colors">
                    <td className="py-5 text-center"><div className="flex justify-center"><CustomCheckbox checked={selectedIds.includes(code.id)} onChange={() => setSelectedIds(prev => prev.includes(code.id) ? prev.filter(i => i !== code.id) : [...prev, code.id])} /></div></td>
                    <td className="py-5 text-center text-admin-text-secondary font-mono text-body-m">{code.groupCode}</td>
                    <td className="py-5 text-center">{code.groupName}</td>
                    <td className="py-5 text-center text-admin-text-secondary font-mono text-body-m">{code.detailCode}</td>
                    <td className="py-5 text-center font-bold text-admin-text-primary">{code.detailName}</td>
                    <td className="py-5 px-6 text-left truncate max-w-[200px]">{code.desc}</td>
                    <td className="py-5 text-center text-graygray-50 text-body-m">{code.date}</td>
                    <td className="py-5 text-center">
                      <div className="flex justify-center">
                        <button onClick={() => handleToggleVisible(code.id)} className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${code.visible ? 'bg-admin-primary' : 'bg-graygray-30'}`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${code.visible ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </td>
                    <td className="py-5 text-center">
                      <button onClick={() => navigate(`/admin/system/commonCodeDetail/${code.id}`)} className="border border-admin-border rounded px-4 py-1.5 text-body-m-bold text-admin-text-secondary hover:bg-graygray-10 transition-colors">보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* [개선된 페이지네이션 영역] */}
          <div className="py-14 flex justify-center items-center gap-3">
            {/* 이전 버튼 */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className={`px-5 py-2 text-body-m-bold transition-all ${
                currentPage === 1 
                ? 'text-graygray-30 cursor-default' 
                : 'text-graygray-50 hover:text-admin-primary'
              }`}
            >
              〈 이전
            </button>

            {/* 페이지 번호 */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button 
                  key={num} 
                  onClick={() => setCurrentPage(num)} 
                  className={`w-10 h-10 rounded-lg text-body-m-bold transition-all ${
                    num === currentPage 
                    ? 'bg-secondary-50 text-white shadow-md' 
                    : 'text-graygray-50 hover:bg-graygray-10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className={`px-5 py-2 text-body-m-bold transition-all ${
                currentPage === totalPages 
                ? 'text-graygray-30 cursor-default' 
                : 'text-graygray-50 hover:text-admin-primary'
              }`}
            >
              다음 〉
            </button>
          </div>
        </section>
      </main>

      {toast.visible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] bg-graygray-90 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-blue-500/30">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-body-m font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminCommonCodeList;