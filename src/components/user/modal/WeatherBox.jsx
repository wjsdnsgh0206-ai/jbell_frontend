import React from "react";
import useWeather from "@/hooks/user/useWeather";

const WeatherBox = () => {
  const { weather, dust, address, error, getWeatherDesc } = useWeather();

  if (error)
    return (
      <div className="h-full flex items-center justify-center text-white text-[12px] md:text-detail-m">
        {error}
      </div>
    );

  if (!weather || !dust)
    return (
      <div className="h-full flex items-center justify-center text-white text-[12px] md:text-detail-m animate-pulse">
        날씨 확인 중...
      </div>
    );

  // 미세먼지 수치 및 상태 추출
  const pm10 = dust.list[0].components.pm10;
  const pm2_5 = dust.list[0].components.pm2_5;

  const getDustStatus = (val) => {
    if (val <= 30) return "좋음";
    if (val <= 80) return "보통";
    if (val <= 150) return "나쁨";
    return "매우나쁨";
  };

  const getPM25Status = (val) => {
    if (val <= 15) return "좋음";
    if (val <= 35) return "보통";
    if (val <= 75) return "나쁨";
    return "매우나쁨";
  };

  // 기존 상세 정보에 미세먼지 데이터만 추가
  const details = [
    { label: "체감온도", value: `${Math.round(weather.main.feels_like)}°` },
    { label: "습도", value: `${weather.main.humidity}%` },
    { label: "미세먼지", value: `${Math.floor(pm10)} (${getDustStatus(pm10)})` },
    { label: "초미세", value: `${Math.floor(pm2_5)} (${getPM25Status(pm2_5)})` },
    { label: "풍속", value: `${weather.wind.speed}m/s` },
    { label: "구름", value: `${weather.clouds.all}%` },
  ];

  return (
    <div className="relative h-full flex flex-col justify-between">
      {/* 상단 섹션 (기존 유지) */}
      <div className="flex flex-col flex-1 justify-center pb-2 border-b border-white/10">
        <div className="flex justify-between items-start mb-1 md:mb-0">
          <span className="text-white text-detail-l md:text-body-m-bold truncate block max-w-[200px] md:max-w-full font-bold">
            {address || "위치 계산 중..."}
          </span>
          <span className="text-[10px] md:text-detail-s px-2 py-0.5 md:py-1 bg-white/25 text-white rounded-md font-bold whitespace-nowrap backdrop-blur-md border border-white/20">
            {address ? "실시간 위치" : "기본위치"}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-heading-l md:text-title-xl mt-1 text-white font-black">
            {Math.round(weather.main.temp)}°
          </span>
          <span className="text-detail-m md:text-body-s text-white/80 font-medium">
            {getWeatherDesc(weather.weather[0].id, weather.weather[0].description)}
          </span>
        </div>
      </div>

      {/* 하단 상세 정보 섹션 (기존 그리드 유지 + 미세먼지 항목 추가) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-2.5 pt-3 md:pt-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-detail-m md:text-detail-m text-white/60 font-medium">
              {item.label}
            </span>
            <span className="text-detail-m md:text-detail-m font-bold text-white whitespace-nowrap">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherBox;