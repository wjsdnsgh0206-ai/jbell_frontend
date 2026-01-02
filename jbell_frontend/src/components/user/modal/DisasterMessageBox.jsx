// ------ 재난사고속보 탭 - 재난안전문자 메시지 박스 ------ //

const DisasterMessage = () => {
  // 나중에 API로 불러올 더미 데이터
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다." },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다." },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오." },
  ];

  return (
   <>
      {/* 헤더 섹션: 패딩과 폰트 무게 조절 */}
      <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-[16px] font-black text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">●</span> 재난안전문자
        </h3>
        <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
          전체보기 +
        </button>
      </div>

      {/* 리스트 섹션: 간격을 더 쫀쫀하게 조절 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`px-5 py-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer
              ${idx !== messages.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[13px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {msg.region}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {msg.time}
              </span>
            </div>
            <p className="text-[13px] text-gray-600 font-medium leading-[1.5] break-keep line-clamp-2">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisasterMessage;