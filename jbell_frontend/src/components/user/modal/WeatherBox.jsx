// ------ 재난사고속보 탭 - 날씨 표시 박스 ----- // 


import React from "react";

const WeatherBox = () => {
  const weatherData = [
    { label: "미세먼지", value: "좋음", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "초미세먼지", value: "좋음", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "강수량", value: "0mm", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "강수확률", value: "10%", color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <>
      <div className="flex justify-between items-start mb-5">
        <div>
          <span className="inline-block px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded mb-2 tracking-tighter">
            LIVE WEATHER
          </span>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-1.5">
            <span className="text-rose-500 text-base">📍</span> 덕진동
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">-2°</span>
          <span className="text-[11px] font-bold text-slate-400 mt-1.5">맑음 / 체감 -5.2°</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {weatherData.map((item) => (
          <div
            key={item.label}
            className={`${item.bg} p-3 rounded-lg border border-white flex flex-col items-center justify-center transition-all hover:scale-[1.02] shadow-sm`}
          >
            <span className="text-[10px] text-slate-500 font-bold mb-1 opacity-70">{item.label}</span>
            <span className={`text-[14px] font-extrabold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherBox;