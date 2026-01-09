import React from "react";
import { MapPin, Clock, AlertCircle, ChevronRight } from "lucide-react";

const DisasterMessage = () => {
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다.", type: "화재" },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다.", type: "교통" },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오.", type: "호우" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더: 모바일에서는 패딩을 줄이고, PC에서는 적당히 유지 */}
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center gap-2.5 flex-shrink-0 bg-white">
        <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-red-50">
          <AlertCircle size={16} className="text-red-500" />
        </div>
        {/* 모바일 text-body-s-bold -> PC text-body-m-bold */}
        <h3 className="text-body-s-bold md:text-body-m-bold text-gray-900">
          실시간 재난문자
        </h3>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3 md:space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="relative p-4 bg-gray-50/50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:shadow-md group border-l-4"
            style={{ borderLeftColor: msg.type === '화재' ? '#ef4444' : msg.type === '호우' ? '#3b82f6' : '#f97316' }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {/* 모바일에서는 더 작게(text-[11px]), PC에서는 원래대로(text-detail-s-bold) */}
                <span className="text-[11px] md:text-detail-s-bold text-gray-600 font-bold">{msg.region}</span>
                <span className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded font-black ${
                  msg.type === '화재' ? 'bg-red-100 text-red-600' : msg.type === '호우' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {msg.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] md:text-detail-s text-gray-400 font-mono">
                <Clock size={10} className="md:w-3 md:h-3" />
                {msg.time}
              </div>
            </div>

            {/* 본문: 모바일 text-detail-s -> PC text-detail-m (혹은 body-s) */}
            <p className="text-detail-s md:text-detail-m text-gray-700 leading-relaxed break-keep font-medium">
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex-shrink-0">
        <p className="text-detail-xs md:text-detail-xs text-gray-400 leading-tight">
          본 정보는 공공데이터를 기반으로 제공되며,<br className="md:hidden" />
          실제 상황과 일부 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default DisasterMessage;