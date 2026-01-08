import React, { useState } from 'react';
import { Search, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';

const QnAListPage = () => {
  const navigate = useNavigate();

  // --- Breadcrumb 데이터 설정 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
  ];

  // 샘플 데이터
  const inquiries = [
  {
    id: 1,
    status: 'progress', // 진행단계 
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.04.30',
    category: '회원정보',
  },
  {
    id: 2,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.05.01',
    category: '이용문의',
  },
  {
    id: 3,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2024.06.01',
    category: '결제/환불',
  },
  {
    id: 4,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2025.11.01',
    category: '시스템오류',
  },

  {
    id: 5,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.05.06',
    category: '회원정보',
  },
  {
    id: 6,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.05.18',
    category: '이용문의',
  },
  {
    id: 7,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2024.06.09',
    category: '결제/환불',
  },
  {
    id: 8,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2024.07.03',
    category: '시스템오류',
  },
  {
    id: 9,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.08.14',
    category: '회원정보',
  },
  {
    id: 10,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.09.02',
    category: '이용문의',
  },
  {
    id: 11,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2024.09.21',
    category: '결제/환불',
  },
  {
    id: 12,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2024.10.07',
    category: '시스템오류',
  },
  {
    id: 13,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.10.19',
    category: '회원정보',
  },
  {
    id: 14,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.11.04',
    category: '이용문의',
  },
  {
    id: 15,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2024.11.22',
    category: '결제/환불',
  },
  {
    id: 16,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2024.12.03',
    category: '시스템오류',
  },
  {
    id: 17,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2025.01.09',
    category: '회원정보',
  },
  {
    id: 18,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2025.01.27',
    category: '이용문의',
  },
  {
    id: 19,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2025.02.11',
    category: '결제/환불',
  },
  {
    id: 20,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2025.03.05',
    category: '시스템오류',
  },
  {
    id: 21,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2025.04.16',
    category: '회원정보',
  },
  {
    id: 22,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2025.05.08',
    category: '이용문의',
  },
  {
    id: 23,
    status: 'receipt', // 접수단계
    statusText: '접수완료',
    title: '결제 취소 요청', content: '어제 결제한 내역을 취소하고 싶습니다.',
    date: '2025.06.20',
    category: '결제/환불',
  },
  {
    id: 24,
    status: 'waiting', // 예비/타기관 이송 등
    statusText: '확인중',
    title: '기관 연동이 안돼요', content: '타기관 인증서 등록 시 오류가 뜹니다.',
    date: '2025.08.12',
    category: '시스템오류',
  },
  {
    id: 25,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2025.10.03',
    category: '회원정보',
  },
];

// --- 상태 관리 ---
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 표시 개수 (기본 10개)
  const [sortOrder, setSortOrder] = useState('latest'); // 정렬 상태: 'latest' | 'oldest'

  // --- 데이터 정렬 로직 ---
  const getSortedData = () => {
    const sorted = [...inquiries]; // 원본 배열 복사
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

  const sortedData = getSortedData();

  // --- 페이지네이션 로직 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = inquiries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 스크롤
  };

  // 표시 개수 변경 핸들러
  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value.replace('개', ''), 10);
    setItemsPerPage(value);
    setCurrentPage(1); // 개수가 바뀌면 1페이지로 리셋
  };

  // 정렬 변경 핸들러
  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // 정렬 방식이 바뀌면 1페이지로 이동
  };

  // 상태에 따른 배지 스타일 반환 함수
  const getStatusStyle = (status) => {
    switch (status) {
      case 'progress': // 답변대기 (초록)
        return 'bg-green-100 text-green-700 border-green-200';
      case 'complete': // 답변완료 (파랑 - 강조)
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'receipt': // 접수완료 (회색)
       return 'bg-graygray-5 text-graygray-70 border-graygray-10';
      case 'waiting': // 확인중 (빨강 or 주황)
       return 'bg-orange-50 text-orange-600 border-orange-200';
      default:
        return 'bg-graygray-5 text-graygray-50 border-graygray-10';
    }
  };

  // [추가] 상세 페이지 이동 핸들러 
  const QnADetailClick = (id) => {
    navigate(`/qna/${id}`); 
    
  };

  return (
    <div className="w-full bg-white text-graygray-90 pb-20 px-4 lg:px-0">
     
      {/* ================= Main Content ================= */}
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        {/* ================= Breadcrumb ================= */}
       <PageBreadcrumb items={breadcrumbItems} />
        <h1 className="text-heading-xl pb-10 text-graygray-90">1:1문의</h1>

      {/* Search Bar (FAQPage 스타일 통일) */}
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

        {/* Filter & Count & Button */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 border-b border-gray-900 pb-2 gap-y-2 ">
          <div className="w-full md:w-auto text-body-m text-gray-700 order-1 md:order-1 mb-2 md:mb-0">
            검색 결과 <span className="font-bold text-secondary-50">{totalItems}</span>개
          </div>
          <div className="flex w-full md:w-auto items-center justify-between text-gray-500 order-2 md:order-2">
            <button 
              onClick={() => navigate('/qna/form')}
              className="px-5 py-1.5 bg-secondary-50 text-white font-bold rounded hover:bg-opacity-90 transition-colors text-detail-m"
            >
              문의하기
            </button>
            
            <div className="flex items-center gap-4">
              <div className="h-4 w-px bg-gray-300 mx-2 hidden md:block"></div>
              
              <div className="flex items-center gap-1 text-detail-m">
                <span className="hidden sm:inline">목록 표시 개수</span>
                <select 
                  className="ml-1 border border-gray-300 rounded px-1 py-0.5"
                  onChange={handleItemsPerPageChange}
                  value={`${itemsPerPage}개`}
                >
                  <option value="10개">10개</option>
                  <option value="20개">20개</option>
                </select>
              </div>
              
              <div className="flex gap-2 text-detail-m">
                <button 
                  onClick={() => handleSortChange('latest')}
                  className={sortOrder === 'latest' ? "font-bold text-gray-900 underline underline-offset-4" : "hover:text-gray-900"}
                >
                  최신순
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => handleSortChange('oldest')}
                  className={sortOrder === 'oldest' ? "font-bold text-gray-900 underline underline-offset-4" : "hover:text-gray-900"}
                >
                  오래된순
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry List */}
        <div className="space-y-4">
          {/* inquiries.map -> currentItems.map 으로 변경 */}
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => QnADetailClick(item.id)}
              className="border border-graygray-10 rounded-lg p-6 hover:shadow-sm hover:border-graygray-30 transition-all cursor-pointer bg-white"
            >
              {/* Top: Status & Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-[13px] font-bold rounded border ${getStatusStyle(item.status)}`}>
                  {item.statusText}
                </span>
                <span className="text-[13px] text-graygray-50 border border-graygray-10 px-2 py-1 rounded bg-graygray-5">
                  {item.category}
                </span>
              </div>

              {/* Middle: Title */}
              <div className="mb-2">
                <h3 className="text-title-l text-graygray-90">{item.title}</h3>
              </div>
              
              {/* Content Preview (Optional) */}
              <p className="text-body-m text-graygray-70 mb-4 line-clamp-1">
                {item.content}
              </p>

              {/* Bottom: Date */}
              <div className="flex items-center justify-between border-t border-graygray-5 pt-4">
                <span className="text-detail-m text-graygray-50">
                  <span className="font-bold mr-2 text-graygray-70">등록일</span> {item.date}
                </span>
                {/* 화살표 아이콘 등 추가 가능 */}
                <ChevronRight size={18} className="text-graygray-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (FAQPage 스타일 통일) */}
        <div className="flex justify-center items-center gap-2 mt-10">
         <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 p-2 text-detail-m ${currentPage === 1 ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-graygray-90'}`}
          >
            <ChevronLeft size={16} /> 이전
          </button>
          
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`w-9 h-9 flex items-center justify-center text-detail-m rounded transition-colors
                ${currentPage === number 
                  ? 'bg-secondary-50 text-white font-bold'
                  : 'text-graygray-70 hover:bg-graygray-5'
                }`}
            >
              {number}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 p-2 text-detail-m ${currentPage === totalPages ? 'text-graygray-30 cursor-default' : 'text-graygray-50 hover:text-graygray-90'}`}
          >
            다음 <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default QnAListPage;