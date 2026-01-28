// src/pages/user/mainSafetyPolicies/citizenSafetyInsurance/CitySafetyMasterPlan.jsx
import GuidePageTemplate from '@/components/shared/GuidePageTemplate copy';
import { citySafetyMasterPlanData } from './data';

const CitySafetyMasterPlan = () => {
  const { meta, contents } = citySafetyMasterPlanData;

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

        // [Tab 0] 개요 탭일 때의 렌더링
        if (activeTab === 0) {
          return (
            <div className="flex flex-col gap-16">
              
              {/* 섹션 1: 계획의 정의 */}
              <article className="flex flex-col gap-6">
                <SectionHeader title={currentContent.sections[0].title} />
                <p className="text-title-m text-secondary-50 font-bold">
                  ○ {currentContent.sections[0].description}
                </p>

                {/* 회색 박스 */}
                <div className="bg-graygray-5 border border-graygray-20 rounded-xl p-6 md:p-8 flex flex-col gap-4">
                  <h4 className="text-body-m font-bold text-graygray-90">
                    {currentContent.sections[0].boxContent.title}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {currentContent.sections[0].boxContent.items.map((item, idx) => (
                      <p key={idx} className="text-body-m text-graygray-70 leading-relaxed pl-2">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                
                <p className="text-body-m text-graygray-90 leading-relaxed">
                  ○ {currentContent.sections[0].summary}
                </p>
              </article>

              {/* 섹션 2: 계획의 위상 및 역할 (다이어그램) */}
              <article className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <SectionHeader title={currentContent.sections[1].title} />
                  <p className="text-title-m text-secondary-50 font-bold">
                    ○ {currentContent.sections[1].description}
                  </p>
                </div>

                {/* 다이어그램 시각화 */}
                <div className="w-full flex flex-col items-center">
                  {/* 상단 메인 박스 */}
                  <div className="bg-[#46B6B6] text-white px-12 py-3 rounded-lg text-title-m font-bold shadow-md mb-8 relative">
                    도시안전기본계획
                    {/* 연결선 (장식) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-8 bg-graygray-30"></div>
                  </div>

                  {/* 하단 4개 카드 그리드 */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                    {/* 상단 연결 가로선 (PC에서만 보임) */}
                    <div className="hidden lg:block absolute -top-8 left-[12.5%] right-[12.5%] h-[2px] bg-graygray-30 border-t border-graygray-30"></div>
                    
                    {currentContent.sections[1].diagram.map((item, idx) => (
                      <div key={idx} className="relative flex flex-col items-center">
                        {/* 연결 세로선 */}
                        <div className="hidden lg:block absolute -top-8 w-[2px] h-8 bg-graygray-30"></div>
                        
                        <div className="flex flex-col w-full h-full bg-white border border-graygray-20 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="bg-graygray-5 py-3 text-center border-b border-graygray-10">
                            <span className="text-title-m text-[#D32F2F] font-bold">{item.title}</span>
                          </div>
                          <div className="p-5 flex items-center justify-center h-full bg-graygray-0">
                            <p className="text-body-s text-graygray-70 text-center leading-relaxed break-keep">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 섹션 3: 계획의 범위 */}
              <article className="flex flex-col gap-6">
                <SectionHeader title={currentContent.sections[2].title} />
                <div className="flex flex-col gap-3 pl-2">
                  {currentContent.sections[2].list.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-body-m">
                      <span className="font-bold text-graygray-90 shrink-0">○ {item.label} :</span>
                      <span className="text-graygray-70">{item.text}</span>
                    </div>
                  ))}
                </div>
              </article>

            </div>
          );
        }

        // [Tab 1, 2] 기타 탭 (준비중)
        return (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
             <h3 className="text-title-l text-graygray-90">{currentContent.subTitle}</h3>
             <p className="text-body-m text-graygray-50">{currentContent.content}</p>
          </div>
        );
      }}
    </GuidePageTemplate>
  );
};

// [내부 컴포넌트] 섹션 헤더 (파란색 네모 아이콘 + 제목)
const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 bg-secondary-50" /> {/* 파란색 네모 */}
    <h3 className="text-heading-m text-secondary-50 font-bold">
      {title}
    </h3>
  </div>
);

export default CitySafetyMasterPlan;