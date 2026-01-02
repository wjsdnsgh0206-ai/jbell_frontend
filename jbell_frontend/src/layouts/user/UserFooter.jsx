import { Link } from "react-router-dom";

const UserFooter = () => {
  const teamMembers = [
    { name: "전은호", email: "wjsdnsgh0206@gmail.com" },
    { name: "김민주", email: "2808988749491550@facebook.com" },
    { name: "김승하", email: "dfj7200@naver.com" },
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
    <footer className="flex flex-col items-center relative bg-graygray-10">
      <div className="flex flex-col w-[1280px] items-start gap-10 px-0 py-10 relative flex-[0_0_auto] border-0 border-none border-graygray-30">
        {/* 로고 */}
        <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
          <Link to="/">
            <img
                className="relative w-[199px] h-15"
                alt="전북안전누리 로고"
                src="src/assets/logo/jeonbuk_safety_nuri_watermark.svg"
            />
          </Link>
        </div>
        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto] font-body-small">
          <address className="inline-flex flex-col h-20 items-start gap-6 relative flex-[0_0_auto] not-italic">
            <div className="inline-flex flex-col gap-5 flex-[0_0_auto] items-start relative">
              <div className="inline-flex gap-1 flex-[0_0_auto] items-start relative">
                <p className="font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] relative w-fit mt-[-1.00px] text-graygray-90 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] whitespace-nowrap [font-style:var(--body-body-m-400-font-style)]">
                  (54888) 전북특별자치도 전주시 덕진구 기린대로 499
                </p>
              </div>
            </div>

            <div className="inline-flex flex-col gap-5 flex-[0_0_auto] items-start relative">
              <div className="inline-flex gap-1 flex-[0_0_auto] items-start relative">
                <div className="font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] relative w-fit mt-[-1.00px] text-graygray-90 text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)] whitespace-nowrap [font-style:var(--body-body-m-700-font-style)]">
                  대표전화 1234
                </div>

                <div className="font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] relative w-fit mt-[-1.00px] text-graygray-90 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] whitespace-nowrap [font-style:var(--body-body-m-400-font-style)]">
                  (평일 09시~18시)
                </div>
              </div>

              <div className="inline-flex gap-1 flex-[0_0_auto] items-start relative">
                <div className="relative w-fit mt-[-1.00px] font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] text-graygray-90 text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)] whitespace-nowrap [font-style:var(--body-body-m-700-font-style)]">
                  팩스 02-123-5678
                </div>

                <p className="font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] relative w-fit mt-[-1.00px] text-graygray-90 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] whitespace-nowrap [font-style:var(--body-body-m-400-font-style)]">
                  (평일 18시~익일 09시, 주말ㆍ공휴일 24시)
                </p>
              </div>
            </div>
          </address>

          <div className="flex flex-col w-[330px] items-start gap-5 relative">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="inline-flex gap-1 flex-[0_0_auto] items-start relative"
              >
                <div className="font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] relative w-fit mt-[-1.00px] text-graygray-90 text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)] whitespace-nowrap [font-style:var(--body-body-m-700-font-style)]">
                  {member.name}
                </div>

                <a
                  href={`mailto:${member.email}`}
                  className="relative w-fit mt-[-1.00px] font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-90 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] whitespace-nowrap [font-style:var(--body-body-m-400-font-style)]"
                >
                  {member.email}
                </a>
              </div>
            ))}
          </div>

          <nav
            className="inline-flex flex-col max-w-[302px] items-start gap-10 relative flex-[0_0_auto] self-stretch"
            aria-label="Footer navigation"
          >
            <div className="inline-flex flex-col gap-4 flex-[0_0_auto] items-start relative">
              {guideLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex h-6 items-center justify-center gap-1 p-0.5 relative rounded-md"
                  aria-label={link.text}
                >
                  <div className="font-body-body-m-700 font-[number:var(--body-body-m-700-font-weight)] text-graygray-90 relative flex items-center justify-center w-fit text-[length:var(--body-body-m-700-font-size)] tracking-[var(--body-body-m-700-letter-spacing)] leading-[var(--body-body-m-700-line-height)] whitespace-nowrap [font-style:var(--body-body-m-700-font-style)]">
                    {link.text}
                  </div>
                </a>
              ))}
            </div>

            <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
              <div className="inline-flex items-start gap-2 relative flex-[0_0_auto]">
                <a
                  href="#"
                  className="relative w-10 h-10 bg-graygray-0 rounded-[120px] overflow-hidden border border-solid border-graygray-20"
                  aria-label="Social media link"
                >
                  <img
                    className="absolute w-[50.00%] h-[37.50%] top-[32.50%] left-[25.00%]"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div className="flex w-[1280px] gap-10 pt-4 pb-0 px-0 border-t [border-top-style:solid] border-graygray-30 items-center relative flex-[0_0_auto]">
          <nav
            className="flex gap-6 flex-1 grow items-start relative"
            aria-label="Legal links"
          >
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="flex-[0_0_auto] inline-flex h-6 items-center justify-center gap-1 p-0.5 relative rounded-md"
              >
                <div
                  className={`${link.isHighlighted ? "[font-family:'Pretendard_GOV-Bold',Helvetica] font-bold text-secondarysecondary-50" : "[font-family:'Pretendard_GOV-Regular',Helvetica] font-normal text-graygray-90"} relative flex items-center justify-center w-fit text-[17px] tracking-[0] leading-[25.5px] whitespace-nowrap`}
                >
                  {link.text}
                </div>
              </a>
            ))}

            <div className="flex-[0_0_auto] inline-flex h-6 items-center justify-center gap-1 p-0.5 relative rounded-md">
              <p className="[font-family:'Pretendard_GOV-Regular',Helvetica] font-normal text-graygray-90 relative flex items-center justify-center w-fit text-[17px] tracking-[0] leading-[25.5px] whitespace-nowrap">
                웹 접근성 품질인증 마크 획득
              </p>
            </div>
          </nav>

          <div className="inline-flex items-center relative flex-[0_0_auto]">
            <p className="relative w-fit mt-[-1.00px] [font-family:'Pretendard_GOV-Regular',Helvetica] font-normal text-graygray-70 text-[15px] tracking-[0] leading-[22.5px] whitespace-nowrap">
              © The Government of the Republic of Korea. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter
