// src/pages/user/mainSafetyPolicies/disasterSafetyPolicy/stormAndFlood/StormAndFloodSafetyPolicy.jsx

import React from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate copy';
import { CloudRain, Wind } from 'lucide-react'; // 날씨 관련 아이콘 추가
import { stormAndFloodData } from './data';

const StormAndFloodSafetyPolicy = () => {
  const { meta, contents } = stormAndFloodData;

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

              {/* 기상특보 기준 설명 박스 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentContent.definitions.map((def, idx) => (
                  <div key={idx} className="bg-white border border-graygray-20 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-graygray-10 pb-3">
                      {/* 아이콘 분기 처리 */}
                      {idx === 0 ? <CloudRain className="w-6 h-6 text-[#0066CC]" /> : <Wind className="w-6 h-6 text-[#E53935]" />}
                      <h4 className={`text-title-m font-bold ${def.colorClass}`}>
                        {def.title}
                      </h4>
                    </div>
                    <div className="flex flex-col gap-3">
                      {def.items.map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-body-m font-bold text-graygray-90">· {item.label}</span>
                          <span className="text-detail-m text-graygray-70 pl-3 leading-relaxed bg-graygray-5 p-2 rounded">
                            {item.desc}
                          </span>
                        </div>
                      ))}
                    </div>
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
                      e.target.style.display='none';
                      e.target.nextSibling.style.display='flex';
                    }}
                  />
                  {/* Fallback Box */}
                  <div className="hidden w-full h-[300px] bg-graygray-5 items-center justify-center text-graygray-40 flex-col gap-2 rounded-lg">
                    <span className="font-bold">통계 그래프 이미지 준비중</span>
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

        // [Tab 1] 주요정책 탭 (지진 페이지와 동일한 카드 그리드 디자인)
        if (activeTab === 1) {
          return (
            <article className="flex flex-col gap-8">
              {/* 섹션 헤더 */}
              <div className="flex flex-col gap-2">
                <h3 className="text-title-xl text-graygray-90 font-bold">
                  {currentContent.subTitle}
                </h3>
                <p className="text-body-m text-graygray-50">
                  집중 호우와 태풍으로부터 시민의 생명을 지키는 안전 대책입니다.
                </p>
              </div>
              
              {/* 정책 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentContent.policies.map((policy) => (
                  <div 
                    key={policy.id} 
                    className="flex flex-col gap-4 bg-white border border-graygray-20 rounded-xl p-6 hover:border-secondary-50 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* 카테고리 뱃지 (파란색 계열 유지) */}
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

                    {/* 하단 태그 */}
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

export default StormAndFloodSafetyPolicy;