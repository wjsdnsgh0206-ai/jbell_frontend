import { useNavigate } from "react-router-dom";
import MainActionGuide from "@/components/user/main/MainActionGuide";
import { useState } from "react";
import MainWeather from "@/components/user/main/MainWeather";
import MainStatistics from "@/components/user/main/MainStatistics";
import MainDisaster from "@/components/user/main/MainDisaster";

const UserPageMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("공지사항");

  const tabPaths = {
    공지사항: "/userOpenSpaceLi",
    보도자료: "/userOpenSpaceLi",
    시민안전교육: "/userOpenSpaceLi",
  };

  return (
    <div className="w-full min-h-screen font-sans bg-gray-50/30 text-gray-900">
      
      {/* 1. 재난사고속보 & 날씨 섹션 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm">
              <MainDisaster />
            </div>
            <div className="w-full lg:w-[420px] flex flex-col gap-4">
              <MainWeather />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <MainStatistics />
        </div>
      </section>

      {/* 3. 공지사항 & 행동요령 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 lg:pb-28 lg:pt-14"> 
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* 공지사항 탭 영역 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8 lg:p-10 shadow-md">
              <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100">
                <div className="flex gap-6 sm:gap-10 overflow-x-auto">
                  {["공지사항", "보도자료", "시민안전교육"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-base sm:text-lg lg:text-xl font-black transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? "border-b-[5px] border-blue-600 text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  className="shrink-0 mb-4 text-gray-500 hover:text-black transition-colors text-sm sm:text-base font-bold"
                  onClick={() => navigate(tabPaths[activeTab])}
                >
                  더보기 +
                </button>
              </div>

              {/* 리스트 텍스트 크기 상향 */}
              <div className="space-y-5 sm:space-y-7">
                {[1, 2, 3, 4, 5].map((data, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center group cursor-pointer gap-4 border-b border-gray-50 pb-2 last:border-0"
                  >
                    <p className="text-gray-800 group-hover:text-blue-600 transition-colors flex items-center gap-3 overflow-hidden flex-1">
                      <span className="shrink-0 w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600" />
                      <span className="truncate text-sm sm:text-base lg:text-[17px] font-medium leading-relaxed">
                        {activeTab} - 2025년 관련 통합 운영 안내 서비스 제목 {idx + 1}
                      </span>
                    </p>
                    <span className="shrink-0 text-sm sm:text-base text-gray-400 tabular-nums font-medium">
                      2025.12.05
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 행동요령 박스 */}
            <div className="flex flex-col h-full">
                <MainActionGuide />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default UserPageMain;