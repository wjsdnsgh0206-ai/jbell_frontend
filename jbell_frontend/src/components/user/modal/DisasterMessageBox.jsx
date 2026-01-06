import React from "react";

/*
  DisasterMessage 컴포넌트
  > 작성자 : 최지영
  > 컴포넌트 이름 : 재난사고속보 모달 - 재난문자 박스
  > 컴포넌트 설명 : 재난사고속보 모달 내부의 재난문자 컴포넌트로, 재난문자 내용을 표시함. 
    재난사고속보 모달 내의 모든 페이지(사고속보, 지진, 태풍, 호우, 홍수, 산사태, 산불)에서 공통으로 사용되는 컴포넌트임.
*/

const DisasterMessage = () => {
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다." },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다." },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오." },
  ];

  return (
    <>
      {/* 헤더 섹션 */}
      <div className="px-5 py-4 bg-graygray-5/50 border-b border-graygray-10 flex justify-between items-center">
        <h3 className="text-body-m font-black text-graygray-90 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          최신 재난문자
        </h3>
      </div>

      {/* 리스트 섹션 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
  {messages.map((msg) => (
    <div 
      key={msg.id} 
      className="p-4 bg-white border border-graygray-10 rounded-[16px] shadow-sm hover:shadow-md hover:border-graygray-20 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-detail-m font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
          {msg.region}
        </span>
        <span className="text-detail-m font-bold text-graygray-40 tabular-nums">
          {msg.time}
        </span>
      </div>
      <p className="text-detail-l sm:text-body-m text-graygray-80 font-black leading-relaxed break-keep line-clamp-2">
        {msg.content}
      </p>
    </div>
  ))}
</div>
    </>
  );
};

export default DisasterMessage;