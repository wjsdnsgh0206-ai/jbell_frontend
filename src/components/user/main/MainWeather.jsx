// src/components/MainWeather.jsx
import React from "react";
import useWeather from "@/hooks/user/useWeather";

const MainWeather = () => {
  const { weather, address, isLoading, error, getWeatherDesc } = useWeather();

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl flex items-center justify-center text-white animate-pulse min-h-[300px]">
        날씨 연결 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl flex items-center justify-center text-white min-h-[300px] p-8 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex-1 bg-gradient-to-br from-[#70a8e9] to-[#426cb9] rounded-xl border border-white/20 p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-body-m-bold flex items-center gap-1.5 text-white font-bold">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {address || "위치 확인 중..."}
              </p>
              <p className="text-detail-m text-white/70 font-bold">
                {new Date().toLocaleDateString()} 기준
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-detail-m font-bold">Live</div>
          </div>

          <div className="flex items-center gap-6 mt-8 mb-4">
            <span className="text-6xl font-black text-white drop-shadow-md">
              {Math.round(weather.main.temp)}°
            </span>
            <div className="flex flex-col">
              <span className="text-title-m font-black text-white">
                {getWeatherDesc(weather.weather[0].id, weather.weather[0].description)}
              </span>
              <span className="text-detail-m text-white/80 font-bold">
                체감 {Math.round(weather.main.feels_like)}°
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 relative z-10">
          {[
            { label: "습도", value: `${weather.main.humidity}%`, barColor: "bg-white", percent: `${weather.main.humidity}%` },
            { label: "풍속", value: `${weather.wind.speed}m/s`, barColor: "bg-amber-200", percent: `${Math.min(weather.wind.speed * 10, 100)}%` }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20">
              <div className="flex justify-between text-detail-m font-bold mb-2 text-white">
                <span>{item.label} <span className="ml-1 opacity-80">{item.value}</span></span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className={`${item.barColor} h-full transition-all duration-700`} style={{ width: item.percent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 하단 경보 카드는 필요시 여기에 그대로 유지 */}
    </div>
  );
};

export default MainWeather;