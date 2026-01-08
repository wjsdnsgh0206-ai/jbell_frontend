// src/pages/user/mainSafetyPolicies/citizenSafetyInsurance/CitizenSafetyMasterPlan.jsx

import React from 'react';
import GuidePageTemplate from '@/components/shared/GuidePageTemplate';
import { ShieldCheck, CheckCircle2, Phone, FileText, ArrowRight, ArrowDown } from 'lucide-react'; 
import { citizenSafetyInsuranceData } from './data';

const CitizenSafetyInsurance = () => {
  const { meta, contents } = citizenSafetyInsuranceData;

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

        // [Tab 0] 제도 안내 및 보장 내용
        if (activeTab === 0) {
          return (
            <article className="flex flex-col gap-10">
              {/* 1. 상단 인트로 박스 */}
              <div className="bg-secondary-5 border border-secondary-50/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-white rounded-full shadow-sm shrink-0">
                  <ShieldCheck className="w-10 h-10 text-secondary-50" />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-title-l text-secondary-50 font-bold">
                    {currentContent.subTitle}
                  </h3>
                  <p className="text-body-m text-graygray-70">
                    {currentContent.description}
                  </p>
                  <div className="flex flex-col gap-1 mt-2">
                    {currentContent.highlights.map((text, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-detail-m text-graygray-90 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-secondary-50" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 보장 항목 그리드 */}
              <div className="flex flex-col gap-6">
                <h3 className="text-heading-m text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  주요 보장 항목 및 한도
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentContent.coverageItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-graygray-20 rounded-xl p-6 hover:shadow-md hover:border-secondary-50 transition-all duration-300 flex flex-col gap-3 group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 bg-graygray-5 text-graygray-50 text-detail-m rounded font-bold group-hover:bg-secondary-5 group-hover:text-secondary-50 transition-colors">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-title-m font-bold text-graygray-90">
                        {item.title}
                      </h4>
                      <p className="text-title-xl font-bold text-secondary-50">
                        {item.amount}
                      </p>
                      <p className="text-detail-m text-graygray-50 border-t border-dashed border-graygray-20 pt-3 mt-auto">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-detail-m text-graygray-50 text-right">
                  ※ 세부 보장 금액은 사고 유형 및 피해 정도에 따라 상이할 수 있습니다.
                </p>
              </div>
            </article>
          );
        }

        // [Tab 1] 청구 절차
        if (activeTab === 1) {
          return (
            <article className="flex flex-col gap-10">
               {/* 1. 절차 흐름도 */}
               <section className="flex flex-col gap-6">
                <h3 className="text-heading-m text-graygray-90 border-l-4 border-secondary-50 pl-3">
                  {currentContent.subTitle}
                </h3>
                
                {/* 반응형 스텝 UI (모바일: 세로, PC: 가로) */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-graygray-5 p-6 rounded-2xl">
                  {currentContent.steps.map((step, index) => (
                    <React.Fragment key={step.step}>
                      {/* 스텝 카드 */}
                      <div className="flex-1 w-full bg-white border border-graygray-20 rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                        <span className="w-8 h-8 rounded-full bg-secondary-50 text-white font-bold flex items-center justify-center mb-4">
                          {step.step}
                        </span>
                        <h4 className="text-title-m font-bold text-graygray-90 mb-2">
                          {step.title}
                        </h4>
                        <p className="text-detail-m text-graygray-70 break-keep">
                          {step.desc}
                        </p>
                      </div>
                      
                      {/* 화살표 아이콘 (마지막 요소 제외) */}
                      {index < currentContent.steps.length - 1 && (
                        <div className="text-graygray-30">
                          <ArrowRight className="hidden md:block w-8 h-8" />
                          <ArrowDown className="block md:hidden w-8 h-8" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
               </section>

               <div className="flex flex-col lg:flex-row gap-8">
                 {/* 2. 제출 서류 */}
                 <section className="flex-1 flex flex-col gap-4">
                    <h4 className="text-title-m font-bold text-graygray-90 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-secondary-50" />
                      필수 제출 서류
                    </h4>
                    <ul className="bg-white border border-graygray-20 rounded-xl p-6 flex flex-col gap-3">
                      {currentContent.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-body-m text-graygray-70">
                          <CheckCircle2 className="w-5 h-5 text-graygray-30 shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                 </section>

                 {/* 3. 접수처 */}
                 <section className="flex-1 flex flex-col gap-4">
                    <h4 className="text-title-m font-bold text-graygray-90 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-secondary-50" />
                      접수 및 문의처
                    </h4>
                    <div className="bg-secondary-5 border border-secondary-50/30 rounded-xl p-6 flex flex-col justify-center h-full gap-4">
                      <div className="text-center">
                        <p className="text-body-m text-graygray-70 mb-1">통합 콜센터</p>
                        <p className="text-heading-xl font-bold text-secondary-50">
                          {currentContent.contact.phone}
                        </p>
                      </div>
                      <div className="border-t border-graygray-20 pt-4 flex flex-col gap-2 text-center text-body-m">
                         <p><strong>담당:</strong> {currentContent.contact.name}</p>
                         <p><strong>FAX:</strong> {currentContent.contact.fax}</p>
                      </div>
                    </div>
                 </section>
               </div>
            </article>
          );
        }
      }}
    </GuidePageTemplate>
  );
};

export default CitizenSafetyInsurance;