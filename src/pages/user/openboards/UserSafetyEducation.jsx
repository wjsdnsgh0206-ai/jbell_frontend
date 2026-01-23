// src/pages/user/openboards/UserSafetyEducation.jsx
import React from 'react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { safetyEduData } from './BoardData';

// 시민안전교육 사용자 페이지 //
const UserSafetyEducation = () => {
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userSafetyEducation" },
    { label: "시민안전교육", path: "/userSafetyEducation" },
  ];

 // 관리자가 '노출'로 설정한 데이터만 필터링한 후, orderNo 기준 오름차순 정렬
const visibleEduData = safetyEduData
  .filter(edu => edu.isPublic)
  .sort((a, b) => Number(a.orderNo) - Number(b.orderNo));
  
  return (
    <div className="w-full px-5 md:px-0">
      <PageBreadcrumb items={breadcrumbItems} />
      
      <main className="w-full">
        <h1 className="text-heading-xl text-graygray-90 pb-10">시민안전교육</h1>
        <hr className="mb-10 border-gray-200" />

        <section className="mb-12 text-left">
          <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-5">
            <span className="text-[14px] mr-2">■</span> 전북특별자치도민 안전 교육
          </h2>
          <p className="pl-6 text-[17px] leading-relaxed">
            전북특별자치도에서는 도민의 안전의식을 높이고 재난 대응 능력을 기르기 위해 다양한 시민 안전 교육 및 체험 프로그램을 운영하고 있습니다.
            <br />주요 교육 정보 및 신청 방법은 다음과 같습니다.
          </p>
        </section>

        {/* 요약 섹션 */}
        <section className="mb-12">
          <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-5">
            <span className="text-[14px] mr-2">■</span> 주요 안전 교육 및 체험 시설
          </h2>
          <div className="pl-6 space-y-5 text-[17px] text-left">
            {visibleEduData.map((edu) => (
              <div key={`summary-${edu.id}`}>
                <p className="font-bold mb-1 text-black text-[18px]">{edu.title}</p>
                <p className="text-gray-700">{edu.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 상세 섹션 */}
        {visibleEduData.length > 0 ? (
          visibleEduData.map((edu) => (
            <section key={edu.id} className="mb-16 text-left">
              <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-6">
                 <span className="text-[14px] mr-2">■</span> {edu.title}
              </h2>
              
              <div className="pl-6">
                {edu.sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    <p className="text-[#0066cc] font-bold text-[18px] mb-2">{section.subTitle}</p>
                    <div className="space-y-1 text-[17px] leading-relaxed">
                      {section.items.map((item) => (
                        <p key={item.id} className={`
                          ${item.type === 'bold' ? 'font-bold text-black' : ''}
                          ${item.type === 'gray' ? 'text-gray-600 text-[16px]' : ''}
                          ${item.type === 'indent' ? 'pl-4' : ''}
                          ${item.mb || ''} ${item.mt || ''}
                        `}>
                          {item.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}

                {edu.footerNotice && (
                  <p className="mt-8 mb-4 font-sans text-left text-[17px] leading-relaxed">
                    {edu.footerNotice}
                  </p>
                )}

                <div className="mt-8 space-y-5 text-left mb-6">
                  {edu.links && edu.links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="block group w-fit">
                      <p className="text-[#0066cc] font-bold text-[18px] group-hover:text-blue-800 transition-colors">
                        {link.label}
                      </p>
                      <p className="text-gray-500 text-[14px] mt-0.5 ml-1">{link.url}</p>
                    </a>
                  ))}
                </div>

                {edu.contact && (
                  <div className="mt-8 pt-2">
                    <p className="text-[#0066cc] font-bold mb-1 text-[18px]">안전체험관 운영 문의</p>
                    <p className="text-[18px] font-medium">{edu.contact}</p>
                  </div>
                )}
              </div>
            </section>
          ))
        ) : (
          /* ★ 노출할 데이터가 하나도 없을 때 보여줄 화면 */
          <div className="py-32 text-center border-t border-gray-100">
            <p className="text-gray-400 text-[18px]">현재 등록된 안전 교육 정보가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserSafetyEducation;