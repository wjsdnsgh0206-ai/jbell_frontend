import React, { useState } from "react";

export const TimeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("최근 24시간");
  const timeRangeOptions = ["최근 24시간", "1일", "3일", "7일", "30일"];

  return (
    <div className="inline-flex flex-col items-start gap-2 absolute top-[54px] left-[1410px] z-50">
      <div className="flex flex-col w-[140px] items-end pr-1.5 relative">
        <button
          className="inline-flex items-center gap-1 bg-transparent cursor-pointer p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-[#1d1d1d] text-[17px] font-normal">{selectedOption}</span>
          {/* 화살표 아이콘 대체 */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col w-[140px] p-2 bg-white rounded-lg border border-solid border-gray-300 shadow-lg">
          {timeRangeOptions.map((option, index) => (
            <div
              key={index}
              className={`flex items-center px-4 py-[10px] rounded-md cursor-pointer hover:bg-orange-50 ${
                selectedOption === option ? "bg-orange-100 font-bold" : ""
              }`}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              <div className="text-[#1d1d1d] text-[15px]">{option}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};