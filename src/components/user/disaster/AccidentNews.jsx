import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";

const AccidentNews = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "화재사고", "차량사고", "도로공사"];

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6">
      {/* === 사고 목록 + 지도 통합 섹션 === */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">

        {/* 1. 리스트 영역 */}
        <div className="w-full lg:w-[320px] flex flex-col bg-gray-50/30">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h4 className="text-body-m-bold text-gray-900 flex items-center justify-between">
              실시간 상황
              <span className="text-red-500 text-detail-s font-black bg-red-50 px-2 py-0.5 rounded-full">
                9건
              </span>
            </h4>
          </div>

          {/* 사고 카드 리스트 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar lg:max-h-[600px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:ring-2 hover:ring-blue-100 transition-all  group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-semibold text-gray-400">
                    2026.01.02 16:10
                  </span>
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                    주의
                  </span>
                </div>
                <h5 className="text-body-s-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  ㅇㅇㅇ 아파트 부근 화재
                </h5>
                <p className="text-detail-s text-gray-500 mt-1 line-clamp-1">
                  소방차 출동 중, 인근 도로 우회 바랍니다.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center text-[11px] font-bold text-red-600">
                    ● 화재 진압중
                  </span>
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