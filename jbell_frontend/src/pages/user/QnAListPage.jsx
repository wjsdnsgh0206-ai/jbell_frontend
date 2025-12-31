import React from 'react';
import { Search, Home, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QnAListPage = () => {
  const navigate = useNavigate();

  // 샘플 데이터
  const inquiries = [
    {
      id: 1,
      status: 'progress', // 진행단계
      statusText: '답변대기',
      title: '비밀번호 변경이 되지 않습니다.',
      content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
      date: '2024.04.30',
      category: '회원정보',
    },
    {
      id: 2,
      status: 'complete', // 완료단계
      statusText: '답변완료',
      title: '서비스 이용 관련 문의드립니다.',
      content: '주말에도 고객센터 상담이 가능한가요?',
      date: '2023.11.01',
      category: '이용문의',
    },
    {
      id: 3,
      status: 'receipt', // 접수단계
      statusText: '접수완료',
      title: '결제 취소 요청',
      content: '어제 결제한 내역을 취소하고 싶습니다.',
      date: '2023.11.01',
      category: '결제/환불',
    },
    {
      id: 4,
      status: 'waiting', // 예비/타기관 이송 등
      statusText: '확인중',
      title: '기관 연동이 안돼요',
      content: '타기관 인증서 등록 시 오류가 뜹니다.',
      date: '2023.11.01',
      category: '시스템오류',
    }
  ];

  // 상태에 따른 배지 스타일 반환 함수
  const getStatusStyle = (status) => {
    switch (status) {
      case 'progress': // 답변대기 (초록)
        return 'bg-green-100 text-green-700 border-green-200';
      case 'complete': // 답변완료 (파랑 - 강조)
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'receipt': // 접수완료 (회색)
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'waiting': // 확인중 (빨강 or 주황)
        return 'bg-orange-50 text-orange-600 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // 상세 페이지 이동 핸들러 (추후 구현 시 사용)
  const handleItemClick = (id) => {
    // navigate(`/inquiry/${id}`); 
    console.log(`Maps to inquiry ${id}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* ================= Breadcrumb ================= */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
          <Home size={16} />
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">1:1문의</span>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">1:1문의</h1>

        {/* Search Bar (FAQPage 스타일 통일) */}
        <div className="flex border-2 border-gray-300 rounded-none mb-10 h-14">
          <div className="relative w-32 md:w-48 border-r border-gray-300">
            <select className="w-full h-full appearance-none px-4 text-gray-600 bg-white focus:outline-none">
              <option>전체</option>
              <option>제목</option>
              <option>내용</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="검색어를 입력해주세요." 
              className="w-full h-full px-4 focus:outline-none"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search size={24} />
            </button>
          </div>
        </div>

        {/* Filter & Count & Button */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-900 pb-2">
          <div className="text-gray-700">
            검색 결과 <span className="font-bold text-blue-700">{inquiries.length}</span>개
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            {/* 문의하기 버튼 추가 */}
            <button className="px-4 py-1.5 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors">
              문의하기
            </button>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-1">
              목록 표시 개수
              <select className="ml-1 border border-gray-300 rounded px-1 py-0.5">
                <option>10개</option>
                <option>20개</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="font-bold text-gray-900 underline underline-offset-4">최신순</button>
              <span className="text-gray-300">|</span>
              <button className="hover:text-gray-900">오래된순</button>
            </div>
          </div>
        </div>

        {/* Inquiry List */}
        <div className="space-y-4">
          {inquiries.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item.id)}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer bg-white"
            >
              {/* Top: Status & Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-bold rounded border ${getStatusStyle(item.status)}`}>
                  {item.statusText}
                </span>
                <span className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded bg-gray-50">
                  {item.category}
                </span>
              </div>

              {/* Middle: Title */}
              <div className="mb-2">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              </div>
              
              {/* Content Preview (Optional) */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                {item.content}
              </p>

              {/* Bottom: Date */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-500">
                  <span className="font-bold mr-2 text-gray-700">등록일</span> {item.date}
                </span>
                {/* 화살표 아이콘 등 추가 가능 */}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (FAQPage 스타일 통일) */}
        <div className="flex justify-center items-center gap-2 mt-10">
          <button className="flex items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
            <ChevronLeft size={16} /> 이전
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center bg-blue-900 text-white text-sm font-bold rounded">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">3</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">4</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-sm">5</button>

          <button className="flex items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
            다음 <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default QnAListPage;