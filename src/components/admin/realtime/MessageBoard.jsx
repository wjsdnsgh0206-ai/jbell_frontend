import React, { useState } from "react";
import { Bell, ChevronRight, Newspaper } from "lucide-react";

export const MessageBoard = () => {
  const [activeTab, setActiveTab] = useState("messages");

  const messages = [
    { id: 1, title: "[행정안전부] 오늘 14:00 폭염경보 발효", time: "10분 전", type: "경보", bgColor: "bg-orange-100", textColor: "text-orange-600" },
    { id: 2, title: "[기상청] 오늘 15:30 태풍 예보", time: "30분 전", type: "주의", bgColor: "bg-blue-100", textColor: "text-blue-600" },
    { id: 3, title: "[보건복지부] 코로나19 확진자 발표", time: "1시간 전", type: "긴급", bgColor: "bg-red-100", textColor: "text-red-600" },
    { id: 4, title: "[교육부] 학교 운영 방침 변경", time: "1시간 반 전", type: "공고", bgColor: "bg-green-100", textColor: "text-green-600" },
  ];

  return (
    <section className="absolute w-[735px] h-[416px] top-[266px] left-[815px] bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <nav className="flex px-6 pt-4">
        {["messages", "news"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 font-bold text-base transition-all relative ${
              activeTab === tab ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "messages" ? "최근 재난 문자" : "최근 안전 뉴스"}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />}
          </button>
        ))}
      </nav>

      <div className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar">
        {messages.map((msg) => (
          <article key={msg.id} className="flex items-center p-3 mb-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className={`w-12 h-12 rounded-lg ${msg.bgColor} flex items-center justify-center mr-4 shrink-0 font-bold text-xs ${msg.textColor}`}>
              {msg.type}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[16px] font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">{msg.title}</h4>
              <span className="text-xs text-gray-400 font-medium">{msg.time}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-all transform group-hover:translate-x-1" />
          </article>
        ))}
      </div>

      <button className="w-full py-4 border-t border-gray-50 text-[14px] font-bold text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2">
        전체 데이터 확인하기 <ChevronRight size={16} />
      </button>
    </section>
  );
};