import React from "react";

/*
  FacilityCheckGroup - 범용 컴포넌트
  - items: [{ id: "ID", label: "이름" }] 형태의 배열
  - facilities: 현재 체크 상태 객체
  - onCheck: 핸들러 함수
*/
const FacilityCheckGroup = ({ 
  items = [ // 기본값은 지진 항목으로 설정
    { id: "shelter", label: "지진옥외대피장소" },
    { id: "hospital", label: "병원" },
    { id: "pharmacy", label: "약국" },
  ], 
  facilities, 
  onCheck 
}) => {
  return (
    <div className="flex flex-col gap-1 mt-1 ml-1 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-graygray-10 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
      {items.map((item) => (
        <label key={item.id} className="flex items-center gap-2.5 cursor-pointer py-1.5 group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={facilities[item.id] || false}
              onChange={() => onCheck(item.id)}
              className="peer appearance-none w-4 h-4 rounded border-2 border-graygray-20 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
            />
            <svg
              className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            className={`text-[11px] sm:text-detail-m font-bold transition-colors ${
              facilities[item.id] ? "text-graygray-90" : "text-graygray-40"
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