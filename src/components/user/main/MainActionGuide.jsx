import React, { useState } from "react";

/*
  MainActionGuide 컴포넌트
  > 작성자 : 최지영
  > 포인트 : 카드 내부 숫자와 호버 시 배경색에 테마 컬러 적용
  > 수정사항 : 디자인 토큰(graygray, secondary) 및 Semantic Class 적용
*/

const GUIDE_DATA = {
  재난: [
    { title: "지진 발생 시", desc: "탁자 아래로 들어가 몸 보호", icon: "01", color: "text-amber-500", bg: "bg-amber-50" },
    { title: "태풍·호우 시", desc: "외출 자제 및 물가 접근 금지", icon: "02", color: "text-secondary-50", bg: "bg-secondary-5" },
    { title: "산불 발생 시", desc: "산불 방향 확인 후 대피", icon: "03", color: "text-orange-500", bg: "bg-orange-50" },
    { title: "황사·미세먼지", desc: "실외 활동 자제 및 마스크 착용", icon: "04", color: "text-green-500", bg: "bg-green-50" },
  ],
  사고: [
    { title: "교통사고 대응", desc: "비상등 점등 및 안전지대 대피", icon: "01", color: "text-red-500", bg: "bg-red-50" },
    { title: "전기사고 예방", desc: "젖은 손으로 콘센트 조작 금지", icon: "02", color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "가스 누출 시", desc: "창문 개방 후 메인 밸브 차단", icon: "03", color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "승강기 갇힘", desc: "비상호출 버튼 누르고 대기", icon: "04", color: "text-indigo-500", bg: "bg-indigo-50" },
  ],
  생활안전: [
    { title: "입·코 가리기", desc: "젖은 수건 등으로 보호", icon: "01", color: "text-sky-500", bg: "bg-sky-50" },
    { title: "낮은 자세 유지", desc: "유도등 따라 대피", icon: "02", color: "text-lime-600", bg: "bg-lime-50" },
    { title: "밸브·전원 차단", desc: "가스 및 전기 메인 차단", icon: "03", color: "text-rose-500", bg: "bg-rose-50" },
    { title: "비상 계단 대피", desc: "엘리베이터 사용 금지", icon: "04", color: "text-cyan-500", bg: "bg-cyan-50" },
  ],
  긴급상황: [
    { title: "심정지 환자 발견", desc: "119 신고 및 응급처치", icon: "01", color: "text-red-600", bg: "bg-red-50" },
    { title: "기도 폐쇄 시", desc: "하임리히법 등 응급처치", icon: "02", color: "text-orange-600", bg: "bg-orange-50" },
    { title: "소화기 사용법", desc: "핀 뽑고 바람 등지고 분사", icon: "03", color: "text-rose-600", bg: "bg-rose-50" },
    { title: "소화전 사용법", desc: "호스 전개 후 밸브 개방", icon: "04", color: "text-red-500", bg: "bg-red-50" },
  ],
};

const MainActionGuide = () => {
  const [activeTab, setActiveTab] = useState("생활안전");

  return (
    <div className="bg-graygray-0 rounded-[24px] border border-graygray-10 p-5 sm:p-8 shadow-1 h-full flex flex-col min-h-[420px]">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-title-m sm:text-title-l text-graygray-90 font-bold">
            행동요령
          </h2>
        </div>
        {/* 하이라이트 바: 브랜드 컬러 secondary-50 적용 */}
        <div className="w-10 sm:w-15 h-1 bg-secondary-50 rounded-full" />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-4 sm:gap-6 mb-6 border-b border-graygray-10 overflow-x-auto scrollbar-hide">
        {Object.keys(GUIDE_DATA).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-body-m-bold transition-all whitespace-nowrap relative shrink-0
              ${activeTab === tab ? "text-secondary-50" : "text-graygray-40 hover:text-graygray-70"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-secondary-50 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 내부 컨텐츠 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 content-start">
        {GUIDE_DATA[activeTab].map((item, idx) => (
          <div
            key={`${activeTab}-${idx}`}
            className={`group relative p-4 rounded-[16px] border border-transparent transition-all duration-300 cursor-pointer
              bg-graygray-5 hover:bg-graygray-0 hover:border-graygray-10 hover:shadow-md`}
          >
            <div className="flex items-start justify-between z-10 relative">
              <div className="flex flex-col gap-1 pr-2">
                <span className={`text-[10px] font-black ${item.color} tracking-widest uppercase mb-0.5 opacity-80`}>
                  Step {item.icon}
                </span>
                <h4 className="text-body-m-bold text-graygray-90 group-hover:text-secondary-50 transition-colors">
                  {item.title}
                </h4>
                <p className="text-detail-m text-graygray-60 leading-snug break-keep group-hover:text-graygray-80">
                  {item.desc}
                </p>
              </div>
              
              {/* 우측 숫자 아이콘: 디자인 가이드 유지 */}
              <span className={`text-4xl font-black italic select-none transition-all duration-300 
                ${item.color} opacity-10 group-hover:opacity-100 group-hover:scale-110`}>
                {item.icon}
              </span>
            </div>
            
            {/* 호버 시 하단 라인: 아이템별 포인트 컬러 또는 브랜드 컬러 활용 */}
            <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-[16px] ${item.bg}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainActionGuide;