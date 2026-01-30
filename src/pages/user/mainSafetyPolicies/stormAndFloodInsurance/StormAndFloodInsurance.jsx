// src/pages/user/mainSafetyPolicies/stormAndFloodInsurance/StormAndFloodInsurance.jsx

import React from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate copy';
import { Umbrella, Home, Sprout, Store, CheckCircle2, PhoneCall, ArrowRight, ArrowDown } from 'lucide-react'; 
import { stormAndFloodInsuranceData } from './data';

const StormAndFloodInsurance = () => {
  const { meta, contents } = stormAndFloodInsuranceData;

  // 아이콘 매핑 헬퍼 함수
  const getIcon = (type) => {
    switch(type) {
      case 'house': return <Home className="w-8 h-8 text-secondary-50" />;
      case 'sprout': return <Sprout className="w-8 h-8 text-secondary-50" />;
      case 'store': return <Store className="w-8 h-8 text-secondary-50" />;
      default: return <CheckCircle2 className="w-8 h-8 text-secondary-50" />;
    }
  };

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

        // [Tab 0] 제도 안내
        if (activeTab === 0) {
          return (
            <article className="flex flex-col gap-12">
              {/* 1. 인트로 (정부지원 강조) */}
              <div className="bg-secondary-5 border border-secondary-50/20 rounded-2xl p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                <div className="p-5 bg-white rounded-full shadow-sm shrink-0">
                  <Umbrella className="w-12 h-12 text-secondary-50" />
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <h3 className="text-title-l text-secondary-50 font-bold">
                    {currentContent.subTitle}
                  </h3>
                  <p className="text-body-m text-graygray-70 leading-relaxed">
                    {currentContent.description}
                  </p>
                  
                  {/* 3가지 특징 카드 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 w-full">
                    {currentContent.features.map((feat, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-secondary-50/10 shadow-sm">
                        <p className="text-body-m font-bold text-graygray-90 mb-1">{feat.title}</p>
                        <p className="text-detail-m text-graygray-50">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 보상하는 재해 (태그 구름) */}
              <div className="flex flex-col gap-4">
                <h4 className="text-title-m font-bold text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  보상하는 자연재해 (9종)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentContent.disasters.map((disaster, idx) => (
                    <span key={idx} className="px-4 py-2 bg-graygray-5 text-graygray-70 text-body-s rounded-full border border-graygray-20">
                      #{disaster}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. 가입 대상 (아이콘 카드) */}
              <div className="flex flex-col gap-6">
                <h4 className="text-title-m font-bold text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  가입 대상 시설물
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentContent.targets.map((target, idx) => (
                    <div key={idx} className="bg-white border border-graygray-20 rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-all">
                      <div className="p-3 bg-graygray-5 rounded-full">
                        {getIcon(target.iconType)}
                      </div>
                      <div>
                        <p className="text-title-m font-bold text-graygray-90 mb-2">{target.category}</p>
                        <p className="text-detail-m text-graygray-70 break-keep">{target.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        }

        // [Tab 1] 가입 방법 및 문의
        if (activeTab === 1) {
          return (
            <article className="flex flex-col gap-12">
              {/* 1. 가입 절차 */}
              <section className="flex flex-col gap-6">
                <h3 className="text-title-l font-bold text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  가입 절차
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-center bg-graygray-5 p-6 rounded-2xl gap-4">
                  {currentContent.steps.map((step, index) => (
                    <React.Fragment key={step.step}>
                      <div className="flex-1 w-full bg-white border border-graygray-20 rounded-xl p-6 flex flex-col items-center text-center shadow-sm h-40 justify-center">
                        <span className="w-7 h-7 rounded-full bg-secondary-50 text-white font-bold flex items-center justify-center mb-3 text-detail-m">
                          {step.step}
                        </span>
                        <p className="text-body-m font-bold text-graygray-90 mb-1">{step.title}</p>
                        <p className="text-detail-m text-graygray-50">{step.desc}</p>
                      </div>
                      
                      {/* 화살표 */}
                      {index < currentContent.steps.length - 1 && (
                        <div className="text-graygray-30">
                          <ArrowRight className="hidden md:block w-6 h-6" />
                          <ArrowDown className="block md:hidden w-6 h-6" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </section>

              {/* 2. 판매 보험사 리스트 */}
              <section className="flex flex-col gap-6">
                <h3 className="text-title-l font-bold text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  제휴 보험사 문의처
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentContent.partners.map((partner, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-graygray-20 rounded-lg hover:border-secondary-50 group transition-colors">
                      <span className="text-body-m font-medium text-graygray-90">
                        {partner.name}
                      </span>
                      <a href={`tel:${partner.phone}`} className="flex items-center gap-1 text-detail-m text-graygray-50 group-hover:text-secondary-50">
                        <PhoneCall className="w-4 h-4" />
                        <span className="hidden sm:inline">문의</span>
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-detail-m text-graygray-50 bg-graygray-5 p-4 rounded-lg">
                  ※ 보험사별 상품 내용이 상이할 수 있으니, 자세한 사항은 각 보험사 콜센터로 문의하시기 바랍니다.
                </p>
              </section>
            </article>
          );
        }
      }}
    </GuidePageTemplate>
  );
};

export default StormAndFloodInsurance;