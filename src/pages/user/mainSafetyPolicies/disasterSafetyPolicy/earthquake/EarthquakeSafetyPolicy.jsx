// src/pages/user/mainSafetyPolicies/disasterSafetyPolicy/earthquake/EarthquakeSafetyPolicy.jsx
import React from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate copy';
import { earthquakeSafetyPolicyData } from './data';

const EarthquakeSafetyPolicy = () => {
  const { meta, contents } = earthquakeSafetyPolicyData;

  return (
    <GuidePageTemplate
      title={meta.title}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={meta.breadcrumbs}
      tabs={meta.tabs}
    >
      {(activeTab) => {
        const currentContent = contents[activeTab];
        if (!currentContent) return null;

        // [Tab 0] 현황 탭
        if (activeTab === 0) {
          return (
            <article className="flex flex-col gap-10">
              {/* 서브 타이틀 */}
              <h3 className="text-title-l text-secondary-50 font-bold border-l-4 border-secondary-50 pl-3">
                □ {currentContent.subTitle}
              </h3>

              {/* 용어 설명 박스 */}
              <div className="w-full bg-white border border-graygray-30 p-6 md:p-8 flex flex-col justify-center gap-3 shadow-sm rounded-lg">
                {currentContent.definitions.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-body-m">
                    <span className={`font-bold shrink-0 ${item.colorClass}`}>
                      - {item.label} :
                    </span>
                    <span className="text-graygray-70 font-medium">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* 그래프 이미지 영역 */}
              <div className="flex flex-col items-center gap-4 mt-4 w-full">
                <div className="w-full max-w-[800px] bg-white rounded-lg overflow-hidden border border-graygray-10 p-4">
                  <img 
                    src={currentContent.chartImage.src} 
                    alt={currentContent.chartImage.alt}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      // 이미지 로드 실패 시 Fallback UI
                      e.target.style.display='none';
                      e.target.nextSibling.style.display='flex';
                    }}
                  />
                  {/* Fallback Box */}
                  <div className="hidden w-full h-[300px] bg-graygray-5 items-center justify-center text-graygray-40 flex-col gap-2 rounded-lg">
                    <span className="font-bold">그래프 이미지 준비중</span>
                    <span className="text-detail-m text-graygray-50">data.js의 chartImage 경로를 확인하세요.</span>
                  </div>
                </div>
                <p className="text-body-m font-bold text-graygray-90 mt-2">
                  {currentContent.chartImage.caption}
                </p>
              </div>
            </article>
          );
        }

        // [Tab 1] 주요정책 탭 (완성된 코드)
        if (activeTab === 1) {
          return (
            <article className="flex flex-col gap-8">
              {/* 섹션 헤더 */}
              <div className="flex flex-col gap-2">
                <h3 className="text-title-xl text-graygray-90 font-bold">
                  {currentContent.subTitle}
                </h3>
                <p className="text-body-m text-graygray-50">
                  시민의 안전을 최우선으로 하는 지진 방재 종합 대책입니다.
                </p>
              </div>
              
              {/* 정책 카드 그리드 (2열) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentContent.policies.map((policy) => (
                  <div 
                    key={policy.id} 
                    className="flex flex-col gap-4 bg-white border border-graygray-20 rounded-xl p-6 hover:border-secondary-50 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* 카테고리 뱃지 */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-secondary-5 text-secondary-50 text-detail-m font-bold rounded-full">
                        {policy.category}
                      </span>
                    </div>

                    {/* 제목 & 내용 */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-title-m font-bold text-graygray-90 group-hover:text-secondary-50 transition-colors">
                        {policy.title}
                      </h4>
                      <p className="text-body-m text-graygray-70 leading-relaxed min-h-[3rem]">
                        {policy.description}
                      </p>
                    </div>

                    {/* 하단 태그 (점선 위) */}
                    <div className="mt-auto pt-4 border-t border-dashed border-graygray-20 flex gap-2 flex-wrap">
                      {policy.tags.map((tag, idx) => (
                        <span key={idx} className="text-detail-m text-graygray-50 bg-graygray-5 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        }
      }}
    </GuidePageTemplate>
  );
};

export default EarthquakeSafetyPolicy;