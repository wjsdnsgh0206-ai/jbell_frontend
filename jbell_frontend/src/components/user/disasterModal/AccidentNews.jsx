// ------------ 사고속보 컨텐츠 ------------ //

const AccidentNews = () => {
    return (
        <>

    <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f7fa]">
      {/* 메인 컨텐츠 그리드 */}
      <div className="p-6 grid grid-cols-12 gap-6 h-full overflow-y-auto">
        
        {/* 왼쪽 & 중앙 영역 (사고목록 + 지도) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[550px] relative flex flex-col">
            
            {/* 상단 타이틀 바 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800">현재기상특보</h3>
                <span className="text-[11px] px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-semibold">특보없음</span>
              </div>
              <p className="text-[11px] text-gray-400 tabular-nums font-medium">2025년 12월 21일(일) 22:49:02 기준</p>
            </div>

            <div className="flex-1 flex gap-4 relative">
              {/* 사고·사고 목록 드롭다운 & 상세 카드 (이미지 4번 영역) */}
              <div className="w-[280px] shrink-0 flex flex-col gap-3 z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-[#1a1a1a]">재난·사고 목록</h4>
                  <span className="text-red-500 font-black">9</span>
                </div>
                
                {/* 커스텀 셀렉트 박스 */}
                <div className="relative group">
                  <button className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center text-sm font-bold text-gray-700 shadow-sm">
                    전체
                    <span className="text-gray-400">▼</span>
                  </button>
                </div>

                {/* 상세 정보 카드 */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-400 italic">2025.12.21 22:49:02</span>
                  </div>
                  <div className="py-8 text-center flex flex-col items-center gap-4">
                    <h5 className="text-lg font-black text-gray-800">위치 : ㅇㅇㅇ 아파트 앞</h5>
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-full border border-red-100 shadow-sm">
                      <span className="animate-pulse">🔥</span>
                      <span className="font-black text-sm">화재 진압중</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지도 영역 (이미지 5번 영역) */}
              <div className="flex-1 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                {/* 지도 줌 컨트롤 */}
                <div className="absolute top-4 left-4 flex flex-col shadow-sm border border-gray-200 rounded-lg overflow-hidden z-20">
                  <button className="bg-white w-8 h-8 flex items-center justify-center font-bold border-b border-gray-100 hover:bg-gray-50">+</button>
                  <button className="bg-white w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-50">-</button>
                </div>

                {/* 재난안전시설 플로팅 메뉴 */}
                <div className="absolute top-20 left-4 w-36 bg-white/90 backdrop-blur rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden text-[11px]">
                  <div className="bg-blue-600 text-white p-2 font-bold flex justify-between items-center">
                    재난안전시설
                    <span>▲</span>
                  </div>
                  <div className="p-3 space-y-2 font-bold text-gray-600">
                    {['자동심장충격기', '보이는 소화기', '비상소화장치', '약국'].map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-3 h-3 rounded" />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 지도 가상 배경 */}
                <div className="w-full h-full flex items-center justify-center opacity-30 select-none">
                   <p className="font-black text-blue-200 text-4xl">MAP AREA</p>
                </div>
              </div>
            </div>
          </div>

          {/* 지진 발생 시 행동요령 (이미지 8번 영역) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-800 mb-6 text-lg">지진 발생시 행동요령</h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="relative aspect-[4/3] bg-blue-50/50 rounded-2xl border border-blue-100/50 p-4 group cursor-pointer hover:bg-white transition-all overflow-hidden">
                  <span className="text-2xl font-black text-gray-200 italic italic">0{num}</span>
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="text-[12px] font-bold text-gray-700 leading-tight">집안에 넘어지기 쉬운 물건을 두지 마세요.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 패널 (날씨 + 재난문자) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* 날씨 (이미지 6번 영역) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-1 font-bold text-gray-800 text-sm">
                  <span>📍</span> 현재 위치 : 덕진동
                </div>
                <div className="flex gap-3 text-[10px] text-gray-400 font-bold uppercase">
                  <span>강수 2mm</span>
                  <span>습도 20%</span>
                  <span>북서 2m/s</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-gray-800">-2°</span>
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['미세먼지 보통', '초미세먼지 보통', '내일강수량 0mm', '내일비율확률 10%'].map((info) => (
                <div key={info} className="bg-[#f8f9fb] rounded-xl p-3 text-center border border-gray-50 group hover:border-blue-200 transition-colors">
                  <p className="text-[10px] text-gray-400 font-bold mb-1">{info.split(' ')[0]}</p>
                  <p className="text-[12px] font-black text-gray-800">{info.split(' ')[1]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 재난안전문자 (이미지 7번 영역) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
            <h3 className="font-black text-gray-800 mb-6 flex justify-between items-center text-lg">
              재난안전문자
              <span className="text-blue-500 text-xs font-bold cursor-pointer">더보기 +</span>
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-[10px] font-black px-3 py-1 rounded-full border border-gray-200 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">중화산동</span>
                    <span className="text-[10px] text-gray-400 tabular-nums font-bold">2025.12.12. 12:45</span>
                  </div>
                  <p className="text-sm text-gray-500 font-bold leading-relaxed truncate">문자내용이 여기에 들어갑니다. 실제 데이터 연동 시 전체 내용이 노출됩니다.</p>
                </div>
              ))}
            </div>
          </div>
          </div>
    </div>
    </div>
    </>
  );
};


export default AccidentNews;