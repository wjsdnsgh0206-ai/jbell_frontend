// src/pages/user/customerservice/faq/FAQListPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react'; // 아이콘 추가

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button'; // 디자인 시스템 버튼
import { getFAQDetail } from './data'; // 분리된 데이터 함수 임포트

const FAQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  // 데이터 로드
  useEffect(() => {
    const data = getFAQDetail(id);
    setItem(data);
  }, [id]);

  // Breadcrumb 설정
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/faq", hasIcon: false },
    { label: "FAQ", path: "/faq", hasIcon: false },
    { label: "상세보기", path: "", hasIcon: false },
  ];

  // 1. 데이터가 없을 경우 (예외 처리)
  if (!item) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-graygray-30 mb-4" />
        <p className="text-title-m text-graygray-70 mb-6">게시글을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/faq')} variant="primary">
          목록으로
        </Button>
      </div>
    );
  }

  // 2. 정상 렌더링
  return (
    <div className="w-full bg-white text-graygray-90 pb-20 px-4 lg:px-0">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        
        <PageBreadcrumb items={breadcrumbItems} />

        {/* Title Area */}
        <div className="border-b border-graygray-20 pb-6 mb-8 mt-4">
          {/* 태그 & 날짜 정보 (모바일: 세로, PC: 가로 정렬) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <span className="self-start sm:self-auto px-3 py-1 bg-graygray-5 text-graygray-70 text-detail-m rounded-full border border-graygray-10 whitespace-nowrap">
              {item.tag}
            </span>
            <div className="flex items-center gap-2 text-detail-m text-graygray-50">
              <span>등록일: {item.date}</span>
              <span className="text-graygray-30">|</span>
              <span>최종 수정일: {item.modifiedDate}</span>
            </div>
          </div>

          {/* 질문 제목 */}
          <h1 className="text-heading-m lg:text-heading-l text-graygray-90 mt-2 leading-snug">
            <span className="text-secondary-50 mr-2 font-bold">Q.</span>
            {item.question}
          </h1>
        </div>

        {/* Content Area (답변) */}
        <div className="min-h-[300px] bg-graygray-5 p-6 lg:p-10 rounded-xl mb-10 border border-graygray-20">
          <div className="flex items-start gap-4">
            <span className="text-heading-m text-graygray-50 font-bold leading-none mt-1">A.</span>
            <div className="text-body-m text-graygray-80 whitespace-pre-wrap leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>

        {/* 하단 목록 버튼 영역 */}
        <div className="flex justify-center md:justify-end pt-10 border-t border-graygray-20">
          <div className="flex justify-center md:justify-end">
            <Button 
              variant="tertiary"
              onClick={() => navigate('/faq')}
              className="px-8" 
            >
              목록으로
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQDetailPage;