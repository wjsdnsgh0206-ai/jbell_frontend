import React, { useState } from "react";
import { Clock, ChevronDown } from "lucide-react";

export const TimeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("최근 24시간");
  const timeRangeOptions = ["최근 24시간", "1일", "3일", "7일", "30일"];

  return (
    <div className="absolute top-[60px] left-[1380px] z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm hover:border-orange-300 transition-all active:scale-95"
      >
        <Clock size={18} className="text-orange-500" />
        <span className="text-[#1d1d1d] text-sm font-bold min-w-[80px] text-left">{selectedOption}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[160px] bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {timeRangeOptions.map((option, index) => (
            <button
              key={index}
              className={`w-full flex items-center px-5 py-3 text-sm font-medium transition-colors ${
                selectedOption === option ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};