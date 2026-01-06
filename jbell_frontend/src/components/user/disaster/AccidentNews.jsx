import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

/*
  AccidentNews 컴포넌트
  > 수정 사항: 
    1. 날씨 박스 배경색을 다시 bg-white로 변경
    2. 모든 박스의 border-radius를 rounded-[24px]로 유지 (Earthquake와 통일)
    3. 전체적인 간격 및 레이아웃 구조 유지
*/

const AccidentNews = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "화재사고", "차량사고", "도로공사"];

  return (
    <div className="grid grid-cols-12 gap-5 lg:gap-8">
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 lg:gap-8">
        
        {/* === 사고 목록 + 지도 통합 섹션 === */}
        <div className="bg-white rounded-[24px] shadow-1 border border-graygray-10 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          
          {/* 1. 왼쪽: 사고 리스트 사이드바 */}
          <div className="w-full lg:w-[320px] border-r border-graygray-10 p-5 flex flex-col gap-4 z-20">
            <div className="flex items-center justify-between">
              <h4 className="text-body-l-bold text-graygray-90">
                재난·사고 목록 <span className="text-red-500 ml-1">9</span>
              </h4>
            </div>
            
            {/* 드롭다운 영역 */}
            <div className="relative">
              <label className="text-[11px] font-bold text-graygray-40 ml-1 mb-1 block">재난사고구분</label>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border ${isDropdownOpen ? 'border-blue-600 ring-2 ring-blue-50' : 'border-graygray-10'} 
                px-4 py-3 rounded-xl flex justify-between items-center text-body-m font-bold text-graygray-80 transition-all shadow-sm`}
              >
                {selectedCategory}
                <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-graygray-10 shadow-xl rounded-xl py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-body-m font-bold text-graygray-60 hover:bg-secondary-5 hover:text-blue-600 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 사고 카드 리스트 */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[400px] lg:max-h-none">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-graygray-10 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-all group cursor-pointer">
                  <div className="bg-secondary-5/50 px-3 py-2 border-b border-graygray-5 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-graygray-20 rounded-full" />
                      <span className="text-detail-m font-bold text-graygray-40 tracking-tight">
                        2026.01.02 16:10:02
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <h5 className="text-body-m font-bold text-graygray-90 mb-3 leading-tight">
                      위치 : ㅇㅇㅇ 아파트 앞
                    </h5>
                    <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-1.5 rounded-full text-detail-m font-black border-2 border-red-500 shadow-sm shadow-red-50">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                      </span>
                      화재 진압중
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 오른쪽: 지도 영역 */}
          <div className="flex-1 min-h-[400px] lg:min-h-full bg-secondary-5 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                </div>
              </div>
              <span className="text-title-m font-black text-graygray-20 tracking-[0.3em] uppercase select-none">Map Area</span>
            </div>
          </div>
        </div>

        {/* 행동요령 박스 */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-1 border border-graygray-10">
          <ActionTipBox />
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 lg:gap-8">
        
        {/* 날씨 박스 */}
     <div className="bg-gradient-to-br from-[#62A1E9] to-[#4A90E2] rounded-[24px] p-6 shadow-1 border border-white/30">
          <WeatherBox />
        </div>

        {/* 재난문자 */}
        <div className="bg-white rounded-[24px] shadow-1 flex flex-col h-full border border-graygray-10 overflow-hidden min-h-[400px]">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};

export default AccidentNews;