import { useState } from 'react';
import PageBreadcrumb from './PageBreadcrumb';
import PageTabs from './PageTabs';

const GuidePageTemplate = ({ 
  breadcrumbItems, 
  title, 
  lastUpdated, 
  tabs, 
  children // 탭 아래에 들어갈 실제 컨텐츠 (가이드라인, 비디오 등)
}) => {
  // 탭 상태를 템플릿 내부가 아닌 상위에서 제어할 수도 있지만, 
  // 단순히 보여주기만 한다면 여기서 제어 후 children에 index를 넘겨주는 방식도 가능합니다.
  // 여기서는 부모(Page)에서 children을 통째로 받거나, 
  // render props 패턴을 사용하여 유연하게 처리합니다.
  
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      
      {/* 1. 공통 브레드크럼 */}
      <PageBreadcrumb items={breadcrumbItems} />

      <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-heading-xl text-graygray-90">{title}</h1>
          <p className="text-detail-m text-graygray-70">최종 정보 수정일: {lastUpdated}</p>
        </div>

        {/* 2. 공통 탭 */}
        <PageTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 3. 공통 안내 박스 */}
        <aside className="w-full p-6 bg-secondary-5 rounded-lg">
          <p className="text-body-m text-graygray-90 leading-relaxed">
            * 탭을 선택하여 상황별(전, 중, 후) 행동요령을 확인하세요.
          </p>
        </aside>
      </header>

      {/* 4. 페이지별 컨텐츠 영역 */}
      {/* children을 함수로 받아서 activeTab을 넘겨줄 수 있음 */}
      <section className="w-full flex flex-col gap-16 mb-20">
        {typeof children === 'function' ? children(activeTab) : children}
      </section>
    </div>
  );
};

export default GuidePageTemplate;