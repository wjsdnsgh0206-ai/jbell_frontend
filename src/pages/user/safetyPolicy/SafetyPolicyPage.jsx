import React, { useState, useEffect, useMemo } from 'react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import PageTabs from '@/components/shared/PageTabs';
import { safetyPolicyService } from '@/services/api';

const SafetyPolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [lastOverallUpdate, setLastOverallUpdate] = useState(""); // 최신 수정 날짜

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    // ISO 포맷(2026-02-03T15:00:00)을 YYYY-MM-DD HH:mm 형식으로 변환
    return dateStr.replace('T', ' ').substring(0, 16);
  };

  // 1. 브레드크럼 정의
  const breadcrumbItems = [
    { label: '홈', path: '/', hasIcon: true },
    { label: '주요 안전정책', path: '/safetyPolicyPage' },
    { label: '전북재난안전대책본부', path: null }
  ];


  // 2. 데이터 조회 및 가공
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const params = { page: 1, size: 50, visibleYn: 'Y' };
        const res = await safetyPolicyService.getSafetyPolicyList(params);

        if (res && res.data && res.data.list) {
          const list = res.data.list;

          // 1. 탭 순서 정렬 (ordering 우선, 그 다음 '수정일'순)
          const sortedList = [...list].sort((a, b) => {
            const orderA = a.ordering || 0;
            const orderB = b.ordering || 0;
            if (orderA !== orderB) return orderA - orderB; 
            // 수정일 기준으로 내림차순 정렬
            return new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate); 
          });
          setPolicies(sortedList);

          // 2. 전체 리스트 중 가장 최근 lastUpdateDate 찾기
          // 정렬을 통해 가장 최신 날짜 문자열을 직접 추출합니다.
          const latestItem = [...list]
            .filter(item => item.lastUpdateDate)
            .sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate))[0];

          if (latestItem) {
            // toISOString()을 쓰지 말고 서버에서 온 문자열을 그대로 넣어야 formatDate가 정상 작동합니다.
            setLastOverallUpdate(latestItem.lastUpdateDate); 
          }
        }
      } catch (error) {
        console.error("조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  // 3. 탭 데이터 생성 (PageTabs 컴포넌트용 포맷)
  const tabs = useMemo(() => {
    return policies.map((item, index) => ({
      id: index, // activeTab 인덱스와 매칭
      label: item.title, // 탭 이름 = 정책 제목
    }));
  }, [policies]);

  // 현재 선택된 정책 데이터
  const currentPolicy = policies[activeTab];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-admin-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentPolicy) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-4 py-20 text-center text-gray-500">
        등록된 안전정책 정보가 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0 max-w-screen-xl mx-auto">
      <PageBreadcrumb items={breadcrumbItems} />

      <header className="flex flex-col w-full gap-8 lg:gap-10 mb-10">
        <div className="flex flex-col gap-4 border-b border-graygray-20 pb-6">
          <h1 className="text-heading-xl text-graygray-90">전북재난안전대책본부</h1>
          <div className="flex flex-wrap items-center gap-4 text-detail-m text-graygray-60">
            <span className="flex items-center gap-1.5">
               {/* 개별 탭 수정일이 아닌, 페이지 전체의 최신 수정일을 보여주고 싶다면 lastOverallUpdate 사용 */}
               최종 정보 수정일: {formatDate(lastOverallUpdate)}
            </span>
            <span className="w-[1px] h-3 bg-graygray-30"></span>
          </div>
        </div>

        {tabs.length > 0 && (
          <PageTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        <aside className="w-full p-6 bg-secondary-5 rounded-lg border border-secondary-10 flex items-start gap-3">
           <span className="text-secondary-50 font-bold text-lg">💡</span>
           <p className="text-body-m text-graygray-90 leading-relaxed">
             상단의 탭을 선택하여 전북특별자치도의 분야별 안전관리 계획과 체계를 확인하세요.
           </p>
        </aside>
      </header>

      <section className="w-full flex flex-col gap-8 min-h-[400px] animate-fade-in-up">
        <article className="prose prose-lg max-w-none text-graygray-80 leading-loose ql-editor custom-policy-content">
            <div dangerouslySetInnerHTML={{ __html: currentPolicy?.body }} />
        </article>

        {currentPolicy?.contentLink && (
            <div className="flex justify-end mt-10 pt-6 border-t border-graygray-20">
                <a href={currentPolicy.contentLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-graygray-20 rounded-lg text-body-m font-bold text-secondary-50 hover:bg-secondary-5 transition-all shadow-sm">
                    관련 누리집 바로가기
                </a>
            </div>
        )}
      </section>
    </div>
  );
};

export default SafetyPolicyPage;