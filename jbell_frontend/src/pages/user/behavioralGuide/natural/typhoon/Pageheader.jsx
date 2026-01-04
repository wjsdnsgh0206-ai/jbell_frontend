/**
 * 페이지 타이틀 + 수정일 + 탭
 */
const PageHeader = () => {
  return (
    <header className="flex flex-col gap-6">
      {/* 제목 */}
      <h1 className="text-heading font-bold text-gray-90">
        태풍
      </h1>

      {/* 수정일 */}
      <p className="text-small text-gray-70">
        최종 정보 수정일: 2025년 12월 16일
      </p>

      {/* 탭 */}
      <ActionTabs />
    </header>
  );
};
