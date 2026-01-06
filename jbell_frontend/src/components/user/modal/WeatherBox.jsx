import React from "react";

/*
  WeatherBox - 다크 배경 대응 버전
  1. 가독성 개선: 어두운 배경에 맞춰 텍스트 컬러를 white 및 white/opacity 위주로 변경
  2. 포인트 컬러: 미세먼지 '좋음' 등 강조가 필요한 곳은 형광기 있는 밝은 컬러 적용
  3. 시각적 분리: border-graygray-5 대신 white/10을 사용하여 은은한 구분선 유지
*/

const WeatherBox = () => {
  const details = [
    { label: "미세먼지", value: "좋음", color: "text-green-300" }, // 밝은 배경보다 더 선명한 컬러
    { label: "초미세", value: "좋음", color: "text-green-300" },
    { label: "강수확률", value: "10%", color: "text-white" },
    { label: "습도", value: "45%", color: "text-white" },
  ];

  return (
    <>
      {/* 상단: 지역 및 핵심 정보 */}
      <div className="flex justify-between items-end pb-4 border-b border-white/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            {/* 메인 텍스트는 순수 흰색으로 */}
            <span className="text-white text-body-m-bold font-semibold">전주시 덕진동</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/20 text-white rounded font-medium">현재위치</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-white">-2°</span>
            <span className="text-detail-m text-white/60 font-medium">맑음</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end text-detail-m text-white/60 font-medium">
          <span>체감 -5.2°</span>
          <span>최저 -8° / 최고 2°</span>
        </div>
      </div>

      {/* 하단: 상세 정보 */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            {/* 레이블은 약간 흐리게 해서 위계를 둠 */}
            <span className="text-detail-m text-white/50 font-medium">{item.label}</span>
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