// src/pages/user/customerservice/faq/FAQListPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { Button } from '@/components/shared/Button';
import { faqService } from '@/services/api';

const FAQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Breadcrumb 설정
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "고객센터", path: "/faq", hasIcon: false },
    { label: "FAQ", path: "/faq", hasIcon: false },
    { label: "상세보기", path: "", hasIcon: false },
  ];

  // 1. 사용할 렌더링 함수 정의
const renderFaqContent = (contentJson) => {
  if (!contentJson) return null;

  try {
    const parsedData = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson;

    // 배열 형태가 아니면 그냥 텍스트로 출력
    if (!Array.isArray(parsedData)) {
        return <p className="whitespace-pre-wrap">{contentJson}</p>;
    }

    // 배열을 순회하며 type에 따라 다르게 렌더링
    return parsedData.map((block, index) => {
      // 1) 텍스트 타입일 경우
      if (block.type === 'text') {
        return (
          <p key={index} className="mb-4 whitespace-pre-wrap leading-relaxed text-gray-800">
            {block.value}
          </p>
        );
      }
      
      // 2) 테이블 타입일 경우
      if (block.type === 'table') {
        return (
          <div key={index} className="overflow-x-auto mb-4 border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {block.headers.map((header, hIndex) => (
                    <th key={hIndex} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {block.rows.map((row, rIndex) => (
                  <tr key={rIndex}>
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // 3) 리스트 타입
      if (block.type === 'list') {
          const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
          const listStyle = block.style === 'ordered' ? 'list-decimal' : 'list-disc';
          
          return (
            <ListTag key={index} className={`mb-4 ml-5 space-y-1 ${listStyle} text-gray-800`}>
              {block.items.map((listItem, i) => (
                <li key={i} className="pl-1">{listItem}</li>
              ))}
            </ListTag>
          );
      }

      // 4) 노트(참고) 타입
      if (block.type === 'note') {
          return (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
              {block.value}
            </div>
          );
      }

      return null;
    });

  } catch (e) {
      console.error("FAQ parsing error:", e);
      // 파싱 실패 시 원본 텍스트라도 보여주도록 처리
      return <p className="whitespace-pre-wrap">{String(contentJson)}</p>;
    }
  };

  // --- 데이터 Fetching ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // API 호출
        const response = await faqService.getPublicFaqDetail(id);
        const data = response.data || response;

        if (data) {
            // 백엔드 DTO(FaqDetail) -> 프론트엔드 변수 매핑
            setItem({
                id: data.faqId,
                category: data.faqCategory || '기타',
                question: data.faqTitle,
                answer: data.faqContent,
                date: data.faqCreatedAt ? data.faqCreatedAt.split('T')[0] : '', // YYYY-MM-DD
                modifiedDate: data.faqUpdatedAt ? data.faqUpdatedAt.split('T')[0] : (data.faqCreatedAt ? data.faqCreatedAt.split('T')[0] : ''),
                views: data.faqViewCount
            });
        } else {
            setError(true);
        }
      } catch (err) {
        console.error("FAQ 상세 조회 실패:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // 1. 로딩 중
  if (loading) {
    return (
        <div className="w-full min-h-[50vh] flex items-center justify-center text-graygray-50">
            데이터를 불러오는 중입니다...
        </div>
    );
  }

  // 2. 데이터 없음 또는 에러
  if (error || !item) {
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
              {item.category}
            </span>
            <div className="flex items-center gap-2 text-detail-m text-graygray-50">
              <span>등록일: {item.date}</span>
              <span className="text-graygray-30">|</span>
              <span>최종 수정일: {item.modifiedDate}</span>
              <span className="text-graygray-30">|</span>
              <span>조회수: {item.views}</span>
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
              {renderFaqContent(item.answer)}
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