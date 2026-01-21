import React from "react";
import useWeather from "@/hooks/user/useWeather";

const MainWeather = () => {
  // 훅에서 dust 데이터도 함께 가져와
  const { weather, dust, address, isLoading, error, getWeatherDesc } = useWeather();

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

  // 미세먼지 데이터 및 등급 계산 (데이터가 있을 때만 실행)
  const pm10 = dust?.list[0].components.pm10;
  const pm2_5 = dust?.list[0].components.pm2_5;

  const getDustStatus = (val) => {
    if (val <= 30) return "좋음";
    if (val <= 80) return "보통";
    if (val <= 150) return "나쁨";
    return "매우나쁨";
  };

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

        {/* 미세먼지 포함 상세 그리드 영역 */}
        <div className="grid grid-cols-1 gap-2.5 relative z-10">
          {[
            { 
              label: "미세먼지", 
              value: pm10 ? `${Math.floor(pm10)}㎍/㎥ (${getDustStatus(pm10)})` : "정보 없음", 
              barColor: pm10 > 80 ? "bg-amber-300" : "bg-emerald-300", 
              percent: `${Math.min((pm10 / 150) * 100, 100)}%` 
            },
            { 
              label: "습도", 
              value: `${weather.main.humidity}%`, 
              barColor: "bg-white", 
              percent: `${weather.main.humidity}%` 
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20">
              <div className="flex justify-between text-detail-m font-bold mb-2 text-white">
                <span>{item.label} <span className="ml-1 opacity-80 font-normal">{item.value}</span></span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className={`${item.barColor} h-full transition-all duration-700`} style={{ width: item.percent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 하단 경보 카드 (기존 유지) */}
      <div className="bg-white border-l-4 border-l-orange-500 border border-graygray-10 rounded-[24px] p-4 flex items-center gap-4 shadow-1 hover:translate-y-[-2px] transition-all">
        <div className="bg-orange-500 text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold shadow-md">
          <span className="text-[9px] opacity-80 leading-none mb-0.5">LV</span>
          <span className="text-xl leading-none">03</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-detail-m font-bold text-orange-600 mb-0.5">태풍 주의보 발령</p>
          <h4 className="text-body-m-bold text-graygray-90 truncate">강풍 동반 집중호우 주의</h4>
        </div>
      </div>
    </div>
  );
};

export default MainWeather;