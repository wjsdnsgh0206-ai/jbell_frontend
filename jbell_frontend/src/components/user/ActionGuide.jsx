// ------ 행동요령 탭 (메인에 들어갈 components를 따로 빼서 여기에 저장함.) ------ //
import React, { useState } from "react";

const GUIDE_DATA = {
  재난: [
    { title: "지진 발생 시", desc: "탁자 아래로 들어가 몸 보호", icon: "01" },
    { title: "태풍·호우 시", desc: "외출 자제 및 물가 접근 금지", icon: "02" },
    { title: "산불 발생 시", desc: "산불 방향 확인 후 대피", icon: "03" },
    { title: "황사·미세먼지", desc: "실외 활동 자제 및 마스크 착용", icon: "04" },
  ],
  사고: [
    { title: "교통사고 대응", desc: "비상등 점등 및 안전지대 대피", icon: "01" },
    { title: "전기사고 예방", desc: "젖은 손으로 콘센트 조작 금지", icon: "02" },
    { title: "가스 누출 시", desc: "창문 개방 후 메인 밸브 차단", icon: "03" },
    { title: "승강기 갇힘", desc: "비상호출 버튼 누르고 대기", icon: "04" },
  ],
  생활안전: [
    { title: "입·코 가리기", desc: "젖은 수건 등으로 보호", icon: "01" },
    { title: "낮은 자세 유지", desc: "유도등 따라 대피", icon: "02" },
    { title: "밸브·전원 차단", desc: "가스 및 전기 메인 차단", icon: "03" },
    { title: "비상 계단 대피", desc: "엘리베이터 사용 금지", icon: "04" },
  ],
  긴급상황: [
    { title: "심정지 환자 발견", desc: "119 신고 및 응급처치", icon: "01" },
    { title: "기도 폐쇄 시", desc: "하임리히법 등 응급처치", icon: "02" },
    { title: "소화기 사용법", desc: "핀 뽑고 바람 등지고 분사", icon: "03" },
    { title: "소화전 사용법", desc: "호스 전개 후 밸브 개방", icon: "04" },
  ],
};

const ActionGuide = () => {
  const [activeTab, setActiveTab] = useState("생활안전");

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-5 sm:p-7 shadow-sm h-full flex flex-col min-h-[420px]">
      {/* 상단 타이틀 섹션: 크기 축소 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
            행동요령
          </h2>
        </div>
        <div className="w-8 h-1 bg-blue-600 rounded-full" />
      </div>

      {/* 탭 메뉴: 간격 및 폰트 축소 */}
      <div className="flex gap-6 mb-7 border-b border-gray-50 overflow-x-auto no-scrollbar">
        {Object.keys(GUIDE_DATA).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[14px] font-bold transition-all whitespace-nowrap relative
              ${activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* 내부 컨텐츠: 카드 패딩 및 텍스트 크기 축소 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 content-start">
        {GUIDE_DATA[activeTab].map((item, idx) => (
          <div
            key={`${activeTab}-${idx}`}
            className="group p-4 rounded-[18px] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg hover:shadow-gray-200/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-blue-500/60 tracking-wider uppercase">
                  Guide {item.icon}
                </span>
                <h4 className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[12px] text-gray-500 font-medium leading-snug break-keep">
                  {item.desc}
                </p>
              </div>
              {/* 숫자 배경: 크기 축소 및 투명도 조절 */}
              <span className="text-2xl font-black text-gray-100 group-hover:text-blue-50 transition-colors italic select-none ml-2">
                {item.icon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionGuide;