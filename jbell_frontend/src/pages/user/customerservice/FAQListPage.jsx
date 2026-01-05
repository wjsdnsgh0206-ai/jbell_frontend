import React from 'react';
import { Search, Home, ChevronRight, ChevronLeft, ChevronDown, Menu, User, Globe, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQPage = () => {
  const navigate = useNavigate();
  // 샘플 데이터 (이미지 내용을 기반으로 생성)
  const faqData = [
    { id: 1, question: "사람은 어떻게 태어나는 건가요?", answer: "사람은 태어나는 것이 아닌 하늘에서 비를 뿌리면...", date: "2023.10.01", tag: "질문 유형" },
    { id: 2, question: "비밀번호를 변경하고 싶어요.", answer: "마이페이지 > 회원정보 수정 메뉴에서 변경 가능합니다.", date: "2023.10.02", tag: "계정 관리" },
    { id: 3, question: "환불 규정이 어떻게 되나요?", answer: "결제 후 7일 이내에는 100% 환불이 가능합니다.", date: "2023.10.03", tag: "결제/환불" },
    { id: 4, question: "서비스 이용 시간이 궁금해요.", answer: "24시간 언제든지 이용 가능합니다.", date: "2023.10.04", tag: "이용 문의" },
    { id: 5, question: "사람은 어떻게 태어나는 건가요? (5)", answer: "답변 내용...", date: "2023.10.05", tag: "질문 유형" },
    { id: 6, question: "비밀번호를 변경하고 싶어요. (6)", answer: "답변 내용...", date: "2023.10.06", tag: "계정 관리" },
    { id: 7, question: "환불 규정이 어떻게 되나요? (7)", answer: "답변 내용...", date: "2023.10.07", tag: "결제/환불" },
    { id: 8, question: "서비스 이용 시간이 궁금해요. (8)", answer: "답변 내용...", date: "2023.10.08", tag: "이용 문의" },
    { id: 9, question: "질문 9", answer: "답변 9", date: "2023.10.09", tag: "질문 유형" },
    { id: 10, question: "질문 10", answer: "답변 10", date: "2023.10.10", tag: "계정 관리" },
    { id: 11, question: "질문 11", answer: "답변 11", date: "2023.10.11", tag: "결제/환불" },
    { id: 12, question: "질문 12", answer: "답변 12", date: "2023.10.12", tag: "이용 문의" },
    { id: 13, question: "질문 13", answer: "답변 13", date: "2023.10.13", tag: "질문 유형" },
    { id: 14, question: "질문 14", answer: "답변 14", date: "2023.10.14", tag: "계정 관리" },
    { id: 15, question: "질문 15", answer: "답변 15", date: "2023.10.15", tag: "결제/환불" },
    { id: 16, question: "질문 16", answer: "답변 16", date: "2023.10.16", tag: "이용 문의" },
    { id: 17, question: "질문 17", answer: "답변 17", date: "2023.10.17", tag: "질문 유형" },
    { id: 18, question: "질문 18", answer: "답변 18", date: "2023.10.18", tag: "계정 관리" },
    { id: 19, question: "질문 19", answer: "답변 19", date: "2023.10.19", tag: "결제/환불" },
    { id: 20, question: "질문 20", answer: "답변 20", date: "2023.10.20", tag: "이용 문의" },
    { id: 21, question: "질문 21", answer: "답변 21", date: "2023.10.21", tag: "질문 유형" },
    { id: 22, question: "질문 22", answer: "답변 22", date: "2023.10.22", tag: "계정 관리" },
    { id: 23, question: "질문 23", answer: "답변 23", date: "2023.10.23", tag: "결제/환불" },
    { id: 24, question: "질문 24", answer: "답변 24", date: "2023.10.24", tag: "이용 문의" },
    { id: 25, question: "질문 25", answer: "답변 25", date: "2023.10.25", tag: "질문 유형" },
  ];

  // --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(12); // 페이지당 표시 개수
  const [sortOrder, setSortOrder] = useState('latest'); // [추가] 정렬 상태: 'latest' | 'oldest'

  // --- 데이터 정렬 로직 [추가] ---
  const getSortedData = () => {
    const sorted = [...faqData]; // 원본 배열 복사
    return sorted.sort((a, b) => {
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

  // [추가] 상세 페이지 이동 핸들러
  const FAQDetailClick = (id) => {
    navigate(`/faq/${id}`);
  };
    
  

  return (
    <div className="bg-white font-sans text-gray-800 w-full">
      {/* ================= Header ================= */}

      {/* ================= Breadcrumb ================= */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
          <Home size={16} />
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">FAQ</span>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <main className="max-w-[1280px] mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">FAQ</h1>

        {/* Search Bar */}
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-lg mb-10 flex flex-col md:flex-row justify-center items-center gap-3">
          <div className="relative w-full lg:w-32 h-10">
            <select className="w-full h-full appearance-none border border-gray-300 rounded px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm pr-10">
              <option>전체</option>
              <option>제목</option>
              <option>내용</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="relative w-full lg:flex-1 max-w-lg h-10">
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요." 
              className="w-full h-full border border-gray-300 rounded px-4 pr-10 focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
          </div>
          <button className="w-full md:w-auto h-10 bg-blue-600 text-white px-8 rounded font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm whitespace-nowrap flex items-center justify-center">
            검색
          </button>
        </div>

        {/* Filter & Count */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-900 pb-2">
          <div className="text-gray-700">
            검색 결과 <span className="font-bold text-blue-700">24</span>개
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              목록 표시 개수
              <select className="ml-1 border border-gray-300 rounded px-1 py-0.5">
                <option>12개</option>
                <option>24개</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="font-bold text-gray-900 underline underline-offset-4">많이 질문한순</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-900">최신순</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-900">오래된순</button>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <div key={item.id} 
            onClick={() => FAQDetailClick(item.id)}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              {/* Question */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl font-bold text-gray-900">Q</span>
                <h3 className="text-lg font-bold text-gray-900 pt-0.5">{item.question}</h3>
              </div>
              
              {/* Answer */}
              <div className="flex items-start gap-3 mb-6">
                <span className="text-xl font-bold text-gray-500">A</span>
                <p className="text-gray-600 pt-0.5">{item.answer}</p>
              </div>

              {/* Meta Data */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">
                  <span className="font-bold mr-2 text-gray-700">등록일</span> {item.date}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
       <div className="flex justify-center items-center gap-2 mt-10">
          {/* 이전 버튼: flex, items-center 추가 */}
          <button className="flex items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
            <ChevronLeft size={16} /> 이전
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white text-sm font-bold rounded">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">3</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">4</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">5</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">6</button>

          {/* 다음 버튼: flex, items-center 추가 */}
          <button className="flex items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
            다음 <ChevronRight size={16} />
          </button>
        </div>
      </main>

      {/* ================= Footer Pre-section (Affiliates) ================= */}
      

      {/* ================= Footer ================= */}
      
    </div>
  );
};




export default FAQPage;