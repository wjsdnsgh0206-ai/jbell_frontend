import React from "react";
import { MapPin, Clock, AlertCircle, ChevronRight } from "lucide-react";

const DisasterMessage = () => {
  const messages = [
    { id: 1, region: "중화산동", time: "12:45", content: "금일 화재 발생으로 인해 인근 주민들은 창문을 닫고 안전에 유의하시기 바랍니다.", type: "화재" },
    { id: 2, region: "서신동", time: "11:20", content: "도로 파손 복구 공사로 인해 해당 구간 교통 정체가 예상되오니 우회 바랍니다.", type: "교통" },
    { id: 3, region: "효자동", time: "09:15", content: "호우 주의보 발령. 하천변 산책로 출입을 금지하며 안전한 곳으로 대피하십시오.", type: "호우" },
  ];

  return (
    <div className="flex flex-col h-full bg-graygray-0">
      {/* 헤더 섹션: 타이틀 크기 최적화 */}
      <div className="px-6 py-3 border-b border-graygray-10 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary-5">
            <AlertCircle size={16} className="text-secondary-50" />
          </div>
          <h3 className="text-title-s text-graygray-90 tracking-tight">
            실시간 재난문자
          </h3>
        </div>
      </div>

      {/* 리스트 섹션: 가독성 중심 카드 설계 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="relative p-5 bg-graygray-0 border border-graygray-10 rounded-xl hover:border-secondary-20 transition-all duration-200 cursor-default shadow-sm group"
          >
            {/* 상단 메타 정보: 글자 크기 및 간격 조정 */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-body-s-bold text-graygray-60">
                  <MapPin size={12} className="text-graygray-40" />
                  {msg.region}
                </div>
                <span className="w-1 h-1 rounded-full bg-graygray-20" />
                <span className={`text-body-s-bold ${
                  msg.type === '화재' ? 'text-red-500' : msg.type === '호우' ? 'text-secondary-50' : 'text-orange-500'
                }`}>
                  {msg.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-detail-s font-medium text-graygray-40 tabular-nums">
                <Clock size={12} />
                {msg.time}
              </div>
            </div>

            {/* 본문 영역: 글자 크기를 키워 시인성 확보 */}
            <p className="text-detail-m text-graygray-80 font-medium leading-[1.6] break-keep">
              {msg.content}
            </p>

            {/* 디자인 포인트: 왼쪽 강조 바를 조금 더 굵게 */}
            <div className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-transform group-hover:scale-y-110 ${
              msg.type === '화재' ? 'bg-red-500' : msg.type === '호우' ? 'bg-secondary-50' : 'bg-orange-500'
            }`} />
          </div>
        ))}
      </div>

      {/* 푸터: 폰트 가독성 한계치 고려 */}
      <div className="px-6 py-2 bg-graygray-5 border-t border-graygray-10">
        <p className="text-detail-xs text-graygray-50 leading-relaxed">
          본 정보는 공공데이터를 기반으로 제공되며,<br/>
          실제 상황과 일부 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default DisasterMessage;