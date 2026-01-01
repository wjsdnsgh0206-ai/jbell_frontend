import DisasterModalLayout 
  from "../../layouts/user/disasterModal/DisasterModalLayout";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const UserLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans">
      {/* 모달 컴포넌트 삽입 */}
      {/* <DisasterModalLayout 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      /> */}
    {/* <button onClick={() => navigate("/disaster/accident")}>
      사고속보 열기
    </button> */}

      {/* 1. 상단 알림 및 날씨 섹션 */}
      <section className="w-full bg-white border-b border-gray-100">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 재난고속보 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold tracking-tight">재난사고속보</h2>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
                </div>
                {/* 더보기 클릭시 재난사고속보 모달창 열기 */}
                <button className="text-gray-400 hover:text-black transition-colors text-sm" onClick={() => navigate("/disaster/accident")}>더보기 +</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <span className="shrink-0 w-12 text-center py-1 rounded text-[11px] font-bold border border-blue-200 text-blue-500 bg-blue-50">태풍</span>
                      <span className="text-[15px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                        제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응 단계 격상
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400 tabular-nums ml-4">2025.12.05</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 날씨 및 경보 */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
              <div className="flex-1 bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
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

              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold opacity-80 uppercase">Level</span>
                  <span className="text-2xl font-black">03</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 mb-1">태풍 주의보 발령</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">강풍 동반 집중호우 주의</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="w-full -mt-8 relative z-10">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="bg-[#2d3748] rounded-2xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center text-white gap-8">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white/10 rounded-xl text-2xl">📊</div>
              <div>
                <h3 className="text-lg font-bold">지난주 주요 재난통계</h3>
                <p className="text-xs text-gray-400">데이터 기준: 2025.12.01 ~ 12.07</p>
              </div>
            </div>
            <div className="flex gap-16">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">발생 건수</p>
                <p className="text-3xl font-black">458<span className="text-sm ml-1 font-normal opacity-70">건</span></p>
              </div>
              <div className="w-[1px] h-12 bg-gray-600 hidden md:block" />
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1 text-red-400">사망 건수</p>
                <p className="text-3xl font-black text-red-400">5<span className="text-sm ml-1 font-normal opacity-70">건</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 하단 컨텐츠 그리드 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
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
                    <p className="text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2 overflow-hidden">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                      <span className="truncate text-sm md:text-base">2025년 설 연휴 전국 민원서비스 통합 운영 안내</span>
                    </p>
                    <span className="shrink-0 text-sm text-gray-400 tabular-nums ml-4">12.05</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 행동요령 영역 - 기존 박스 스타일(bg, rounded, border, p, shadow) 그대로 유지 */}
<div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-full flex flex-col">
  
  {/* 상단 헤더 & 배지 */}
  <div className="flex items-center gap-3 mb-8">
    <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">행동요령</h2>
  </div>

  {/* 이미지 스타일의 탭 메뉴 */}
  <div className="flex flex-wrap gap-2 mb-8">
    {['재난', '사고', '생활안전', '재난약자', '긴급상황'].map((btn, idx) => (
      <button
        key={btn}
        className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all border-2 
          ${idx === 2 
            ? 'bg-white border-black text-black shadow-sm' 
            : 'bg-transparent border-gray-200 text-gray-400 hover:border-gray-300'}`}
      >
        {btn}
      </button>
    ))}
  </div>

  {/* 카드 그리드 - 기존 박스 내에서 flex-1로 높이 꽉 채움 */}
  <div className="grid grid-cols-2 gap-4 flex-1">
    {[
      { title: "사고 대비 요령", desc: "미리 준비하는 안전 습관" },
      { title: "발생 시 행동요령", desc: "당황하지 말고 차근차근" },
      { title: "사고 종료 복귀 안내", desc: "신속한 복구와 대처" },
      { title: "비상 연락처 안내", desc: "긴급 상황 시 즉시 연결" }
    ].map((item, idx) => (
      <div 
        key={idx} 
        className="bg-[#f8f9fb] p-5 rounded-[20px] hover:bg-white hover:shadow-md hover:border-blue-100 border border-transparent transition-all cursor-pointer flex flex-col"
      >
        <h4 className="text-[15px] font-bold text-[#1a1a1a] mb-2">{item.title}</h4>
        <div className="flex items-start gap-2">
          {/* 이미지에 있던 리스트 점 아이콘 */}
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-[2px] mt-1.5 shrink-0" />
          <p className="text-[13px] text-gray-500 font-medium leading-snug">
            {item.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default UserLayout;