import ActionTipBox from "../modal/ActionTipBox";
import WeatherBox from "../modal/WeatherBox";
import DisasterMessageBox from "../modal/DisasterMessageBox";
// ----------- 태풍 ----------- //

const Typhoon = () => {
  return (
    <div className="grid grid-cols-12 gap-6">

      {/* 왼쪽 & 중앙 */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border min-h-[550px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-800">
                현재기상특보
              </h3>
              <span className="text-xs px-2 py-0.5 bg-gray-100 border rounded text-gray-500">
                특보없음
              </span>
            </div>
            <p className="text-xs text-gray-400">
              2025.12.21 기준
            </p>
          </div>

          <div className="h-[350px] bg-blue-50 rounded-xl border flex items-center justify-center">
            <span className="text-3xl font-black text-blue-200">
              MAP AREA
            </span>
          </div>
        </div>
      {/* 행동요령 박스 */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border">
          <ActionTipBox type="태풍" />
        </div>
      </div>

      
      {/* 오른쪽 패널 */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <WeatherBox />
        </div>

        {/* 재난문자 */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-full border border-gray-100/50">
          <DisasterMessageBox />
        </div>
      </div>
    </div>
  );
};
export default Typhoon;