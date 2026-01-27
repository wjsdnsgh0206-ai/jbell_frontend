// src/pages/user/customerservice/qna/QnADetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button';
import { qnaService } from '@/services/api';

const QnADetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 데이터 로드 ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await qnaService.getPublicQnaDetail(id);
        setItem(data);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("문의 내용을 불러올 수 없습니다.");
        navigate('/qna');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

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
      case '답변처리중': 
        return 'bg-orange-50 text-orange-600 border-orange-100'; 
      case '답변완료': 
        return 'bg-blue-50 text-blue-600 border-blue-100';      
      case '답변대기':  
        return 'bg-green-50 text-green-600 border-green-100';   
      default: 
        return 'bg-graygray-5 text-graygray-40 border-graygray-10';
    }
  };

  if (loading) return <div className="p-20 text-center">로딩 중...</div>;
  if (!item) return null;

  return (
    <div className="w-full bg-white text-graygray-90">
      <main className="max-w-[1280px] mx-auto px-4 lg:px-0">
        <PageBreadcrumb items={breadcrumbItems} />
        
        {/* 질문 영역 */}
        <div className="border-b border-graygray-90 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-detail-m text-graygray-50 border border-graygray-10 px-2 py-1 rounded bg-graygray-5">
              {item.categoryName}
            </span>
            <span className={`px-2 py-1 text-[13px] font-bold rounded border ${getStatusStyle(item.status)}`}>
              {item.status}
            </span>
            <span className="text-detail-m text-graygray-50 ml-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-heading-l text-graygray-90 mt-2">
            <span className="text-secondary-50 mr-2">Q.</span>
            {item.title}
          </h1>
        </div>

        <div className="space-y-8">
          {/* 질문 본문 */}
          <div className="min-h-[100px] text-body-m text-graygray-90 leading-relaxed whitespace-pre-wrap p-2">
            {item.content}
          </div>

          {/* 답변 영역 (답변이 있는 경우에만 표시됨) */}
          <div className="bg-graygray-5 p-8 rounded-lg border border-graygray-10">
            <div className="flex items-start gap-4">
              <span className="text-heading-m text-graygray-50 mt-[-2px]">A.</span>
              <div className="w-full">
                {item.answerContent ? (
                  <>
                    <div className="text-body-m text-graygray-70 leading-relaxed whitespace-pre-wrap">
                      {item.answerContent}
                    </div>
                    <div className="mt-6 text-detail-m text-graygray-50 text-right">
                      답변일: {new Date(item.answerCreatedAt).toLocaleDateString()}
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