import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { pressData as initialData } from '@/pages/user/openboards/BoardData';
import AdminCodeConfirmModal from '../CodeManagement/AdminCodeConfirmModal';
import { X, ChevronDown, RotateCcw, Calendar, Paperclip, Search } from 'lucide-react';

// 보도자료 관리자 목록페이지 //

// 토스트용 성공 아이콘
const SuccessIcon = ({ fill = "#4ADE80" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill={fill}/>
    <path d="M11 6L7 10L5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AdminPressRelList = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [pressList, setPressList] = useState(initialData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchInput, setSearchInput] = useState(""); 
  const [selectedPublicStatus, setSelectedPublicStatus] = useState("전체");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchType, setSearchType] = useState("전체");

  // 토스트 알림 상태
  const [toast, setToast] = useState({ show: false, message: "" });

  const [appliedFilters, setAppliedFilters] = useState({
    keyword: "",
    status: "전체",
    start: "",
    end: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'confirm', onConfirm: () => {} });

  const itemsPerPage = 10;

  // 토스트 표시 함수
  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  // 2. 검색 실행 및 초기화 함수
  const handleSearch = () => {
    setAppliedFilters({
      keyword: searchInput,
      status: selectedPublicStatus,
      start: startDate,
      end: endDate
    });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSelectedPublicStatus("전체");
    setStartDate("");
    setEndDate("");
    setSearchType("전체"); 
    setAppliedFilters({
      keyword: "",
      status: "전체",
      start: "",
      end: ""
    });
    setCurrentPage(1);
  };

  // 3. 핵심 필터 로직
  const filteredData = useMemo(() => {
    const { keyword, status, start, end } = appliedFilters;
    const searchTerm = keyword.trim().toLowerCase();
    const pureSearchTerm = searchTerm.replace(/\s+/g, "");

    return pressList.filter(item => {
      const isPublicMatch = 
        status === "전체" || 
        (status === "노출" && item.isPublic === true) ||
        (status === "비노출" && item.isPublic === false);

      let targetString = "";
      if (searchType === "제목") {
        targetString = item.title;
      } else if (searchType === "출처") {
        targetString = item.source;
      } else {
        targetString = [item.title, item.mgmtId, item.source, item.author].join("|");
      }
      
      const pureTarget = targetString.toLowerCase().replace(/\s+/g, "");
      let isKeywordMatch = true;
      if (pureSearchTerm) {
        const simpleInclude = pureTarget.includes(pureSearchTerm);
        let fuzzyMatch = false;
        const chars = pureSearchTerm.split("");
        let charIndex = 0;
        for (const char of pureTarget) {
          if (char === chars[charIndex]) charIndex++;
          if (charIndex === chars.length) {
            fuzzyMatch = true;
            break;
          }
        }
        isKeywordMatch = simpleInclude || fuzzyMatch;
      }

      let isDateMatch = true;
      if (start || end) {
        const rawDate = item.date || (item.createdAt ? item.createdAt.split(' ')[0] : "");
        const itemDate = rawDate.replaceAll('.', '-'); 
        if (start && end) isDateMatch = itemDate >= start && itemDate <= end;
        else if (start) isDateMatch = itemDate >= start;
        else if (end) isDateMatch = itemDate <= end;
      }

      return isPublicMatch && isKeywordMatch && isDateMatch;
    }).sort((a, b) => b.id - a.id);
  }, [pressList, appliedFilters, searchType]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 4. 선택 관련 함수
  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));
  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    else setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
  };

  const getAllSelectedTitles = () => {
    return pressList
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.title)
      .join(", ");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }
    const allTitles = getAllSelectedTitles(); // 👈 여기서 전체 제목 가져오기
    setModalConfig({
      title: '보도자료 삭제',
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-red-600 font-bold">[{allTitles}]</span></p>
          <p>항목을 정말 삭제하시겠습니까?</p>
          <p className="text-body-s text-graygray-50 mt-2">* 삭제된 데이터는 복구할 수 없습니다.</p>
        </div>
      ),
      type: 'delete',
      onConfirm: () => {
        setPressList(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setIsModalOpen(false);
        triggerToast("정상적으로 삭제되었습니다."); //  토스트 추가
      }
    });
    setIsModalOpen(true);
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) {
      alert("변경할 항목을 선택해주세요.");
      return;
    }
    const allTitles = getAllSelectedTitles(); //  여기서 전체 제목 가져오기
    const statusText = status ? '노출' : '비노출';
    setModalConfig({
      title: `일괄 ${statusText} 처리`,
      message: (
        <div className="flex flex-col gap-2 text-left">
          <p>선택하신 <span className="text-admin-primary font-bold">[{allTitles}]</span> 항목을</p>
          <p>일괄 <span className="font-bold underline">{statusText}</span> 처리하시겠습니까?</p>
        </div>
      ),
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setPressList(prev => prev.map(item => 
          selectedIds.includes(item.id) ? { ...item, isPublic: status } : item
        ));
        setSelectedIds([]);
        setIsModalOpen(false);
        triggerToast(`정상적으로 ${statusText} 처리되었습니다.`); //  토스트 추가
      }
    });
    setIsModalOpen(true);
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
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90 relative">
      
      {/* 정상 처리 알림 토스트 */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000]">
          <div className="bg-[#111] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <SuccessIcon />
            <span className="font-bold text-[16px]">{toast.message}</span>
          </div>
        </div>
      )}

      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight text-left">보도자료 목록</h2>
  
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 flex items-center gap-3 mb-8 text-left">
          <div className="flex flex-1 gap-3">
            <div className="relative w-44 shrink-0">
              <select 
                value={selectedPublicStatus} 
                onChange={(e) => { 
                  const newStatus = e.target.value;
                  setSelectedPublicStatus(newStatus); 
                  setAppliedFilters(prev => ({ ...prev, status: newStatus }));
                  setCurrentPage(1); 
                }} 
                className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-[15px] outline-none bg-white focus:border-admin-primary transition-all cursor-pointer"
              >
                <option value="전체">노출여부 전체</option>
                <option value="노출">노출</option>
                <option value="비노출">비노출</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="relative w-40 shrink-0">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full appearance-none border border-admin-border rounded-md px-5 h-14 text-[15px] outline-none bg-white focus:border-admin-primary transition-all cursor-pointer"
              >
                <option value="전체">전체검색</option>
                <option value="제목">제목</option>
                <option value="출처">출처</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-graygray-40 pointer-events-none" size={18} />
            </div>

            <div className="flex-1 relative min-w-[200px]">
              <input 
                type="text" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                placeholder="검색어를 입력해주세요"
                className="w-full border border-admin-border rounded-md px-5 h-14 text-[15px] outline-none bg-white focus:border-admin-primary transition-all" 
              />
              {searchInput && (
                <button onClick={() => setSearchInput("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-graygray-40">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="flex items-center border border-admin-border rounded-md px-4 h-14 bg-white focus-within:border-admin-primary transition-all shrink-0">
              <div className="flex items-center">
                <div className="relative group w-[115px]">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="outline-none text-[14px] bg-transparent cursor-pointer text-graygray-60 w-full custom-date-input" />
                  <Calendar size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-graygray-30 pointer-events-none group-hover:text-admin-primary transition-colors" />
                </div>
                <span className="text-graygray-30 mx-2">-</span>
                <div className="relative group w-[115px]">
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="outline-none text-[14px] bg-transparent cursor-pointer text-graygray-60 w-full custom-date-input" />
                  <Calendar size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-graygray-30 pointer-events-none group-hover:text-admin-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button onClick={handleSearch} className="px-8 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 active:scale-95 text-[15px] shadow-sm">검색</button>
            <button onClick={handleClearSearch} className="px-6 h-14 bg-white text-graygray-50 border border-admin-border font-bold rounded-md hover:bg-gray-50 active:scale-95 flex items-center gap-2 text-[15px] shadow-sm">
              <RotateCcw size={18} />초기화
            </button>
          </div>
          <style>{`.custom-date-input::-webkit-calendar-picker-indicator { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; color: transparent; cursor: pointer; z-index: 5; }`}</style>
        </section>

        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} />
              <span className="text-body-m-bold text-admin-text-secondary">{selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `전체 ${filteredData.length}건`}</span>
              <div className="flex items-center ml-4 gap-4">
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
              <button 
                onClick={() => navigate('/admin/content/pressRelAdd')} 
                className="px-6 h-12 bg-admin-primary text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                등록
              </button>
              <button 
                onClick={handleDeleteSelected} 
                className="px-6 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="border border-admin-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-graygray-10 border-b border-admin-border text-admin-text-primary text-body-m-bold">
                  <th className="py-5 w-[80px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div></th>
                  <th className="py-5 px-2 text-center">번호</th>
                  <th className="py-5 px-2 text-center">ID</th>
                  <th className="py-5 px-2 text-center">등록방식</th>
                  <th className="py-5 px-2 text-center">출처</th>
                  <th className="py-5 px-6 text-center">제목</th>
                  <th className="py-5 px-2 text-center">등록인</th>
                  <th className="py-5 px-2 text-center">파일</th>
                  <th className="py-5 px-2 text-center">등록일시</th>
                  <th className="py-5 px-2 text-center">조회수</th>
                  <th className="py-5 px-2 text-center">노출여부</th>
                  <th className="py-5 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="text-body-m text-graygray-60 text-center">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => {
                    const rowNum = filteredData.length - (currentPage - 1) * itemsPerPage - index;
                    const isLastRows = index >= currentData.length - 3;
                    return (
                      <tr key={item.id} className={`border-b border-graygray-5 last:border-0 hover:bg-graygray-5/50 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50' : 'bg-white'}`}>
                        <td className="py-5"><div className="flex justify-center"><CustomCheckbox checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} /></div></td>
                        <td className="py-5 ">{rowNum}</td>
                        <td className="py-5 ">{item.mgmtId}</td>
                        <td className="py-5">
                          <div className="flex justify-center">
                            <span className={`px-2 py-1 rounded text-[12px] font-medium ${item.regType === '직접등록' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                              {item.regType}
                            </span>
                          </div>
                        </td>
                        <td className="py-5">{item.source}</td>
                        <td className="py-5 px-6 text-left truncate max-w-[280px]" title={item.title}>{item.title}</td>
                        <td className="py-5 ">{item.author}</td>
                        <td className="py-5 relative group">
                          <div className="flex justify-center">
                           {item.files && item.files.length > 0 && (
                              <div className="relative">
                                <Paperclip size={18} className="text-graygray-40 transition-colors group-hover:text-[#2563EB] cursor-pointer" />
                                <div className={`absolute left-1/2 -translate-x-1/2 hidden group-hover:block z-[9999] pointer-events-none ${isLastRows ? 'bottom-full mb-3' : 'top-full mt-2'}`}>
                                  <div className="bg-[#333] text-white text-[12px] py-2.5 px-4 rounded-lg shadow-2xl min-w-[160px] max-w-[300px] text-left border-t-2 border-[#2563EB]">
                                    <div className="pb-1.5 mb-1.5 font-bold text-[#60A5FA] flex items-center justify-between border-b border-white/10">
                                      <span>첨부파일</span><span>{item.files.length}개</span>
                                    </div>
                                    <div className="flex flex-col gap-2 text-white/90">
                                      {item.files.map((f, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                          <span className="w-1 h-1 bg-[#60A5FA] rounded-full shrink-0 mt-1.5"></span>
                                          <span className="break-all leading-relaxed">{f.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className={`w-2.5 h-2.5 bg-[#333] rotate-45 absolute left-1/2 -translate-x-1/2 ${isLastRows ? '-bottom-1' : '-top-1'}`}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-5 ">{item.createdAt}</td>
                        <td className="py-5">{item.views || 0}</td>
                        <td className="py-5 text-center">
                          <div className="flex justify-center">
                            {item.isPublic ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">노출</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">비노출</span>
                            )}
                          </div>
                        </td>
                        <td className="py-5">
                          <button onClick={() => navigate(`/admin/content/pressRelDetail/${item.id}`)} className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all">보기</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="py-32 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="mb-4 text-gray-200"><Search size={64} strokeWidth={1} /></div>
                        <p className="text-[#111] text-[18px] font-bold mb-1">검색 결과가 없습니다.</p>
                        <p className="text-gray-400 text-[14px]">입력하신 검색어와 일치하는 보도자료가 존재하지 않습니다.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

      <AdminCodeConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={modalConfig.onConfirm} 
        title={modalConfig.title} 
        message={modalConfig.message} 
        type={modalConfig.type} 
      />
    </div>
  );
};

export default AdminPressRelList;