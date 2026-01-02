import { useNavigate } from "react-router-dom";

const MainDisaster = () => {
  const navigate = useNavigate();
  return (
    <>
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
                제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응 단계 격상
              </span>
            </div>
            <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums sm:ml-4">
              2025.12.05
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default MainDisaster;
