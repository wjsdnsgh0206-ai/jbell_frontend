import React, { useMemo } from "react";

/*
  MainStatistics 컴포넌트
  > 메인화면 재난통계
  > 발생 건수 = 기본 발생 건수 + 전북 지진 데이터 건수
*/

const MainStatistics = ({ totalCount }) => {
  // ✅ 오늘 기준 최근 7일 날짜 계산
  const dateRangeText = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);

    startDate.setDate(today.getDate() - 6); // 오늘 포함 7일

    const format = (date) =>
      `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
        date.getDate()
      ).padStart(2, "0")}`;

    return `${format(startDate)} ~ ${format(endDate)}`;
  }, []);

  // ✅ 기본 발생 건수 (추후 API 연동 예정)
  const baseIncidentCount = 0;

  // ✅ 최종 발생 건수
  // const totalIncidentCount = baseIncidentCount + Number(totalCount || 0);

  // console.log("발생건수>>>>",totalIncidentCount);
    // console.log("발생건수>>>>",totalIncidentCount);

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl border border-graygray-10 p-5 sm:p-8 flex flex-col gap-4">

        {/* 상단 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* 타이틀 & 날짜 */}
          <div className="flex flex-col gap-0.5 w-full md:w-auto">
            <h3 className="text-title-m sm:text-title-l text-graygray-90 font-bold tracking-tight">
              지난주 주요 재난통계
            </h3>
            <p className="text-detail-m text-graygray-40 font-bold">
              데이터 기준: {dateRangeText}
            </p>
          </div>

          {/* 통계 수치 */}
          <div className="flex items-center justify-around md:justify-end gap-6 sm:gap-12 w-full md:w-auto border-t border-graygray-5 pt-6 md:pt-0 md:border-t-0">

            {/* 발생 건수 */}
            <div className="text-center flex flex-col gap-1 min-w-[80px]">
              <p className="text-detail-m text-graygray-50 font-bold">
                발생 건수
              </p>
              <p className="text-heading-m sm:text-heading-l font-black text-graygray-90 flex items-baseline justify-center gap-0.5">
                {totalCount}
                <span className="text-detail-m font-bold text-graygray-40">건</span>
              </p>
            </div>


           
          </div>
        </div>

        {/* 하단 안내 문구 */}
        <p className="text-[12px] text-graygray-40 font-medium text-right">
          ※ 일부 데이터는 1년 전 데이터를 제공합니다.
        </p>
      </div>
    </section>
  );
};

export default MainStatistics;
