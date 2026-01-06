import React from "react";


/*
  ActionTipBox 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 행동요령 박스
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 행동요령 컴포넌트로, 행동요령 내용을 표시함. 
    재난사고속보 모달 내의 모든 페이지(사고속보, 지진, 태풍, 호우, 홍수, 산사태, 산불)에서 공통으로 사용되는 컴포넌트임.
*/


// 재난별 SVG 아이콘 컴포넌트 (동일)
const Icons = {
  Earthquake: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-amber-600"><path d="M3 10h18M5 10v10M19 10v10M9 14h6M10 17h4" strokeLinecap="round" /><circle cx="12" cy="16" r="1.5" fill="currentColor" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-blue-600"><path d="M13 4v4h4v4h4M3 20h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 11l3-3 3 3M10 8v8" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-rose-600"><path d="M12 9v4M12 17h.01M5 19h14a2 2 0 001.8-2.8L13.8 5.4a2 2 0 00-3.6 0L3.2 16.2A2 2 0 005 19z" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-slate-600"><circle cx="12" cy="12" r="8" /><path d="M12 8v8M8 12h8" strokeLinecap="round" /><path d="M16 16l-8-8" strokeLinecap="round" /></svg>
  ],
  Typhoon: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-sky-600"><path d="M12 3a9 9 0 00-9 9M21 12a9 9 0 01-9 9" strokeLinecap="round" /><circle cx="12" cy="12" r="3" /><path d="M16 8l3-3M8 16l-3 3M16 16l3 3M8 8l-3-3" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-blue-700"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /><path d="M22 12h-3M2 12h3M12 2v3M12 22v-3" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-orange-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.2" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-slate-700"><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M8 20h8M12 16v4" strokeLinecap="round" /></svg>
  ],
  Rain: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-blue-600"><path d="M5 18h14M5 14h14M3 10l2-4h14l2 4" /><circle cx="7" cy="14" r="1" /><circle cx="17" cy="14" r="1" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-rose-500"><path d="M12 2L2 22h20L12 2z" /><path d="M12 12v4M12 18h.01" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-slate-500"><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-green-600"><path d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h4M20 8v8a2 2 0 01-2 2h-2" /><path d="M12 12h8M16 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ],
  Flood: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-blue-500"><path d="M21 16c0-4.4-3.6-8-8-8s-8 3.6-8 8M12 2v6" /><path d="M3 20h18" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-orange-500"><circle cx="12" cy="12" r="6" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-rose-600"><path d="M10 20L3 7h18l-7 13" /><circle cx="12" cy="11" r="2" fill="currentColor" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-cyan-600"><path d="M12 21a2 2 0 100-4 2 2 0 000 4z" /><path d="M12 17V7m-5 5l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ],
  Landslide: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-stone-600"><path d="M3 20l6-12 6 12h-12z" /><path d="M12 10l3 3M16 14l3 3" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-slate-700"><rect x="6" y="4" width="12" height="12" rx="2" /><path d="M9 20h6M12 16v4" strokeLinecap="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-blue-500"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-amber-700"><path d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" /><path d="M12 8v4l2 2" strokeLinecap="round" /></svg>
  ],
  ForestFire: [
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-rose-600"><path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" fill="currentColor" fillOpacity="0.2" /><path d="M8 12c0 2 2 3 4 3s4-1 4-3" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-orange-600"><path d="M17 10l-5-5-5 5M12 5v14" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 14c-2 0-3 1-3 3s1 3 3 3h14c2 0 3-1 3-3s-1-3-3-3" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-green-700"><path d="M12 19V5M5 13l7-8 7 8M8 19h8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full text-rose-700"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" fill="currentColor" fillOpacity="0.2" /></svg>
  ]
};

const ActionTipBox = ({ type = "지진" }) => {
  const tipsData = {
    지진: [
      { id: "01", text: "탁자 아래로 들어가 몸을 보호하세요.", icon: Icons.Earthquake[0] },
      { id: "02", text: "계단을 이용해 운동장 등 넓은 곳으로 대피하세요.", icon: Icons.Earthquake[1] },
      { id: "03", text: "유리창이나 담벼락 근처는 위험하니 피하세요.", icon: Icons.Earthquake[2] },
      { id: "04", text: "흔들림이 멈추면 가스와 전기를 차단하세요.", icon: Icons.Earthquake[3] },
    ],
    태풍: [
      { id: "01", text: "창문은 창틀에 단단히 고정하고 외출을 자제하세요.", icon: Icons.Typhoon[0] },
      { id: "02", text: "해안가나 저지대 근처에는 절대 가지 마세요.", icon: Icons.Typhoon[1] },
      { id: "03", text: "공사장 주변이나 전신주 근처는 위험합니다.", icon: Icons.Typhoon[2] },
      { id: "04", text: "TV나 라디오를 통해 기상 상황을 확인하세요.", icon: Icons.Typhoon[3] },
    ],
    호우: [
      { id: "01", text: "하천변이나 지하 주차장 등 저지대에서 대피하세요.", icon: Icons.Rain[0] },
      { id: "02", text: "공사장이나 축대 근처는 붕괴 위험이 있으니 피하세요.", icon: Icons.Rain[1] },
      { id: "03", text: "맨홀이나 배수구 근처는 물살이 세니 주의하세요.", icon: Icons.Rain[2] },
      { id: "04", text: "비상시를 대비해 응급 용품을 미리 챙겨두세요.", icon: Icons.Rain[3] },
    ],
    홍수: [
      { id: "01", text: "침수 위험이 있을 땐 높은 곳으로 신속히 이동하세요.", icon: Icons.Flood[0] },
      { id: "02", text: "전기를 차단하고 가스 밸브를 잠가 사고를 예방하세요.", icon: Icons.Flood[1] },
      { id: "03", text: "침수된 도로에서는 절대 차량을 운행하지 마세요.", icon: Icons.Flood[2] },
      { id: "04", text: "지정된 대피소 위치를 미리 파악해 두세요.", icon: Icons.Flood[3] },
    ],
    산사태: [
      { id: "01", text: "산 근처 거주민은 미리 대피 준비를 하세요.", icon: Icons.Landslide[0] },
      { id: "02", text: "대피 시에는 전기를 끄고 가스 밸브를 잠그세요.", icon: Icons.Landslide[1] },
      { id: "03", text: "산사태 발생 방향의 반대 방향으로 대피하세요.", icon: Icons.Landslide[2] },
      { id: "04", text: "나무가 기울거나 땅 울림이 들리면 즉시 대피하세요.", icon: Icons.Landslide[3] },
    ],
    산불: [
      { id: "01", text: "불씨가 남지 않도록 등산 시 라이터를 챙기지 마세요.", icon: Icons.ForestFire[0] },
      { id: "02", text: "산불 발생 시 바람을 등지고 신속히 하산하세요.", icon: Icons.ForestFire[1] },
      { id: "03", text: "대피가 어렵다면 이미 탄 지역이나 공터로 대피하세요.", icon: Icons.ForestFire[2] },
      { id: "04", text: "산불 발견 즉시 119나 산림청에 신고하세요.", icon: Icons.ForestFire[3] },
    ],
  };

const currentTips = tipsData[type] || tipsData["지진"];

return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5 px-1">
        <h3 className="text-body-l-bold font-black text-graygray-90 tracking-tight">
          {type} 발생 시 행동요령
        </h3>
        <span className="text-[10px] sm:text-detail-m font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
          Safety Guide
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
  {currentTips.map((tip) => (
    <div 
      key={tip.id} 
      className="group relative flex flex-col bg-white border border-graygray-10 rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md hover:border-graygray-20 transition-all duration-300 overflow-hidden min-h-[140px]"
    >
      <span className="absolute right-4 bottom-3 text-3xl font-black text-graygray-5/40 group-hover:text-blue-100/50 transition-colors pointer-events-none z-0 italic tabular-nums">
        {tip.id}
      </span>

      <div className="relative z-10 w-11 h-11 bg-graygray-5 rounded-xl flex items-center justify-center p-2.5 mb-4 group-hover:bg-blue-50 transition-colors">
        <tip.icon />
      </div>

      <div className="relative z-10 pr-2">
        <p className="text-detail-l sm:text-body-m font-black text-graygray-80 leading-[1.6] break-keep">
          {tip.text}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};



export default ActionTipBox;