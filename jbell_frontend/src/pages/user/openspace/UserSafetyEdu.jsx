import React from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ 사이드바 레이아웃 임포트
import UserOpenSpaceLayout from "@/layouts/user/openspace/UserOpenSpaceLayout";

const UserSafetyEdu = () => {
  const navigate = useNavigate();

  return (
    <UserOpenSpaceLayout>
      <div className="w-full">
        {/* ✅ main의 py-8을 제거하여 상단 여백을 다른 페이지와 맞춤 */}
        <main className="w-full">
          {/* 상단 브레드크럼 */}
          {/* ✅ 타이틀과의 간격을 위해 mb-8로 수정 및 py-1로 높이 조절 */}
          <nav className="flex items-center text-[#444] text-[15px] py-1 mb-8" aria-label="브레드크럼">
            <ol className="flex items-center gap-2">
              <li className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => navigate('/')}
                >
                  {/* 홈 아이콘 */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  <span className="underline underline-offset-4 decoration-1 group-hover:text-black">홈</span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg font-light flex items-center mb-0.5">&gt;</span>
                <span className="underline underline-offset-4 decoration-1 cursor-pointer hover:text-black">
                  열린마당
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 text-lg font-light flex items-center mb-0.5">&gt;</span>
                <span className="underline underline-offset-4 decoration-1 font-semibold text-gray-800 cursor-default">
                  시민안전교육
                </span>
              </li>
            </ol>
          </nav>

          {/* 타이틀 영역 - 텍스트 크기를 [28px]로 조절하여 일치시킴 */}
          <h1 className="text-[28px] font-bold mb-10 text-black text-left">시민안전교육</h1>
          <hr className="mb-10 border-gray-200" />

          {/* 섹션 1: 전북특별자치도민 안전 교육 */}
          <section className="mb-12">
            <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-5">
              <span className="text-[14px] mr-2">■</span> 전북특별자치도민 안전 교육
            </h2>
            <div className="pl-6 text-[17px] leading-relaxed text-left">
              전북특별자치도에서는 도민의 안전의식을 높이고 재난 대응 능력을 기르기 위해 다양한 시민 안전 교육 및 체험 프로그램을 운영하고 있습니다.
              <br />
              주요 교육 정보 및 신청 방법은 다음과 같습니다.
            </div>
          </section>

          {/* 섹션 2: 주요 안전 교육 및 체험 시설 */}
          <section className="mb-12">
            <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-5">
              <span className="text-[14px] mr-2">■</span> 주요 안전 교육 및 체험 시설
            </h2>
            <div className="pl-6 space-y-5 text-[17px] text-left">
              <div>
                <p className="font-bold mb-1 text-black text-left text-[18px]">전북119안전체험관</p>
                <p>태풍, 교통사고, 화재, 지진 등 다양한 재난 상황을 직접 체험하며 위기 탈출 방법을 배울 수 있는 종합 안전 체험 시설입니다.</p>
              </div>
              <div>
                <p className="font-bold mb-1 text-black text-left text-[18px]">전주학생교육문화관 안전체험관</p>
                <p>유아부터 중학생, 일반 시민까지 폭넓은 연령층을 대상으로 실습 중심의 안전교육을 운영합니다.</p>
              </div>
            </div>
          </section>

          {/* 섹션 3: 전북소방119안전체험관 */}
          <section className="mb-16 text-left">
            <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-6">
              <span className="text-[14px] mr-2">■</span> 전북소방119안전체험관
            </h2>
            
            <div className="pl-6 text-[17px] leading-relaxed">
              <p className="text-[#0066cc] font-bold mb-2 text-[18px]">이용안내</p>
              <p className="font-bold mb-1 text-[17px]">체험객 복장 유의사항</p>
              <p>치마, 구두, 리본, 레이스옷 등의 옷차림 착용 시 체험이 어렵습니다.</p>
              <p>편한 바지와 운동화를 권장하며, 여름철 물놀이안전체험의 경우 여벌의 옷을 준비하셔야 합니다.</p>
              <p className="mb-4">가방, 핸드폰 등 개인소지품은 분실 및 파손우려가 있으므로 차량에 놓고 내리시기 바랍니다.</p>

              <p className="text-[#0066cc] font-bold mb-2 text-[18px]">이용방법</p>
              <div className="space-y-1">
                <p>전북 119안전체험관을 이용하고자 하는 고객은 체험 희망일 1일전까지 인터넷 홈페이지를 통해 날짜 및 시간 등을 사전예약해야 합니다.</p>
                <p className="text-gray-600 text-[16px]">(단, 예약 미달시에는 현장 예약 가능)</p>
                <p>전북 119안전체험관 이용인원은 각 동별 수용범위내에서 운영함을 원칙으로 합니다.</p>
                <p className="text-gray-600 text-[16px]">(단, 이용자 편의와 시설의 원활한 운영을 위하여 인원 조정 가능)</p>
                <p>재난종합체험동은 초등학교 이상 이용가능하며, 5~7세 어린이는 보호자가 동반하셔야 됩니다.</p>
                <p className="text-gray-600 text-[16px]">(단, 예약시 보호자도 예약)</p>
                <p>위기탈출체험동은 초등학교 이상 이용가능합니다.</p>
                <p>어린이안전마을은 5~7세가 이용하는 전용 체험마을로 단체의 경우 체험 시 20명당 성인 1명이 동반해야 합니다.</p>
                <p className="text-gray-600 mb-2 text-[16px]">(단, 주말의 경우 보호자 동반 입장이 가능하며, 동반 시 보호자도 체험료 결제를 하셔야 합니다.)</p>
                <p className="font-bold text-[17px]">※ 모든 체험 가능 연령 기준일은 2025. 1. 1. 입니다.</p>
              </div>

              <p className="text-[#0066cc] font-bold mt-6 mb-2 text-[18px]">이용일 및 휴관일 안내</p>
              <div className="space-y-1">
                <p>전북 119안전체험관은 다음의 휴관일을 제외하고 매일 개관합니다.</p>
                <p>매년 1월1일, 명절(설날,추석) 연휴, 매주 월요일</p>
                <p>그 밖에 시설의 효율적인 운영을 위해 정하는 휴관일(2025년 1월 14일 ~ 28일)</p>
                <p>전북 119안전체험관의 체험시간은 09:50 ~ 16:40 까지입니다.</p>
                <p>점심시간은 11:30 ~ 12:30 까지입니다.</p>
              </div>

              <p className="mt-8 mb-4 font-sans text-left text-[17px]">기타 자세한 사항은 전북소방119안전체험관 웹사이트를 방문하여 확인하시길 바랍니다.</p>

              <div className="space-y-5 text-left">
                <a href="https://www.sobang.kr/safe119/index.sobang?contentsId=40" target="_blank" rel="noreferrer" className="block group">
                  <p className="text-[#0066cc] font-bold text-[18px] group-hover:text-blue-800 transition-colors">전북소방119안전체험관 ↗</p>
                  <p className="text-gray-500 text-[14px] mt-0.5 ml-1">https://www.sobang.kr/safe119/index.sobang?contentsId=40</p>
                </a>
                <a href="https://www.sobang.kr/safe119/index.sobang?menuCd=DOM_000001803003001000" target="_blank" rel="noreferrer" className="block group">
                  <p className="text-[#0066cc] font-bold text-[18px] group-hover:text-blue-800 transition-colors">체험예약 ↗</p>
                  <p className="text-gray-500 text-[14px] mt-0.5 ml-1">https://www.sobang.kr/safe119/index.sobang?menuCd=DOM_000001803003001000</p>
                </a>
              </div>
            </div>
          </section>

          {/* 섹션 4: 전주학생교육문화관 안전체험관 */}
          <section className="mb-10 text-left">
            <h2 className="text-[20px] font-bold text-[#0055aa] flex items-center mb-6">
              <span className="text-[14px] mr-2">■</span> 전주학생교육문화관 안전체험관
            </h2>

            <div className="pl-6 text-[17px] leading-relaxed">
              <p className="text-[#0066cc] font-bold mb-2 text-[18px]">운영 안내</p>
              <p className="font-bold mb-1 text-black text-left text-[17px]">운영 대상 및 신청 방법</p>
              <div className="space-y-1 mb-4">
                <p>전주 시민 누구나(최소 4명 ~ 최대 10명)</p>
                <p className="pl-4">- 유선 예약 또는 누리집 예약(수업 희망일 최소 5일 전 예약)</p>
                <p className="pl-4">- 유아 신청 시 보호자 필수 동행</p>
                <p>전주 관내 공·사립 유치원(4세~5세, 최대 25명)</p>
                <p>전주 관내 국·공립 초등 1학년~중학생(최대 30명)</p>
                <p className="pl-4">- 공문 또는 유선 예약</p>
              </div>

              <p className="text-[#0066cc] font-bold mb-1 text-[18px]">운영 시간</p>
              <div className="space-y-0.5 mb-4">
                <p>오전(09:30~11:30), 오후(13:30~15:30)</p>
                <p>수업 일정 조율 가능</p>
                <p>입장료 및 수강료: 무료</p>
              </div>

              <p className="text-[#0066cc] font-bold mb-2 text-[18px]">신청 경로</p>
              <div className="space-y-3 mb-4">
                <a href="https://lib.jbe.go.kr/jec/module/teach/index.do?menu_idx=280&searchCate1=24" target="_blank" rel="noreferrer" className="block group">
                  <p className="font-bold text-black text-[17px] group-hover:text-[#0066cc] transition-colors">
                    (누리집) 전주학생교육문화관 누리집/학생&평생교육/안전체험관이용신청 ↗
                  </p>
                  <p className="text-[#0066cc] break-all text-[15px]">
                    https://lib.jbe.go.kr/jec/module/teach/index.do?menu_idx=280&searchCate1=24
                  </p>
                </a>
                <p className="text-gray-500 text-[14px]">※ 안전체험관이용신청 메뉴에서 확인되는 일시에 교육 신청 가능</p>
                <p className="font-bold mt-2 text-black text-left text-[17px]">(유선) 안전체험 담당 유선 예약(270-1672)</p>
              </div>

              <p className="mt-8 mb-6 font-sans text-[17px]">기타 자세한 사항은 전북특별자치도교육청전주학생교육문화관 안전체험관 웹사이트를 방문하여 확인하시거나 유선 연락으로 문의바랍니다.</p>

              <div className="space-y-5">
                <a href="https://lib.jbe.go.kr/jec/html.do?menu_idx=283" target="_blank" rel="noreferrer" className="block group">
                  <p className="text-[#0066cc] font-bold text-[18px] group-hover:text-blue-800 transition-colors">전북특별자치도교육청전주학생교육문화관 &gt; 안전체험관 ↗</p>
                  <p className="text-gray-500 text-[14px] mt-0.5 ml-1">https://lib.jbe.go.kr/jec/html.do?menu_idx=283</p>
                </a>
                
                <div className="pt-2">
                  <p className="text-[#0066cc] font-bold mb-1 text-[18px]">안전체험관 운영 문의</p>
                  <p className="font-bold text-[18px]">총무과 안전체험 담당 ☎ 270-1672</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </UserOpenSpaceLayout>
  );
};

export default UserSafetyEdu;