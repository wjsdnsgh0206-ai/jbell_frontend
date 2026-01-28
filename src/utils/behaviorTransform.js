// src/utils/behaviorTransform.js

// 탭 순서(ordering)에 따른 라벨 매핑 상수
const TAB_LABEL_MAP = {
  // 태풍
  "1001000": "멀티미디어",
  "1001001": "태풍 예보 시",
  "1001002": "태풍 특보 중",
  "1001003": "태풍 이후",
  // 홍수, 호우 등 다른 재난 코드도 패턴이 발견되면 여기에 추가하거나 정규식으로 처리
  "DEFAULT": "행동요령"
};

/**
 * 탭 라벨 결정 함수
 */
const getTabLabel = (tabKey, originalTitle) => {
  if (TAB_LABEL_MAP[tabKey]) return TAB_LABEL_MAP[tabKey];

  // 키워드 기반 추론 (Fallback)
//   if (!originalTitle) return TAB_LABEL_MAP["DEFAULT"];
//   if (originalTitle.includes("상황별")) return "상황별 요령";
//   if (originalTitle.includes("장소별")) return "장소별 요령";
//   if (originalTitle.includes("대비합니다")) return "평상시 대비";
//   if (originalTitle.includes("행동합니다")) return "지진 발생 시";
//   if (originalTitle.includes("대피 후")) return "대피 후 조치";
  
  return originalTitle;
};

/**
 * 아이템이 미디어(영상/이미지) 타입인지 텍스트인지 판별
 */
const getItemType = (item) => {
  const link = item.contentLink || "";
  const isVideo = link.includes('safetv') || link.includes('mp4') || link.includes('youtube');
  const isImage = link.match(/\.(jpg|png|gif)$/i) !== null;

  if (isVideo) return 'VIDEO';
  if (isImage) return 'IMAGE';
  return 'TEXT';
};

export const transformData = (dbList) => {
  if (!dbList || dbList.length === 0) return null;

  // 1. 탭(Tab) 별로 데이터 그룹화
  const groupedByTab = dbList.reduce((acc, item) => {
    const fullOrder = String(item.ordering).replace(/,/g, '');
    const tabKey = fullOrder.substring(0, 7); // ordering의 앞 7자리가 탭 식별자라고 가정
    
    if (!acc[tabKey]) {
      acc[tabKey] = {
        key: tabKey,
        label: getTabLabel(tabKey, item.title),
        items: []
      };
    }
    acc[tabKey].items.push({ ...item, fullOrder });
    return acc;
  }, {});

  // 2. 각 탭 내부의 섹션 및 스텝 정렬/구조화
  const contents = Object.values(groupedByTab).map(tab => {
    // 2-1. 섹션(Section) 별 그룹화
    const sectionsMap = tab.items.reduce((secAcc, item) => {
      let sectionTitle = item.title;
      // 타이틀이 없는 경우 기본 타이틀 부여
      if (!sectionTitle) {
        sectionTitle = tab.key.startsWith("1001") ? "사전 준비 및 대피 요령" : "행동요령 상세";
      }

      if (!secAcc[sectionTitle]) {
        secAcc[sectionTitle] = { title: sectionTitle, rawItems: [] };
      }
      secAcc[sectionTitle].rawItems.push(item);
      return secAcc;
    }, {});

    // 2-2. 각 섹션 내부 아이템 정렬 및 카드(Card)화
    const sections = Object.values(sectionsMap).map(section => {
      // 정렬: ordering -> contentId
      section.rawItems.sort((a, b) => 
        (Number(a.fullOrder) - Number(b.fullOrder)) || (Number(a.contentId) - Number(b.contentId))
      );

      // 연속된 텍스트는 하나의 카드로 묶고, 미디어는 개별 카드로 분리
      const steps = [];
      let currentTextCard = null;

      section.rawItems.forEach(item => {
        const type = getItemType(item);
        const bodyText = item.body ? item.body.trim() : "";

        if (type === 'VIDEO' || type === 'IMAGE') {
            // 미디어가 나오면 이전 텍스트 카드를 마감하고 미디어 카드 추가
            currentTextCard = null; 
            steps.push({
                id: item.contentId,
                type: 'MEDIA',
                videoLink: type === 'VIDEO' ? item.contentLink : null,
                images: type === 'IMAGE' ? [item.contentLink] : [],
                mediaTitle: bodyText
            });
        } else if (bodyText) {
            // 텍스트인 경우 기존 텍스트 카드에 추가하거나 새로 생성
            if (!currentTextCard) {
                currentTextCard = {
                    id: item.contentId, // 첫 번째 아이템 ID 사용
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

    return { tabLabel: tab.label, sections };
  });

  // 3. 메타 데이터 생성
  // (XML 데이터 특성상 ordering 순서 보장이 안될 수 있으므로 tabKey로 정렬이 필요할 수 있음. 여기선 DB리스트 순서 의존)
  // 필요한 경우 contents.sort(...) 추가
  
  const tabs = contents.slice(0, 6).map(c => ({ label: c.tabLabel }));
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  return {
    meta: { lastUpdated: today, tabs },
    contents: contents.slice(0, 6),
  };
};