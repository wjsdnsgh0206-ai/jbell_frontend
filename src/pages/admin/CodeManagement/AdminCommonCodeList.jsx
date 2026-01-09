import React, { useState, useMemo } from 'react';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { AdminCommonCodeData } from './AdminCommonCodeData';

const AdminCommonCodeList = () => {
  // 상태 관리
  const [codes, setCodes] = useState(AdminCommonCodeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 (X 버튼용)
  const itemsPerPage = 10;

  // --- 페이지네이션 로직 ---
  const totalPages = Math.ceil(codes.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return codes.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, codes]);

  // 핸들러들
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(codes.map(code => code.id));
    } else {
      setSelectedIds([]);
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

  const handleClearSearch = () => {
    setSearchTerm(""); // 검색어 초기화 기능 복구
  };

  const handleViewDetail = (id) => {
    console.log(`${id}번 상세 페이지 이동`);
  };

  // 컴포넌트 내부 UI 요소들
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
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  return (
    // 최상단에 Pretendard GOV 서체 강제 적용
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8F9FB] font-['Pretendard_GOV'] antialiased text-[#111]">
      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-[32px] font-bold mt-2 mb-10">공통코드관리</h2>

        {/* 검색 영역: 선택 박스 2개 + 검색창(X버튼 복구) */}
        <section className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 mb-10">
          <div className="relative w-72">
            <select className="appearance-none w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white focus:border-[#2563EB] font-['Pretendard_GOV']">
              <option>그룹코드 전체</option>
            </select>
            <CustomArrow />
          </div>
          <div className="relative w-72">
            <select className="appearance-none w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] text-[#666] outline-none bg-white focus:border-[#2563EB] font-['Pretendard_GOV']">
              <option>상세코드 전체</option>
            </select>
            <CustomArrow />
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력해주세요" 
              className="w-full border border-gray-300 rounded-md px-5 py-3.5 text-[16px] outline-none font-medium focus:border-[#2563EB] font-['Pretendard_GOV']" 
            />
            {/* X 버튼 및 기능 완벽 복구 */}
            {searchTerm && (
              <button 
                type="button"
                onClick={handleClearSearch} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xl transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <button className="bg-[#EBF3FF] border border-[#BFDBFE] text-[#2563EB] px-14 py-3.5 rounded-md text-[16px] font-bold shadow-sm hover:bg-[#D6E6FF] transition-all font-['Pretendard_GOV']">
            검색
          </button>
        </section>

        {/* 리스트 영역: 헤더 진하게 + td 구분선 연하게 + 폰트 통일 */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden font-['Pretendard_GOV']">
          <div className="px-8 py-6 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center gap-4">
              <CustomCheckbox checked={selectedIds.length === codes.length && codes.length > 0} onChange={handleSelectAll} />
              <span className="font-bold text-[16px]">
                {selectedIds.length === codes.length && codes.length > 0 ? '전체 선택됨' : `${selectedIds.length}개 선택됨`}
              </span>
            </div>
            <button className="bg-[#FF003E] text-white px-12 py-3.5 rounded-md text-[16px] font-bold shadow-sm hover:bg-[#D90035] transition-all font-['Pretendard_GOV']">삭제</button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              {/* 헤더 배경색 강화 (#F2F4F7) */}
              <tr className="bg-[#F2F4F7] border-b border-gray-200 text-[#333] text-[15px]">
                <th className="py-5 px-8 w-20 text-center">
                  <CustomCheckbox checked={selectedIds.length === codes.length && codes.length > 0} onChange={handleSelectAll} />
                </th>
                <th className="py-5 px-2 font-bold text-center">그룹코드</th>
                <th className="py-5 px-2 font-bold text-center">그룹코드명</th>
                <th className="py-5 px-2 font-bold text-center">상세코드</th>
                <th className="py-5 px-2 font-bold text-center">상세코드명</th>
                <th className="py-5 px-6 font-bold text-left w-[25%]">코드설명</th>
                <th className="py-5 px-2 font-bold text-center">등록 일시</th>
                <th className="py-5 px-2 font-bold text-center">순서</th>
                <th className="py-5 px-2 font-bold text-center">노출</th>
                <th className="py-5 px-8 font-bold text-center">상세</th>
              </tr>
            </thead>
            <tbody className="text-[15px]">
              {currentData.map((code) => (
                /* 행 구분선 연하게 (#F2F4F7) 적용 */
                <tr key={code.id} className={`border-b border-[#F2F4F7] transition-colors ${selectedIds.includes(code.id) ? 'bg-[#F0F7FF]' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-5 px-8 text-center"><CustomCheckbox checked={selectedIds.includes(code.id)} onChange={() => handleSelectOne(code.id)} /></td>
                  {/* 모든 td 폰트 색상/크기/굵기 통일 */}
                  <td className="py-5 px-2 text-center text-[#4B5563] font-medium">{code.groupCode}</td>
                  <td className="py-5 px-2 text-center text-[#4B5563] font-medium">{code.groupName}</td>
                  <td className="py-5 px-2 text-center text-[#4B5563] font-medium">{code.detailCode}</td>
                  <td className="py-5 px-2 text-center text-[#4B5563] font-medium">{code.detailName}</td>
                  <td className="py-5 px-6 text-left text-[#4B5563] font-medium leading-relaxed">{code.desc}</td>
                  <td className="py-5 px-2 text-center text-[#6B7280] font-medium whitespace-nowrap">{code.date}</td>
                  <td className="py-5 px-2 text-center text-[#4B5563] font-medium">{code.order}</td>
                  <td className="py-5 px-2 text-center">
                    <button 
                      onClick={() => handleToggleVisible(code.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer mx-auto transition-all duration-300 ${code.visible ? 'bg-[#2563EB]' : 'bg-[#D1D5DB]'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${code.visible ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <button 
                      onClick={() => handleViewDetail(code.id)}
                      className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[14px] font-bold bg-white hover:bg-gray-50 transition-all font-['Pretendard_GOV']"
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="py-14 flex justify-center items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 text-[15px] font-bold font-['Pretendard_GOV'] ${currentPage === 1 ? 'text-gray-200' : 'text-[#999] hover:text-[#111]'}`}
            >
              〈 이전
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button 
                  key={num} 
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-lg text-[15px] font-bold font-['Pretendard_GOV'] ${
                    currentPage === num ? 'bg-[#003366] text-white' : 'text-[#666] hover:bg-gray-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 text-[15px] font-bold font-['Pretendard_GOV'] ${currentPage === totalPages ? 'text-gray-200' : 'text-[#999] hover:text-[#111]'}`}
            >
              다음 〉
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCommonCodeList;