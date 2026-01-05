const PageTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full" role="tablist">
      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <button
            key={index}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(index)}
            className={`
              flex-1 h-14 flex items-center justify-center px-4 transition-all
              ${isActive 
                ? "bg-secondary-50 text-graygray-0" 
                : "bg-white border border-secondary-5 text-graygray-70 hover:bg-graygray-5"
              }
              lg:first:rounded-l-lg lg:last:rounded-r-lg
              ${!isActive && "lg:border-r-0 lg:last:border-r"}
            `}
          >
            <span className={`text-title-m ${isActive ? "" : "font-normal"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
export default PageTabs;