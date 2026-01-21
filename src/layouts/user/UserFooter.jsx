import { Link } from "react-router-dom";
import logo from "@/assets/logo/jeonbuk_safety_nuri_watermark.svg";

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

  // 1. 기존 스크롤 함수 복사
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-graygray-10 border-t border-graygray-30">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-6 px-4 py-8 lg:px-8">
        
        {/* 2. Link 대신 일반 클릭 이벤트로 활용하거나, 
               Link를 유지하고 싶다면 아래처럼 작성하세요 */}
        <Link 
          to="/" 
          onClick={(e) => {
            // 메인 페이지일 경우 페이지 이동 없이 스크롤만 올리려면 아래 주석 해제
            // e.preventDefault(); 
            scrollToTop();
          }} 
          className="inline-block w-fit"
        >
          <img
            className="w-36 md:w-44 h-auto cursor-pointer"
            alt="전북안전누리 로고"
            src={logo}
          />
        </Link>

        {/* 2. 정보 섹션 (주소 + 팀원) */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-0">
          
          {/* 주소 및 연락처 */}
          <address className="flex flex-col gap-3 not-italic">
            <p className="text-detail-m text-graygray-90">
              (54888) 전북특별자치도 전주시 덕진구 기린대로 499
            </p>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-detail-m font-bold text-graygray-90">
                  대표전화 1234
                </span>
                <span className="text-detail-m text-graygray-70">
                  (평일 09시~18시)
                </span>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-detail-m font-bold text-graygray-90">
                  팩스 02-123-5678
                </span>
                <span className="text-detail-m text-graygray-70">
                  (평일 18시~익일 09시, 주말ㆍ공휴일 24시)
                </span>
              </div>
            </div>
          </address>

          {/* 팀 멤버 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 w-full md:w-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-detail-m font-bold text-graygray-90 whitespace-nowrap">
                  {member.name}
                </span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-detail-m text-graygray-70 hover:underline hover:text-secondary-50 transition-colors"
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 하단 링크 및 저작권 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-graygray-30">
          
          {/* 링크 모음 */}
          <nav className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {footerLinks.map((link, index) => (
              <a 
                key={index} 
                href="#" 
                className={`
                  text-detail-m hover:underline
                  ${link.isHighlighted 
                    ? "font-bold text-secondary-50" 
                    : "text-graygray-90"
                  }
                `}
              >
                {link.text}
              </a>
            ))}
            <span className="text-detail-m text-graygray-70">|</span>
            <span className="text-detail-m text-graygray-90">
              웹 접근성 품질인증 획득
            </span>
          </nav>

          {/* 저작권 표시 */}
          <p className="text-detail-m text-graygray-70 text-center md:text-right">
            © The Government of the Republic of Korea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;