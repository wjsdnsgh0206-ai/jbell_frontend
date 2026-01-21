//src/pages/admin/customerservice/qna/AdminQnAList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

// 유틸리티: 클래스 병합
const cn = (...classes) => classes.filter(Boolean).join(' ');

// 샘플 데이터 (1:1 문의)
const initialInquiries = [
  { id: 1, no: 1024, type: '시스템 및 장애', title: '로그인이 갑자기 되지 않습니다.', author: '김철수', date: '2025-01-09', status: 'WAITING' },
  { id: 2, no: 1023, type: '계정 및 회원정보', title: '비밀번호 변경 방법을 모르겠습니다.', author: '이영희', date: '2025-01-09', status: 'ANSWERED', answerDate: '2025-01-09' },
  { id: 3, no: 1022, type: '기능 제안 및 개선', title: '모바일 화면에서 버튼이 잘려 보입니다.', author: '박민수', date: '2025-01-08', status: 'WAITING' },
  { id: 4, no: 1021, type: '기능 제안 및 개선', title: '다크 모드 기능 추가 건의합니다.', author: '최지은', date: '2025-01-08', status: 'ANSWERED', answerDate: '2025-01-08' },
  { id: 5, no: 1020, type: '기타', title: '회원 탈퇴 처리가 안 됩니다.', author: '정준호', date: '2025-01-07', status: 'ANSWERED', answerDate: '2025-01-07' },
  { id: 6, no: 1019, type: '시스템 및 장애', title: '첨부파일 업로드 시 오류 발생', author: '강서연', date: '2025-01-07', status: 'WAITING' },
  { id: 7, no: 1018, type: '계정 및 회원정보', title: '아이디 찾기 결과가 나오지 않아요.', author: '윤동주', date: '2025-01-06', status: 'ANSWERED', answerDate: '2025-01-06' },
  { id: 8, no: 1017, type: '결제 및 서비스 이용', title: '결제 내역 영수증 출력 문의', author: '한석봉', date: '2025-01-05', status: 'ANSWERED', answerDate: '2025-01-06' },
  { id: 9, no: 1016, type: '기능 제안 및 개선', title: '알림 설정 기능을 세분화해주세요.', author: '심사임당', date: '2025-01-04', status: 'ANSWERED', answerDate: '2025-01-04' },
  { id: 10, no: 1015, type: '기타', title: '개인정보 처리방침 관련 문의', author: '장영실', date: '2025-01-03', status: 'WAITING' },
];

// const initialInquiries = Array.from({ length: 45 }).map((_, i) => ({
//   id: i + 1,
//   no: i + 1,
//   type: ['시스템장애', '계정문의', '이용불편', '제안', '기타'][i % 5],
//   title: `테스트 문의 제목입니다. (${i + 1})`,
//   author: `사용자${i + 1}`,
//   date: '2025-01-09',
//   status: i % 3 === 0 ? 'WAITING' : 'ANSWERED'
// })).reverse(); // 최신순 정렬 가정

const InquiryListPage = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [selectedIds, setSelectedIds] = useState([]);
  
    // 입력 상태
    const [inputStatus, setInputStatus] = useState('ALL'); // ALL, WAITING, ANSWERED
    const [inputType, setInputType] = useState('ALL');
    const [inputKeyword, setInputKeyword] = useState('');
    const [inputDateStart, setInputDateStart] = useState('');
    const [inputDateEnd, setInputDateEnd] = useState('');

    // 필터 상태
    const [searchFilters, setSearchFilters] = useState({
        status: 'ALL',
        type: 'ALL',
        keyword: '',
        dateStart: '',
        dateEnd: ''
    });

    // --- 페이지네이션 상태 ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- 답변 상태 변경 핸들러 ---
    const handleStatusChange = (e) => {
        const value = e.target.value;
        setInputStatus(value); // UI 상태 업데이트
        setSearchFilters((prev) => ({ ...prev, status: value })); // 필터 상태 즉시 업데이트
        setCurrentPage(1); // 페이지 초기화
    };

    // --- 문의 유형 변경 핸들러 ---
    const handleTypeChange = (e) => {
        const value = e.target.value;
        setInputType(value); // UI 상태 업데이트
        setSearchFilters((prev) => ({ ...prev, type: value })); // 필터 상태 즉시 업데이트
        setCurrentPage(1); // 페이지 초기화
    };

    // --- 검색 핸들러 ---
    const handleSearch = () => {
        setSearchFilters((prev) => ({
            ...prev,
            status: inputStatus,
            type: inputType,
            keyword: inputKeyword,
            dateStart: inputDateStart,
            dateEnd: inputDateEnd
        }));
        setCurrentPage(1);
    };

    // 엔터키 입력 시 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // --- 로직: 필터링 ---
    const filteredData = useMemo(() => {
        return inquiries.filter((item) => {
          const { status, type, keyword, dateStart, dateEnd } = searchFilters;
            // 1. 상태 필터
            if (status !== 'ALL' && item.status !== status) return false;
            
            // 2. 유형 필터
            if (type !== 'ALL' && item.type !== type) return false;

            // 3. 키워드 검색 (제목 + 작성자)
            if (keyword) {
                const lowerKeyword = keyword.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(lowerKeyword);
                const matchAuthor = item.author.toLowerCase().includes(lowerKeyword);
                if (!matchTitle && !matchAuthor) return false;
            }

            // 4. 날짜 필터 (단순 문자열 비교 예시)
            if (dateStart && item.date < dateStart) return false;
            if (dateEnd && item.date > dateEnd) return false;

            return true;
        });
    }, [inquiries, searchFilters]);

    // 필터 조건이나 보기 개수가 바뀌면 1페이지로 초기화
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // --- 로직: 페이지네이션 계산 ---
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // --- 로직: 선택 및 삭제 ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredData.map((n) => n.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds((prev) => 
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }
        if (confirm(`선택한 ${selectedIds.length}건의 문의를 영구 삭제하시겠습니까?`)) {
            setInquiries((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
            setSelectedIds([]);
        }
    };

    // --- 페이지 이동 핸들러 ---
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // --- 상세 페이지 이동 ---
    const handleRowClick = (id) => {
       navigate(`/admin/service/QnADetail/${id}`);
    };

  return (
    <div className="w-full bg-white p-6 font-sans text-slate-800 min-h-screen">
      
      {/* 1. Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <span>고객센터 관리</span>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-gray-900 font-bold">1:1 문의 관리</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">1:1 문의 관리</h2>
      </div>

      {/* 2. Search & Filter Box */}
      <div className="bg-white border border-gray-200 p-4 rounded-sm mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* 등록일 기간 설정 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">등록일</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={inputDateStart}
                onChange={(e) => setInputDateStart(e.target.value)}
                className="h-9 w-full border border-gray-300 rounded-sm px-2 text-sm focus:border-blue-500 focus:outline-none text-gray-600"
              />
              <span className="text-gray-400">~</span>
              <input 
                type="date" 
                value={inputDateEnd}
                onChange={(e) => setInputDateEnd(e.target.value)}
                className="h-9 w-full border border-gray-300 rounded-sm px-2 text-sm focus:border-blue-500 focus:outline-none text-gray-600"
              />
            </div>
          </div>

          {/* 답변 상태 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">답변 상태</label>
            <select 
              value={inputStatus}
              onChange={handleStatusChange} 
              className="h-9 border border-gray-300 rounded-sm px-3 text-sm w-full focus:border-blue-500 focus:outline-none bg-white text-gray-600"
            >
              <option value="ALL">전체</option>
              <option value="WAITING">답변대기</option>
              <option value="ANSWERED">답변완료</option>
            </select>
          </div>

          {/* 문의 유형 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">문의 유형</label>
            <select 
              value={inputType}
              onChange={handleTypeChange}
              className="h-9 border border-gray-300 rounded-sm px-3 text-sm w-full focus:border-blue-500 focus:outline-none bg-white text-gray-600"
            >
              <option value="ALL">전체 유형</option>
              <option value="계정 및 회원정보">계정 및 회원정보</option>
              <option value="시스템 및 장애">시스템 및 장애</option>
              <option value="결제 및 서비스 이용">결제 및 서비스 이용</option>
              <option value="기능 제안 및 개선">기능 제안 및 개선</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 검색어 입력 & 버튼 */}
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <input 
                type="text"
                className="h-9 w-full border border-gray-300 rounded-sm pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400"
                placeholder="제목 또는 작성자 검색"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={handleKeyDown} // 엔터키 이벤트 연결
              />
              {inputKeyword && (
                <button 
                  onClick={() => setInputKeyword('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
           {/* onClick 이벤트에 handleSearch 연결 */}
            <button 
                onClick={handleSearch}
                className="h-9 px-5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-sm flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
            >
              <Search className="h-3 w-3" />
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 3. Action Bar (List Info & Buttons) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              총 <span className="font-bold text-gray-900">{filteredData.length}</span>건
            </span>
          </div>
          {/* 보기 개수 선택 (10개 / 20개 / 50개) */}
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="h-8 border border-gray-300 rounded-sm px-2 text-xs focus:border-blue-500 focus:outline-none bg-white text-gray-600"
          >
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>

          {selectedIds.length > 0 && (
             <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
               {selectedIds.length}개 선택됨
             </span>
          )}
        </div>

        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="h-8 px-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium rounded-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              선택 삭제
            </button>
          )}
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="w-full overflow-x-auto border-t border-gray-800">
        <table className="w-full text-sm text-left border-b border-gray-300">
          <thead className="text-xs text-gray-700 bg-[#f8f9fa] border-b border-gray-300">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-[50px]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 border-gray-300 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                />
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[60px]">번호</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[100px]">상태</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[120px]">문의유형</th>
              <th scope="col" className="px-4 py-3 font-semibold text-gray-600 min-w-[300px]">제목</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[100px]">작성자</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[120px]">등록일</th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-gray-600 w-[80px]">상세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-300" />
                    <p>조건에 맞는 문의 내역이 없습니다.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-gray-300 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  
                  {/* 번호 */}
                  <td className="px-4 py-3 text-center text-gray-500">
                    {item.no}
                  </td>

                  {/* 상태 뱃지 */}
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "inline-block px-2 py-1 text-[11px] font-bold rounded-sm min-w-[60px]",
                      item.status === 'WAITING' 
                        ? "bg-gray-100 text-gray-600 border border-gray-200" 
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    )}>
                      {item.status === 'WAITING' ? '답변대기' : '답변완료'}
                    </span>
                  </td>

                  {/* 유형 */}
                  <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">
                    {item.type}
                  </td>

                  {/* 제목 (클릭 시 상세 이동) */}
                  <td className="px-4 py-3">
                    <div 
                      onClick={() => handleRowClick(item.id)}
                      className="cursor-pointer text-gray-900 group-hover:text-blue-600 group-hover:underline flex items-center gap-2"
                    >
                      {item.title}
                      {/* New 아이콘 (최근 글 가정) */}
                      {item.id <= 3 && (
                        <span className="inline-flex items-center justify-center w-3 h-3 bg-red-500 text-white text-[9px] rounded-full">N</span>
                      )}
                    </div>
                  </td>

                  {/* 작성자 */}
                  <td className="px-4 py-3 text-center text-gray-600">
                    {item.author}
                  </td>

                  {/* 등록일 */}
                  <td className="px-4 py-3 text-center text-gray-500 text-xs">
                    {item.date}
                  </td>

                  {/* 상세 버튼 */}
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleRowClick(item.id)}
                      className="px-2.5 py-1 border border-gray-300 bg-white text-xs text-gray-600 rounded-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      조회
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination (동적 페이지네이션) */}
      <div className="flex items-center justify-center mt-8 select-none">
        <nav className="inline-flex -space-x-px" aria-label="Pagination">
          {/* 이전 버튼 */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* 페이지 번호 (동적 생성) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                "flex items-center justify-center w-8 h-8 border font-medium transition-colors",
                currentPage === page
                  ? "bg-blue-900 border-blue-900 text-white z-10" // 활성 상태 (진한 남색)
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50" // 비활성 상태
              )}
            >
              {page}
            </button>
          ))}
          
          {/* 다음 버튼 */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400">
        © The Government of the Republic of Korea. All rights reserved.
      </div>
    </div>
  );
};

export default InquiryListPage;