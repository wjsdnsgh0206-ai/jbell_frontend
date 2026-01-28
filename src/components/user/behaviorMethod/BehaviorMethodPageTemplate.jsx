// src\components\user\behaviorMethod\BehaviorMethodPageTemplate.jsx
import { useState } from 'react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import PageTabs from '@/components/shared/PageTabs';

/**
 * BehaviorMethodPageTemplate (구 GuidePageTemplate)
 * 행동요령 페이지의 공통 레이아웃을 담당합니다.
 */
const BehaviorMethodPageTemplate = ({ 
  breadcrumbItems, 
  title, 
  lastUpdated, 
  tabs, 
  children // Render Props Pattern: (activeTab) => ReactNode
}) => {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0 max-w-screen-xl mx-auto">
      
      {/* 1. 상단 브레드크럼 */}
      <PageBreadcrumb items={breadcrumbItems} />

      <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
        {/* 타이틀 및 수정일 */}
        <div className="flex flex-col gap-4 border-b border-graygray-20 pb-6">
          <h1 className="text-heading-xl text-graygray-90">{title}</h1>
          {lastUpdated && (
            <p className="text-detail-m text-graygray-70">
              최종 정보 수정일: {lastUpdated}
            </p>
          )}
        </div>

        {/* 2. 탭 네비게이션 */}
        {tabs && tabs.length > 0 && (
          <PageTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )}

        {/* 3. 안내 박스 */}
        <aside className="w-full p-6 bg-secondary-5 rounded-lg border border-secondary-10 flex items-start gap-2">
           <span className="text-secondary-50 font-bold">💡</span>
           <p className="text-body-m text-graygray-90 leading-relaxed">
             상단의 탭을 선택하여 상황별 세부 행동요령을 확인하세요.
           </p>
        </aside>
      </header>

      {/* 4. 컨텐츠 영역 (탭 인덱스 전달) */}
      <section className="w-full flex flex-col gap-16 mb-20 min-h-[400px]">
        {/* children이 함수면 실행해서 결과 렌더링, 아니면 그대로 렌더링 */}
        {typeof children === 'function' ? children(activeTab) : children}
      </section>
    </div>
  );
};

export default BehaviorMethodPageTemplate;