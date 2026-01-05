import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Home, ChevronRight, ChevronLeft, ChevronDown, Menu, User, Globe, MessageCircle,ArrowLeft  } from 'lucide-react';
const FAQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 실제로는 API 호출로 데이터를 가져와야 합니다. 여기서는 같은 샘플 데이터를 사용합니다.
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

  // ID와 일치하는 데이터 찾기 (문자열 id를 숫자로 변환)
  const item = faqData.find(d => d.id === parseInt(id));

  if (!item) {
    return <div className="p-10 text-center">게시글을 찾을 수 없습니다.</div>;
  }
 return (
    <div className="w-full bg-white font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
         <span className="font-medium text-gray-900 cursor-pointer" onClick={() => navigate('/')}> <Home size={16} /></span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900 cursor-pointer hover:underline" onClick={() => navigate('/faq')}>FAQ</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">상세보기</span>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 py-10">
        {/* Title Area */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
                {/* 스타일 수정된 부분: FAQListPage와 동일한 디자인 적용 */}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                    {item.tag}
                </span>
                <span className="text-gray-500 text-sm">{item.date}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                <span className="text-blue-700 mr-2">Q.</span>
                {item.question}
            </h1>
        </div>

        {/* Content Area */}
        <div className="min-h-[300px] bg-gray-50 p-8 rounded-lg mb-10 border border-gray-100">
            <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-gray-500 mt-[-4px]">A.</span>
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {item.answer}
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center border-t border-gray-200 pt-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium"
            >
                <ArrowLeft size={18} />
                목록으로 돌아가기
            </button>
        </div>
      </main>
    </div>
  );
};

export default FAQDetailPage;