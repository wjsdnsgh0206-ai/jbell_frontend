// src/pages/user/customerservice/qna/QnADetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button';
// 데이터와 헬퍼 함수 import
import { getQnADetail } from './data'; 

const QnADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 데이터 로드 ---
  const item = getQnADetail(id);

  // --- Breadcrumb 데이터 ---
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/qna", hasIcon: false },
    { label: "1:1문의", path: "/qna", hasIcon: false },
    { label: "상세보기", path: "", hasIcon: false },
  ];

  // --- 상태 스타일 ---
  const getStatusStyle = (status) => {
    switch (status) {
      case 'progress': return 'bg-green-100 text-green-700 border-green-200';
      case 'complete': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'receipt': return 'bg-graygray-5 text-graygray-70 border-graygray-10';
      case 'waiting': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-graygray-5 text-graygray-50 border-graygray-10';
    }
  };

  if (!item) {
    return (
      <div className="p-20 text-center flex flex-col items-center">
        <p className="text-title-l text-graygray-50 mb-4">해당 문의 내역을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/qna')}>목록으로</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-graygray-90">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        <PageBreadcrumb items={breadcrumbItems} />
        
        <div className="border-b border-graygray-90 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-detail-m text-graygray-50 border border-graygray-10 px-2 py-1 rounded bg-graygray-5">
              {item.category}
            </span>
            <span className={`px-2 py-1 text-[13px] font-bold rounded border ${getStatusStyle(item.status)}`}>
              {item.statusText}
            </span>
            <span className="text-detail-m text-graygray-50 ml-1">{item.date}</span>
          </div>
          <h1 className="text-heading-l text-graygray-90 mt-2">
            <span className="text-secondary-50 mr-2">Q.</span>
            {item.title}
          </h1>
        </div>

        <div className="space-y-8">
          <div className="min-h-[100px] text-body-m text-graygray-90 leading-relaxed whitespace-pre-wrap p-2">
            {item.content}
          </div>

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

        <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20 mt-10">
          <Button 
            variant="tertiary"
            onClick={() => navigate('/qna')}
            className="px-8" 
          >
            목록으로
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QnADetailPage;