import React from 'react';
import { Settings, Trophy, Edit3, ClipboardCheck, Map as MapIcon } from 'lucide-react';

const FrequentlyUsedMenuSection = () => {
  const menus = [
    { id: 1, title: "재난 발생 관리", icon: <Trophy size={32} className="text-blue-500"/> },
    { id: 2, title: "기상 특보 관리", icon: <Edit3 size={32} className="text-blue-500"/> },
    { id: 3, title: "안전정책 관리", icon: <ClipboardCheck size={32} className="text-blue-500"/> },
    { id: 4, title: "안전 정보 지도", icon: <MapIcon size={32} className="text-blue-500"/> },
  ];

  return (
    <section className="absolute top-[712px] left-[50px] right-[50px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[32px] font-bold text-[#1d1d1d]">자주찾는 메뉴</h2>
        <button className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
          <Settings size={18}/> <span className="text-sm font-bold">설정하기</span>
        </button>
      </div>
      <div className="flex gap-8">
        {menus.map((menu) => (
          <div key={menu.id} className="flex-1 flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group min-w-0 overflow-hidden">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
              {menu.icon}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h3 className="font-bold text-[18px] text-[#1d1d1d] truncate">{menu.title}</h3>
              <p className="text-gray-500 text-sm leading-snug whitespace-nowrap">해당 메뉴로 빠르게 이동합니다.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FrequentlyUsedMenuSection;