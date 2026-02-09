import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { disasterModalService } from "@/services/api";

const MainDisaster = () => {
  const navigate = useNavigate();
  const [disasterList, setDisasterList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDisasterData = async () => {
    try {
      setLoading(true);
      const data = await disasterModalService.fetchCombinedDisasterList();
      if (data && Array.isArray(data)) {
        setDisasterList(data);
      }
    } catch (error) {
      console.error("재난 데이터를 불러오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisasterData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getBadgeStyle = (category) => {
    if (!category) return "border-gray-200 text-gray-500 bg-gray-50";
    if (category.includes("태풍")) return "border-blue-200 text-blue-500 bg-blue-50";
    if (category.includes("지진")) return "border-amber-200 text-amber-600 bg-amber-50";
    if (category.includes("호우")) return "border-indigo-200 text-indigo-500 bg-indigo-50";
    if (category.includes("산불")) return "border-orange-200 text-orange-600 bg-orange-50";
    if (category.includes("경보") || category.includes("재난")) return "border-red-200 text-red-500 bg-red-50";
    return "border-gray-200 text-gray-500 bg-gray-50";
  };

  return (
    // max-w-2xl 정도를 줘서 너무 옆으로 퍼지는 걸 방지해
    <div className="w-full max-w-[700px]"> 
      <div className="flex justify-between items-end mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-title-m sm:text-title-l text-graygray-90">재난사고속보</h2>
          <span className="bg-red-50 text-red-600 text-detail-m font-bold px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
        </div>
        <button
          className="text-detail-m text-graygray-50 hover:text-secondary-50 transition-colors p-1"
          onClick={() => navigate("/disaster/earthquake")}
        >
          더보기 +
        </button>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="py-10 text-center text-gray-400 text-body-s">데이터 로딩 중...</div>
        ) : disasterList.length > 0 ? (
          disasterList.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/disaster/earthquake`)}
              className="flex items-center justify-between group cursor-pointer 
                         hover:bg-secondary-5 
                         py-3 px-1 /* 패딩을 살짝 늘려 가독성 확보 */
                         border-b border-graygray-10 last:border-0 
                         gap-4 transition-all duration-200"
            >
              <div className="flex items-center gap-4 overflow-hidden flex-1">
                <span className={`shrink-0 w-12 text-center py-0.5 rounded-md text-detail-s font-bold border ${getBadgeStyle(item.category)}`}>
                  {item.category.substring(0, 2)}
                </span>
                {/* 제목 영역이 너무 길어지지 않게 유지 */}
                <span className="text-body-s md:text-body-m text-graygray-80 group-hover:text-secondary-50 transition-colors truncate">
                  {item.title}
                </span>
              </div>

              <span className="shrink-0 text-detail-m text-graygray-50 tabular-nums ml-4">
                {formatDate(item.eventDate)}
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400 text-body-s">조회된 데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MainDisaster;