import { useNavigate } from "react-router-dom";
import MainActionGuide from "@/components/user/main/MainActionGuide";
import { useState } from "react";
import MainWeather from "@/components/user/main/MainWeather";
import MainStatistics from "@/components/user/main/MainStatistics";
import MainDisaster from "@/components/user/main/MainDisaster";
// --------- 메인 화면 ----------- //
const UserPageMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("공지사항");

  // 각 탭마다 매핑되는 경로 설정
  const tabPaths = {
    공지사항: "/userOpenSpaceLi",
    보도자료: "/userOpenSpaceLi",
    시민안전교육: "/userOpenSpaceLi",
  };
  return (
    <div className="w-full min-h-screen font-sans">
      {/* 재난사고속보 & 날씨 박스 - components/user/main 폴더에 따로 컴포넌트 생성해서 불러옴.*/}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* 재난사고속보 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <MainDisaster />
            </div>
            {/* 날씨 */}
            <div className="w-full lg:w-[400px] flex flex-col gap-3 sm:gap-4">
              <MainWeather />
            </div>
          </div>
        </div>
      </section>

      {/* 통계 박스 - components/user/main 폴더에 따로 컴포넌트 생성해서 불러옴. */}
      <section className="w-full ">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <MainStatistics />
        </div>
      </section>

      <div className="w-full min-h-screen font-sans">
        <section className="w-full">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* 공지사항 탭 영역 */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-gray-100">
                  <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto">
                    {["공지사항", "보도자료", "시민안전교육"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)} // 클릭 시 탭 변경
                        className={`pb-3 sm:pb-4 text-sm sm:text-base lg:text-lg font-bold transition-all whitespace-nowrap ${
                          activeTab === tab
                            ? "border-b-4 border-blue-600 text-blue-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* 더보기 버튼 - 클릭시 해당 페이지로 이동*/}
                  <button
                    className="shrink-0 mb-3 sm:mb-4 text-gray-400 hover:text-black transition-colors text-xs sm:text-sm font-medium"
                    onClick={() => navigate(tabPaths[activeTab])}
                  >
                    더보기 +
                  </button>
                </div>

                {/* 탭 내용 (현재는 예시 리스트만 출력) */}
                <div className="space-y-4 sm:space-y-5">
                  {[1, 2, 3, 4, 5].map((data, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center group cursor-pointer gap-2"
                    >
                      <p className="text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2 overflow-hidden flex-1">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                        <span className="truncate text-xs sm:text-sm lg:text-base">
                          {activeTab} - 2025년 관련 통합 운영 안내 서비스 제목{" "}
                          {idx + 1}
                        </span>
                      </p>
                      <span className="shrink-0 text-xs sm:text-sm text-gray-400 tabular-nums">
                        12.05
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* 행동요령 박스 - components/user/main 폴더에 따로 컴포넌트 생성해서 불러옴. */}
              <MainActionGuide />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserPageMain;
