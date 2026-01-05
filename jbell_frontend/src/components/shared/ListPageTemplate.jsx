// src/components/shared/ListPageTemplate.jsx
import PageBreadcrumb from './PageBreadcrumb'; // 기존 컴포넌트 재사용

const ListPageTemplate = ({ breadcrumbItems, title, lastUpdated, children }) => {
  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      
      {/* 1. 브레드크럼 */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* 2. 페이지 헤더 */}
      <header className="flex flex-col w-full gap-4 mb-10">
        <h1 className="text-heading-m text-graygray-90">{title}</h1>
        {lastUpdated && (
          <p className="text-detail-m text-graygray-70">
            최종 정보 수정일: {lastUpdated}
          </p>
        )}
      </header>

      {/* 3. 컨텐츠 영역 (필터 + 리스트) */}
      <section className="w-full flex flex-col gap-6">
        {children}
      </section>
    </div>
  );
};

export default ListPageTemplate;