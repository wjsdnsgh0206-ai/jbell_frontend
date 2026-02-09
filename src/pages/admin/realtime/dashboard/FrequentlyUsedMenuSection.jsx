import React from 'react';
import { Settings, Trophy, Edit3, ClipboardCheck, Map as MapIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const FrequentlyUsedMenuSection = () => {
  const navigate = useNavigate();
  
  const menus = [
    { 
      id: 1, 
      title: "재난 문자이력 관리", 
      icon: <Trophy size={32} className="text-blue-500"/>,
      path: "/admin/realtime/disasterMessageList" 
    },
    { 
      id: 2, 
      title: "기상 특보 관리", 
      icon: <Edit3 size={32} className="text-blue-500"/>,
      path: "/admin/realtime/weatherNewsList"
    },
    { 
      id: 3, 
      title: "행동요령 관리", 
      icon: <ClipboardCheck size={32} className="text-blue-500"/>,
      path: "/admin/contents/behaviorMethodList"
    },
    { 
      id: 4, 
      title: "회원 관리", 
      icon: <MapIcon size={32} className="text-blue-500"/>,
      path: "/admin/member/adminMemberList"
    },
  ];

  return (
    <section className="absolute top-[712px] left-[50px] right-[50px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[32px] font-bold text-[#1d1d1d]">주요 메뉴</h2>

      </div>
      <div className="flex gap-8">
        {menus.map((menu) => (
          <div 
            key={menu.id} 
            onClick={() => navigate(menu.path)}
            className="flex-1 flex items-center gap-5 p-6 bg-slate-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group min-w-0 overflow-hidden"
          >
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