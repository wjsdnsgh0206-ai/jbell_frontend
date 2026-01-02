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
    <div className="flex flex-col lg:flex-row w-full max-w-[1280px] mx-auto items-start justify-center gap-8 lg:gap-20 px-4 sm:px-6 lg:px-8 py-6">
      {/* 사이드바 - 모바일에서는 상단에 표시 */}
      <nav
        className="flex flex-col w-full lg:w-[296px] items-start lg:pl-0 lg:pr-10 lg:py-0 lg:border-r border-graygray-40"
        aria-label="사이드바 네비게이션"
      >
        <div className="flex flex-col items-start w-full">
          <div className="flex w-full gap-2 px-2 py-6 lg:py-10 bg-graygray-0 border-b border-graygray-50 items-center">
            <h2 className="relative flex-1 h-[15px] mt-[-1.00px] font-title-title-l-700 font-[number:var(--title-title-l-700-font-weight)] text-graygray-90 text-[length:var(--title-title-l-700-font-size)] tracking-[var(--title-title-l-700-letter-spacing)] leading-[var(--title-title-l-700-line-height)] whitespace-nowrap [font-style:var(--title-title-l-700-font-style)]">
              대피소 소개
            </h2>
          </div>

          <div className="hidden lg:flex flex-col w-full items-start">
            <a
              href="#"
              className="flex h-16 gap-2 px-2 py-0 w-full bg-graygray-0 border-b-[3px] border-secondarysecondary-50 items-center"
              aria-current="page"
            >
              <span className="font-bold text-secondarysecondary-50 text-[17px]">
                대피소 소개
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-start gap-8 lg:gap-20 w-full lg:flex-1">
        {/* 브레드크럼 */}
        <div className="flex flex-col items-start justify-end gap-8 lg:gap-20 w-full">
          <nav
            className="inline-flex items-center gap-1 rounded-md overflow-x-auto"
            aria-label="브레드크럼"
          >
            <ol className="inline-flex items-center">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="inline-flex items-center">
                  {index === 0 && (
                    <div className="p-1 rounded inline-flex items-center gap-2.5">
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
                    className="pt-1.5 pb-[7px] px-0.5 inline-flex items-center gap-2.5"
                  >
                    <span className="font-normal text-graygray-90 text-xs sm:text-sm lg:text-[15px] text-right underline whitespace-nowrap overflow-hidden text-ellipsis">
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

        {/* 헤더 */}
        <header className="flex flex-col items-start justify-center gap-6 lg:gap-10 w-full">
          <div className="inline-flex flex-col items-start justify-center gap-4 lg:gap-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-graygray-90">
              전주 시민 체육관 대피소
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-graygray-70">
              최종 정보 수정일: 2025년 12월 16일
            </p>
          </div>
        </header>

        {/* 시설 정보 섹션 */}
        <section className="flex flex-col items-start justify-center gap-6 lg:gap-10 w-full">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-graygray-90">
            시설 위치 및 정보
          </h2>

          <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 w-full">
            {/* 지도 및 안내사항 */}
            <div className="flex flex-col items-start gap-4 lg:gap-6 w-full lg:flex-1">
              <img
                className="w-full h-64 sm:h-80 lg:h-auto object-cover rounded-lg"
                alt="전주 시민 체육관 대피소 위치"
                src="https://c.animaapp.com/PZUA6SpP/img/-----2025-12-11-093936-2@2x.png"
              />

              <aside
                className="flex flex-col items-start justify-center gap-2 p-3 sm:p-4 w-full bg-[#f4f5f6] rounded-xl border border-solid border-[#cdd1d5]"
                role="note"
                aria-label="안내사항"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="inline-flex flex-col items-start justify-center gap-2">
                    <img
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      alt="정보 아이콘"
                      src="https://c.animaapp.com/PZUA6SpP/img/icon-system-info.svg"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-[17px] text-[#1e2124] font-normal">
                      안내사항
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 pl-5 sm:pl-7 w-full">
                  <p className="text-xs sm:text-sm lg:text-[15px] text-[#464c53] leading-relaxed">
                    본 대피소는 내진 설계가 적용되어 있으며, 비상 급수 시설과
                    자가 발전기를 갖추고 있습니다.
                  </p>
                </div>
              </aside>
            </div>

            {/* 시설 상세 정보 */}
            {/* dl태그 안에 dt와 dd가 들어감. (dt는 용어, dd는 설명) */}
            <dl className="flex flex-col items-start justify-center gap-3 lg:gap-2.5 w-full lg:flex-1">
              {facilityDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-3 lg:gap-6 w-full"
                >
                  <div className="flex flex-col gap-2.5 rounded-xl w-full">
                    <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 w-full bg-graygray-5 rounded-lg">
                      <dt className="text-xs sm:text-sm lg:text-base text-graygray-70 whitespace-nowrap">
                        {detail.label}
                      </dt>

                      <dd className="text-right">
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-graygray-90 whitespace-nowrap">
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
