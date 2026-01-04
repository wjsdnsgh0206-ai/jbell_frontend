/**
 * 상단 브레드크럼 네비게이션
 */
const Breadcrumb = () => {
  const items = ["홈", "행동요령", "자연재난행동요령", "태풍"];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-small text-gray-70">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span className="underline">{item}</span>
            {idx < items.length - 1 && <span>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};
