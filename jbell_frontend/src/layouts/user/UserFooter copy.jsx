import { Link } from "react-router-dom";

const UserFooter = () => {
  const teamMembers = [
    { name: "전은호", email: "wjsdnsgh0206@gmail.com" },
    { name: "김민주", email: "j89465137@gmail.com" },
    { name: "김승하", email: "dubbii720@gmail.com" },
    { name: "김정훈", email: "kwjdgns2198@gmail.com" },
    { name: "최병준", email: "qudwns1216@gmail.com" },
    { name: "최지영", email: "jiyoungwlwl@gmail.com" },
  ];

  const footerLinks = [
    { text: "이용안내", isHighlighted: false },
    { text: "개인정보처리방침", isHighlighted: true },
    { text: "저작권정책", isHighlighted: false },
  ];

  // const guideLinks = [
  //   { text: "이용안내", hasIcon: true },
  //   { text: "찾아오시는 길", hasIcon: true },
  // ];

  return (
    <footer className="flex flex-col items-center relative bg-graygray-10 w-full border-t-2 border-graygray-30">
    {/* py-10 -> py-6(모바일)/py-8(데스크탑), gap-10 -> gap-6으로 축소 */}
    <div className="flex flex-col w-full max-w-[1280px] items-start gap-6 px-6 py-6 md:py-8 md:px-0 relative border-0 border-graygray-30">
      
      {/* 로고 영역: 하단 간격을 줄이기 위해 div wrapper의 gap 영향만 받도록 설정 */}
      <div className="inline-flex items-start relative">
        <Link to="/">
          <img
            className="relative w-[140px] md:w-[180px] h-auto"
            alt="전북안전누리 로고"
            src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
          />
        </Link>
      </div>

      {/* 상단 정보 섹션: gap-10 -> gap-6(모바일)/gap-0(데스크탑) */}
      <div className="flex flex-col md:flex-row items-start justify-between relative self-stretch w-full gap-6 md:gap-0">
        
        {/* 주소 및 연락처: gap-6 -> gap-3으로 축소 */}
        <address className="flex flex-col items-start gap-3 relative not-italic w-full md:w-auto">
          <div className="flex flex-col gap-1 items-start relative">
            <p className="font-body-body-m-400 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-400-font-size)] leading-relaxed md:leading-[var(--body-body-m-400-line-height)]">
              (54888) 전북특별자치도 전주시 덕진구 기린대로 499
            </p>
          </div>

          {/* 연락처 내부 간격 gap-3 -> gap-1 */}
          <div className="flex flex-col gap-1 items-start relative">
            <div className="flex flex-wrap gap-2 items-start relative">
              <span className="font-body-body-m-700 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-700-font-size)]">
                대표전화 1234
              </span>
              <span className="font-body-body-m-400 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-400-font-size)]">
                (평일 09시~18시)
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-1 relative">
              <span className="font-body-body-m-700 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-700-font-size)]">
                팩스 02-123-5678
              </span>
              <p className="font-body-body-m-400 text-graygray-90 text-[13px] md:text-[length:var(--body-body-m-400-font-size)] opacity-80">
                (평일 18시~익일 09시, 주말ㆍ공휴일 24시)
              </p>
            </div>
          </div>
        </address>

        {/* 팀 멤버 정보: gap-y-3 -> gap-y-1.5, border-b 및 pb 제거로 높이 축소 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 w-full md:w-[330px] gap-x-4 gap-y-1.5 relative">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:gap-2 items-start relative md:pb-0">
              <span className="font-body-body-m-700 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-700-font-size)] whitespace-nowrap shrink-0">
                {member.name}
              </span>
              <a
                href={`mailto:${member.email}`}
                className="font-body-body-m-400 text-graygray-90 text-[13px] md:text-[length:var(--body-body-m-400-font-size)] break-all sm:break-words hover:underline"
              >
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 법적 고지 및 저작권 영역: pt-6 -> pt-4, gap-6 -> gap-4 */}
      <div className="flex flex-col md:flex-row w-full gap-4 pt-4 border-t border-graygray-30 items-center justify-between relative">
        {/* gap-y-3 -> gap-y-1 */}
        <nav className="flex flex-wrap gap-x-6 gap-y-1 justify-center md:justify-start w-full md:w-auto" aria-label="Legal links">
          {footerLinks.map((link, index) => (
            <a key={index} href="#" className="inline-flex items-center justify-center">
              <span className={`${
                link.isHighlighted 
                  ? "font-bold text-secondarysecondary-50" 
                  : "font-normal text-graygray-90"
                } text-[14px] md:text-[17px] hover:underline`}
              >
                {link.text}
              </span>
            </a>
          ))}
          <div className="inline-flex items-center">
            <p className="font-normal text-graygray-90 text-[14px] md:text-[17px]">
              웹 접근성 품질인증 획득
            </p>
          </div>
        </nav>

        <div className="flex items-center text-center md:text-right">
          <p className="font-normal text-graygray-70 text-[12px] md:text-[15px] leading-relaxed">
            © The Government of the Republic of Korea. <br className="block md:hidden" /> All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default UserFooter;