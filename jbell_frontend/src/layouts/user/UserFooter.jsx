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

  const guideLinks = [
    { text: "이용안내", hasIcon: true },
    { text: "찾아오시는 길", hasIcon: true },
  ];

  return (
    <footer className="flex flex-col items-center relative bg-graygray-10 w-full">
      {/* 컨테이너: 고정 너비를 제거하고 max-width와 padding(px-6) 추가 */}
      <div className="flex flex-col w-full max-w-[1280px] items-start gap-10 px-6 py-10 md:px-0 relative border-0 border-graygray-30">
        
        {/* 로고 영역 */}
        <div className="inline-flex items-start gap-2.5 relative">
          <Link to="/">
            <img
              className="relative w-[160px] md:w-[199px] h-auto"
              alt="전북안전누리 로고"
              src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
            />
          </Link>
        </div>

        {/* 상단 정보 섹션: 모바일은 세로, 데스크탑은 가로 정렬 */}
        <div className="flex flex-col md:flex-row items-start justify-between relative self-stretch w-full gap-10 md:gap-0">
          
          {/* 주소 및 연락처 */}
          <address className="flex flex-col items-start gap-6 relative not-italic w-full md:w-auto">
            <div className="flex flex-col gap-2 md:gap-5 items-start relative">
              <p className="font-body-body-m-400 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-400-font-size)] leading-relaxed md:leading-[var(--body-body-m-400-line-height)]">
                (54888) 전북특별자치도 전주시 덕진구 기린대로 499
              </p>
            </div>

            <div className="flex flex-col gap-3 md:gap-5 items-start relative">
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
          {/* 팀 멤버 정보: 모바일에서 2열 그리드로 변경 가능 (현재는 세로 나열 유지) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 w-full md:w-[330px] gap-x-4 gap-y-3 relative">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:gap-2 items-start relative border-b border-gray-200 pb-2 md:border-none md:pb-0">
                {/* 1. 이름: 절대 줄바꿈 방지 및 공간 수축 방지 */}
                <span className="font-body-body-m-700 text-graygray-90 text-[14px] md:text-[length:var(--body-body-m-700-font-size)] whitespace-nowrap shrink-0">
                  {member.name}
                </span>
                {/* 2. 이메일: 이름이 차지한 나머지 공간을 채우고, 너무 길면 단어 단위로 쪼개기 */}
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

        {/* 하단 법적 고지 및 저작권 영역 */}
        <div className="flex flex-col md:flex-row w-full gap-6 pt-6 border-t border-graygray-30 items-center justify-between relative">
          <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center md:justify-start w-full md:w-auto" aria-label="Legal links">
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