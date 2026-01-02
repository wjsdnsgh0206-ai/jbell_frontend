// ----------- 사고속보 ----------- //

import ActionTipBox from '../modal/ActionTipBox';
import WeatherBox from '../modal/WeatherBox';
const AccidentNews = () => {
  return (
    <div className="grid grid-cols-12 gap-6">

      {/* 왼쪽 & 중앙 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        
        {/* 사고 목록 + 지도 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[550px] flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">현재기상특보</h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 border rounded text-gray-500 font-semibold">
                특보없음
              </span>
            </div>
            <p className="text-xs text-gray-400">
              2025.12.21 22:49 기준
            </p>
          </div>

          <div className="flex-1 flex gap-4">
            {/* 사고 리스트 */}
            <div className="w-[280px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-800">
                  재난·사고 목록
                </h4>
                <span className="text-red-500 font-bold text-sm">9</span>
              </div>

              <button className="w-full bg-white border rounded-xl px-4 py-3 flex justify-between text-sm font-semibold text-gray-700">
                전체
                <span className="text-gray-400">▼</span>
              </button>

              <div className="bg-white border rounded-2xl p-5 shadow-sm flex-1">
                <span className="text-xs text-gray-400 font-semibold">
                  2025.12.21 22:49
                </span>

                <div className="mt-6 text-center space-y-4">
                  <h5 className="text-sm font-bold text-gray-800">
                    위치 : ㅇㅇㅇ 아파트 앞
                  </h5>
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold border">
                    🔥 화재 진압중
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 */}
            <div className="flex-1 bg-blue-50 rounded-2xl border flex items-center justify-center">
              <span className="text-3xl font-black text-blue-200">
                MAP AREA
              </span>
            </div>
          </div>
        </div>

      {/* ------ 행동요령 컴포넌트 박스 ------ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <ActionTipBox />
      </div>

      </div>
      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* ------ 날씨 컴포넌트 박스 ------ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <WeatherBox />
        </div>
        {/* 날씨
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-bold text-gray-800">
              📍 덕진동
            </span>
            <span className="text-2xl font-black text-gray-800">
              -2°
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {["미세먼지 보통", "초미세먼지 보통", "강수 0mm", "확률 10%"].map(v => (
              <div key={v} className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-400 font-bold">
                  {v.split(" ")[0]}
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {v.split(" ")[1]}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* 재난문자 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            재난안전문자
          </h3>

          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="border-b pb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-gray-600">
                    중화산동
                  </span>
                  <span className="text-xs text-gray-400">
                    12:45
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  문자 내용이 여기에 표시됩니다.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AccidentNews;
