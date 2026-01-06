import React from "react";
import { MapPin, Clock, AlertCircle } from "lucide-react";

/*
  수정 사항:
  1. 디자인 토큰 적용: gray-900 -> graygray-90, gray-500 -> graygray-50 등
  2. Semantic Class 적용: text-body-m, text-detail-m 등 활용
  3. 배경색 및 보더: 디자인 시스템의 secondary 및 graygray 토큰 활용
*/

const DisasterMessage = () => {
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다.", type: "화재" },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다.", type: "교통" },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오.", type: "호우" },
  ];

  return (
    <div className="flex flex-col h-full bg-graygray-0 selection:bg-secondary-5">
      {/* 헤더 섹션 */}
      <div className="px-6 py-5 border-b border-graygray-10 flex justify-between items-center bg-graygray-0">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary-5">
             <AlertCircle size={14} className="text-secondary-50" />
          </div>
          <h3 className="text-body-m-bold text-graygray-90 tracking-tight">
            실시간 재난문자
          </h3>
        </div>
      </div>

      {/* 리스트 섹션 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="relative p-4 bg-graygray-0 border border-graygray-10 rounded-2xl hover:border-graygray-30 transition-colors duration-200 cursor-default shadow-1"
          >
            {/* 상단 라벨 영역 */}
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[11px] font-bold text-graygray-50">
                  <MapPin size={10} />
                  {msg.region}
                </div>
                <div className="w-[1px] h-2 bg-graygray-10" />
                <span className={`text-[10px] font-bold ${
                  msg.type === '화재' ? 'text-red-500' : msg.type === '호우' ? 'text-secondary-50' : 'text-orange-500'
                }`}>
                  {msg.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-graygray-40 tabular-nums">
                <Clock size={10} />
                {msg.time}
              </div>
            </div>

            {/* 본문 영역 - Semantic Class 적용 */}
            <p className="text-detail-m sm:text-body-m text-graygray-80 font-medium leading-relaxed break-keep">
              {msg.content}
            </p>

            {/* 왼쪽 상태 바 */}
            <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full ${
              msg.type === '화재' ? 'bg-red-500' : msg.type === '호우' ? 'bg-secondary-50' : 'bg-orange-500'
            }`} />
          </div>
        ))}
      </div>

      {/* 하단 푸터 */}
      <div className="px-5 py-3 bg-graygray-5 border-t border-graygray-10">
        <p className="text-[9px] text-graygray-50 font-medium leading-relaxed">
          본 정보는 공공데이터를 기반으로 제공되며,<br/>
          실제 상황과 일부 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default DisasterMessage;