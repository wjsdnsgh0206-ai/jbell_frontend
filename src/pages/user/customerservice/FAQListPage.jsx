// src/pages/user/customerservice/FAQListPage.jsx
import React, { useState } from 'react';
import { Search, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'

const FAQListPage = () => {
  const navigate = useNavigate();

  // --- Breadcrumb 데이터 설정 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/faq", hasIcon: false },
    { label: "FAQ", path: "/faq", hasIcon: false },
  ];

  // 샘플 데이터 (이미지 내용을 기반으로 생성)
 const faqData = [
    { id: 1, question: "사람은 어떻게 태어나는 건가요?", answer: "사람은 태어나는 것이 아닌 하늘에서 비를 뿌리면...", date: "2023.10.01", tag: "질문 유형", views: 150 },
    { id: 2, question: "비밀번호를 변경하고 싶어요.", answer: "마이페이지 > 회원정보 수정 메뉴에서 변경 가능합니다.", date: "2023.10.02", tag: "계정 관리", views: 85 },
    { id: 3, question: "환불 규정이 어떻게 되나요?", answer: "결제 후 7일 이내에는 100% 환불이 가능합니다.", date: "2023.10.03", tag: "결제/환불", views: 230 },
    { id: 4, question: "서비스 이용 시간이 궁금해요.", answer: "24시간 언제든지 이용 가능합니다.", date: "2023.10.04", tag: "이용 문의", views: 45 },
    { id: 5, question: "사람은 어떻게 태어나는 건가요? (5)", answer: "답변 내용...", date: "2023.10.05", tag: "질문 유형", views: 12 },
    { id: 6, question: "비밀번호를 변경하고 싶어요. (6)", answer: "답변 내용...", date: "2023.10.06", tag: "계정 관리", views: 67 },
    { id: 7, question: "환불 규정이 어떻게 되나요? (7)", answer: "답변 내용...", date: "2023.10.07", tag: "결제/환불", views: 99 },
    { id: 8, question: "서비스 이용 시간이 궁금해요. (8)", answer: "답변 내용...", date: "2023.10.08", tag: "이용 문의", views: 120 },
    { id: 9, question: "질문 9", answer: "답변 9", date: "2023.10.09", tag: "질문 유형", views: 34 },
    { id: 10, question: "질문 10", answer: "답변 10", date: "2023.10.10", tag: "계정 관리", views: 55 },
    { id: 11, question: "질문 11", answer: "답변 11", date: "2023.10.11", tag: "결제/환불", views: 78 },
    { id: 12, question: "질문 12", answer: "답변 12", date: "2023.10.12", tag: "이용 문의", views: 90 },
    { id: 13, question: "질문 13", answer: "답변 13", date: "2023.10.13", tag: "질문 유형", views: 11 },
    { id: 14, question: "질문 14", answer: "답변 14", date: "2023.10.14", tag: "계정 관리", views: 22 },
    { id: 15, question: "질문 15", answer: "답변 15", date: "2023.10.15", tag: "결제/환불", views: 33 },
    { id: 16, question: "질문 16", answer: "답변 16", date: "2023.10.16", tag: "이용 문의", views: 44 },
    { id: 17, question: "질문 17", answer: "답변 17", date: "2023.10.17", tag: "질문 유형", views: 55 },
    { id: 18, question: "질문 18", answer: "답변 18", date: "2023.10.18", tag: "계정 관리", views: 66 },
    { id: 19, question: "질문 19", answer: "답변 19", date: "2023.10.19", tag: "결제/환불", views: 77 },
    { id: 20, question: "질문 20", answer: "답변 20", date: "2023.10.20", tag: "이용 문의", views: 88 },
    { id: 21, question: "질문 21", answer: "답변 21", date: "2023.10.21", tag: "질문 유형", views: 100 },
    { id: 22, question: "질문 22", answer: "답변 22", date: "2023.10.22", tag: "계정 관리", views: 110 },
    { id: 23, question: "질문 23", answer: "답변 23", date: "2023.10.23", tag: "결제/환불", views: 130 },
    { id: 24, question: "질문 24", answer: "답변 24", date: "2023.10.24", tag: "이용 문의", views: 140 },
    { id: 25, question: "질문 25", answer: "답변 25", date: "2023.10.25", tag: "질문 유형", views: 160 },
  ];

  // --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(12); // 페이지당 표시 개수
  const [sortOrder, setSortOrder] = useState('latest'); // 정렬 상태: 'latest' | 'oldest'

  // --- 데이터 정렬 로직 [추가] ---
  const getSortedData = () => {
    const sorted = [...faqData]; // 원본 배열 복사
    return sorted.sort((a, b) => {

      // 1. 많이 질문한순 (views 내림차순)
      if (sortOrder === 'mostAsked') {
        return b.views - a.views;
      }
      // 날짜 문자열(yyyy.mm.dd)을 Date 객체로 변환하여 비교
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortOrder === 'latest') {
        return dateB - dateA; // 내림차순 (최신순)
      } else {
        return dateA - dateB; // 오름차순 (오래된순)
      }
    });
  };

  const sortedData = getSortedData(); // 정렬된 데이터 가져오기

  // --- 페이지네이션 로직 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = faqData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
  };

  // 표시 개수 변경 핸들러
  const handleItemsPerPageChange = (e) => {
    // 문자열을 숫자로 변환 (예: "12개" -> 12)
    const value = parseInt(e.target.value.replace('개', ''), 10);
    setItemsPerPage(value);
    setCurrentPage(1); // 개수가 바뀌면 1페이지로 리셋
  };

  // 정렬 변경 핸들러
  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // 정렬 방식이 바뀌면 1페이지로 이동
  };

  // 상세 페이지 이동 핸들러
  const FAQDetailClick = (id) => {
    navigate(`/faq/${id}`);
  };
    
  return (
    <div className="w-full bg-white text-graygray-90 pb-20 px-4 lg:px-0">
      {/* ================= Header ================= */}

      {/* ================= Main Content ================= */}
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* ================= Breadcrumb ================= */}
        <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl pb-10 text-graygray-90">FAQ</h1>

        {/* Search Bar */}
       <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
            <div className="relative w-full md:w-32 h-10"> 
            <select className="w-full h-full appearance-none border border-gray-300 rounded px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10">
              <option>전체</option>
              <option>제목</option>
              <option>내용</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="relative w-full md:flex-1 max-w-lg h-10">
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요." 
              className="w-full h-full border border-gray-300 rounded px-4 pr-10 focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
          </div>
          <button className="w-full md:w-auto h-10 bg-blue-600 text-white px-8 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm whitespace-nowrap flex items-center justify-center">
            검색
          </button>
        </div>

        {/* Filter & Count */}
        <div className="flex flex-row justify-end sm:justify-between items-center mb-4 border-b border-graygray-90 pb-2">
          <div className="hidden sm:block text-body-m text-graygray-70 whitespace-nowrap">
            검색 결과 <span className="font-bold text-secondary-50">{totalItems}</span>개
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <span className="hidden sm:inline text-detail-m text-graygray-50">목록 표시 개수</span>
                <select 
                  className="border border-graygray-30 rounded px-1 py-1 text-detail-m text-graygray-90 focus:outline-none cursor-pointer"
                  onChange={handleItemsPerPageChange}
                  value={`${itemsPerPage}개`}
                >
                  <option value="12개">12개</option>
                  <option value="24개">24개</option>
                </select>
              </div>
              
              {/* 정렬 버튼 그룹 */}
              <div className="flex items-center gap-2 text-detail-m text-graygray-50">
                <button 
                  onClick={() => handleSortChange('mostAsked')}
                  className={sortOrder === 'mostAsked' ? "font-bold text-graygray-90 underline underline-offset-4 whitespace-nowrap" : "hover:text-graygray-90 transition-colors whitespace-nowrap"}
                >
                  {/* 공간 확보를 위해 모바일에서는 '인기순' 등으로 짧게 줄일 수도 있음 */}
                  인기질문
                </button>
                
                <span className="text-graygray-30">|</span>
                
                <button 
                  onClick={() => handleSortChange('latest')}
                  className={sortOrder === 'latest' ? "font-bold text-gray-900 underline underline-offset-4 whitespace-nowrap" : "hover:text-gray-900 whitespace-nowrap"}
                >
                  최신순
                </button>
                
                <span className="text-gray-300">|</span>
                
                <button 
                  onClick={() => handleSortChange('oldest')}
                  className={sortOrder === 'oldest' ? "font-bold text-gray-900 underline underline-offset-4 whitespace-nowrap" : "hover:text-gray-900 whitespace-nowrap"}
                >
                  오래된순
                </button>
              </div>
            </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {/* 현재 페이지에 해당하는 데이터만 맵핑 */}
          {currentItems.map((item) => (
            <div key={item.id} 
              onClick={() => FAQDetailClick(item.id)}
              className="border border-graygray-10 rounded-lg p-6 hover:shadow-sm hover:border-graygray-30 transition-all cursor-pointer bg-white">
              {/* Question */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-title-l text-secondary-50">Q</span>
                <h3 className="text-title-l text-graygray-90 pt-0.5">{item.question}</h3>
              </div>
              
              {/* Answer */}
              <div className="flex items-start gap-3 mb-5">
                <span className="text-body-m-bold text-graygray-50">A</span>
                <p className="text-body-m text-graygray-70 pt-0.5 line-clamp-2">{item.answer}</p>
              </div>

              {/* Meta Data */}
              <div className="flex items-center justify-between border-t border-graygray-5 pt-4">
                <span className="text-detail-m text-graygray-50">
                  <span className="font-bold mr-2 text-graygray-70">등록일</span> {item.date}
                </span>
                <span className="hidden sm:inline">
                    <span className="font-bold mr-2 text-gray-700">질문수</span> {item.views}
                  </span>
                <span className="px-3 py-1 bg-graygray-5 text-graygray-70 text-detail-m rounded-full border border-graygray-10">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

       {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10 select-none">
          {/* 이전 버튼 */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 text-sm ${
              currentPage === 1 
                ? 'text-gray-300 cursor-default' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">이전</span>
          </button>

          {/* 페이지 번호 */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded transition-colors
                  ${currentPage === number 
                    ? 'bg-[#1e4078] text-white' // 이미지와 동일한 네이비색 배경
                    : 'bg-transparent text-gray-600 hover:bg-gray-50' // 선택되지 않은 페이지
                  }`}
              >
                {number}
              </button>
            ))}
          </div>

          {/* 다음 버튼 */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 text-sm ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-default' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="hidden sm:inline">다음</span>
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </main>

      {/* ================= Footer Pre-section (Affiliates) ================= */}
      

      {/* ================= Footer ================= */}
      
    </div>
  );
};

export default FAQListPage;