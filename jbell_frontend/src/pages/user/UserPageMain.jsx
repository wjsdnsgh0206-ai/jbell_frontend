import { useNavigate } from "react-router-dom";

// --------- 메인 화면 ----------- //
const UserPageMain = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen font-sans">
      {/* 1. 상단 알림 및 날씨 섹션 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* 재난사고속보 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight">
                    재난사고속보
                  </h2>
                  <span className="bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                    LIVE
                  </span>
                </div>
                {/* 더보기 버튼 클릭시 '재난사고속보'모달을 띄움. */}
                <button
                  className="text-gray-400 hover:text-black transition-colors text-xs sm:text-sm"
                  onClick={() => navigate("/disaster/accident")}
                >
                  더보기 +
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer border-b border-gray-50 pb-3 last:border-0 last:pb-0 gap-2 sm:gap-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                      <span className="shrink-0 w-10 sm:w-12 text-center py-1 rounded text-[10px] sm:text-[11px] font-bold border border-blue-200 text-blue-500 bg-blue-50">
                        태풍
                      </span>
                      <span className="text-xs sm:text-sm lg:text-[15px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                        제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응
                        단계 격상
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums sm:ml-4">
                      2025.12.05
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 날씨 및 경보 */}
            <div className="w-full lg:w-[400px] flex flex-col gap-3 sm:gap-4">
              {/* 메인 날씨*/}
              <div className="flex-1 bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] text-white rounded-xl sm:rounded-2xl p-5 lg:p-6 shadow-md relative overflow-hidden group flex flex-col justify-between">
                {/* 배경 장식 */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold opacity-90 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        전주시 덕진동
                      </p>
                      <p className="text-[10px] opacity-60 mt-0.5">
                        2026.01.02 15:00 기준
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30 text-[10px] font-bold">
                      실시간
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl lg:text-6xl font-black tracking-tighter">
                        -2°
                      </span>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold leading-tight">
                          맑음
                        </span>
                        <span className="text-[10px] opacity-70">
                          체감 -5.4°
                        </span>
                      </div>
                    </div>
                    <span className="text-5xl drop-shadow-lg">🌙</span>
                  </div>
                </div>

                {/* 대기질 정보 - 슬림한 프로그레스 바 형태로 공간 절약 */}
                <div className="relative z-10 space-y-2.5">
                  <div className="bg-black/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span>
                        미세먼지{" "}
                        <span className="text-blue-300 ml-1">좋음</span>
                      </span>
                      <span className="opacity-80">15㎍/㎥</span>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: "15%" }}
                      />
                    </div>
                  </div>

                  <div className="bg-black/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span>
                        초미세먼지{" "}
                        <span className="text-yellow-300 ml-1">보통</span>
                      </span>
                      <span className="opacity-80">22㎍/㎥</span>
                    </div>
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 경보 알림 카드: 높이를 조금 더 슬림하게 조정 */}
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className="bg-gradient-to-tr from-orange-600 to-orange-400 text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[8px] font-black opacity-70">LV</span>
                  <span className="text-xl font-black leading-none">03</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-orange-600 mb-0.5">
                    태풍 주의보 발령
                  </p>
                  <p className="text-sm font-bold text-gray-800 leading-tight truncate">
                    강풍 동반 집중호우 주의
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="w-full ">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="bg-[#2d3748] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-center text-white gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl text-xl sm:text-2xl">
                📊
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  지난주 주요 재난통계
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  데이터 기준: 2025.12.01 ~ 12.07
                </p>
              </div>
            </div>
            <div className="flex gap-8 sm:gap-12 lg:gap-16 w-full sm:w-auto justify-center">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1">
                  발생 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black">
                  458
                  <span className="text-xs sm:text-sm ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
              <div className="w-[1px] h-10 sm:h-12 bg-gray-600" />
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1 text-red-400">
                  사망 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black text-red-400">
                  5
                  <span className="text-xs sm:text-sm ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 하단 컨텐츠 그리드 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* 공지사항 탭 영역 */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 border-b border-gray-100 overflow-x-auto">
                {['공지사항', '보도자료', '시민안전교육'].map((tab, idx) => (
                  <button 
                    key={idx} 
                    className={`pb-3 sm:pb-4 text-sm sm:text-base lg:text-lg font-bold transition-all whitespace-nowrap ${
                      idx === 0
                        ? "border-b-4 border-blue-600 text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="space-y-4 sm:space-y-5">
                {[1, 2, 3, 4, 5].map((data, idx) => (
                  <div key={idx} className="flex justify-between items-center group cursor-pointer gap-2">
                    <p className="text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2 overflow-hidden flex-1">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                      <span className="truncate text-xs sm:text-sm lg:text-base">
                        2025년 설 연휴 전국 민원서비스 통합 운영 안내
                      </span>
                    </p>
                    <span className="shrink-0 text-xs sm:text-sm text-gray-400 tabular-nums">
                      12.05
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 행동요령 영역 - 모던 UI 스타일 */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
                    행동요령
                  </h2>
                  <div className="w-12 h-1 bg-blue-600 mt-2 rounded-full" />{" "}
                </div>
              </div>

              {/* 탭 메뉴 - 언더라인 스타일로 더 세련되게 */}
              <div className="flex gap-6 mb-8 border-b border-gray-50 overflow-x-auto no-scrollbar">
                {["재난", "사고", "생활안전", "긴급상황"].map((btn, idx) => (
                  <button
                    key={btn}
                    className={`pb-3 text-xs font-black transition-all whitespace-nowrap
          ${
            idx === 2
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              {/* 행동 지침 그리드 - 카드 디자인 최적화 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {[
                  {
                    title: "입·코 가리기",
                    desc: "젖은 수건 등으로 보호",
                    icon: "01",
                  },
                  {
                    title: "낮은 자세 유지",
                    desc: "유도등 따라 대피",
                    icon: "02",
                  },
                  {
                    title: "밸브·전원 차단",
                    desc: "가스 및 전기 메인 차단",
                    icon: "03",
                  },
                  {
                    title: "비상 계단 대피",
                    desc: "엘리베이터 사용 금지",
                    icon: "04",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group p-5 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-blue-600/50 mb-1 tracking-widest">
                          GUIDE {item.icon}
                        </span>
                        <h4 className="text-[16px] font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-gray-400 font-medium leading-tight">
                          {item.desc}
                        </p>
                      </div>
                      {/* 숫자를 배경 요소로 세련되게 배치 */}
                      <span className="text-3xl font-black text-gray-200 group-hover:text-blue-50 transition-colors italic">
                        {item.icon}
                      </span>
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

export default UserPageMain;
