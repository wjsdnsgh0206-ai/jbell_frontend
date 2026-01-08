import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';

const QnADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 // --- Breadcrumb 데이터 설정 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
    { label: "상세보기", path: "", hasIcon: false },
  ];

  const inquiries = [
    {
    id: 1,
    status: 'progress', // 진행단계
    statusText: '답변대기',
    title: '비밀번호 변경이 되지 않습니다.', content: '마이페이지에서 비밀번호 변경을 시도했는데 오류가 발생합니다...',
    date: '2024.04.30',
    category: '회원정보',
    answer: null // 답변 없음
  },
  {
    id: 2,
    status: 'complete', // 완료단계
    statusText: '답변완료',
    title: '서비스 이용 관련 문의드립니다.', content: '주말에도 고객센터 상담이 가능한가요?',
    date: '2024.05.01',
    category: '이용문의',
    answer: {
        title: '안녕하세요. 고객센터입니다.',
        content: '네, 주말 상담은 오전 10시부터 오후 5시까지 가능합니다.\n감사합니다.',
        date: '2024.05.02'
      }
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

  // --- 상태에 따른 배지 스타일 반환 함수 (ListPage와 동일하게 적용) ---
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

  // ID와 일치하는 데이터 찾기
  const item = inquiries.find(d => d.id === parseInt(id));

  // 데이터가 없을 경우 예외 처리
  if (!item) {
    return (
        <div className="p-20 text-center flex-col-center">
            <p className="text-title-l text-graygray-50 mb-4">해당 문의 내역을 찾을 수 없습니다.</p>
            <button 
                onClick={() => navigate('/qna')}
                className="px-6 py-2 bg-graygray-90 text-white rounded text-body-m hover:bg-graygray-80"
            >
                목록으로
            </button>
        </div>
    );
  }

  return (
    <div className="w-full bg-white text-graygray-90">

     <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
      {/* ================= Breadcrumb ================= */}
      <PageBreadcrumb items={breadcrumbItems} />
        {/* ================= Title Area ================= */}
        <div className="border-b border-graygray-90 pb-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
                {/* 카테고리 태그 */}
                <span className="text-detail-m text-graygray-50 border border-graygray-10 px-2 py-1 rounded bg-graygray-5">
                    {item.category}
                </span>
                {/* 상태 태그 */}
                <span className={`px-2 py-1 text-[13px] font-bold rounded border ${getStatusStyle(item.status)}`}>
                    {item.statusText}
                </span>
                
                <span className="text-detail-m text-graygray-50 ml-1">{item.date}</span>
            </div>
            {/* 제목 */}
            <h1 className="text-heading-l text-graygray-90 mt-2">
                <span className="text-secondary-50 mr-2">Q.</span>
                {item.title}
            </h1>
        </div>

        {/* ================= Content Area ================= */}
        <div className="space-y-8">
            {/* 질문 내용 */}
            <div className="min-h-[100px] text-body-m text-graygray-90 leading-relaxed whitespace-pre-wrap p-2">
                {item.content}
            </div>

            {/* 답변 영역 */}
            <div className="bg-graygray-5 p-8 rounded-lg border border-graygray-10">
                <div className="flex items-start gap-4">
                    <span className="text-heading-m text-graygray-50 mt-[-2px]">A.</span>
                    <div className="w-full">
                        {item.answer ? (
                            <>
                                <div className="text-title-m text-graygray-90 mb-3">{item.answer.title}</div>
                                <div className="text-body-m text-graygray-70 leading-relaxed whitespace-pre-wrap">
                                    {item.answer.content}
                                </div>
                                <div className="mt-6 text-detail-m text-graygray-50 text-right">
                                    답변일: {item.answer.date}
                                </div>
                            </>
                        ) : (
                            <div className="text-body-m text-graygray-50 py-4">
                                아직 관리자의 답변이 등록되지 않았습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center border-t border-graygray-10 pt-8 mt-10">
            <button 
                onClick={() => navigate('/qna')}
                className="flex items-center gap-2 px-8 py-3 bg-graygray-90 text-white rounded hover:bg-graygray-80 transition-colors text-body-m-bold shadow-sm"
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