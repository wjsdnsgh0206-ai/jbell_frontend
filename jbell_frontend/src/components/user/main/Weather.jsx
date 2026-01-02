// ------ 메인화면 - 날씨 컴포넌트 ------ //

const Weather = () => {
    return (
        <>

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
              </>
    )
}

export default Weather;
