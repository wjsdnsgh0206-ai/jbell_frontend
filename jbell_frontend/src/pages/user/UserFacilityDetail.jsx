const UserFacilityDetail = () => {
  const breadcrumbItems = [
    { label: "홈", link: "#" },
    { label: "대피소 소개", link: "#" },
    { label: "전주 시민 체육관 대피소", link: "#" },
  ];

  const facilityDetails = [
    { label: "시설유형", value: "대피소" },
    { label: "관리기관", value: "전주시청 안전총괄과" },
    { label: "시설규모", value: "1200 ㎡" },
    { label: "수용 가능 인원", value: "500명" },
    { label: "주소", value: "전주시 완산구 효자로 225" },
    { label: "평상시 활용 유형", value: "지하주차장" },
    { label: "운영여부", value: "운영중" },
    { label: "문의 전화", value: "063-252-0000" },
  ];

  return (
    <div className="flex w-[1280px] items-start justify-center gap-20 relative flex-[0_0_auto]">
      <nav
        className="flex flex-col w-[296px] items-center pl-0 pr-10 py-0 relative self-stretch border-r [border-right-style:solid] border-graygray-40"
        aria-label="사이드바 네비게이션"
      >
        <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex w-64 gap-2 px-2 py-10 flex-[0_0_auto] bg-graygray-0 border-b [border-bottom-style:solid] border-graygray-50 items-center relative">
            <h2 className="relative flex-1 h-[15px] mt-[-1.00px] font-title-title-l-700 font-[number:var(--title-title-l-700-font-weight)] text-graygray-90 text-[length:var(--title-title-l-700-font-size)] tracking-[var(--title-title-l-700-letter-spacing)] leading-[var(--title-title-l-700-line-height)] whitespace-nowrap [font-style:var(--title-title-l-700-font-style)]">
              대피소 소개
            </h2>
          </div>

          <div className="flex flex-col w-64 items-start relative flex-[0_0_auto]">
            <a
              href="#"
              className="flex h-16 gap-2 px-2 py-0 self-stretch w-full bg-graygray-0 border-b-[3px] [border-bottom-style:solid] border-secondarysecondary-50 items-center relative"
              aria-current="page"
            >
              <span className="relative flex-1 [font-family:'Pretendard_GOV-Bold',Helvetica] font-bold text-secondarysecondary-50 text-[17px] tracking-[0] leading-[25.5px]">
                대피소 소개
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex flex-col h-[1019px] items-center gap-20 pt-0 pb-20 px-0 relative flex-1 grow">
        <div className="flex flex-col items-start justify-end gap-20 pt-10 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
          <nav
            className="inline-flex items-center gap-1 relative flex-[0_0_auto] rounded-md"
            aria-label="브레드크럼"
          >
            <ol className="inline-flex items-center relative flex-[0_0_auto]">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="inline-flex items-center">
                  {index === 0 && (
                    <div className="p-1 rounded inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
                      <div className="relative w-4 h-4">
                        <img
                          className="absolute top-0.5 left-0.5 w-3 h-3"
                          alt="홈"
                          src="https://c.animaapp.com/PZUA6SpP/img/live-area@2x.png"
                        />
                      </div>
                    </div>
                  )}

                  <a
                    href={item.link}
                    className="pt-1.5 pb-[7px] px-0.5 inline-flex items-center gap-2.5 relative flex-[0_0_auto]"
                  >
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Pretendard_GOV-Regular',Helvetica] font-normal text-graygray-90 text-[15px] text-right tracking-[0] leading-[22.5px] underline whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {item.label}
                    </span>
                  </a>

                  {index < breadcrumbItems.length - 1 && (
                    <img
                      className="relative w-4 h-4"
                      alt="다음"
                      src="https://c.animaapp.com/PZUA6SpP/img/icon16-1.svg"
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <header className="flex flex-col items-start justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start justify-center gap-6 relative flex-[0_0_auto]">
            <h1 className="relative w-fit mt-[-1.00px] font-heading-heading-m-700 font-[number:var(--heading-heading-m-700-font-weight)] text-graygray-90 text-[length:var(--heading-heading-m-700-font-size)] tracking-[var(--heading-heading-m-700-letter-spacing)] leading-[var(--heading-heading-m-700-line-height)] whitespace-nowrap [font-style:var(--heading-heading-m-700-font-style)]">
              전주 시민 체육관 대피소
            </h1>

            <p className="relative w-[360px] font-detail-detail-m-400 font-[number:var(--detail-detail-m-400-font-weight)] text-graygray-70 text-[length:var(--detail-detail-m-400-font-size)] tracking-[var(--detail-detail-m-400-letter-spacing)] leading-[var(--detail-detail-m-400-line-height)] [font-style:var(--detail-detail-m-400-font-style)]">
              최종 정보 수정일: 2025년 12월 16일
            </p>
          </div>
        </header>

        <section className="flex flex-col items-start justify-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
          <h2 className="relative self-stretch mt-[-1.00px] font-title-title-XL-700 font-[number:var(--title-title-XL-700-font-weight)] text-graygray-90 text-[length:var(--title-title-XL-700-font-size)] tracking-[var(--title-title-XL-700-letter-spacing)] leading-[var(--title-title-XL-700-line-height)] [font-style:var(--title-title-XL-700-font-style)]">
            시설 위치 및 정보
          </h2>

          <div className="justify-center gap-6 flex items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch grow">
              <img
                className="relative flex-1 self-stretch w-full grow object-cover"
                alt="전주 시민 체육관 대피소 위치"
                src="https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png"
              />

              <aside
                className="flex flex-col items-start justify-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f5f6] rounded-xl border border-solid border-[#cdd1d5]"
                role="note"
                aria-label="안내사항"
              >
                <div className="gap-2 self-stretch w-full flex-[0_0_auto] flex items-center relative">
                  <div className="inline-flex flex-col items-start justify-center gap-2 relative flex-[0_0_auto]">
                    <img
                      className="relative w-5 h-5"
                      alt="정보 아이콘"
                      src="https://c.animaapp.com/PZUA6SpP/img/icon-system-info.svg"
                    />
                  </div>

                  <div className="gap-2.5 flex-1 grow flex items-center relative">
                    <h3 className="flex-1 mt-[-1.00px] text-[#1e2124] text-[17px] leading-[25.5px] relative [font-family:'Pretendard_GOV-Regular',Helvetica] font-normal tracking-[0]">
                      안내사항
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 pl-7 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
                  <p className="self-stretch mt-[-1.00px] text-[#464c53] text-[15px] leading-[22.5px] relative [font-family:'Pretendard_GOV-Regular',Helvetica] font-normal tracking-[0]">
                    본 대피소는 내진 설계가 적용되어 있으며, 비상 급수 시설과
                    자가 발전기를 갖추고 있습니다.
                  </p>
                </div>
              </aside>
            </div>

            <dl className="gap-2.5 flex-1 grow flex flex-col items-start justify-center relative">
              {facilityDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]"
                >
                  <div className="flex-col gap-2.5 rounded-xl flex items-start relative self-stretch w-full flex-[0_0_auto]">
                    <div className="flex items-center justify-between p-6 relative self-stretch w-full flex-[0_0_auto] bg-graygray-5 rounded-lg">
                      <dt className="relative w-fit font-body-body-m-400 font-[number:var(--body-body-m-400-font-weight)] text-graygray-70 text-[length:var(--body-body-m-400-font-size)] tracking-[var(--body-body-m-400-letter-spacing)] leading-[var(--body-body-m-400-line-height)] whitespace-nowrap [font-style:var(--body-body-m-400-font-style)]">
                        {detail.label}
                      </dt>

                      <dd className="relative mr-[-2.00px]">
                        <span className="font-title-title-m-700 font-[number:var(--title-title-m-700-font-weight)] text-graygray-90 text-[length:var(--title-title-m-700-font-size)] tracking-[var(--title-title-m-700-letter-spacing)] leading-[var(--title-title-m-700-line-height)] whitespace-nowrap [font-style:var(--title-title-m-700-font-style)]">
                          {detail.value}
                        </span>
                      </dd>
                    </div>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
};


export default UserFacilityDetail;