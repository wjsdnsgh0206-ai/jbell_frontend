import {MainActionGuide,MainWeather,MainStatistics,MainDisaster,MainBoard} from "@/components/user/main/index.js";
const UserPageMain = () => {


  return (
    <div className="w-full min-h-screen bg-white text-graygray-90">
      
      {/* 1. 재난사고속보 & 날씨 섹션 */}
      <section className="w-full mt-[20px]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 재난사고속보 박스: 행동요령과 동일한 스타일 적용 */}
            <div className="flex-1 bg-white border border-graygray-10 rounded-[24px] p-5 sm:p-8 shadow-1">
              <MainDisaster />
            </div>
            {/* 날씨 영역 */}
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
<div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-6 pb-10 lg:pt-6 lg:pb-28">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 공지사항 탭 박스: 행동요령과 동일한 스타일 적용 */}
            <MainBoard/>

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