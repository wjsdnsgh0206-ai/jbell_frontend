import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
// 보드 데이터를 가져와 (경로는 네 프로젝트 구조에 맞게 수정해줘!)
// MainBoard.jsx 상단에서 이렇게 바꿔봐!
import { noticeData, pressData } from "../../../pages/user/openboards/BoardData.js";

const MainBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("공지사항");

  const tabPaths = {
    공지사항: "/userNoticeList",
    보도자료: "/userPressRelList",
  };

  // activeTab에 따라 보여줄 데이터를 선택하고 최신순(날짜 내림차순) 정렬 후 5개만 추출
  const currentDisplayData = useMemo(() => {
    let data = [];
    if (activeTab === "공지사항") data = [...noticeData];
    else if (activeTab === "보도자료") data = [...pressData];
    // else if (activeTab === "시민안전교육") data = []; // 시민안전교육 데이터가 생기면 여기에 추가!

    // 날짜(date) 기준으로 내림차순 정렬 후 상위 5개 자르기
    return data
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [activeTab]);

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
              onClick={() => navigate(`${tabPaths[activeTab]}/${item.id}`)}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full transition-colors ${item.isPin ? 'bg-red-500' : 'bg-graygray-40 group-hover:bg-blue-500'}`} />
                <span className="truncate text-body-m text-graygray-80 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </span>
              </div>
              <span className="shrink-0 text-detail-m text-graygray-40 tabular-nums">
                {item.date.replace(/-/g, ".")}
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