import React from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate';
import VideoCardList from '@/components/shared/VideoCardList';
import { firstAidData } from './firstAid/data';

const FirstAidBehaviorMethod = () => {
  // 데이터 구조 분해 할당
  const { meta, contents } = firstAidData;

  return (
    <GuidePageTemplate 
      title={meta.title}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={meta.breadcrumbs}
      tabs={meta.tabs}
    >
      {/* 템플릿에서 activeTab(현재 선택된 탭 인덱스)을 render prop으로 받아옴 */}
      {(activeTab) => {
        const currentContent = contents[activeTab];
        
        // 데이터 방어 로직
        if (!currentContent) return null;

        return (
          <>
            {/* 1. 텍스트 가이드라인 영역 */}
            <article className="flex flex-col gap-8">
              <h2 className="text-title-xl text-graygray-90">
                {currentContent.subTitle}
              </h2>

              <div className="flex flex-col gap-6">
                <h3 className="text-title-m text-graygray-90">
                  - 국민행동요령 상세
                </h3>

                <ol className="flex flex-col gap-4 pl-2">
                  {currentContent.guidelines.map((text, idx) => (
                    <li key={idx} className="flex gap-2 text-body-m text-graygray-70 leading-relaxed">
                      <span className="shrink-0">{idx + 1}.</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            {/* 2. 관련 영상 카드 리스트 */}
            <VideoCardList videos={currentContent.videos} />
          </>
        );
      }}
    </GuidePageTemplate>
  );
};

export default FirstAidBehaviorMethod;