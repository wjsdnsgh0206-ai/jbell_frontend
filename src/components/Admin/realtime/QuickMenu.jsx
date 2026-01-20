import React from "react";

export const QuickMenu = () => {
  const menuItems = [
    { id: 1, title: "재난 발생 관리", desc: "실시간 재난 현황 관리", color: "bg-blue-50" },
    { id: 2, title: "기상 특보 관리", desc: "기상청 특보 데이터 연동", color: "bg-orange-50" },
    { id: 3, title: "안전정책 관리", desc: "정부 안전 지침 공지", color: "bg-green-50" },
    { id: 4, title: "안전 정보 지도", desc: "전국 안전 시설물 위치", color: "bg-purple-50" },
  ];

  return (
    <section className="flex flex-col w-[1499px] items-start gap-10 absolute top-[712px] left-[51px]">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[32px] font-bold text-[#1d1d1d]">자주찾는 메뉴</h2>
        <button className="flex items-center gap-1 text-gray-500">
          <span className="text-[17px]">설정하기</span>
        </button>
      </div>

      <div className="flex items-center gap-8 w-full">
        {/* 이전 버튼 */}
        <button className="p-2 border rounded-full hover:bg-gray-100">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <nav className="flex-1 grid grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <article key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-20 h-20 rounded-xl ${item.color} flex items-center justify-center`}>
                <div className="w-10 h-10 border-2 border-gray-300 rounded-full" /> {/* 임시 아이콘 */}
              </div>
              <div className="flex flex-col justify-center py-2">
                <h3 className="text-[17px] font-bold text-[#1d1d1d]">{item.title}</h3>
                <p className="text-[14px] text-gray-500 whitespace-pre-line">{item.desc}</p>
              </div>
            </article>
          ))}
        </nav>

        {/* 다음 버튼 */}
        <button className="p-2 border rounded-full hover:bg-gray-100">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6 6-6"/></svg>
        </button>
      </div>

      {/* 페이지네이션 도트 */}
      <div className="flex justify-center w-full gap-2 mt-4">
        <div className="w-5 h-2 bg-orange-500 rounded-full" />
        <div className="w-2 h-2 bg-gray-300 rounded-full" />
      </div>
    </section>
  );
};