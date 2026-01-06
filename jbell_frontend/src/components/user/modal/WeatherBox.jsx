import React from "react";

/*
  WeatherBox - 정갈한 미니멀리즘 버전
  1. 폰트 최적화: 과한 Bold를 줄이고 text-graygray-80과 medium/semibold 위주로 사용
  2. 라인 디자인: 면 대신 얇은 선(border-b)으로 정보를 분리해 시각적 피로도 감소
  3. 컴팩트 레이아웃: 전체적인 텍스트 크기를 낮추고 핵심 정보만 강조
*/

const WeatherBox = () => {
  const details = [
    { label: "미세먼지", value: "좋음", color: "text-blue-500" },
    { label: "초미세", value: "좋음", color: "text-blue-500" },
    { label: "강수확률", value: "10%", color: "text-graygray-80" },
    { label: "습도", value: "45%", color: "text-graygray-80" },
  ];

  return (
    <>
      {/* 상단: 지역 및 핵심 정보 */}
      <div className="flex justify-between items-end pb-4 border-b border-graygray-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-graygray-90 text-body-m-bold font-semibold">전주시 덕진동</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-secondary-5 text-graygray-50 rounded font-medium">현재위치</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-graygray-90">-2°</span>
            <span className="text-detail-m text-graygray-40 font-medium">맑음</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end text-detail-m text-graygray-40 font-medium">
          <span>체감 -5.2°</span>
          <span>최저 -8° / 최고 2°</span>
        </div>
      </div>

      {/* 하단: 상세 정보 (한 줄에 2개씩 정갈하게 배치) */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m text-graygray-40 font-medium">{item.label}</span>
            <span className={`text-detail-m font-semibold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherBox;