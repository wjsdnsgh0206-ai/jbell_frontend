import React from "react";
import { AlertCircle, CloudRain, ShieldCheck, Map, Settings2, ChevronLeft, ChevronRight } from "lucide-react";

export const QuickMenu = () => {
  const menuItems = [
    { id: 1, title: "재난 발생 관리", desc: "실시간 현황 등록 및 관리", icon: <AlertCircle size={28} />, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, title: "기상 특보 관리", desc: "기상청 데이터 수동 연동", icon: <CloudRain size={28} />, color: "text-orange-600", bg: "bg-orange-50" },
    { id: 3, title: "안전정책 관리", desc: "정부 지침 공지사항 관리", icon: <ShieldCheck size={28} />, color: "text-green-600", bg: "bg-green-50" },
    { id: 4, title: "안전 정보 지도", desc: "시설물 위치 정보 편집", icon: <Map size={28} />, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <section className="absolute top-[720px] left-[51px] w-[1500px]">
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <h2 className="text-[28px] font-extrabold text-[#1d1d1d] flex items-center gap-3">
            자주찾는 메뉴 <div className="w-2 h-2 rounded-full bg-orange-500" />
          </h2>
          <p className="text-gray-400 font-medium">관리자 업무 효율을 위한 바로가기 서비스입니다.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
          <Settings2 size={16} /> 메뉴 설정하기
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-3 bg-white border border-gray-100 rounded-full shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-orange-500">
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer relative overflow-hidden">
              <div className="flex flex-col gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1d1d1d] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity">
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        <button className="p-3 bg-white border border-gray-100 rounded-full shadow-md hover:scale-110 transition-transform text-gray-400 hover:text-orange-500">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center mt-10 gap-2.5">
        <div className="w-8 h-2.5 bg-orange-500 rounded-full" />
        <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
        <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
      </div>
    </section>
  );
};