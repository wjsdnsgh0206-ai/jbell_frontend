import React from "react";
import { useNavigate } from "react-router-dom";

const MainDisaster = () => {
  const navigate = useNavigate();

  // 1. 실제로는 나중에 백엔드 API에서 받아올 데이터의 구조.
  // path를 미리 지정해두면 클릭했을 때 해당 탭으로 이동 가능
  const disasterList = [
    {
      id: 1,
      type: "태풍",
      title: "제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응 단계 격상",
      date: "2025.12.05",
      path: "/disaster/typhoon", // 태풍 탭으로 이동
    },
    {
      id: 2,
      type: "지진",
      title: "전북 장수군 북쪽 17km 지역 규모 3.5 지진 발생 (유감 신고 접수 중)",
      date: "2025.12.04",
      path: "/disaster/earthquake", // 지진 탭으로 이동
    },
    {
      id: 3,
      type: "호우",
      title: "내일 새벽까지 전북 전역 최대 120mm 집중호우 예상, 하천변 접근 금지",
      date: "2025.12.03",
      path: "/disaster/heavyRain", // 호우 탭으로 이동
    },
    {
      id: 4,
      type: "산불",
      title: "건조주의보 발령 중, 입산 시 화기 소지 금지 및 산불 예방 수칙 준수",
      date: "2025.12.02",
      path: "/disaster/wildfire", // 산불 탭으로 이동
    },
    {
      id: 5,
      type: "사고",
      title: "서해안고속도로 하행선 부근 다중 추돌 사고 발생, 우회 도로 이용 권장",
      date: "2025.12.01",
      path: "/disaster/accident", // 사고속보 탭으로 이동
    },
  ];

  return (
    <div className="w-full">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-gray-900">
            재난사고속보
          </h2>
          <span className="bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
        
        {/* 전체 목록은 '사고속보' 탭으로 이동 */}
        <button
          className="text-gray-400 hover:text-blue-600 transition-colors text-xs sm:text-sm font-medium"
          onClick={() => navigate("/disaster/accident")}
        >
          더보기 +
        </button>
      </div>

      {/* 게시물 리스트 영역 */}
      <div className="space-y-1">
        {disasterList.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.path)} // 클릭시 카테고리 탭으로 이동 (재난사고속보 탭 오픈 후, 카테고리 선택 이동)
            className="flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer 
                       hover:bg-blue-50/50 p-2 sm:p-3 rounded-xl transition-all duration-200 
                       border-b border-gray-50 last:border-0 gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              {/* 카테고리 뱃지 */}
              <span className={`shrink-0 w-12 sm:w-14 text-center py-1 rounded-md text-[10px] sm:text-[11px] font-bold border transition-colors
                ${item.type === "태풍" ? "border-blue-200 text-blue-500 bg-blue-50" : 
                  item.type === "지진" ? "border-amber-200 text-amber-600 bg-amber-50" :
                  item.type === "호우" ? "border-indigo-200 text-indigo-500 bg-indigo-50" :
                  "border-gray-200 text-gray-500 bg-gray-50"
                }`}
              >
                {item.type}
              </span>

              {/* 제목 */}
              <span className="text-xs sm:text-sm lg:text-[15px] font-semibold text-gray-700 group-hover:text-blue-600 transition-colors truncate">
                {item.title}
              </span>
            </div>

            {/* 날짜 */}
            <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums font-medium sm:ml-auto">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDisaster;