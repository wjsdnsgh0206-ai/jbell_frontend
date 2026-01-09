import React from "react";

/*
  FacilityCheckGroup - 범용 컴포넌트
  - 모바일: 지도 상단 가로 스크롤 칩 형태
  - PC: 기존 박스 형태 유지
*/
const FacilityCheckGroup = ({ 
  items = [
    { id: "shelter", label: "지진옥외대피장소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], 
  facilities, 
  onCheck 
}) => {
  return (
    /* container 설정:
       - 모바일: flex-row, overflow-x-auto (가로 스크롤)
       - PC(lg): flex-col, w-fit (세로 정렬 박스)
    */
    <div className="flex flex-row lg:flex-col gap-2 lg:gap-1 p-2 lg:p-3 bg-white/90 backdrop-blur-md rounded-full lg:rounded-2xl border border-graygray-10 animate-in fade-in slide-in-from-top-2 duration-300 overflow-x-auto no-scrollbar max-w-[95vw] lg:max-w-none">
      {items.map((item) => (
        <label 
          key={item.id} 
          className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 lg:px-1 lg:py-1.5 rounded-full lg:rounded-none transition-all whitespace-nowrap group ${
            facilities[item.id] && "bg-blue-50 lg:bg-transparent" 
          }`}
        >
          <div className="relative flex items-center justify-center flex-shrink-0">
            <input
              type="checkbox"
              checked={facilities[item.id] || false}
              onChange={() => onCheck(item.id)}
              className="peer appearance-none w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 rounded border-2 border-graygray-20 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
            />
            <svg
              className="absolute w-2.5 h-2.5 md:w-3 md:h-3 lg:w-2.5 lg:h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <span
            className={`text-[12px] md:text-body-s lg:text-detail-m font-black lg:font-bold transition-colors ${
              facilities[item.id] ? "text-blue-600 lg:text-graygray-90" : "text-graygray-40"
            }`}
          >
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default FacilityCheckGroup;