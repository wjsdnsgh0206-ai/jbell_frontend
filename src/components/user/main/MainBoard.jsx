import { useNavigate } from "react-router-dom";
import { useState } from "react";

/*
  MainBoard 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 메인화면의 요약 게시판
  > 컴포넌트 설명 : 메인화면(pages/user/UserPageMain.jsx)에 들어갈 요약게시판 컴포넌트로, 
    공지사항 / 보도자료 / 시민안전교육의 게시판 내용을 일부 표시함. 
*/

const MainBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("공지사항");

  const tabPaths = {
    공지사항: "/userNoticeList",
    보도자료: "/userPressRelList",
    시민안전교육: "/userSafetyEducation",
  };

  return (
    <div className="bg-white rounded-[24px] border border-graygray-10 p-6 sm:p-8 shadow-sm h-full">
      <div className="flex justify-between items-end mb-8 border-b border-graygray-10">
        <div className="flex gap-6 sm:gap-10 overflow-x-auto scrollbar-hide">
          {["공지사항", "보도자료", "시민안전교육"].map((tab) => (
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
          className="shrink-0 mb-4 text-detail-m text-graygray-50 hover:text-graygray-90 transition-colors font-bold"
          onClick={() => navigate(tabPaths[activeTab])}
        >
          더보기 +
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {[1, 2, 3, 4, 5].map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center group cursor-pointer gap-4 p-3 -mx-2 rounded-xl hover:bg-graygray-5/50 transition-all"
            onClick={() => navigate(tabPaths[activeTab])}
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-graygray-40 group-hover:bg-blue-500 transition-colors" />
              <span className="truncate text-body-m text-graygray-80 group-hover:text-blue-600 transition-colors">
                {activeTab} - 2026년 관련 통합 운영 안내 서비스 제목 {idx + 1}
              </span>
            </div>
            <span className="shrink-0 text-detail-m text-graygray-40 tabular-nums">
              2025.12.05
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainBoard;
