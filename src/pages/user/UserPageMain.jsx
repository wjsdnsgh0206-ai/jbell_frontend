import React from "react";
import { MainBehaviorMethod, MainWeather, MainStatistics, MainDisaster, MainBoard } from "@/components/user/main/index.js";

/*
  UserPageMain 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 설명 : 재난사고속보 모달창 레이아웃. 
  > 반응형 가이드 : 
    - 웹(lg 이상): 기존 1200px 중앙 정렬 유지
    - 모바일: 세로 배치 및 터치 친화적 간격 적용
*/

const UserPageMain = () => {
  return (
    <div className="w-full min-h-screen bg-white text-graygray-90">
      
      {/* 1. 재난사고속보 & 날씨/재난문자 섹션 */}
      <section className="w-full mt-[10px] lg:mt-[20px]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            
            {/* [왼쪽] 재난사고속보 박스 (원래대로 크게) */}
            <div className="flex-1 bg-white border border-graygray-10 rounded-2xl p-5 sm:p-8 shadow-sm">
              <MainDisaster />
            </div>

            {/* [오른쪽] 날씨 + 재난문자 세로 그룹 */}
            <div className="w-full lg:w-[420px] flex flex-col gap-4 shrink-0 bg-gray-300">
              
              {/* 날씨 박스 */}
              <div className="w-full">
                <MainWeather />
              </div>

              {/* ✅ 날씨 바로 아래 추가된 재난문자 박스 */}
              <div className="w-full bg-white border border-graygray-10 rounded-2xl overflow-hidden shadow-sm">
                <DisasterMessage />
              </div>

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
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-4 lg:pt-6 pb-12 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
            <div className="w-full">
              <MainBoard />
            </div>
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