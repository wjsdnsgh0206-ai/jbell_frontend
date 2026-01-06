import React from "react";

/*
  MainWeather 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 메인화면의 날씨
  > 컴포넌트 설명 : 메인화면(pages/user/UserPageMain.jsx)에 들어갈 날씨 컴포넌트로, 
    날씨관련 정보를 표시함. 추후 api연동 필요. 
*/

const MainWeather = () => {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* === 날씨 메인 카드: 배경에 은은한 블루 그라데이션 추가 === */}
      <div className="flex-1 bg-gradient-to-br from-blue-50/50 to-white rounded-[24px] border border-blue-100 p-5 sm:p-8 shadow-1 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
        {/* 장식용 배경 원형 포인트 */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-body-m-bold flex items-center gap-1.5 text-graygray-90">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                전주시 덕진동
              </p>
              <p className="text-detail-m text-graygray-40 font-bold">
                2026.01.05 15:00 기준
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-200 text-blue-600 text-detail-m font-bold shadow-sm">
              Live
            </div>
          </div>

          <div className="flex items-center gap-6 mt-8 mb-4">
            <span className="text-6xl font-black tracking-tighter text-blue-600 drop-shadow-sm">
              -2°
            </span>
            <div className="flex flex-col">
              <span className="text-title-m font-black text-graygray-90">맑음</span>
              <span className="text-detail-m text-graygray-50 font-bold">체감 -5.4°</span>
            </div>
          </div>
        </div>

        {/* 대기질 정보: 흰색 박스로 대비를 줌 */}
        <div className="grid grid-cols-1 gap-2.5 relative z-10">
          {[
            { label: "미세먼지", value: "좋음", statusColor: "text-blue-500", barColor: "bg-blue-500", percent: "15%" },
            { label: "초미세먼지", value: "보통", statusColor: "text-amber-500", barColor: "bg-amber-500", percent: "45%" }
          ].map((item, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm p-3.5 rounded-xl border border-blue-50 shadow-sm">
              <div className="flex justify-between text-detail-m font-bold mb-2">
                <span className="text-graygray-70">
                  {item.label} <span className={`${item.statusColor} ml-1`}>{item.value}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-graygray-10 rounded-full overflow-hidden">
                <div className={`${item.barColor} h-full transition-all duration-700 ease-out`} style={{ width: item.percent }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 경보 카드: 눈에 띄게 오렌지 테두리 포인트 */}
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