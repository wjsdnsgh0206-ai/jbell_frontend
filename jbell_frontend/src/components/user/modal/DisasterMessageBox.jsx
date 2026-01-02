// ------ 재난사고속보 탭 - 재난안전문자 메시지 박스 ------ //

import React from "react";

const DisasterMessage = () => {
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다." },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다." },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오." },
  ];

  return (
    <>
      <div className="px-5 py-4 bg-slate-50/50 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-[15px] font-black text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          최신 재난문자
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 hover:bg-slate-50/80 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[15px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                {msg.region}
              </span>
              <span className="text-[12px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                {msg.time}
              </span>
            </div>
            <p className="text-[15px] text-slate-600 font-bold leading-relaxed break-keep line-clamp-2">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DisasterMessage;