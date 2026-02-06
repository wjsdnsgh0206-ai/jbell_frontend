// src/utils/behaviorTransform.js

// [중요] 탭 구분을 위한 코드 매핑 (공공데이터 포털 ordering 규칙 참고)
// 백엔드 DB의 ordering 값을 확인하여 이 맵을 채워주면 가장 정확합니다.
const TAB_LABEL_MAP = {

  // 태풍(1001) 관련 코드 매핑
  "1001000": "태풍",
  "1001001": "태풍 예보시",
  "1001002": "태풍 특보 중",

  // 홍수(1002) 관련 코드 매핑
  "1002001": "홍수 예·경보시",
  "1002002": "홍수 우려 때는",
  "1002003": "물이 밀려들 때는",
  "1002004": "물이 빠진 후에는",
  
  // 호우(1006) 관련 코드 매핑
  "1003000": "행동요령 영상",
  "1003001": "사전 준비",
  "1003002": "호우 예보 시",
  "1003003": "호우특보 중",
  "1003004": "호우가 지나간 후",

  // 한파(1006) 관련 코드 매핑
  "1006001": "한파 사전준비",
  "1006002": "한파 발생 시",
  
  // 지진(1011) 관련 코드 매핑
  "1011007": "상황별 행동요령(이미지 설명)",
  "1011008": "장소별 행동요령(이미지 설명)",
  "1011009": "평상시 대비",
  "1011010": "지진 발생 시",
  "1011011": "장소별 대처",
  "1011012": "대피 후 조치",
  
  // 산사태(1014) 관련 코드 매핑
  "1014001": "취약지역(주의보)",
  "1014002": "취약지역(경보/대피)",
  "1014003": "일반지역(주의보)",
  "1014004": "일반지역(경보/신고)",

  // 사회재난 - 화재 (2011)
  "2011001": "화재 발생 시",
  "2011002": "화재 예방",
  "2011003": "대피 후 행동",
  "2011004": "신고/진화",
  "2011005": "대피 유도",
  "2011006": "피해 복구 지원", // 개발 참고사항: 복구 지원 탭 분리
  "2011007": "가정 안전",
  "2011008": "연기 대처",
  "2011009": "아파트 화재",
  "2011010": "아파트 예방",
  "2011011": "터널 화재",
  "2011012": "대형 화재",
  "2011013": "고층빌딩 화재",
  "2011014": "지하상가 화재",
  "2011015": "지하철 화재(상세)",

  // 산불(2012) 관련 코드 매핑
  "2012001": "주택가 확산 시",
  "2012002": "산불방지 수칙",
  "2012003": "산불 예방/과태료",
  "2012004": "산행 시 주의사항",
  "2012005": "산불 발생 후",
  "2012006": "산불 대피 요령",
  "2012007": "가축 관리 요령", // 농가 지역 특화 정보

  // 붕괴 사고(2013) 관련 코드 매핑
  "2013001": "붕괴 사고 요약",
  "2013002": "붕괴 징후 포착",
  "2013003": "건물 내부 대처",
  "2013004": "건물 외부 대처",
  "2013005": "매몰 시 행동요령",
  "2013007": "도로 공사장 붕괴",
  "2013008": "상수도 공사장 붕괴",
  "2013009": "아파트 공사장 붕괴",
  "2013010": "지하철 공사장 붕괴",

  // 가스 및 전기 사고(2019) 관련 코드 매핑
  "2019001": "일반 전기 예방",
  "2019002": "침수 시 감전 예방",
  "2019003": "대피 시 전기 조치",
  "2019004": "정전 시 조치사항",
  "2019005": "야외 전기 안전",
  "2019006": "가스사고 예방",
  "2019007": "가스 누출 시 행동",
  "2019008": "LPG 응급조치",
  "2019009": "도시가스 응급조치",
  "2019010": "부탄가스 안전점검",
  "2019011": "가스 평소 점검법",
  "2019012": "대량 누출 시 대피",
  "2019013": "특수 가스 대처",
  "2019015": "암모니아 응급조치",
  "2019016": "염소가스 응급조치",

  // 응급처치(3002) 관련 코드 매핑
  "3002000": "재난별 응급처치(요약)",
  "3002002": "화상 처치법",
  "3002003": "온열질환(일사/열사병)",
  "3002004": "뱀에 물렸을 때",
  "3002005": "벌에 쏘였을 때",
  "3002006": "과호흡 응급처치",
  "3002007": "구급 약품 관리",

  // 심폐소생술 및 AED(3003) 관련 코드 매핑
  "3003000": "응급구조 요약",
  "3003003": "자동심장충격기(AED)",

  // 식중독(3005) 관련 코드 매핑
  "3005001": "식중독 발생 시 대처",
  "3005002": "운영자 준수사항",

  // 위급 상황 대처(3006) 관련 코드 매핑
  "3006001": "위급상황 3단계(3C)",
  "3006002": "구조 요청 가이드",
  "3006003": "질환별 응급조치",

  // 교통 안전 및 사고 대응(3013) 관련 코드 매핑
  "3013000": "교통안전 가이드",
  "3013002": "사고 발생 시 행동",

  // 승강기 안전(3014) 관련 코드 매핑
  "3014000": "승강기 사고 대처",
  "3014001": "승강기 안전 이용",
  "3014002": "승강기 이용 에티켓",
  "3014003": "고장 시 구조 요청",
  "3014004": "에스컬레이터 수칙",
  "3014006": "에스컬레이터 사고 예방",




  
  
  // fallback

  "DEFAULT": "상세 행동요령"
};

/**
 * 탭 라벨 결정 함수
 */
const getTabLabel = (item, tabKey) => {
  if (TAB_LABEL_MAP[tabKey]) return TAB_LABEL_MAP[tabKey];
  return TAB_LABEL_MAP["DEFAULT"];
};

const getItemType = (item) => {
  const link = item.contentLink || "";
  const isVideo = link.includes('safetv') || link.includes('mp4') || link.includes('youtube') || link.includes('youtu.be');
  const isImage = link.match(/\.(jpg|png|gif|jpeg|webp)$/i) !== null;
  if (isVideo) return 'VIDEO';
  if (isImage) return 'IMAGE';
  return 'TEXT';
};

/**
 * 텍스트 파싱 로직 (Q&A 및 단계별 번호 강조)
 */
const parseBodyText = (text) => {
  if (!text) return { content: "", isQA: false, isStep: false };
  
  const isQA = text.startsWith('Q :') || text.includes('A :');
  const isStep = /^[0-9①-⑩]\.?/.test(text); // 숫자나 원문자로 시작하는 경우

  return {
    content: text.replace(/Q :|A :/g, '').trim(),
    isQA,
    isStep
  };
};

export const transformData = (dbList) => {
  if (!dbList || dbList.length === 0) return null;

  const pageTitle = dbList[0].contentTypeName || "행동요령";
  const lastUpdated = dbList[0].created_at || new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  const groupedByTab = dbList.reduce((acc, item) => {
    const fullOrder = String(item.ordering || "0000000000").replace(/,/g, '');
    const tabKey = fullOrder.substring(0, 7); 
    
    if (!acc[tabKey]) {
      acc[tabKey] = {
        key: tabKey,
        label: getTabLabel(item, tabKey),
        items: []
      };
    }
    acc[tabKey].items.push({ ...item, fullOrder });
    return acc;
  }, {});

  const contents = Object.values(groupedByTab).map(tab => {
    const sectionsMap = tab.items.reduce((secAcc, item) => {
      let sectionTitle = item.title;
      if (sectionTitle === tab.label) sectionTitle = ""; 

      if (!secAcc[sectionTitle]) {
        secAcc[sectionTitle] = { title: sectionTitle, rawItems: [] };
      }
      secAcc[sectionTitle].rawItems.push(item);
      return secAcc;
    }, {});

    const sections = Object.values(sectionsMap).map(section => {
      section.rawItems.sort((a, b) => 
        (Number(a.fullOrder) - Number(b.fullOrder)) || (Number(a.contentId) - Number(b.contentId))
      );

      const steps = [];
      let currentGroupCard = null;

      section.rawItems.forEach(item => {
        const type = getItemType(item);
        const { content, isQA, isStep } = parseBodyText(item.body);

        if (type === 'VIDEO' || type === 'IMAGE') {
            currentGroupCard = null; 
            steps.push({
                id: item.contentId,
                type: 'MEDIA',
                videoLink: type === 'VIDEO' ? item.contentLink : null,
                images: type === 'IMAGE' ? [item.contentLink] : [],
                mediaTitle: content
            });
        } else if (content) {
            // Q&A이거나 새로운 단계가 시작되면 카드를 분리하거나 그룹화 전략 결정
            // 여기서는 QA는 단독 카드로, 일반 가이드는 그룹으로 묶음
            if (isQA) {
              steps.push({
                id: item.contentId,
                type: 'QA',
                content: content
              });
              currentGroupCard = null;
            } else {
              if (!currentGroupCard) {
                  currentGroupCard = {
                      id: item.contentId,
                      type: 'GUIDELINE',
                      guidelines: []
                  };
                  steps.push(currentGroupCard);
              }
              currentGroupCard.guidelines.push(content);
            }
        }
      });

      return { title: section.title, steps };
    });

    return { tabLabel: tab.label, sections, key: tab.key };
  });

  contents.sort((a, b) => Number(a.key) - Number(b.key));
  const tabs = contents.map(c => ({ label: c.tabLabel }));

  return {
    meta: { pageTitle, lastUpdated, tabs },
    contents: contents,
  };
};