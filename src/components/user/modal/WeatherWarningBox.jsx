import React from 'react';
import { useWeatherWarning } from '@/hooks/user/useWeatherWarning';
import { AlertTriangle, Clock, MapPin, RefreshCcw } from 'lucide-react';

const WeatherWarningBox = ({ disasterType }) => {
  const { warnings, isLoading, refetch } = useWeatherWarning(disasterType);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center items-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="animate-spin mr-3 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="text-gray-500 font-medium">실시간 특보 데이터 분석 중...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold text-gray-800">실시간 특보</h3>
        </div>
        <button 
          onClick={refetch}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          title="새로고침"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* 특보 카드 리스트 */}
      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {warnings.length > 0 ? (
          warnings.map((item) => (
            <div 
              key={item.PRSNTN_SN}
              className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                  <AlertTriangle size={12} className="mr-1" />
                  {item.TTL && item.TTL.includes('경보') ? '위험' : '주의'}
                </span>
                <span className="flex items-center text-[11px] text-gray-400 uppercase tracking-tighter">
                  <Clock size={12} className="mr-1" />
                  {/* 에러 수정 부분: PRSNTN_TM(202601281400) 형식을 안전하게 자름 */}
                  {item.PRSNTN_TM ? 
                    `${item.PRSNTN_TM.substring(4, 6)}/${item.PRSNTN_TM.substring(6, 8)} ${item.PRSNTN_TM.substring(8, 10)}:${item.PRSNTN_TM.substring(10, 12)}` 
                    : "시간정보없음"}
                </span>
              </div>
              
              <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.TTL}
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed border border-gray-100">
                <div className="flex items-start gap-1">
                  <MapPin size={14} className="mt-0.5 text-blue-400 shrink-0" />
                  <p className="line-clamp-3 md:line-clamp-none">
                    {item.RLVT_ZONE}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">현재 발효된 관련 기상특보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 모바일 하단 안내 */}
      <p className="text-[10px] text-gray-400 text-center px-4">
        본 정보는 기상청 API를 통해 실시간으로 제공되며, 실제 상황과 다를 수 있습니다.
      </p>
    </div>
  );
};

export default WeatherWarningBox;