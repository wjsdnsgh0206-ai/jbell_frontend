import React from "react";

/*
  WeatherBox 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 날씨 표시 박스
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 날씨 컴포넌트로, 날씨 내용을 표시함. 
    재난사고속보 모달 내의 모든 페이지(사고속보, 지진, 태풍, 호우, 홍수, 산사태, 산불)에서 공통으로 사용되는 컴포넌트임.
    추후 api연동 필요함. 
*/

const WeatherBox = () => {
  const weatherData = [
    {
      label: "미세먼지",
      value: "좋음",
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      label: "초미세먼지",
      value: "좋음",
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      label: "강수량",
      value: "0mm",
      color: "text-graygray-80",
      bg: "bg-graygray-5",
    },
    {
      label: "강수확률",
      value: "10%",
      color: "text-graygray-80",
      bg: "bg-graygray-5",
    },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-detail-m font-black rounded-md mb-2.5 tracking-tighter uppercase">
            LIVE WEATHER
          </span>

          <h3 className="text-title-s font-black text-graygray-90 flex items-center gap-1.5">
            <span className="text-blue-600 text-[18px]">📍</span> 덕진동
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-graygray-90 leading-none tracking-tighter tabular-nums">
            -2°
          </span>
          <span className="text-detail-l sm:text-body-m font-black text-graygray-40 mt-2">
            맑음 / 체감 <span className="text-graygray-60">-5.2°</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {weatherData.map((item) => (
          <div
            key={item.label}
            className={`bg-white p-4 rounded-2xl border border-graygray-10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center cursor-default`}
          >
            <span className="text-detail-m text-graygray-40 font-black mb-1.5 uppercase tracking-tight">
              {item.label}
            </span>
            <span
              className={`text-body-m font-black ${item.color} tabular-nums`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherBox;
