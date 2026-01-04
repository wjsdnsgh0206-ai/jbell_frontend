// src/components/shared/DetailPageTemplate.jsx
import PageBreadcrumb from './PageBreadcrumb';

const DetailPageTemplate = ({ breadcrumbItems, title, lastUpdated, children }) => {
  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      
      {/* 1. 브레드크럼 */}
      <PageBreadcrumb items={breadcrumbItems} />

      {/* 2. 상세 페이지 헤더 */}
      <header className="flex flex-col items-start gap-4 w-full mb-10 border-b border-graygray-20 pb-6">
        <h1 className="text-heading-l text-graygray-90">
          {title}
        </h1>
        {lastUpdated && (
          <p className="text-detail-m text-graygray-70">
            최종 정보 수정일: {lastUpdated}
          </p>
        )}
      </header>

      {/* 3. 컨텐츠 영역 */}
      <section className="w-full flex flex-col gap-10">
        {children}
      </section>
    </div>
  );
};

export default DetailPageTemplate;