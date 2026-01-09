import React, { useState, useMemo } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';

const AdminCommonCodeList = () => {
  // --- 1. 상태 관리 ---
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); 
  const [appliedSearch, setAppliedSearch] = useState(""); 
  const itemsPerPage = 10;

  // --- 2. 데이터 필터링 및 페이징 (검색 버튼 클릭 시에만 반영) ---
  const filteredData = useMemo(() => {
    return codes.filter(code => 
      code.groupName.includes(appliedSearch) || 
      code.detailName.includes(appliedSearch) ||
      code.groupCode.includes(appliedSearch)
    );
  }, [codes, appliedSearch]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- 3. 핸들러 ---
  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));

  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    } else {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleVisible = (id) => {
    setCodes(prev => prev.map(code => 
      code.id === id ? { ...code, visible: !code.visible } : code
    ));
  };

  const handleViewDetail = (id) => {
    // [기억된 정보] 상세 페이지 이동
    console.log(`${id}번 상세 페이지 이동`);
  };

  // --- 4. 공통 UI 컴포넌트 ---
  const CustomCheckbox = ({ checked, onChange }) => (
    <label className="relative flex items-center justify-center cursor-pointer select-none">
      <input type="checkbox" className="absolute opacity-0 w-0 h-0" checked={checked} onChange={onChange} />
      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-gray-300'}`}>
        {checked && (
          <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        )}
      </div>
    </label>
  );

  const CustomArrow = () => (
    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );

  const cardStyle = "bg-white border border-gray-200 rounded-xl shadow-sm";
  const focusInputStyle = "focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:shadow-sm transition-all";

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10 tracking-tight">공통코드관리</h2>

        {/* 상단 검색 영역: 포커스 효과 적용 */}
        <section className={`${cardStyle} p-8 flex items-center gap-4 mb-8`}>
          <div className="relative w-72">
            <select className={`appearance-none w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white font-['Pretendard_GOV'] ${focusInputStyle}`}>
              <option>그룹코드 전체</option>
            </select>
            <CustomArrow />
          </div>
          <div className="relative w-72">
            <select className={`appearance-none w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white font-['Pretendard_GOV'] ${focusInputStyle}`}>
              <option>상세코드 전체</option>
            </select>
            <CustomArrow />
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="검색어를 입력해주세요" 
              className={`w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] outline-none font-medium font-['Pretendard_GOV'] ${focusInputStyle}`} 
            />
            {searchInput && (
              <button type="button" onClick={handleClearSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xl font-light">✕</button>
            )}
          </div>
          <button onClick={handleSearch} className="bg-[#EBF3FF] border border-[#BFDBFE] text-[#2563EB] px-14 py-3.5 rounded-md text-[16px] font-bold hover:bg-[#D6E6FF] transition-all">검색</button>
        </section>

        {/* 리스트 영역 */}
        <section className={`${cardStyle} p-8`}>
          
          {/* 상단 컨트롤바: 하단 정렬 최적화 */}
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center">
              <div className="w-[80px] flex justify-center">
                <CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} />
              </div>
              <span className="font-medium text-[16px] text-[#4B5563] leading-[1.2]">
                {isAllSelectedOnPage && currentData.length > 0
                  ? `${currentData.length}개 전체 선택됨` 
                  : `${selectedIds.length}개 선택됨`}
              </span>
            </div>
            <button className="bg-[#FF003E] text-white px-12 py-3.5 rounded-md text-[16px] font-bold hover:bg-[#D90035] transition-all leading-none">
              삭제
            </button>
          </div>

          {/* 테이블 영역: 헤더 중앙 정렬 및 행 선택 효과 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F2F4F7] border-b border-gray-200 text-[#333] text-[15px]">
                  <th className="py-5 w-[80px] text-center">
                    <div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div>
                  </th>
                  <th className="py-5 px-2 font-bold text-center">그룹코드</th>
                  <th className="py-5 px-2 font-bold text-center">그룹코드명</th>
                  <th className="py-5 px-2 font-bold text-center">상세코드</th>
                  <th className="py-5 px-2 font-bold text-center">상세코드명</th>
                  <th className="py-5 px-6 font-bold text-center w-[25%]">코드설명</th>
                  <th className="py-5 px-2 font-bold text-center">등록 일시</th>
                  <th className="py-5 px-2 font-bold text-center">순서</th>
                  <th className="py-5 px-2 font-bold text-center">노출</th>
                  <th className="py-5 px-8 font-bold text-center">상세</th>
                </tr>
              </thead>
              <tbody className="text-[15px] font-medium text-[#4B5563]">
                {currentData.map((code) => {
                  const isSelected = selectedIds.includes(code.id);
                  return (
                    <tr 
                      key={code.id} 
                      className={`border-b border-gray-100 last:border-0 transition-colors ${isSelected ? 'bg-[#F0F7FF]' : 'hover:bg-gray-50/50'}`}
                    >
                      <td className="py-5 w-[80px] text-center">
                        <div className="flex justify-center"><CustomCheckbox checked={isSelected} onChange={() => handleSelectOne(code.id)} /></div>
                      </td>
                      <td className="py-5 px-2 text-center">{code.groupCode}</td>
                      <td className="py-5 px-2 text-center">{code.groupName}</td>
                      <td className="py-5 px-2 text-center">{code.detailCode}</td>
                      <td className="py-5 px-2 text-center">{code.detailName}</td>
                      <td className="py-5 px-6 text-left leading-relaxed">{code.desc}</td>
                      <td className="py-5 px-2 text-center">{code.date}</td>
                      <td className="py-5 px-2 text-center">{code.order}</td>
                      <td className="py-5 px-2 text-center">
                        <button 
                          onClick={() => handleToggleVisible(code.id)}
                          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer mx-auto transition-all duration-300 ${code.visible ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${code.visible ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <button onClick={() => handleViewDetail(code.id)} className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[14px] font-bold bg-white hover:bg-gray-50 transition-all">보기</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="py-14 flex justify-center items-center gap-3">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-5 py-2 text-[15px] font-bold ${currentPage === 1 ? 'text-gray-200 cursor-default' : 'text-[#999] hover:text-[#111]'}`}>〈 이전</button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-[15px] font-bold transition-all ${num === currentPage ? 'bg-[#003366] text-white shadow-md' : 'text-[#666] hover:bg-gray-100'}`}>{num}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-5 py-2 text-[15px] font-bold ${currentPage === totalPages ? 'text-gray-200 cursor-default' : 'text-[#999] hover:text-[#111]'}`}>다음 〉</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCommonCodeList;