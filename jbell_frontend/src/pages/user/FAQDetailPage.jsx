import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

const FAQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 실제로는 API 호출로 데이터를 가져와야 합니다. 여기서는 같은 샘플 데이터를 사용합니다.
  const faqData = [
    { id: 1, question: "사람은 어떻게 태어나는 건가요?", answer: "사람은 태어나는 것이 아닌 하늘에서 비를 뿌리면...", date: "2023.11.01", tag: "질문 유형" },
    { id: 2, question: "비밀번호를 변경하고 싶어요.", answer: "마이페이지 > 회원정보 수정 메뉴에서 변경 가능합니다.", date: "2023.11.02", tag: "계정 관리" },
    { id: 3, question: "환불 규정이 어떻게 되나요?", answer: "결제 후 7일 이내에는 100% 환불이 가능합니다.", date: "2023.11.03", tag: "결제/환불" },
    { id: 4, question: "서비스 이용 시간이 궁금해요.", answer: "24시간 언제든지 이용 가능합니다.", date: "2023.11.04", tag: "이용 문의" }
  ];

  // ID와 일치하는 데이터 찾기 (문자열 id를 숫자로 변환)
  const item = faqData.find(d => d.id === parseInt(id));

  if (!item) {
    return <div className="p-10 text-center">게시글을 찾을 수 없습니다.</div>;
  }
 return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
          <Home size={16} />
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900 cursor-pointer" onClick={() => navigate('/faq')}>FAQ</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">상세보기</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Title Area */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
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