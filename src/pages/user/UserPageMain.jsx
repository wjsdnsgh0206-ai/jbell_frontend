import React, { useEffect } from "react";
import {
  MainBehaviorMethod,
  MainWeather,
  MainStatistics,
  MainDisaster,
  MainBoard,
} from "@/components/user/main/index.js";

import useEarthquake from "@/hooks/user/useEarthquake";
import { useSluiceData } from "@/hooks/user/useSluiceData";
import useLandSlide from "@/hooks/user/useLandSlide";
import useTyphoon from "@/hooks/user/useTyphoon";
import useForestFire from "@/hooks/user/useForestFire"; // ✅ 산불 추가

/*
  UserPageMain 컴포넌트
  > 재난 메인 페이지
*/

const UserPageMain = () => {
  /* =========================
      지진
  ========================= */
  const { earthquakeCount, fetchEarthquakeData } = useEarthquake();

  /* =========================
      태풍
  ========================= */
  const { typhoonCount, fetchTyphoonData } = useTyphoon();

  /* =========================
      호우 / 홍수
  ========================= */
  const {
    rainCount,              // 호우 특보 발생 건수
    fetchRainfallWarning,
  } = useSluiceData();

  /* =========================
      산사태
  ========================= */
  const {
    lsCount,                // 산사태 발생 건수
    fetchLandSlideData,
  } = useLandSlide();

  /* =========================
      산불
  ========================= */
  const {
    fireCount,              // 산불 발생 건수
    fetchFireData,
  } = useForestFire();

  /* =========================
      메인 진입 시 데이터 로딩
  ========================= */
  useEffect(() => {
    fetchEarthquakeData();     // 지진
    fetchRainfallWarning();    // 호우
    fetchLandSlideData();      // 산사태
    fetchTyphoonData();        // 태풍
    fetchFireData();           // 산불
  }, [
    fetchEarthquakeData,
    fetchRainfallWarning,
    fetchLandSlideData,
    fetchTyphoonData,
    fetchFireData,
  ]);

  /* =========================
      전체 발생 건수 합산
  ========================= */
  const totalDisasterCount =
    (earthquakeCount || 0) +
    (rainCount || 0) +
    (lsCount || 0) +
    (typhoonCount || 0) +
    (fireCount || 0);

  return (
    <div className="w-full min-h-screen bg-white text-graygray-90">
      {/* 1. 재난사고속보 & 날씨 */}
      <section className="w-full mt-[10px] lg:mt-[20px]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* 재난사고속보 */}
            <div className="flex-1 bg-white border border-graygray-10 rounded-xl p-5 sm:p-8">
              <MainDisaster />
            </div>

            {/* 날씨 */}
            <div className="w-full lg:w-[420px] flex flex-col gap-4">
              <MainWeather />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-2 lg:py-0">
          <MainStatistics totalCount={totalDisasterCount} />
        </div>
      </section>

      {/* 3. 공지사항 & 행동요령 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-4 lg:pt-6 pb-12 lg:pb-28">
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
