import React from "react";
import { MainBehaviorMethod, MainWeather, MainStatistics, MainDisaster, MainBoard } from "@/components/user/main/index.js";

/*
  UserPageMain 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 설명 : 재난사고속보 모달창 레이아웃. 
  > 반응형 가이드 : (주석 수정)
    - 웹(lg 이상): 기존 1200px 중앙 정렬 유지
    - 모바일: 세로 배치 및 터치 친화적 간격 적용
*/

const UserPageMain = () => {
  return (
    <div className="w-full min-h-screen bg-white text-graygray-90">
      
      {/* 1. 재난사고속보 & 날씨 섹션 */}
      {/* 모바일에서는 상단 여백을 살짝 줄여서 첫 화면 이탈 방지 */}
      <section className="w-full mt-[10px] lg:mt-[20px]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 lg:py-6">
          {/* 모바일: flex-col(세로), 웹: flex-row(가로) */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            
            {/* 재난사고속보 박스 */}
            <div className="flex-1 bg-white border border-graygray-10 rounded-xl p-5 sm:p-8">
              <MainDisaster />
            </div>

            {/* 날씨 영역: 모바일에서도 꽉 차게, 웹에서는 420px 고정 */}
            <div className="w-full lg:w-[420px] flex flex-col gap-4">
              <MainWeather />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-2 lg:py-0">
          <MainStatistics />
        </div>
      </section>

      {/* 3. 공지사항 & 행동요령 섹션 */}
      <section className="w-full">
        {/* 모바일 하단 여백 최적화 (pb-12), 웹은 기존 pb-28 유지 */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-4 lg:pt-6 pb-12 lg:pb-28">
          {/* 모바일: 1열 배치, 웹: 2열(lg:grid-cols-2) 배치 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
            
            {/* 공지사항 탭 박스 */}
            <div className="w-full">
              <MainBoard />
            </div>

            {/* 행동요령 박스 */}
            <div className="flex flex-col h-full w-full">
              <MainBehaviorMethod />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default UserPageMain;