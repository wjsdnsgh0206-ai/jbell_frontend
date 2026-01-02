import { useNavigate } from "react-router-dom";
import ActionGuide from '@/components/user/ActionGuide';
import { useState } from 'react';
import Weather from '@/components/user/main/Weather';
// --------- 메인 화면 ----------- //
const UserPageMain = () => {
  const navigate = useNavigate();


  // 1. 현재 선택된 탭을 관리할 상태 추가
  const [activeTab, setActiveTab] = useState('공지사항');

  // 2. 각 탭 이름에 매핑되는 경로 설정
  const tabPaths = {
    '공지사항': '/userOpenSpaceLi',
    '보도자료': '/userOpenSpaceLi',
    '시민안전교육': '/userOpenSpaceLi'
  };
  return (
    <div className="w-full min-h-screen font-sans">
      {/* 1. 상단 알림 및 날씨 섹션 */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* 재난사고속보 */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
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
                        제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응
                        단계 격상
                      </span>
                    </div>
                    <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums sm:ml-4">
                      2025.12.05
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 날씨 및 경보 */}
            <div className="w-full lg:w-[400px] flex flex-col gap-3 sm:gap-4">
              <Weather/>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 통계 섹션 */}
      <section className="w-full ">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="bg-[#2d3748] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-center text-white gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl text-xl sm:text-2xl">
                📊
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  지난주 주요 재난통계
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  데이터 기준: 2025.12.01 ~ 12.07
                </p>
              </div>
            </div>
            <div className="flex gap-8 sm:gap-12 lg:gap-16 w-full sm:w-auto justify-center">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1">
                  발생 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black">
                  458
                  <span className="text-xs sm:text-sm ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
              <div className="w-[1px] h-10 sm:h-12 bg-gray-600" />
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-400 mb-1 text-red-400">
                  사망 건수
                </p>
                <p className="text-2xl sm:text-3xl font-black text-red-400">
                  5
                  <span className="text-xs sm:text-sm ml-1 font-normal opacity-70">
                    건
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    <div className="w-full min-h-screen font-sans">
      {/* ... (상단 알림 및 날씨 섹션, 통계 섹션은 기존과 동일) ... */}

      {/* 3. 하단 컨텐츠 그리드 섹션 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* 공지사항 탭 영역 */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-gray-100">
                <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto">
                  {['공지사항', '보도자료', '시민안전교육'].map((tab) => (
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

                {/* --- 더보기 버튼 추가 --- */}
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
                  <div key={idx} className="flex justify-between items-center group cursor-pointer gap-2">
                    <p className="text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-2 overflow-hidden flex-1">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600" />
                      <span className="truncate text-xs sm:text-sm lg:text-base">
                        {activeTab} - 2025년 관련 통합 운영 안내 서비스 제목 {idx + 1}
                      </span>
                    </p>
                    <span className="shrink-0 text-xs sm:text-sm text-gray-400 tabular-nums">
                      12.05
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ActionGuide/>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default UserPageMain;
