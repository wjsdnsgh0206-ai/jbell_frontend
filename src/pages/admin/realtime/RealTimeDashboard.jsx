import React from "react";

// [공통 컴포넌트]
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchBox from "@/components/admin/AdminSearchBox";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";

// 개별 섹션 컴포넌트들
// (파일이 없다면 에러가 날 수 있으니, 파일명을 확인해줘!)
import { QuickMenu } from "@/components/admin/realtime/QuickMenu";
import { MessageBoard } from "@/components/admin/realtime/MessageBoard";
import { TimeFilter } from "@/components/admin/realtime/TimeFilter";

// 이미지가 없는 경우를 대비해 간단한 원형 아이콘 컴포넌트 생성
const DummyIcon = ({ color = "#ccc" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill={color} />
  </svg>
);

export const RealTimeDashboard = () => {
  const mapMarkers = [
    { id: 1, top: "128px", left: "152px", color: "#de3412", type: "주의(특보)" },
    { id: 2, top: "315px", left: "464px", color: "#de3412", type: "주의(특보)" },
    { id: 3, top: "110px", left: "454px", color: "#0b78cb", type: "위급(재난)" },
  ];

  const legendItems = [
    { id: 1, color: "#0B78CB", label: "위급(재난)" },
    { id: 2, color: "#DE3412", label: "주의(특보)" },
  ];

  return (
    <div className="relative w-full h-[1080px] mx-auto bg-white">
      {/* 1. 시간 범위 선택 섹션 */}
      <TimeFilter />

      {/* 2. 지도 영역 */}
      <section
        className="absolute w-[735px] h-[416px] top-[266px] left-[50px] flex flex-col items-center justify-center gap-4 p-6 rounded-xl border border-solid border-graygray-40 bg-gray-50"
        aria-label="재난 요약 지도"
      >
        {/* 지도 마커 */}
        {mapMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute w-6 h-6"
            style={{ top: marker.top, left: marker.left }}
          >
            <div
              className="relative w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: marker.color }}
            />
          </div>
        ))}

        {/* 확대 버튼 (이미지 대신 텍스트/기호 사용) */}
        <button
          className="absolute top-[13px] left-[697px] w-6 h-6 flex items-center justify-center border rounded bg-white"
          aria-label="지도 확대"
        >
          <span className="text-xs font-bold">+</span>
        </button>

        {/* 축소 버튼 */}
        <button
          className="relative w-6 h-6 flex items-center justify-center border rounded bg-white"
          aria-label="지도 축소"
        >
          <span className="text-xs font-bold">-</span>
        </button>

        <h2 className="font-bold text-[#1d1d1d] text-[17px] text-center leading-[25.5px]">지도 영역</h2>
        <p className="font-bold text-[#1d1d1d] text-[17px] text-center leading-[25.5px] text-gray-400">(카카오 API 연동 예정)</p>

        {/* 범례 */}
        <div className="absolute top-[324px] left-[614px] inline-flex flex-col gap-2.5 p-2.5 rounded-[10px] border border-black bg-white" role="list">
          {legendItems.map((item) => (
            <div key={item.id} className="inline-flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[15px] text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 최근 재난 문자 및 뉴스 섹션 */}
      <MessageBoard />

      {/* 4. 자주찾는 메뉴 섹션 */}
      <QuickMenu />
    </div>
  );
};

export default RealTimeDashboard;