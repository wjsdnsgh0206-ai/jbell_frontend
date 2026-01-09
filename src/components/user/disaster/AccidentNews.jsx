// \src\components\user\modal\ActionTipBox.jsx
import React, { useState } from "react";
import ActionTipBox from "../modal/ActionTipBox";

const AccidentNews = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  return (
    // 전체 컨테이너: PC에서는 부모 높이에 맞게 h-full, min-h-0 설정
    <div className="flex-1 flex flex-col min-h-0 gap-5 lg:gap-6 lg:h-full">
      {/* === 사고 목록 + 지도 통합 섹션 === */}
      {/* lg:flex-1을 주어 남은 공간을 지도/리스트가 다 차지하게 함 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row overflow-hidden flex-1 min-h-0">
        {/* 1. 지도 영역: 모바일 order-first, PC order-last */}
        <div className="flex-1 min-h-[300px] md:min-h-[400px] lg:min-h-0 bg-blue-50 relative overflow-hidden flex items-center justify-center order-first lg:order-last border-b lg:border-b-0 lg:border-l border-gray-100">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <span className="text-gray-400 font-bold opacity-50 uppercase tracking-widest text-detail-s md:text-body-m">
              Map View
            </span>
          </div>
          {/* MapControlBtn 같은 컴포넌트가 들어갈 자리 */}
        </div>

        {/* 2. 리스트 영역 */}
        {/* lg:h-full을 주어 부모 섹션 높이에 맞춤 */}
        <div className="w-full lg:w-[320px] flex flex-col bg-graygray-5/30 lg:h-full transition-all duration-300">
          {/* 1. 리스트 헤더 (클릭 시 아코디언 토글) */}
          <div
            className="p-4 md:p-5 border-b border-graygray-10 bg-white flex-shrink-0 cursor-pointer lg:cursor-default"
            onClick={() => {
              if (window.innerWidth < 1024) setIsListOpen(!isListOpen);
            }}
          >
            <h4 className="text-body-m-bold md:text-body-l-bold text-graygray-90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                실시간 상황
                <span className="text-red-500 text-[11px] md:text-detail-m font-black bg-red-50 px-2.5 py-0.5 rounded-full">
                  9건
                </span>
              </div>

              {/* 모바일 전용 화살표 아이콘 */}
              <svg
                className={`w-5 h-5 text-graygray-40 lg:hidden transition-transform duration-300 ${
                  isListOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
          </div>

          {/* 2. 사고 카드 리스트 (아코디언 본문) */}
          <div
            className={`
    flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar
    ${
      isListOpen
        ? "max-h-[500px] opacity-100"
        : "max-h-0 lg:max-h-none opacity-0 lg:opacity-100"
    }
    transition-all duration-300 lg:overflow-y-auto
  `}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white border border-graygray-10 rounded-xl p-4 shadow-sm hover:border-secondary-30 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] md:text-detail-s font-semibold text-graygray-40">
                    2026.01.02 16:10
                  </span>
                </div>
                <h5 className="text-[14px] md:text-body-s-bold text-graygray-90 group-hover:text-secondary-50 transition-colors font-bold">
                  ㅇㅇㅇ 아파트 부근 화재
                </h5>
                <p className="text-detail-s md:text-detail-m text-graygray-60 mt-1 line-clamp-1 font-medium">
                  소방차 출동 중, 인근 도로 우회 바랍니다.
                </p>
                <div className="mt-2.5 flex gap-2">
                  <span className="inline-flex items-center text-[11px] md:text-detail-s font-bold text-red-600">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5 animate-pulse" />
                    화재 진압중
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === 하단 행동요령 박스 === */}
      {/* flex-shrink-0을 줘서 리스트가 길어져도 이 박스가 찌그러지지 않게 함 */}
      {/* <div className="bg-white lg:hidden rounded-xl p-4 md:p-6 shadow-sm border border-graygray-10 flex-shrink-0">
        <ActionTipBox type="사고" />
      </div> */}
    </div>
  );
};

export default AccidentNews;
