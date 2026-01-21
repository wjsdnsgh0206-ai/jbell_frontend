import React, { useState } from "react";

export const MessageBoard = () => {
  const [activeTab, setActiveTab] = useState("messages");

  const messages = [
    { id: 1, title: "[행정안전부] 오늘 14:00 폭염경보 발효", time: "10분 전", color: "#FF9F43" },
    { id: 2, title: "[기상청] 오늘 15:30 태풍 예보", time: "30분 전", color: "#00CFE8" },
    { id: 3, title: "[보건복지부] 코로나19 신규 확진자 수 발표", time: "1시간 전", color: "#FF4842" },
    { id: 4, title: "[교육부] 오늘 17:00 학교 운영 방침 변경", time: "1시간 반 전", color: "#54D62C" },
    { id: 5, title: "[환경부] 오늘 18:00 대기오염 경고 발령", time: "2시간 전", color: "#1890FF" },
  ];

  return (
    <section className="flex flex-col w-[735px] h-[416px] items-center px-10 py-2.5 absolute top-[266px] left-[815px] bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* 탭 메뉴 */}
      <nav className="flex w-full h-14 border-b border-gray-200" role="tablist">
        {["messages", "news"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 flex items-center justify-center font-bold text-[19px] border-b-4 transition-colors ${
              activeTab === tab ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "messages" ? "최근 재난 문자" : "최근 안전 뉴스"}
          </button>
        ))}
      </nav>

      {/* 리스트 영역 */}
      <div className="w-full overflow-hidden">
        {messages.map((msg) => (
          <article key={msg.id} className="flex items-center w-full border-b border-gray-100 last:border-0">
            <div className="w-[60px] py-4 flex justify-center">
              {/* 임시 아이콘 */}
              <div className="w-6 h-6 rounded-md" style={{ backgroundColor: msg.color }} />
            </div>
            <div className="flex-1 px-4 py-4">
              <p className="text-[17px] text-[#1d1d1d] truncate">{msg.title}</p>
            </div>
            <div className="w-[100px] py-4 text-right">
              <time className="text-[15px] text-gray-500">{msg.time}</time>
            </div>
          </article>
        ))}
      </div>

      <a href="#" className="absolute bottom-4 flex items-center gap-1 text-gray-600 hover:text-black">
        <span className="text-[15px]">전체 보기</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    </section>
  );
};