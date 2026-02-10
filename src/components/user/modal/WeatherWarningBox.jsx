import React, { useMemo } from 'react';
import { useWeatherWarning } from '@/hooks/user/useWeatherWarning';
import { AlertTriangle, Clock, MapPin, RefreshCcw, CheckCircle } from 'lucide-react';

/**
 * ============================
 * 🔧 판단 로직 정규화 유틸
 * ============================
 */

/** 1️⃣ 수준별 스타일 및 아이콘 매핑 */
const getLevelConfig = (levelText) => {
  switch (levelText) {
    case '위험':
      return {
        style: 'bg-red-50 text-red-700 border-red-200',
        icon: <AlertTriangle size={12} className="mr-1" />,
      };
    case '주의':
      return {
        style: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <AlertTriangle size={12} className="mr-1" />,
      };
    case '보통':
      return {
        style: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle size={12} className="mr-1" />,
      };
    default:
      return {
        style: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <Clock size={12} className="mr-1" />,
      };
  }
};

/** 2️⃣ 특보 유형(카테고리) 판별 */
const getCategories = (ttl = '', content = '') => {
  const text = `${ttl} ${content}`;
  const categoryRules = [
    { key: '지진', match: ['지진', '해일'] },
    { key: '호우홍수', match: ['호우', '홍수', '강우', '침수'] },
    { key: '태풍', match: ['태풍'] },
    { key: '산사태', match: ['산사태', '토사'] },
    { key: '산불', match: ['산불', '화재', '건조'] },
    { key: '한파', match: ['한파', '저온', '추위'] },
    { key: '폭염', match: ['폭염', '더위'] },
    { key: '강풍', match: ['강풍', '바람'] },
    { key: '대설', match: ['대설', '눈', '적설'] },
  ];

  return categoryRules
    .filter((rule) => rule.match.some((word) => text.includes(word)))
    .map((rule) => rule.key);
};

/** 3️⃣ 원본 데이터를 UI용 구조로 변환 */
const normalizeWarning = (item) => {
  // DB에서 가져온 level/lvl 필드 확인 (관리자 설정값)
  let displayLevel = item.level || item.lvl || item.LEVEL;

  // DB 값이 없을 경우(기상청 API 데이터) 제목으로 판별
  if (!displayLevel) {
    const ttl = item.TTL || '';
    if (ttl.includes('경보')) displayLevel = '위험';
    else if (ttl.includes('주의보')) displayLevel = '주의';
    else displayLevel = '보통';
  }

  const categories = getCategories(item.TTL, item.SPNE_FRMNT_PRCON_CN || item.content);

  return {
    ...item,
    displayLevel, // '보통', '주의', '위험'
    categories,
  };
};

/**
 * ============================
 * 📦 컴포넌트
 * ============================
 */

const WeatherWarningBox = ({ disasterType }) => {
  const { warnings, isLoading, refetch } = useWeatherWarning();

  /** 탭별 카테고리 매핑 */
  const typeMap = {
    earthquake: '지진',
    flood: '호우홍수',
    heavyrain: '호우홍수',
    landslide: '산사태',
    typhoon: '태풍',
    forestfire: '산불',
    coldwave: '한파',
  };

  /** ✅ 정규화 + 탭 필터링 */
  const filteredWarnings = useMemo(() => {
    if (!disasterType) return [];

    const targetCategory = typeMap[disasterType.toLowerCase()];
    if (!targetCategory) return [];

    return warnings
      .map(normalizeWarning)
      .filter((item) => {
        const isMatchCategory = item.categories.includes(targetCategory);
        // hook에서 이미 visibleYn을 거르지만, 한 번 더 안전하게 체크
        const isVisible = item.visibleYn !== 'N';

        return isMatchCategory && isVisible;
      });
  }, [warnings, disasterType]);

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center items-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div className="animate-spin mr-3 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        <span className="text-gray-500 font-medium">실시간 특보 데이터 분석 중...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />
          <h3 className="text-lg font-bold text-gray-800">전북 실시간 특보</h3>
        </div>
        <button
          onClick={refetch}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          title="새로고침"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {filteredWarnings.length > 0 ? (
          filteredWarnings.map((item) => {
            const config = getLevelConfig(item.displayLevel);
            return (
              <div
                key={item.PRSNTN_SN}
                className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                {/* 상단 */}
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.style}`}
                  >
                    {config.icon}
                    {item.displayLevel}
                  </span>

                  <span className="flex items-center text-[11px] text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {item.PRSNTN_TM
                      ? `${item.PRSNTN_TM.substring(4, 6)}/${item.PRSNTN_TM.substring(6, 8)} ${item.PRSNTN_TM.substring(8, 10)}:${item.PRSNTN_TM.substring(10, 12)}`
                      : '시간정보없음'}
                  </span>
                </div>

                {/* 제목 */}
                <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.TTL}
                </h4>

                {/* 지역 */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 border border-gray-100">
                  <div className="flex items-start gap-1">
                    <MapPin size={14} className="mt-0.5 text-blue-400 shrink-0" />
                    <p>{item.RLVT_ZONE}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm font-medium">현재 발효된 관련 기상특보가 없습니다.</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 text-center px-4 mt-auto">
        본 정보는 기상청 실시간 API 데이터입니다.
      </p>
    </div>
  );
};

export default WeatherWarningBox;