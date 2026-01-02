import React from 'react';
// 👇 여기에 ChevronRight와 ArrowLeft를 추가했습니다.
import { Search, Home, ChevronRight, ArrowLeft, LogIn, UserPlus, Globe, Type, Settings, Download, Eye, Plus, Instagram, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const QnADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const inquiries = [
    {
      id: 1,
      status: 'progress',
      statusText: '답변대기',
      title: '비밀번호 변경이 되지 않습니다.',
      content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다. \n어떤 브라우저를 써도 동일한 현상입니다.',
      date: '2024.04.30',
      category: '회원정보',
      answer: null 
    },
    {
      id: 2,
      status: 'complete',
      statusText: '답변완료',
      title: '서비스 이용 관련 문의드립니다.',
      content: '주말에도 고객센터 상담이 가능한가요?',
      date: '2023.11.01',
      category: '이용문의',
      answer: {
        title: '안녕하세요, 고객센터입니다.',
        content: '네, 고객센터는 주말 및 공휴일 포함 24시간 운영됩니다.',
        date: '2023.11.02'
      }
    },
    {
      id: 3,
      status: 'receipt',
      statusText: '접수완료',
      title: '결제 취소 요청',
      content: '어제 결제한 내역을 취소하고 싶습니다.',
      date: '2023.11.01',
      category: '결제/환불',
      answer: null
    },
    {
      id: 4,
      status: 'waiting',
      statusText: '확인중',
      title: '기관 연동이 안돼요',
      content: '타기관 인증서 등록 시 오류가 뜹니다.',
      date: '2023.11.01',
      category: '시스템오류',
      answer: null
    }
  ];

  // ID와 일치하는 데이터 찾기
  const item = inquiries.find(d => d.id === parseInt(id));

  // 데이터가 없을 경우 예외 처리
  if (!item) {
    return <div className="p-20 text-center font-bold text-gray-500">해당 문의 내역을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full bg-white font-sans text-gray-800">
      {/* ================= Breadcrumb (FAQDetailPage 스타일) ================= */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center text-gray-500 text-sm">
          <Home size={16} />
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">고객센터</span>
          <ChevronRight size={16} className="mx-2" />
          <span 
            className="font-medium text-gray-900 cursor-pointer hover:underline" 
            onClick={() => navigate('/qna')}
          >
            1:1문의
          </span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-gray-900">상세보기</span>
        </div>
      </div>

     <main className="max-w-[1280px] mx-auto px-4 py-10">
        {/* ================= Title Area (FAQDetailPage 스타일) ================= */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
                {/* 카테고리 태그 */}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                    {item.category}
                </span>
                {/* 상태 태그 */}
                <span className={`px-2 py-1 text-xs font-bold rounded border ${
                    item.status === 'complete' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-100 text-green-700 border-green-200'
                }`}>
                    {item.statusText}
                </span>
                <span className="text-gray-500 text-sm ml-1">{item.date}</span>
            </div>
            {/* 제목 */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                <span className="text-blue-700 mr-2">Q.</span>
                {item.title}
            </h1>
        </div>

        {/* ================= Content Area ================= */}
        <div className="space-y-8">
            {/* 질문 내용 */}
            <div className="min-h-[100px] text-gray-700 leading-relaxed text-lg whitespace-pre-wrap p-2">
                {item.content}
            </div>

            {/* 답변 영역 */}
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
                <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-gray-500 mt-[-4px]">A.</span>
                    <div className="w-full">
                        {item.answer ? (
                            <>
                                <div className="font-bold text-lg text-gray-900 mb-2">{item.answer.title}</div>
                                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                                    {item.answer.content}
                                </div>
                                <div className="mt-4 text-sm text-gray-400 text-right">
                                    답변일: {item.answer.date}
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-400 py-4">
                                아직 관리자의 답변이 등록되지 않았습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center border-t border-gray-200 pt-8 mt-10">
            <button 
                onClick={() => navigate('/qna')}
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

export default QnADetailPage;