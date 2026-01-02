// ------ 메인화면 - 통계 컴포넌트 ------ //

const MainStatistics = () => {
    return (
        <>
         <div className="bg-[#2d3748] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-center text-white gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl text-xl sm:text-2xl">
                📊
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  지난주 주요 재난통계
                </h3>
                <p className="text-[12px] sm:text-[15px] text-gray-400">
                  데이터 기준: 2025.12.01 ~ 12.07
                </p>
              </div>
            </div>
            <div className="flex gap-8 sm:gap-12 lg:gap-16 w-full sm:w-auto justify-center">
              <div className="text-center">
                <p className="text-[12px] sm:text-[15px] text-gray-400 mb-1">
                  발생 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black">
                  458
                  <span className="text-[12px] sm:text-[15px] ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
              <div className="w-[1px] h-10 sm:h-12 bg-gray-600" />
              <div className="text-center">
                <p className="text-[12px] sm:text-[15px] text-gray-400 mb-1 text-red-400">
                  사망 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black text-red-400">
                  5
                  <span className="text-[12px] sm:text-[15px] ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
    )
}

export default MainStatistics;