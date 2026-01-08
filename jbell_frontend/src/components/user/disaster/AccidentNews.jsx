import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const AccidentNews = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "화재사고", "차량사고", "도로공사"];

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-6">
      {/* === 왼쪽 패널 === */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-6">
        {/* 사고 목록 + 지도 통합 섹션: 높이를 lg:h-[480px]로 축소 */}
        <div className="bg-white rounded-xl shadow-1 border border-graygray-10 flex flex-col lg:flex-row overflow-hidden h-auto lg:h-[480px]">
          {/* 1. 리스트 영역 */}
          <div className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-graygray-10 p-5 flex flex-col gap-4 z-20 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="text-body-l-bold text-graygray-90">
                재난·사고 목록 <span className="text-red-500 ml-1">9</span>
              </h4>
            </div>

            {/* 드롭다운 */}
            <div className="relative">
              <label className="text-detail-s pb-1 font-bold text-graygray-40 ml-1 mb-1 block">
                재난사고구분
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border ${
                  isDropdownOpen
                    ? "border-blue-600 ring-2 ring-blue-50"
                    : "border-graygray-10"
                } px-4 py-2.5 w-full rounded-lg flex justify-between items-center text-detail-m font-bold text-graygray-80 transition-all shadow-sm`}
              >
                {selectedCategory}
                <span
                  className={`text-detail-s transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-graygray-10 shadow-xl rounded-lg py-2 z-[100]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-detail-m text-graygray-60 hover:bg-secondary-5 hover:text-blue-600 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 사고 카드 리스트 (높이가 줄어든 만큼 내부 스크롤이 더 활발해짐) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[300px] lg:max-h-none">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-graygray-10 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-all group cursor-pointer"
                >
                  <div className="bg-secondary-5/50 px-3 py-1.5 border-b border-graygray-5">
                    <span className="text-detail-xs font-bold text-graygray-40">
                      2026.01.02 16:10
                    </span>
                  </div>
                  <div className="p-3 flex flex-col items-center text-center">
                    <h5 className="text-body-s-bold text-graygray-90 mb-2 leading-tight">
                      ㅇㅇㅇ 아파트 앞
                    </h5>
                    <div className="inline-flex items-center gap-1.5 bg-white text-red-600 px-3 py-1 rounded-lg text-detail-s-bold border border-red-500">
                      화재 진압중
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 지도 영역 */}
          <div className="flex-1 min-h-[350px] lg:min-h-full bg-secondary-5 relative overflow-hidden flex items-center justify-center">
            <span className="text-title-s font-black text-graygray-20 tracking-[0.2em] uppercase">
              Map Area
            </span>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white h-[250px] rounded-xl p-6 shadow-1 border border-graygray-10">
          <ActionTipBox type="재난"/>
        </div>
      </div>

      {/* === 오른쪽 패널 === */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-6 items-center lg:items-start">
        <div className="w-full lg:max-w-[370px] h-[200px] bg-gradient-to-br from-[#62A1E9] to-[#4A90E2] rounded-xl p-5 lg:p-6 shadow-1 border border-white/30">
          <WeatherBox />
        </div>

        {/* 재난문자 높이도 왼쪽과 맞추고 싶다면 같이 h-[480px] 정도로 조절 가능 */}
        <div className="w-full max-w-[370px] h-[530px] bg-white rounded-xl shadow-1 border border-graygray-10 overflow-hidden flex flex-col">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default AccidentNews;
