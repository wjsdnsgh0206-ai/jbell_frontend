const TyphoonBeforeAction = () => {
  const breadcrumbItems = [
    {
      label: "홈",
      icon: "https://c.animaapp.com/VB47VnAn/img/live-area@2x.png",
      hasIcon: true,
    },
    { label: "행동요령", icon: null, hasIcon: false },
    { label: "자연재난행동요령", icon: null, hasIcon: false },
    { label: "태풍", icon: null, hasIcon: false },
  ];

  const tabs = [
    { label: "태풍 예보시 행동요령", isActive: true },
    { label: "태풍 특보 중 행동요령", isActive: false },
    { label: "태풍 이후 행동요령", isActive: false },
  ];

  const detailedGuidelines = [
    "상세 내용.",
    "상세 내용.",
    "상세 내용.",
  ];

  const videoCards = [
    {
      title: "영상 타이틀 제목",
      description: "영상 설명",
      image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
    },
    {
      title: "영상 타이틀 제목",
      description: "영상 설명",
      image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
    },
  ];

  return (
    // 본문 콘텐츠 영역
    <div className="flex flex-col items-center gap-20 pt-0 pb-20 relative flex-1 grow">
      {/* 브레드크럼 */}
      <nav
        className="flex flex-col items-start justify-end gap-20 pt-10 pb-0 px-0 self-stretch w-full relative flex-[0_0_auto]"
        aria-label="Breadcrumb"
        >
        <ol className="inline-flex items-center gap-1 rounded-md relative flex-[0_0_auto]">
          {breadcrumbItems.map((item, index) => (
            <li
            key={index}
            className="inline-flex items-center relative flex-[0_0_auto]"
            >
              {item.hasIcon && (
                <div className="p-1 rounded inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
                  <div className="relative w-4 h-4">
                    <img
                      className="absolute top-0.5 left-0.5 w-3 h-3"
                      alt="Home"
                      src={item.icon}
                      />
                  </div>
                </div>
              )}

              <a
                href="#"
                className="pt-1.5 pb-[7px] px-0.5 inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
                >
                <span className="relative w-fit mt-[-1.00px] [font-family:'Pretendard_GOV-Regular',Helvetica] font-normal text-graygray-90 text-[15px] text-right tracking-[0] leading-[22.5px] underline whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                  {item.label}
                </span>
              </a>

              {index < breadcrumbItems.length - 1 && (
                <img
                className="relative w-4 h-4"
                alt="Separator"
                src="https://c.animaapp.com/VB47VnAn/img/icon16-2.svg"
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* 본문 헤더 */}
      <header className="flex flex-col items-start justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
          {/* 타이틀과 수정일 */}
        <div className="inline-flex flex-col items-start justify-center gap-6 relative flex-[0_0_auto]">
          {/* 타이틀 */}
          <h1 className="relative w-fit mt-[-1.00px] font-heading-heading-m-700 font-[number:var(--heading-heading-m-700-font-weight)] text-graygray-90 text-[length:var(--heading-heading-m-700-font-size)] tracking-[var(--heading-heading-m-700-letter-spacing)] leading-[var(--heading-heading-m-700-line-height)] whitespace-nowrap [font-style:var(--heading-heading-m-700-font-style)]">
            태풍
          </h1>

          {/* 수정일 */}
          <p className="relative w-[360px] font-detail-detail-m-400 font-[number:var(--detail-detail-m-400-font-weight)] text-graygray-70 text-[length:var(--detail-detail-m-400-font-size)] tracking-[var(--detail-detail-m-400-letter-spacing)] leading-[var(--detail-detail-m-400-line-height)] [font-style:var(--detail-detail-m-400-font-style)]">
            최종 정보 수정일: 2025년 12월 16일
          </p>
        </div>

        {/* 탭목록 */}
        <div
          className="flex items-start relative self-stretch w-full flex-[0_0_auto]"
          role="tablist"
        >
          {tabs.map((tab, index) => (
            // 버튼
            <button
              key={index}
              role="tab"
              aria-selected={tab.isActive}
              className={`flex h-14 items-center justify-center gap-2 px-4 py-0 relative flex-1 grow ${
                tab.isActive
                  ? "bg-secondarysecondary-50 rounded-[8px_0px_0px_8px]"
                  : "border-t [border-top-style:solid] border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-secondarysecondary-20"
              }`}
            >
            {/* 버튼 안에 텍스트 */}
              <span
                className={`relative w-fit ${ 
                  tab.isActive
                    ? "font-title-title-m-700 font-[number:var(--title-title-m-700-font-weight)] text-graygray-0 text-[length:var(--title-title-m-700-font-size)] tracking-[var(--title-title-m-700-letter-spacing)] leading-[var(--title-title-m-700-line-height)] [font-style:var(--title-title-m-700-font-style)]"
                    : "font-title-title-m-700 font-[number:var(--title-title-m-700-font-weight)] text-graygray-70 text-[length:var(--title-title-m-700-font-size)] tracking-[var(--title-title-m-700-letter-spacing)] leading-[var(--title-title-m-700-line-height)] [font-style:var(--title-title-m-700-font-style)]"
                } whitespace-nowrap`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <aside className="flex items-center gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] bg-secondarysecondary-5 rounded-lg">
          <p className="relative w-[865px] h-[38px] mt-[-1.00px] mr-[-9.00px] font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-90 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] [font-style:var(--body-body-m-400-font-style)]">
            탭 유형(전, 중, 후 상황)에 따른 설명
          </p>
        </aside>
      </header>

      <section className="flex flex-col items-start gap-16 relative self-stretch w-full flex-[0_0_auto]">
        <article className="flex flex-col items-start justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
            <h2 className="relative self-stretch mt-[-1.00px] font-title-title-XL-700 font-[number:var(--title-title-XL-700-font-weight)] text-graygray-90 text-[length:var(--title-title-XL-700-font-size)] tracking-[var(--title-title-XL-700-letter-spacing)] leading-[var(--title-title-XL-700-line-height)] [font-style:var(--title-title-XL-700-font-style)]">
              중제목
            </h2>
          </div>

          <div className="flex flex-col items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
            <h3 className="relative self-stretch mt-[-1.00px] font-title-title-m-700 font-[number:var(--title-title-m-700-font-weight)] text-graygray-90 text-[length:var(--title-title-m-700-font-size)] tracking-[var(--title-title-m-700-letter-spacing)] leading-[var(--title-title-m-700-line-height)] [font-style:var(--title-title-m-700-font-style)]">
              - 소제목
            </h3>

            <ol className="relative self-stretch font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-70 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] [font-style:var(--body-body-m-400-font-style)]">
              {detailedGuidelines.map((guideline, index) => (
                <li key={index}>
                  {index + 1}. {guideline}
                  {index < detailedGuidelines.length - 1 && <br />}
                </li>
              ))}
            </ol>
          </div>
        </article>
      </section>

      <section className="self-stretch w-full flex-[0_0_auto] flex items-start gap-6 relative">
        {videoCards.map((card, index) => (
          <article
            key={index}
            className="flex-col p-6 flex-1 grow rounded-xl border border-solid border-graygray-40 flex items-start gap-6 relative"
          >
            <header className="flex-col justify-center self-stretch w-full flex-[0_0_auto] flex items-start gap-6 relative">
              <div className="flex items-center gap-0.5 relative self-stretch w-full flex-[0_0_auto]">
                <h3 className="relative flex-1 mt-[-1.00px] font-title-title-l-700 font-[number:var(--title-title-l-700-font-weight)] text-graygray-90 text-[length:var(--title-title-l-700-font-size)] tracking-[var(--title-title-l-700-letter-spacing)] leading-[var(--title-title-l-700-line-height)] [font-style:var(--title-title-l-700-font-style)]">
                  {card.title}
                </h3>
              </div>

              <p className="relative self-stretch font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-70 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] [font-style:var(--body-body-m-400-font-style)]">
                {card.description}
              </p>
            </header>

            <img
              className="relative self-stretch w-full aspect-[1.77] object-cover"
              alt={card.title}
              src={card.image}
            />
          </article>
        ))}
      </section>
    </div>
  );
};
export default TyphoonBeforeAction;