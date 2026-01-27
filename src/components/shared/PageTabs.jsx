// src/components/shared/PageTabs.jsx

const PageTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div 
      className="grid grid-cols-3 w-full border-t border-l border-secondary-10 rounded-lg overflow-hidden shadow-sm" 
      role="tablist"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <button
            // [중요] map의 최상위 요소인 button에 반드시 key가 있어야 합니다.
            key={`tab-${index}`} 
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(index)}
            className={`
              h-16 flex items-center justify-center px-2 transition-all
              border-r border-b border-secondary-10
              ${isActive 
                ? "bg-secondary-50 text-white font-bold" 
                : "bg-white text-graygray-70 hover:bg-secondary-5 font-normal"
              }
            `}
          >
            <span className="text-body-s lg:text-body-m leading-tight text-center break-keep">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PageTabs;