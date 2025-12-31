import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

import React, { useState } from 'react';
import { Search, Menu, MapPin, Navigation, Info, User, Layers } from 'lucide-react';

const UserMap = () => {

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden font-sans text-slate-800">
      {/* 1. 상단 헤더 (GNB) */}
      <UserHeader />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* 2. 좌측 사이드바 */}
        <aside className="w-[380px] bg-white border-r z-10 flex flex-col shadow-xl">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">지도 검색</h2>
              <button className="text-slate-400 hover:text-slate-600"><Info size={18}/></button>
            </div>
            
            {/* 검색창 */}
            <div className="relative group">
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md">
                <Search size={20} />
              </button>
            </div>

            {/* 빠른 도구 메뉴 */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <Navigation size={20} className="text-blue-600" />
                <span className="text-xs font-medium">길찾기</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <MapPin size={20} className="text-red-500" />
                <span className="text-xs font-medium">주소검색</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                <Layers size={20} className="text-emerald-600" />
                <span className="text-xs font-medium">대피소</span>
              </button>
            </div>
          </div>

          {/* 검색 결과 영역 (스크롤 가능) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div className="text-center py-20 text-slate-400">
              <p className="text-sm">주변 정보를 찾으려면<br/>검색어를 입력해 주세요.</p>
            </div>
          </div>
        </aside>

        {/* 3. 지도 영역 (우측 전체) */}
        <main className="flex-1 relative bg-slate-200">
          
          {/* 실제 카카오 지도 */}
            <div
              id="kakao-map"
              className="absolute inset-0"
            ></div>
           {/* 오버레이 효과 */}
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>

          {/* 지도 위 컨트롤 버튼들 */}
          <div className="absolute right-6 bottom-10 flex flex-col gap-3">
            <div className="flex flex-col bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <button className="p-3 hover:bg-slate-50 border-b text-slate-600">+</button>
              <button className="p-3 hover:bg-slate-50 text-slate-600">-</button>
            </div>
            
            <button className="p-3 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <User size={20} />
            </button>
            
            <button className="p-3 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-600 hover:text-blue-600">
              <Navigation size={20} className="rotate-45" />
            </button>
          </div>

          {/* 행정 구역 표시 태그 (예시) */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-white/50 font-semibold text-sm">
            전북특별자치도
          </div>
        </main>
      </div>
      <UserFooter/>
    </div>
  );
};

export default UserMap;