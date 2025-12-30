import React from 'react';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-gray-900">
      <UserHeader />

      {/* 1. 상단 알림 및 날씨 섹션 (배경을 흰색으로 분리해서 넓어 보이게) */}
      <section className="w-full bg-white border-b border-gray-100 pb-12">
        <div className="mx-auto max-w-[1440px] px-8 pt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 재난고속보 - 폭을 더 넓게 조정 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold tracking-tight">재난사고속보</h2>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
                </div>
                <button className="text-gray-400 hover:text-black transition-colors">더보기 +</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className="shrink-0 w-12 text-center py-1 rounded text-[11px] font-bold border border-blue-200 text-blue-500 bg-blue-50">태풍</span>
                      <span className="text-[15px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate">제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응 단계 격상</span>
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums">2025.12.05</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 날씨 및 경보 - 우측 배치 */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
              <div className="h-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white rounded-2xl p-6 shadow-lg shadow-blue-100 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm font-medium opacity-80">현재 위치: 전주시 덕진동</p>
                  <div className="flex items-end gap-2 mt-4">
                    <span className="text-5xl font-black">-2°</span>
                    <span className="text-lg font-medium pb-1">맑음</span>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                      <p className="text-[10px] opacity-70 mb-1">미세먼지</p>
                      <p className="text-xs font-bold text-blue-200">좋음 (15)</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                      <p className="text-[10px] opacity-70 mb-1">초미세먼지</p>
                      <p className="text-xs font-bold text-yellow-200">보통 (22)</p>
                    </div>
                  </div>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] text-[100px] opacity-20">🌙</div>
              </div>

              <div className="h-1/2 bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
                <div className="bg-orange-500 text-white w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold opacity-80 uppercase">Level</span>
                  <span className="text-2xl font-black">03</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 mb-1">태풍 주의보 발령</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">남서쪽 3km 지점<br/>강풍 동반 집중호우 주의</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 (가로로 꽉 차는 느낌을 주기 위해 배경색을 다르게) */}
      <section className="mx-auto max-w-[1440px] px-8 -mt-6 relative z-20">
        <div className="bg-[#2d3748] rounded-2xl p-6 shadow-xl flex flex-wrap justify-between items-center text-white px-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">📊</div>
            <div>
              <h3 className="text-lg font-bold">지난주 주요 재난통계</h3>
              <p className="text-xs text-gray-400">데이터 기준: 2025.12.01 ~ 12.07</p>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">발생 건수</p>
              <p className="text-2xl font-black">458<span className="text-sm ml-1 font-normal opacity-70">건</span></p>
            </div>
            <div className="w-[1px] h-10 bg-gray-600 hidden md:block" />
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1 text-red-400">사망 건수</p>
              <p className="text-2xl font-black text-red-400">5<span className="text-sm ml-1 font-normal opacity-70">건</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 하단 컨텐츠 그리드 섹션 */}
      <section className="mx-auto max-w-[1440px] px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          
          {/* 공지사항 탭 영역 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex gap-8 mb-8 border-b border-gray-100">
              {['공지사항', '보도자료', '시민안전교육'].map((tab, idx) => (
                <button key={tab} className={`pb-4 text-lg font-bold transition-all ${idx === 0 ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <p className="text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                    2025년 설 연휴 전국 민원서비스 통합 운영 안내 및 비상 연락망
                  </p>
                  <span className="text-sm text-gray-400 tabular-nums">2025.12.05</span>
                </div>
              ))}
            </div>
          </div>

          {/* 행동요령 영역 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">행동요령</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['재난', '사고', '생활안전'].map((btn, idx) => (
                  <button key={btn} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${idx === 2 ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>
                    {btn}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "사고 대비 요령", desc: "미리 준비하는 안전 습관" },
                { title: "발생 시 행동요령", desc: "당황하지 말고 차근차근" },
                { title: "상황처리 안내", desc: "신속한 복구와 대처" },
                { title: "비상 연락처", desc: "긴급 상황 시 즉시 연결" }
              ].map((item, idx) => (
                <div key={idx} className="group p-5 bg-[#f8f9fb] hover:bg-blue-600 transition-all rounded-2xl cursor-pointer">
                  <h4 className="font-bold text-gray-800 group-hover:text-white transition-colors mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 group-hover:text-blue-100 transition-colors">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <UserFooter />
    </div>
  );
};

export default UserLayout;