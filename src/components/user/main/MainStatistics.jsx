import React from "react";

/*
  MainStatistics 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 메인화면의 재난통계
  > 컴포넌트 설명 : 메인화면(pages/user/UserPageMain.jsx)에 들어갈 재난통계 컴포넌트로, 
    재난 통계에 대한 데이터를 표시함. 추후 api연동 필요.
*/

const MainStatistics = () => {
  return (
    <section className="w-full">
      {/* === 배경을 흰색으로 변경하고 행동요령과 같은 border, shadow 적용 === */}
      <div className="bg-white rounded-xl border border-graygray-10 p-5 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* 왼쪽: 타이틀 & 날짜 정보 */}
        <div className="flex items-center gap-4 w-full md:w-auto">

          <div className="flex flex-col gap-0.5">
            <h3 className="text-title-m sm:text-title-l text-graygray-90 font-bold tracking-tight">
              지난주 주요 재난통계
            </h3>
            <p className="text-detail-m text-graygray-40 font-bold">
              데이터 기준: 2025.12.01 ~ 12.07
            </p>
          </div>
        </div>

        {/* 오른쪽: 통계 수치 영역 */}
        <div className="flex items-center justify-around md:justify-end gap-6 sm:gap-12 w-full md:w-auto border-t border-graygray-5 pt-6 md:pt-0 md:border-t-0">
          
          {/* 발생 건수 */}
          <div className="text-center flex flex-col gap-1 min-w-[80px]">
            <p className="text-detail-m text-graygray-50 font-bold">
              발생 건수
            </p>
            <p className="text-heading-m sm:text-heading-l font-black text-graygray-90 flex items-baseline justify-center gap-0.5">
              458
              <span className="text-detail-m font-bold text-graygray-40">건</span>
            </p>
          </div>

          {/* 구분선 */}
          <div className="w-[1px] h-10 bg-graygray-10" />

          {/* 사망 건수: 여기만 레드 포인트로 강조 */}
          <div className="text-center flex flex-col gap-1 min-w-[80px]">
            <p className="text-detail-m text-red-500 font-bold">
              사망 건수
            </p>
            <p className="text-heading-m sm:text-heading-l font-black text-red-500 flex items-baseline justify-center gap-0.5">
              5
              <span className="text-detail-m font-bold opacity-60">건</span>
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default MainStatistics;