import React from 'react';

const UserDisasterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 배경 레이어 (클릭 시 닫힘) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* 모달 컨텐츠 바디 */}
      <div className="relative w-[95%] max-w-[1280px] h-[90vh] bg-[#f4f7fa] rounded-[32px] shadow-2xl overflow-hidden flex animate-in fade-in zoom-in duration-300">
        
        {/* 1. 왼쪽 사이드바 (이미지 레이아웃 유지) */}
        <aside className="w-[240px] bg-[#2d3e5d] text-white flex flex-col shrink-0">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold tracking-tight">전주시안전누리</h1>
          </div>
          <nav className="flex-1 mt-4">
            {[
              { name: '사고속보', active: false },
              { name: '지진', active: true },
              { name: '태풍', active: false },
              { name: '호우', active: false },
              { name: '홍수', active: false },
              { name: '산사태', active: false },
              { name: '산불', active: false },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors
                  ${item.active ? 'bg-white text-[#2d3e5d]' : 'hover:bg-white/5 text-gray-300'}`}
              >
                {item.name}
                <span className={item.active ? 'text-[#2d3e5d]' : 'text-gray-500'}>&gt;</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* 2. 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* 상단 헤더 */}
          <header className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-xl font-black text-gray-800">재난사고속보</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">🔔</div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">9</span>
              </div>
              <button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                닫기
              </button>
            </div>
          </header>

          {/* 모달 내부 스크롤 영역 */}
          <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-12 gap-6">
              
              {/* 왼쪽/중앙 정보 (지도 등) */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[450px] relative">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800">현재기상특보</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-500">특보없음</span>
                    </div>
                    <p className="text-[11px] text-gray-400">2025년 12월 21일 기준</p>
                  </div>
                  {/* 가상 지도 영역 */}
                  <div className="w-full h-[350px] bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm border border-gray-200">지진특보</button>
                      <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm border border-gray-200">진도정보조회</button>
                    </div>
                    <span className="text-blue-200 font-bold">MAP INTERFACE</span>
                  </div>
                </div>

                {/* 하단 행동요령 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-sm">⚠️</span>
                    지진 발생시 행동요령
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-[4/3] bg-gray-50 rounded-2xl border border-gray-100 p-4 relative group cursor-pointer hover:border-blue-200 transition-all">
                        <span className="text-xl font-black text-gray-200">0{i}</span>
                        <p className="mt-2 text-[12px] font-bold text-gray-700 leading-snug">집안에서 안전을 확보하세요.</p>
                        <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">🏠</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽 패널 */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-800">📍 덕진동</span>
                      <span className="text-3xl font-black text-blue-600">-2°</span>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      {['미세먼지 보통', '초미세먼지 보통', '강수량 0mm', '확률 10%'].map(item => (
                        <div key={item} className="bg-[#f8f9fb] p-3 rounded-xl text-center border border-gray-50">
                          <p className="text-[10px] text-gray-400 mb-1">{item.split(' ')[0]}</p>
                          <p className="text-[12px] font-bold text-gray-800">{item.split(' ')[1]}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                  <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                    재난안전문자
                    <span className="text-[10px] text-blue-500 font-normal underline cursor-pointer">전체보기</span>
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-b border-gray-50 pb-3 last:border-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] font-bold text-gray-700">중화산동</span>
                          <span className="text-[10px] text-gray-400">12:45</span>
                        </div>
                        <p className="text-[12px] text-gray-500 truncate">재난 문자 내용이 이곳에 표시됩니다...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDisasterModal;