// src/utils/behaviorTransform.js

// [중요] 탭 구분을 위한 코드 매핑 (공공데이터 포털 ordering 규칙 참고)
// 백엔드 DB의 ordering 값을 확인하여 이 맵을 채워주면 가장 정확합니다.
const TAB_LABEL_MAP = {
  // 예시: 지진 (Ordering 앞자리에 따라 구분)
  "1001000": "행동요령 영상",
  "1001000": "행동요령",
  "1001001": "평상시 대비",
  "1001002": "지진 발생 시",
  "1001003": "대피 후 행동",
  "1001004": "장소별 행동요령",
  "1001005": "상황별 행동요령",
  
  "1001000": "태풍",
  "1001001": "태풍 예보시",
  "1001002": "태풍 특보 중",
  "1002001": "홍수 예·경보시",
  "1002002": "홍수 우려 때는",
  "1002003": "물이 밀려들 때는",
  "1003000": "홍수",
  "1006000": "한파",
  "1011000": "지진",
  "1014000": "산사태",
  
  // fallback

  "DEFAULT": "상세 행동요령"
};

/**
 * 탭 라벨 결정 함수
 */
const getTabLabel = (item, tabKey) => {
  // 1순위: 매핑된 코드가 있으면 사용
  if (TAB_LABEL_MAP[tabKey]) return TAB_LABEL_MAP[tabKey];

  // 2순위: 제목에서 유추 (예: "지진 발생 시 행동요령" -> "지진 발생 시")
  // 제목이 너무 길면 그대로 쓰기 애매하므로, 매핑이 없을 때만 제한적으로 사용
  if (item.title && item.title.length < 15) {
      return item.title;
  }

  return TAB_LABEL_MAP["DEFAULT"];
};

/**
 * 아이템 타입 판별
 */
const getItemType = (item) => {
  const link = item.contentLink || "";
  const isVideo = link.includes('safetv') || link.includes('mp4') || link.includes('youtube') || link.includes('youtu.be');
  const isImage = link.match(/\.(jpg|png|gif|jpeg|webp)$/i) !== null;

  if (isVideo) return 'VIDEO';
  if (isImage) return 'IMAGE';
  return 'TEXT';
};

export const transformData = (dbList) => {
  if (!dbList || dbList.length === 0) return null;

  // 0. 메타 데이터 추출 (페이지 타이틀용)
  // 리스트의 첫 번째 항목에서 대분류 명칭(예: 지진)을 가져옴
  const pageTitle = dbList[0].contentTypeName || "행동요령";
  const lastUpdated = dbList[0].created_at || new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  // 1. 탭(Tab) 별로 데이터 그룹화
  const groupedByTab = dbList.reduce((acc, item) => {
    // ordering을 문자열로 변환하고 쉼표 제거
    const fullOrder = String(item.ordering || "0000000000").replace(/,/g, '');
    
    // [핵심] 탭 키 생성 전략 
    // 공공데이터 구조상 보통 앞 5~7자리가 탭(상황)을 의미함. 
    // 데이터 분포를 보고 substring 길이를 조절하세요 (여기선 7자리 가정)
    const tabKey = fullOrder.substring(0, 7); 
    
    if (!acc[tabKey]) {
      acc[tabKey] = {
        key: tabKey,
        label: getTabLabel(item, tabKey), // 수정된 라벨링 함수
        items: []
      };
    }
    acc[tabKey].items.push({ ...item, fullOrder });
    return acc;
  }, {});

  // 2. 각 탭 내부 구조화
  const contents = Object.values(groupedByTab).map(tab => {
    // 2-1. 섹션 그룹화 (같은 제목끼리 묶기)
    const sectionsMap = tab.items.reduce((secAcc, item) => {
      // 탭 라벨과 제목이 같다면 섹션 제목 생략(깔끔하게 보이기 위해)
      let sectionTitle = item.title;
      if (sectionTitle === tab.label) sectionTitle = ""; 

      if (!secAcc[sectionTitle]) {
        secAcc[sectionTitle] = { title: sectionTitle, rawItems: [] };
      }
      secAcc[sectionTitle].rawItems.push(item);
      return secAcc;
    }, {});

    // 2-2. 섹션 내부 정렬 및 카드화
    const sections = Object.values(sectionsMap).map(section => {
      // 정렬: ordering -> contentId
      section.rawItems.sort((a, b) => 
        (Number(a.fullOrder) - Number(b.fullOrder)) || (Number(a.contentId) - Number(b.contentId))
      );

      const steps = [];
      let currentTextCard = null;

      section.rawItems.forEach(item => {
        const type = getItemType(item);
        const bodyText = item.body ? item.body.trim() : ""; 

        if (type === 'VIDEO' || type === 'IMAGE') {
            currentTextCard = null; 
            steps.push({
                id: item.contentId,
                type: 'MEDIA',
                videoLink: type === 'VIDEO' ? item.contentLink : null,
                images: type === 'IMAGE' ? [item.contentLink] : [],
                mediaTitle: bodyText
            });
        } else if (bodyText) {
            if (!currentTextCard) {
                currentTextCard = {
                    id: item.contentId,
                    type: 'GUIDELINE',
                    guidelines: []
                };
                steps.push(currentTextCard);
            }
            currentTextCard.guidelines.push(bodyText);
        }
      });

      return { title: section.title, steps };
    });

    return { tabLabel: tab.label, sections, key: tab.key };
  });

  // 3. 탭 정렬 (Key 기준 오름차순)
  contents.sort((a, b) => Number(a.key) - Number(b.key));

  const tabs = contents.map(c => ({ label: c.tabLabel }));

  return {
    meta: { 
        pageTitle, // 추출한 대분류 타이틀 반환
        lastUpdated, 
        tabs 
    },
    contents: contents,
  };
};