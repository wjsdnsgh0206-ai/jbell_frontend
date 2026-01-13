import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/Admin/board/BreadCrumb';
import { noticeData } from '@/pages/user/openboards/BoardData'; // 공지사항 데이터 임포트
import { X, ChevronDown, RotateCcw, Paperclip } from 'lucide-react';
import AdminCodeConfirmModal from '../CodeManagement/AdminCodeConfirmModal'; // 기존 모달 재활용

const AdminBoardList = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [posts, setPosts] = useState(noticeData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc: 최신순, asc: 오래된순
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'delete', onConfirm: () => {} });

  const itemsPerPage = 10;

  // 데이터 필터링 및 정렬 로직
  const filteredData = useMemo(() => {
    const searchTerm = appliedSearch.replace(/\s+/g, "").toLowerCase();
    
    let result = posts.filter(post => {
      if (!searchTerm) return true;
      const targetString = [post.title, post.author, post.content].join("").replace(/\s+/g, "").toLowerCase();
      return targetString.includes(searchTerm);
    });

    // 정렬 로직 (createdAt 기준)
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [posts, appliedSearch, sortOrder]);

  // 페이지네이션 데이터
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 이벤트 핸들러
  const handleSearch = () => { setAppliedSearch(searchInput); setCurrentPage(1); };
  const handleClearSearch = () => { setSearchInput(""); setAppliedSearch(""); setCurrentPage(1); };

  const isAllSelectedOnPage = currentData.length > 0 && currentData.every(item => selectedIds.includes(item.id));
  const handleSelectAllOnPage = (e) => {
    const currentPageIds = currentData.map(item => item.id);
    if (e.target.checked) setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    else setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
  };

  const handleBatchStatus = (status) => {
    if (selectedIds.length === 0) { alert("항목을 먼저 선택해주세요."); return; }
    setModalConfig({
      title: `일괄 ${status ? '사용' : '미사용'} 처리`,
      message: `선택하신 ${selectedIds.length}건의 게시물을 일괄 ${status ? '사용' : '미사용'} 처리하시겠습니까?`,
      type: status ? 'confirm' : 'delete',
      onConfirm: () => {
        setPosts(prev => prev.map(post => selectedIds.includes(post.id) ? { ...post, isPublic: status } : post));
        setSelectedIds([]); setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) { alert("삭제할 항목을 선택해주세요."); return; }
    setModalConfig({
      title: '선택 항목 삭제',
      message: `선택하신 ${selectedIds.length}건의 데이터를 정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
      type: 'delete',
      onConfirm: () => {
        setPosts(prev => prev.filter(post => !selectedIds.includes(post.id)));
        setSelectedIds([]); setIsModalOpen(false);
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
    <div className="flex-1 flex flex-col min-h-screen bg-admin-bg font-sans antialiased text-graygray-90">
      <main className="p-10">
        <BreadCrumb />
        <h2 className="text-heading-l mt-2 mb-10 text-admin-text-primary tracking-tight">공지사항 관리</h2>

        {/* 상단 검색 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8 flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
              placeholder="제목, 작성자, 본문 내용을 검색해주세요" 
              className="w-full border border-admin-border rounded-md px-5 h-14 text-body-m outline-none bg-white focus:border-admin-primary transition-all" 
            />
            {searchInput && <button onClick={() => setSearchInput("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-graygray-40"><X size={20} /></button>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSearch} className="px-8 h-14 bg-admin-primary text-white font-bold rounded-md hover:opacity-90 transition-all active:scale-95 shadow-sm">검색</button>
            <button onClick={handleClearSearch} className="px-6 h-14 bg-white text-graygray-50 border border-admin-border font-bold rounded-md hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2">
              <RotateCcw size={18} /> 초기화
            </button>
          </div>
        </section>

        {/* 데이터 테이블 영역 */}
        <section className="bg-admin-surface border border-admin-border rounded-xl shadow-adminCard p-8">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center gap-4">
              <CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} />
              <span className="text-body-m-bold text-admin-text-secondary">{selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : `전체 ${filteredData.length}건`}</span>
              <div className="flex items-center ml-4 gap-4">
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
            
            <div className="flex gap-3">
              <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                <button onClick={() => setSortOrder("desc")} className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all ${sortOrder === "desc" ? 'bg-white text-admin-primary shadow-sm' : 'text-gray-500'}`}>최신순</button>
                <button onClick={() => setSortOrder("asc")} className={`px-4 py-2 text-[13px] font-bold rounded-md transition-all ${sortOrder === "asc" ? 'bg-white text-admin-primary shadow-sm' : 'text-gray-500'}`}>오래된순</button>
              </div>
              <button onClick={handleDeleteSelected} className="px-8 h-12 bg-[#FF003E] text-white rounded-md font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">삭제</button>
            </div>
          </div>

          <div className="border border-admin-border rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-graygray-10 border-b border-admin-border text-admin-text-primary text-body-m-bold">
                  <th className="py-5 w-[60px] text-center"><div className="flex justify-center"><CustomCheckbox checked={isAllSelectedOnPage} onChange={handleSelectAllOnPage} /></div></th>
                  <th className="py-5 w-[80px] text-center">번호</th>
                  <th className="py-5 px-6 text-center">제목</th>
                  <th className="py-5 px-2 text-center">등록자</th>
                  <th className="py-5 px-2 text-center">등록일시</th>
                  <th className="py-5 px-2 text-center">수정일시</th>
                  <th className="py-5 px-2 text-center">조회수</th>
                  <th className="py-5 px-2 text-center">첨부</th>
                  <th className="py-5 px-4 text-center">사용여부</th>
                  <th className="py-5 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="text-body-m text-graygray-60">
                {currentData.length > 0 ? (
                  currentData.map((post) => {
                    const isSelected = selectedIds.includes(post.id);
                    return (
                      <tr key={post.id} className={`border-b border-graygray-5 last:border-0 hover:bg-graygray-5/50 transition-colors ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                        <td className="py-5 text-center"><div className="flex justify-center"><CustomCheckbox checked={isSelected} onChange={() => setSelectedIds(prev => prev.includes(post.id) ? prev.filter(i => i !== post.id) : [...prev, post.id])} /></div></td>
                        <td className="py-5 text-center text-graygray-40 font-mono">{post.id}</td>
                        <td className="py-5 px-6 text-left max-w-[300px]">
                          <div className="flex items-center gap-2">
                            {post.isPin && <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[11px] font-bold rounded border border-red-100 flex-shrink-0">공지</span>}
                            <span className="truncate font-medium text-admin-text-primary">{post.title}</span>
                          </div>
                        </td>
                        <td className="py-5 text-center">{post.author}</td>
                        <td className="py-5 text-center text-graygray-40 text-[13px]">{post.createdAt}</td>
                        <td className="py-5 text-center text-graygray-40 text-[13px]">{post.updatedAt}</td>
                        <td className="py-5 text-center font-mono">{post.views.toLocaleString()}</td>
                        <td className="py-5 text-center">
                          <div className="flex justify-center text-graygray-40">
                            {post.files?.length > 0 ? <div className="flex items-center gap-1 font-mono text-[13px]"><Paperclip size={14} />{post.files.length}</div> : "-"}
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <div className="flex justify-center">
                            {post.isPublic ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[12px] font-bold border border-blue-200">사용</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-400 text-[12px] font-bold border border-gray-200">미사용</span>
                            )}
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <button 
                            onClick={() => navigate(`/admin/board/noticeDetail/${post.id}`)} 
                            className="border border-gray-300 text-[#666] rounded px-4 py-1.5 text-[13px] font-bold bg-white hover:bg-admin-primary hover:text-white hover:border-admin-primary transition-all"
                          >
                            보기
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="py-32 text-center">
                      <div className="inline-flex flex-col items-center text-gray-400">
                        <X size={48} className="mb-4 opacity-20" />
                        <p className="text-[18px] font-bold text-gray-600">등록된 공지사항이 없습니다.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {currentData.length > 0 && (
            <div className="py-14 flex justify-center items-center gap-3">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-5 py-2 text-body-m-bold ${currentPage === 1 ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-admin-primary cursor-pointer'}`}>〈 이전</button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button key={num} onClick={() => setCurrentPage(num)} className={`w-10 h-10 rounded-lg text-body-m-bold transition-all ${num === currentPage ? 'bg-admin-primary text-white shadow-md font-bold' : 'text-graygray-50 hover:bg-graygray-10'}`}>{num}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-5 py-2 text-body-m-bold ${currentPage === totalPages ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-admin-primary cursor-pointer'}`}>다음 〉</button>
            </div>
          )}
        </section>
      </main>
      
      {/* 컨펌 모달 */}
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

export default AdminBoardList;