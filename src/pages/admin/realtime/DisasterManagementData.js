/**
 * [관리자] 실시간 재난 관리 더미 데이터 (리팩토링 완료)
 * [데이터 구조 규칙 - CamelCase 적용]
 * 1. id: 고유 식별자 (DB: disaster_id)
 * 2. category: 재난 유형 (지진, 호우·홍수, 산사태, 태풍, 산불, 한파)
 * 3. dataSource: 연동 데이터 API 소스 정보 (api.js 내 서비스 명칭 매칭)
 * 4. mapLayer: 지도에 표시될 레이어 설정 정보 (DB: map_layer)
 * 5. apiStatus: API 연동 상태 (정상/점검중) (DB: api_status)
 * 6. visibleYn: 노출 여부 'Y'/'N' (DB: visible_yn)
 * 7. updatedAt: 최종 수정일 (DB: updated_at)
 */

export const DisasterManagementData = [
  { id: 1, category: "호우·홍수", dataSource: "sluiceApi (수문 정보)", mapLayer: "실시간 댐 수위 / 방류 현황", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-20" },
  { id: 2, category: "호우·홍수", dataSource: "floodTraceApi (침수흔적도)", mapLayer: "과거 침수 지역 / 하천 범람 구역", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-19" },
  { id: 3, category: "지진", dataSource: "kmaApi (지진특보)", mapLayer: "지진 발생 위치 / 통보문", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-18" },
  { id: 4, category: "지진", dataSource: "earthquakeLevelApi (지진 진도)", mapLayer: "지역별 계측 진도 분포도", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-17" },
  { id: 5, category: "산사태", dataSource: "landSlideWarningApi (산사태 예보)", mapLayer: "시군구별 산사태 주의보/경보", apiStatus: "점검중", visibleYn: "N", updatedAt: "2024-03-16" },
  { id: 6, category: "태풍", dataSource: "kmaWarningApi (특보코드)", mapLayer: "태풍 진로 예상도 / 강풍 반경", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-15" },
  { id: 7, category: "산불", dataSource: "forestFireWarningApi (산불위험)", mapLayer: "시도별 산불 위험 지수", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-14" },
  { id: 8, category: "한파", dataSource: "weatherWarningApi (기상특보)", mapLayer: "한파 주의보/경보 현황", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-13" },
  { id: 9, category: "지진", dataSource: "safetyApi (지진 옥외대피소)", mapLayer: "전북 지역별 지진 대피 장소", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-12" },
  { id: 10, category: "호우·홍수", dataSource: "weatherWarningApi (기상특보)", mapLayer: "호우 주의보/경보 발령 구역", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-11" },
  { id: 11, category: "태풍", dataSource: "messageApi (재난문자)", mapLayer: "태풍 관련 긴급 재난문자 이력", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-10" },
  { id: 12, category: "산사태", dataSource: "landSlideWarningApi (예보발령)", mapLayer: "산사태 취약지역 관리 정보", apiStatus: "정상", visibleYn: "N", updatedAt: "2024-03-09" },
  { id: 13, category: "산불", dataSource: "forestFireWarningApi (위험예보)", mapLayer: "실시간 산불 감시 카메라(CCTV)", apiStatus: "점검중", visibleYn: "N", updatedAt: "2024-03-08" },
  { id: 14, category: "한파", dataSource: "kmaWarningApi (한파특보)", mapLayer: "지역별 최저기온 분포도", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-07" },
  { id: 15, category: "지진", dataSource: "earthquakeLevelApi (진도정보)", mapLayer: "지진 피해 예상 반경", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-06" },
  { id: 16, category: "호우·홍수", dataSource: "sluiceApi (댐수문)", mapLayer: "댐 수문 개방 상태 레이어", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-05" },
  { id: 17, category: "태풍", dataSource: "kmaWarningApi (특보코드)", mapLayer: "해안 폭풍해일 위험 구역", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-04" },
  { id: 18, category: "산사태", dataSource: "landSlideWarningApi (산사태예보)", mapLayer: "산사태 위험지구 대피 경로", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-03" },
  { id: 19, category: "산불", dataSource: "forestFireWarningApi (산불예보)", mapLayer: "최근 산불 발생지 이력", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-02" },
  { id: 20, category: "한파", dataSource: "weatherWarningApi (기상특보)", mapLayer: "한파 쉼터 운영 현황", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-03-01" },
  { id: 21, category: "지진", dataSource: "kmaApi (지진정보)", mapLayer: "진도별 가속도 계측 정보", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-28" },
  { id: 22, category: "호우·홍수", dataSource: "floodTraceApi (침수흔적)", mapLayer: "상습 침수 도로/저지대 레이어", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-27" },
  { id: 23, category: "태풍", dataSource: "messageApi (재난문자)", mapLayer: "항만 선박 대피 현황", apiStatus: "점검중", visibleYn: "N", updatedAt: "2024-02-26" },
  { id: 24, category: "산사태", dataSource: "landSlideWarningApi (산사태예보)", mapLayer: "산림청 지정 위험 등급도", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-25" },
  { id: 25, category: "산불", dataSource: "forestFireWarningApi (위험지수)", mapLayer: "풍향/풍속 시각화 데이터", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-24" },
  { id: 26, category: "한파", dataSource: "kmaWarningApi (특보코드)", mapLayer: "상수도 동파 위험 지수", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-23" },
  { id: 27, category: "지진", dataSource: "safetyApi (행안부 지진정보)", mapLayer: "내진 설계 건물 정보", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-22" },
  { id: 28, category: "호우·홍수", dataSource: "sluiceApi (수문관리)", mapLayer: "주요 하천 수위 관측소", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-21" },
  { id: 29, category: "태풍", dataSource: "kmaWarningApi (기상청)", mapLayer: "태풍 상륙 예상 시각 정보", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-20" },
  { id: 30, category: "한파", dataSource: "weatherWarningApi (특보)", mapLayer: "대설/한파 복합 재난 구역", apiStatus: "정상", visibleYn: "Y", updatedAt: "2024-02-19" },
];