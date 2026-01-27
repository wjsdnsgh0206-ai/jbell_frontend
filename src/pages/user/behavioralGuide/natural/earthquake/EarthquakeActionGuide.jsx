// src/pages/user/behavioralGuide/natural/earthquake/EarthquakeActionGuide.jsx
import { useEffect, useState } from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate';
// VideoCardList는 이제 사용하지 않거나, 다른 용도로만 씁니다.
import { behaviorMethodService } from '@/services/api';

const EarthquakeActionGuide = () => {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbData = await behaviorMethodService.getBehaviorMethodList("NATURAL_EARTHQUAKE");
        const formattedData = transformData(dbData);
        setGuideData(formattedData);
      } catch (error) {
        console.error("행동요령 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-10">로딩중...</div>;
  if (!guideData) return <div className="flex justify-center p-10">데이터 없음</div>;

  const { meta, contents } = guideData;

  return (
    <GuidePageTemplate 
      title={meta.title}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={meta.breadcrumbs}
      tabs={meta.tabs}
    >
      {(activeTab) => {
        const currentTabContent = contents[activeTab];
        if (!currentTabContent) return null;

        return (
          <div className="flex flex-col gap-16 animate-fade-in-up">
            {currentTabContent.sections.map((section, secIdx) => (
              <article key={`sec-${secIdx}`} className="flex flex-col gap-8">
                
                {/* 섹션 타이틀 */}
                <div className="flex items-center gap-3 pb-2 border-b-2 border-graygray-20">
                  <span className="w-1.5 h-6 bg-secondary-50 rounded-sm"></span>
                  <h3 className="text-title-xl text-graygray-90">
                    {section.title}
                  </h3>
                </div>

                {/* 카드 리스트 */}
                <div className="flex flex-col gap-6">
                  {section.steps.map((step, stepIdx) => {
                    // 텍스트가 있는지 확인
                    const hasText = step.guidelines && step.guidelines.length > 0;
                    // 이미지가 있는지 확인
                    const hasImage = step.images && step.images.length > 0;

                    return (
                      <div 
                        key={`step-${stepIdx}`} 
                        className="bg-white border border-graygray-20 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row"
                      >
                        {/* (A) 이미지 영역 */}
                        {hasImage && (
                          <div className={`
                            bg-graygray-5 border-b md:border-b-0 md:border-r border-graygray-20
                            ${hasText ? "md:w-1/3 min-w-[320px]" : "w-full"} 
                          `}>
                            {/* 텍스트가 없으면 이미지를 Grid로 크게 보여주고, 있으면 세로로 쌓음 */}
                            <div className={`p-6 grid gap-4 ${!hasText && step.images.length > 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                              {step.images.map((imgUrl, i) => (
                                <div key={i} className="flex items-center justify-center bg-white rounded-lg border border-graygray-10 overflow-hidden">
                                  <img 
                                    src={imgUrl} 
                                    alt="행동요령 이미지" 
                                    className="w-full h-auto object-contain max-h-[400px]"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* (B) 텍스트 영역 (텍스트가 있을 때만 렌더링) */}
                        {hasText && (
                          <div className="flex-1 p-6 lg:p-8 flex items-center bg-white">
                            <ul className="flex flex-col gap-4 w-full">
                              {step.guidelines.map((text, txtIdx) => (
                                <li key={txtIdx} className="flex gap-4 text-body-m text-graygray-80 leading-relaxed">
                                  <span className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-secondary-10 text-secondary-60 font-bold text-xs mt-0.5">
                                    {txtIdx + 1}
                                  </span>
                                  <span className="whitespace-pre-line">{text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        );
      }}
    </GuidePageTemplate>
  );
};

export default EarthquakeActionGuide;
/**
 * [Helper] 데이터 변환 함수 (이미지 기준 병합 로직 추가)
 */
function transformData(dbList) {
  if (!dbList || dbList.length === 0) return null;

  // [Step 1] 탭 > 섹션 > 오더링(Step) 별로 데이터 모으기
  const tabMap = new Map();

  dbList.forEach((item) => {
    const fullOrder = String(item.ordering).replace(/,/g, '');
    const tabKey = fullOrder.substring(0, 7);
    
    // 1-1. 탭 생성
    if (!tabMap.has(tabKey)) {
      let shortLabel = item.title;
      // if (shortLabel.includes("상황별 행동요령")) shortLabel = "상황별 요령";
      // else if (shortLabel.includes("장소별 행동요령")) shortLabel = "장소별 요령";
      // else if (shortLabel.includes("이렇게 대비합니다")) shortLabel = "평상시 대비";
      // else if (shortLabel.includes("이렇게 행동합니다")) shortLabel = "지진 발생 시";
      // else if (shortLabel.includes("대피 후에는")) shortLabel = "대피 후 조치";

      tabMap.set(tabKey, {
        tabLabel: shortLabel, 
        sectionMap: new Map()
      });
    }

    const currentTab = tabMap.get(tabKey);
    const sectionTitle = item.title;

    // 1-2. 섹션(제목) 생성
    if (!currentTab.sectionMap.has(sectionTitle)) {
      currentTab.sectionMap.set(sectionTitle, {
        title: sectionTitle,
        stepMap: new Map() // ordering을 Key로 하는 Map
      });
    }

    const currentSection = currentTab.sectionMap.get(sectionTitle);

    // 1-3. 오더링(Step)별 데이터 수집
    if (!currentSection.stepMap.has(fullOrder)) {
      currentSection.stepMap.set(fullOrder, {
        id: fullOrder,
        images: [],
        guidelines: []
      });
    }

    const stepObj = currentSection.stepMap.get(fullOrder);
    
    // 이미지/텍스트 판별
    let link = item.contentLink;
    if (link && !link.includes('safekorea.go.kr') && link.startsWith('http://')) {
       link = link.replace('http://', 'https://');
    }
    const isImage = link && (link.includes('.jpg') || link.includes('.png') || link.includes('.gif'));

    if (isImage) {
      stepObj.images.push(link);
    } else if (item.body && item.body.trim() !== "") {
      stepObj.guidelines.push(item.body);
    }
  });

  // [Step 2] 수집된 Step들을 순회하며 "이미지 없는 Step"을 "이전 Step"에 병합
  const contents = Array.from(tabMap.values()).map(tab => ({
    tabLabel: tab.tabLabel,
    sections: Array.from(tab.sectionMap.values()).map(sec => {
      // ordering 순서대로 정렬 (매우 중요)
      const sortedSteps = Array.from(sec.stepMap.values())
        .sort((a, b) => Number(a.id) - Number(b.id));

      const mergedCards = [];
      let lastCard = null;

      sortedSteps.forEach((step) => {
        // Case A: 이미지가 있는 경우 -> 무조건 새 카드 생성
        if (step.images.length > 0) {
          lastCard = { ...step }; // 복사해서 사용
          mergedCards.push(lastCard);
        } 
        // Case B: 이미지가 없는 경우 (텍스트만 있음)
        else {
          if (lastCard) {
            // 이전 카드가 있으면 거기에 텍스트 병합 (1011010003 -> 1011010002)
            lastCard.guidelines = [...lastCard.guidelines, ...step.guidelines];
          } else {
            // 이전 카드가 없으면(섹션 시작이 텍스트) 어쩔 수 없이 텍스트 카드 생성
            lastCard = { ...step };
            mergedCards.push(lastCard);
          }
        }
      });

      return {
        title: sec.title,
        steps: mergedCards
      };
    })
  }));

  const finalContents = contents.slice(0, 6); 
  const tabs = finalContents.map(c => ({ label: c.tabLabel }));

  return {
    meta: {
      title: "지진 행동요령", 
      lastUpdated: "2026.01.27",
      breadcrumbs: ["홈", "재난 행동요령", "자연재난", "지진"],
      tabs: tabs, 
    },
    contents: finalContents,
  };
}