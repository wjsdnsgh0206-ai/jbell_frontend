import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TimeRangeSelectorSection = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["최근 24시간", "3일", "7일"];

  return (
    <div className="relative z-10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm min-w-[150px] justify-between hover:border-gray-400 transition-colors"
      >
        <span className="font-medium text-[#1d1d1d]">{selected}</span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul className="absolute top-12 right-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in duration-150">
          {options.map((opt) => (
            <li 
              key={opt}
              onClick={() => { setSelected(opt); setIsOpen(false); }}
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${selected === opt ? "text-blue-600 font-bold bg-blue-50/50" : "text-gray-700"}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeRangeSelectorSection;