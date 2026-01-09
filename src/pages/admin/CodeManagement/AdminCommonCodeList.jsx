// src/pages/admin/CodeManagement/AdminCommonCodeList.jsx
import React, { useState, useMemo } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';
import { Button } from '@/components/shared/Button';

const AdminCommonCodeList = () => {
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState(""); 

  const [selectedGroup, setSelectedGroup] = useState("그룹코드 전체");
  const [selectedDetail, setSelectedDetail] = useState("상세코드 전체");

  const itemsPerPage = 10;

  // 필터링 로직 (유지)
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

  const handleSearch = () => { setAppliedSearch(searchInput); setCurrentPage(1); };
  const handleClearSearch = () => { setSearchInput(""); setAppliedSearch(""); setCurrentPage(1); };
  
  // 전체 선택 여부 확인 로직
  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));
  
  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    else setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
  };
  
  const handleSelectOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  const handleToggleVisible = (id) => setCodes(prev => prev.map(code => code.id === id ? { ...code, visible: !code.visible } : code));
  
  // [기억된 정보] 상세 페이지 이동
  const handleViewDetail = (id) => console.log(`${id}번 상세 페이지 이동`);

  const CustomCheckbox = ({ checked, onChange }) => (
    <label className="relative flex items-center justify-center cursor-pointer select-none">
      <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={checked} onChange={onChange} />
      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-300'}`}>
        {checked && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
      </div>
    </label>
  );

  const CustomArrow = () => (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">공통코드관리</h2>

        {/* 상단 검색 영역 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex items-center gap-4 mb-8">
          <div className="relative w-72">
            <select value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }} className="appearance-none w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white">
              <option value="그룹코드 전체">그룹코드 전체</option>
              {Array.from(new Map(codes.map(c => [c.groupCode, c.groupName]))).map(([code, name]) => (
                <option key={code} value={code}>{`${code}(${name})`}</option>
              ))}
            </select>
            <CustomArrow />
          </div>
          <div className="relative w-72">
            <select value={selectedDetail} onChange={(e) => { setSelectedDetail(e.target.value); setCurrentPage(1); }} className="appearance-none w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white">
              <option value="상세코드 전체">상세코드 전체</option>
              {Array.from(new Map(codes.map(c => [c.detailCode, c.detailName]))).map(([code, name]) => (
                <option key={code} value={code}>{`${code}(${name})`}</option>
              ))}
            </select>
            <CustomArrow />
          </div>
          <div className="flex-1 relative">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="검색어를 입력해주세요" className="w-full border border-gray-300 focus:border-[#2563EB] rounded-md px-5 py-3.5 text-[16px] outline-none font-medium" />
            {searchInput && <button type="button" onClick={handleClearSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xl font-light">✕</button>}
          </div>
          {/* 검색 버튼 */}
          <Button variant="none" size="none" onClick={handleSearch} className="px-8 h-14 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 font-bold rounded-md transition-all">검색</Button>
        </section>

        {/* 리스트 영역 */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center">
              <div className="w-[80px] flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div>
              {/* [수정] 전체 선택 시 문구 변경 로직 적용 */}
              <span className="font-medium text-[16px] text-[#4B5563]">
                {selectedIds.length > 0 && isAllSelectedOnPage 
                  ? `${selectedIds.length}개 전체 선택됨` 
                  : `${selectedIds.length}개 선택됨`}
              </span>
            </div>
            {/* 삭제 버튼: 검색 버튼과 동일한 너비(px-8) 및 높이(h-14) 적용 */}
            <button className="px-8 h-14 bg-[#FF003E] text-white rounded-md text-[16px] font-bold hover:bg-[#D90035] transition-all shadow-sm">
              삭제
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F2F4F7] border-b border-gray-200 text-[#333] text-[15px]">
                  <th className="py-5 w-[80px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div></th>
                  <th className="py-5 px-2 font-bold text-center">그룹코드</th>
                  <th className="py-5 px-2 font-bold text-center">그룹코드명</th>
                  <th className="py-5 px-2 font-bold text-center">상세코드</th>
                  <th className="py-5 px-2 font-bold text-center">상세코드명</th>
                  <th className="py-5 px-6 font-bold text-center w-[25%]">코드설명</th>
                  <th className="py-5 px-2 font-bold text-center">등록 일시</th>
                  <th className="py-5 px-2 font-bold text-center">순서</th>
                  {/* 중앙 정렬 유지 */}
                  <th className="py-5 px-4 font-bold text-center w-[120px]">등록 여부</th>
                  <th className="py-5 px-4 font-bold text-center w-[120px]">상세</th>
                </tr>
              </thead>
              <tbody className="text-[15px] font-medium text-[#4B5563]">
                {currentData.length > 0 ? (
                  currentData.map((code) => {
                    const isSelected = selectedIds.includes(code.id);
                    return (
                      <tr key={code.id} className={`border-b border-gray-100 last:border-0 transition-colors ${isSelected ? 'bg-[#F0F7FF]' : 'hover:bg-gray-50/50'}`}>
                        <td className="py-5 w-[80px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isSelected} onChange={() => handleSelectOne(code.id)} /></div></td>
                        <td className="py-5 px-2 text-center">{code.groupCode}</td>
                        <td className="py-5 px-2 text-center">{code.groupName}</td>
                        <td className="py-5 px-2 text-center">{code.detailCode}</td>
                        <td className="py-5 px-2 text-center">{code.detailName}</td>
                        <td className="py-5 px-6 text-left leading-relaxed">{code.desc}</td>
                        <td className="py-5 px-2 text-center">{code.date}</td>
                        <td className="py-5 px-2 text-center">{code.order}</td>
                        <td className="py-5 px-4">
                          <div className="flex justify-center">
                            <button onClick={() => handleToggleVisible(code.id)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${code.visible ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${code.visible ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex justify-center">
                            <button onClick={() => handleViewDetail(code.id)} className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[14px] font-bold bg-white hover:bg-gray-50 transition-all">보기</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="10" className="py-20 text-center text-gray-400">데이터가 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="py-14 flex justify-center items-center gap-3">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-5 py-2 text-[15px] font-bold ${currentPage === 1 ? 'text-gray-200 cursor-default' : 'text-[#999]'}`}>〈 이전</button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-[15px] font-bold transition-all ${num === currentPage ? 'bg-[#003366] text-white shadow-md' : 'text-[#666]'}`}>{num}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-5 py-2 text-[15px] font-bold ${currentPage === totalPages ? 'text-gray-200 cursor-default' : 'text-[#999]'}`}>다음 〉</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCommonCodeList;