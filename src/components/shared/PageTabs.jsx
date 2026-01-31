// src\components\shared\PageTabs.jsx

/**
 * PageTabs
 * @param {Array} tabs - [{ label: string }]
 * @param {number} activeTab - 현재 활성화된 탭 인덱스
 * @param {function} onTabChange - 탭 변경 핸들러
 */
const PageTabs = ({ tabs, activeTab, onTabChange }) => {
  if (!tabs || tabs.length === 0) return null;

  const totalTabs = tabs.length;

  /**
   * 탭 개수에 따른 동적 그리드 클래스 생성
   * 데스크톱: 탭이 4개면 grid-cols-4, 6개면 grid-cols-3 (2줄) 등으로 유연하게 대응
   * 모바일: 무조건 grid-cols-2로 고정하여 가독성 확보
   */
  const getGridConfig = () => {
    if (totalTabs === 4) return "lg:grid-cols-4 grid-cols-2";
    if (totalTabs % 3 === 0) return "lg:grid-cols-3 grid-cols-2";
    return "lg:grid-cols-4 grid-cols-2"; // 기본값
  };

  return (
    <div 
      className="w-full rounded-lg overflow-hidden shadow-sm border-t border-l border-secondary-10"
      role="tablist"
    >
      <div className={`grid w-full ${getGridConfig()}`}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={`tab-${index}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(index)}
              className={`
                h-14 lg:h-16 flex items-center justify-center px-2 transition-all duration-200
                border-r border-b border-secondary-10 outline-none 
                focus:ring-2 focus:ring-inset focus:ring-secondary-50
                ${isActive 
                  ? "bg-secondary-50 text-white font-bold" 
                  : "bg-white text-graygray-70 hover:bg-secondary-5 font-normal"
                }
              `}
            >
              <span className="text-body-xs lg:text-body-m leading-tight text-center break-keep">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageTabs;