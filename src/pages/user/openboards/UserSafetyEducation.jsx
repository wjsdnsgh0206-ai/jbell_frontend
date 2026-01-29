// src/pages/user/openboards/UserSafetyEducation.jsx

import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/shared/PageBreadcrumb';
import { safetyEduService } from '@/services/api'; // API 서비스 임포트

// 시민안전교육 사용자 페이지 //
const UserSafetyEducation = () => {
  const breadcrumbItems = [
    { label: "홈", path: "/", hasIcon: true },
    { label: "열린마당", path: "/userSafetyEducation" },
    { label: "시민안전교육", path: "/userSafetyEducation" },
  ];

  const [eduList, setEduList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    const fetchEduList = async () => {
      try {
        // 백엔드 API 호출
        // isPublic: 'visible' -> 공개된 게시물만 조회
        // size: 100 -> 한 페이지에 모든 교육 정보를 보여주기 위해 넉넉한 사이즈 요청
        const response = await safetyEduService.getSafetyEduList({
          page: 0,
          size: 100, 
          isPublic: 'visible'
        });
        
        // 백엔드 쿼리에서 이미 ordering ASC로 정렬되어 오지만, 
        // 만약 필요하다면 여기서 추가 정렬 가능
        setEduList(response.content || []);
      } catch (error) {
        console.error("안전교육 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEduList();
  }, []);

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

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
        ) : (
          <>
            {/* 요약 섹션 */}
            <section className="mb-12">
              <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-5">
                <span className="text-[14px] mr-2">■</span> 주요 안전 교육 및 체험 시설
              </h2>
              <div className="pl-6 space-y-5 text-[17px] text-left">
                {eduList.length > 0 ? (
                  eduList.map((edu) => (
                    <div key={`summary-${edu.id}`}>
                      <p className="font-bold mb-1 text-black text-[18px]">{edu.title}</p>
                      <p className="text-gray-700">{edu.summary}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">등록된 교육 정보가 없습니다.</p>
                )}
              </div>
            </section>

            {/* 상세 섹션 */}
            {eduList.length > 0 && eduList.map((edu) => (
              <section key={edu.id} className="mb-16 text-left">
                <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-6">
                   <span className="text-[14px] mr-2">■</span> {edu.title}
                </h2>
                
                <div className="pl-6">
                  {/* 섹션 반복 (이용안내, 방법 등) */}
                  {edu.sections && edu.sections.map((section, sIdx) => (
                    <div key={sIdx} className="mb-6">
                      <p className="text-[#0066cc] font-bold text-[18px] mb-2">{section.subTitle}</p>
                      <div className="space-y-1 text-[17px] leading-relaxed">
                        {section.items && section.items.map((item, iIdx) => (
                          <p key={iIdx} className={`
                            ${item.type === 'bold' ? 'font-bold text-black' : ''}
                            ${item.type === 'gray' ? 'text-gray-600 text-[16px]' : ''}
                            ${item.type === 'indent' ? 'pl-4' : ''}
                          `}>
                            {item.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* 하단 공지사항 */}
                  {edu.footerNotice && (
                    <p className="mt-8 mb-4 font-sans text-left text-[17px] leading-relaxed bg-gray-50 p-4 rounded-md text-gray-700">
                      {edu.footerNotice}
                    </p>
                  )}

                  {/* 관련 링크 */}
                  <div className="mt-8 space-y-5 text-left mb-6">
                    {edu.links && edu.links.map((link, lIdx) => (
                      <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" className="block group w-fit">
                        <p className="text-[#0066cc] font-bold text-[18px] group-hover:text-blue-800 transition-colors">
                          {link.label}
                        </p>
                        <p className="text-gray-500 text-[14px] mt-0.5 ml-1">{link.url}</p>
                      </a>
                    ))}
                  </div>

                  {/* 문의처 */}
                  {edu.contact && (
                    <div className="mt-8 pt-2">
                      <p className="text-[#0066cc] font-bold mb-1 text-[18px]">안전체험관 운영 문의</p>
                      <p className="text-[18px] font-medium">{edu.contact}</p>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default UserSafetyEducation;