import React from "react";
import { useNavigate } from "react-router-dom";

/*
  MainDisaster 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 메인화면의 재난사고속보
  > 컴포넌트 설명 : 메인화면(pages/user/UserPageMain.jsx)에 들어갈 재난사고속보 컴포넌트로, 
    공지사항 / 보도자료 / 시민안전교육의 게시판 내용을 일부 표시함. 
*/

const MainDisaster = () => {
  const navigate = useNavigate();

  const disasterList = [
    {
      id: 1,
      type: "태풍",
      title: "제14호 태풍 '카이로스' 북상에 따른 전북 지역 비상 대응 단계 격상",
      date: "2025.12.05",
      path: "/disaster/typhoon",
    },
    {
      id: 2,
      type: "지진",
      title:
        "전북 장수군 북쪽 17km 지역 규모 3.5 지진 발생 (유감 신고 접수 중)",
      date: "2025.12.04",
      path: "/disaster/earthquake",
    },
    {
      id: 3,
      type: "산불",
      title:
        "건조주의보 발령 중, 입산 시 화기 소지 금지 및 산불 예방 수칙 준수",
      date: "2025.12.03",
      path: "/disaster/forestFire",
    },
    {
      id: 4,
      type: "산불",
      title:
        "건조주의보 발령 중, 입산 시 화기 소지 금지 및 산불 예방 수칙 준수",
      date: "2025.12.02",
      path: "/disaster/forestFire", // 산불 탭으로 이동
    },
    {
      id: 5,
      type: "사고",
      title:
        "서해안고속도로 하행선 부근 다중 추돌 사고 발생, 우회 도로 이용 권장",
      date: "2025.12.01",
      path: "/disaster/accident",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4 sm:mb-6">
        {/*=== 재난 사고속보 헤더 영역 === */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-title-m sm:text-title-l text-graygray-90 transition-all">
            재난사고속보
          </h2>
          <span className="bg-red-50 text-red-600 text-detail-m font-bold px-2 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        </div>
        {/* 더보기 버튼 클릭시, 재난사고속보 모달 페이지 오픈 */}
        <button
          className="text-detail-m text-graygray-50 hover:text-secondary-50 transition-colors p-1"
          onClick={() => navigate("/disaster/accident")}
        >
          더보기 +
        </button>
      </div>

      {/* === 게시물 리스트 영역 === */}
      <div className="flex flex-col gap-2 sm:gap-1">
        {disasterList.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer 
                       bg-white sm:bg-transparent hover:bg-secondary-5 
                       p-4 sm:p-3 rounded-xl transition-all duration-200 
                       border border-graygray-10 sm:border-0 sm:border-b sm:last:border-0 
                       gap-2 sm:gap-4 shadow-sm sm:shadow-none"
          >
            {/* 뱃지 + 제목 영역 */}
            <div className="flex items-center gap-3 overflow-hidden w-full">
              <span
                className={`shrink-0 w-12 text-center py-1 rounded-md text-detail-s md:text-detail-m font-bold border transition-colors
                ${
                  item.type === "태풍"
                    ? "border-blue-200 text-blue-500 bg-blue-50"
                    : item.type === "지진"
                    ? "border-amber-200 text-amber-600 bg-amber-50"
                    : item.type === "호우"
                    ? "border-indigo-200 text-indigo-500 bg-indigo-50"
                    : "border-gray-200 text-gray-500 bg-gray-50"
                }`}
              >
                {item.type}
              </span>

              {/* 제목 */}
              <span className="text-body-s md:text-body-m text-graygray-80 group-hover:text-secondary-50 transition-colors truncate flex-1">
                {item.title}
              </span>
            </div>

            {/* 날짜 영역 */}
            <span className="text-detail-m text-graygray-50 tabular-nums self-end sm:self-auto">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainDisaster;
