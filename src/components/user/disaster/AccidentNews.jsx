import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";

const AccidentNews = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "화재사고", "차량사고", "도로공사"];

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* === 사고 목록 + 지도 통합 섹션 === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-shrink-0 lg:flex-1 min-h-0">
        
        {/* 1. 리스트 영역: 모바일은 지도 아래 혹은 위로 배치 가능 (여기서는 위) */}
        <div className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-gray-10 p-4 md:p-5 flex flex-col gap-4 bg-white">
          <div className="flex items-center justify-between">
            <h4 className="text-body-m-bold md:text-body-l-bold text-graygray-90">
              재난·사고 목록 <span className="text-red-500 ml-1">9</span>
            </h4>
          </div>

          {/* 카테고리 선택 */}
          <div className="relative">
            <label className="text-detail-s font-bold text-gray-400 ml-1 mb-1 block">
              재난사고구분
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-lg flex justify-between items-center text-detail-m font-bold text-gray-800 transition-all shadow-sm active:bg-gray-50"
            >
              {selectedCategory}
              <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-lg py-2 z-[100]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 사고 카드 리스트: 모바일은 3개 정도 보여주고 스크롤, PC는 전체 높이 스크롤 */}
          <div className="flex-1 overflow-y-auto max-h-[320px] lg:max-h-none space-y-3 pr-1 custom-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-blue-200 transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-50">
                  <span className="text-[10px] md:text-detail-xs font-bold text-gray-400">
                    2026.01.02 16:10
                  </span>
                </div>
                <div className="p-3 flex flex-col items-center text-center">
                  <h5 className="text-body-s-bold text-gray-900 mb-2">ㅇㅇㅇ 아파트 앞</h5>
                  <div className="inline-flex items-center gap-1.5 bg-white text-red-600 px-3 py-1 rounded-lg text-detail-s-bold border border-red-500">
                    화재 진압중
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 지도 영역: 모바일에서는 최소 높이 250px 확보 */}
        <div className="flex-1 min-h-[250px] md:min-h-[350px] lg:min-h-0 bg-blue-50 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
             <span className="text-gray-400 font-bold opacity-50 uppercase tracking-widest">Map View</span>
          </div>
        </div>
      </div>

      {/* 3. 하단 행동요령: 모바일에서는 가로 스크롤이 생길 수 있으므로 패딩 주의 */}
      <div className="flex-shrink-0 overflow-x-auto pb-2">
        <ActionTipBox />
      </div>
    </div>
  );
};

export default AccidentNews;