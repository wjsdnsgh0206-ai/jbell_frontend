// ------------ 지진 컨텐츠 ------------ //


const Earthquake = () => {
    return (
        <>
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
          </>
    )
}


export default Earthquake;