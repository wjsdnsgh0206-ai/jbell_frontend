import { Search, Home, ChevronRight, ChevronLeft, ChevronDown, Menu, User, Globe, MessageCircle } from 'lucide-react';

const FAQPage = () => {
  // 샘플 데이터 (이미지 내용을 기반으로 생성)
  const faqData = [
    {
      id: 1,
      question: "사람은 어떻게 태어나는 건가요?",
      answer: "사람은 태어나는 것이 아닌 하늘에서 비를 뿌리면 땅에서 새싹이나 멸치를 맺으면 열매와 함께 나는 꽃봉우리 안에 생깁니다.",
      date: "2023.11.01",
      tag: "질문 유형"
    },
    {
      id: 2,
      question: "질문1",
      answer: "아 마담1",
      date: "2023.11.01",
      tag: "질문 유형"
    },
    {
      id: 3,
      question: "질문2",
      answer: "A 마담2",
      date: "2023.11.01",
      tag: "질문 유형"
    },
    {
      id: 4,
      question: "질문3",
      answer: "A 마담3",
      date: "2023.11.01",
      tag: "질문 유형"
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* ================= Header ================= */}

      {/* ================= Breadcrumb ================= */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
          <Home size={16} />
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">FAQ</span>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">FAQ</h1>

        {/* Search Bar */}
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
            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
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