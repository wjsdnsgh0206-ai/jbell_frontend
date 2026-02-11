import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { noticeApi, pressService } from '@/services/api';
const MainBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("공지사항");
  // 서버에서 받아온 데이터를 저장할 상태
  const [noticeData, setNoticeData] = useState([]);
  const [pressData, setPressData] = useState([]);

  const tabPaths = {
    공지사항: "/userNoticeList",
    보도자료: "/userPressRelList",
  };

  // 리스트 클릭용 (상세 페이지)
  const tabDetailPaths = {
    "공지사항": "/userNoticeDetail",
    "보도자료": "/userPressRelDetail",
  };

  // 탭 선택(activeTab)에 따라 공지사항 또는 보도자료 데이터를 최신순으로 5개만 추출.
  const fetchBoardData = useCallback(async () => {
    try {
      if (activeTab === "공지사항") {
        const response = await noticeApi.getNoticeList();
        const formatted = response
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(item => ({
            id: item.id,
            title: item.title,
            date: item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : "",
            isPin: item.isPinned === 'Y'
          }));
        setNoticeData(formatted);
      }  else {
      // 보도자료 API 호출
      const response = await pressService.getPressList({ offset: 0, limit: 5 });
      const dataList = response?.list || [];
      const formatted = dataList.map(item => ({
        id: item.contentId,
        title: item.title,
        date: item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : "",
        isPin: false
      }));
      setPressData(formatted);
    }
  } catch (error) {
    //console.error("데이터 로드 실패:", error);
  }
}, [activeTab]);

useEffect(() => {
  fetchBoardData();
}, [fetchBoardData]);

  const currentDisplayData = activeTab === "공지사항" ? noticeData : pressData;

  return (
    <div className="bg-white rounded-xl border border-graygray-10 p-6 sm:p-8 h-full">
      <div className="flex justify-between items-end border-b border-graygray-10">
        <div className="flex gap-3 sm:gap-10 overflow-x-auto scrollbar-hide">
          {["공지사항", "보도자료"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-body-l font-black sm:text-title-s lg:text-title-m transition-all whitespace-nowrap relative ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-graygray-40 hover:text-graygray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button
          className="text-center shrink-0 mb-4 text-detail-m text-graygray-50 hover:text-graygray-90 transition-colors font-bold"
          onClick={() => navigate(tabPaths[activeTab])}
        >
          더보기 +
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        {currentDisplayData.length > 0 ? (
          currentDisplayData.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center group cursor-pointer gap-4 p-3 -mx-2 rounded-xl hover:bg-graygray-5/50 transition-all"
              onClick={() => navigate(`${tabDetailPaths[activeTab]}/${item.id}`)}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full transition-colors ${item.isPin ? 'bg-red-500' : 'bg-graygray-40 group-hover:bg-blue-500'}`} />
                <span className="truncate text-body-m text-graygray-80 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </span>
              </div>
              <span className="shrink-0 text-detail-m text-graygray-40 tabular-nums">
                {item.date} 
              </span>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-graygray-40">게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MainBoard;