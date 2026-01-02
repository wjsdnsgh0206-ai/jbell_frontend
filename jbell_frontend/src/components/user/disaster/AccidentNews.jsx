// ----------- 사고속보 ----------- //
import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";

const AccidentNews = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "화재사고", "차량사고", "도로공사"];

  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {/* 왼쪽 & 중앙 영역 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 lg:gap-6">
        
        {/* 사고 목록 + 지도 통합 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          
          {/* 1. 왼쪽: 사고 리스트 사이드바 */}
          <div className="w-full lg:w-[320px] bg-slate-50/30 border-r border-gray-100 p-5 flex flex-col gap-4 z-20">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-black text-slate-800">
                재난·사고 목록 <span className="text-rose-500 ml-1">9</span>
              </h4>
            </div>

            {/* 드롭다운 영역 */}
            <div className="relative">
              <label className="text-[11px] font-bold text-slate-400 ml-1 mb-1 block font-sans">재난사고구분</label>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-white border ${isDropdownOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-gray-200'} 
                px-4 py-3 rounded-lg flex justify-between items-center text-[14px] font-bold text-slate-700 transition-all shadow-sm`}
              >
                {selectedCategory}
                <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* 드롭다운 Floating 창 */}
              {isDropdownOpen && (
                <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 사고 카드 리스트 (스크롤) */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar max-h-[450px] lg:max-h-none">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-all group cursor-pointer">
                  <div className="bg-slate-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[11px] font-black text-slate-500 tracking-tight">
                        2026.01.02 16:10:02
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <h5 className="text-[14px] font-bold text-slate-800 mb-3 leading-tight">
                      위치 : ㅇㅇㅇ 아파트 앞
                    </h5>
                    <div className="inline-flex items-center gap-2 bg-white text-rose-600 px-4 py-1.5 rounded-full text-[13px] font-extrabold border-2 border-rose-500 shadow-sm shadow-rose-100">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                      </span>
                      화재 진압중
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 오른쪽: 지도 영역 (MAP AREA) */}
          <div className="flex-1 min-h-[350px] lg:min-h-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
            {/* 배경 격자나 미세한 패턴을 넣어 밋밋함 방지 (선택) */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-300 tracking-[0.3em] uppercase">Map Area</span>
            </div>

            {/* 지도 위 플로팅 컨트롤 (확대/축소 예시) */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white shadow-lg rounded-lg border border-gray-100 flex items-center justify-center text-xl font-black text-slate-600 hover:bg-slate-50">+</button>
              <button className="w-10 h-10 bg-white shadow-lg rounded-lg border border-gray-100 flex items-center justify-center text-xl font-black text-slate-600 hover:bg-slate-50">-</button>
            </div>
          </div>
        </div>
        {/* 행동요령 박스 */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border">
          <ActionTipBox />
        </div>
      </div>

      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6">
        {/* 날씨 박스 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <WeatherBox />
        </div>

        {/* 재난문자 */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full border border-gray-100/50">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};
export default AccidentNews;
