import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GoHomeFill } from "react-icons/go";

const TyphoonBeforeAction = () => {
  const [activeTab, setActiveTab] = useState(0);

  const breadcrumbItems = [
    { label: "홈", hasIcon: true },
    { label: "행동요령", hasIcon: false },
    { label: "자연재난행동요령", hasIcon: false },
    { label: "태풍", hasIcon: false },
  ];

  const tabs = [
    { label: "태풍 예보시 행동요령", id: 0 },
    { label: "태풍 특보 중 행동요령", id: 1 },
    { label: "태풍 이후 행동요령", id: 2 },
  ];

  const detailedGuidelines = [
    "TV, 라디오, 스마트폰 등으로 태풍의 진로와 도달 시간을 수시로 확인합니다.",
    "가정의 하수구나 집 주변의 배수구를 미리 점검하고 막힌 곳은 뚫어둡니다.",
    "침수나 산사태가 일어날 위험이 있는 지역에 거주하는 주민은 대피 장소와 비상연락방법을 미리 알아둡니다.",
  ];

  const videoCards = [
    {
      title: "태풍 예보시 행동요령 가이드",
      description: "태풍이 오기 전, 가정에서 꼭 확인해야 할 안전 수칙을 영상으로 확인하세요.",
      image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
    },
    {
      title: "비상시 대피 요령",
      description: "침수 우려 시 안전하게 대피하는 방법과 대피소 찾는 법을 알려드립니다.",
      image: "https://c.animaapp.com/VB47VnAn/img/image-1@2x.png",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full pb-20 px-4 lg:px-0">
      
      {/* 1. 브레드크럼 */}
      <nav className="w-full flex py-6 lg:py-10" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center justify-end gap-2 text-graygray-90">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {item.hasIcon && <GoHomeFill className="w-4 h-4 text-graygray-50" />}
              
              {/* text-detail-m 클래스 사용 (15px) */}
              <span className={`
                text-detail-m
                ${index === breadcrumbItems.length - 1 ? 'font-bold text-graygray-90' : 'text-graygray-70'}
              `}>
                {item.label}
              </span>

              {index < breadcrumbItems.length - 1 && (
                <ChevronRight className="w-4 h-4 text-graygray-40" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* 2. 본문 헤더 */}
      <header className="flex flex-col w-full gap-8 lg:gap-10 mb-16">
        <div className="flex flex-col gap-4">
          {/* H1 타이틀 (Heading XL) */}
          <h1 className="text-heading-xl text-graygray-90">
            태풍
          </h1>
          {/* 수정일 (Detail M) */}
          <p className="text-detail-m text-graygray-70">
            최종 정보 수정일: 2025년 12월 16일
          </p>
        </div>

        {/* 3. 탭 (Tabs) */}
        <div className="flex flex-col lg:flex-row w-full" role="tablist">
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(index)}
                className={`
                  flex-1 h-14 flex items-center justify-center px-4 transition-all
                  /* 색상 및 보더 로직 */
                  ${isActive 
                    ? "bg-secondary-50 text-graygray-0" 
                    : "bg-white border border-secondary-5 text-graygray-70 hover:bg-graygray-5"
                  }
                  lg:first:rounded-l-lg lg:last:rounded-r-lg
                  ${!isActive && "lg:border-r-0 lg:last:border-r"}
                `}
              >
                {/* 탭 텍스트 (Title M) - 19px Bold */}
                <span className={`
                  text-title-m
                  ${isActive ? "" : "font-normal"} 
                  /* text-title-m은 기본 Bold이므로 비활성 시 normal로 덮어씀 */
                `}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. 안내 박스 */}
        <aside className="w-full p-6 bg-secondary-5 rounded-lg">
          {/* 본문 텍스트 (Body M) - 17px */}
          <p className="text-body-m text-graygray-90 leading-relaxed">
            * 탭을 선택하여 상황별(전, 중, 후) 행동요령을 확인하세요.
          </p>
        </aside>
      </header>

      {/* 5. 상세 내용 섹션 */}
      <section className="w-full flex flex-col gap-16 mb-20">
        <article className="flex flex-col gap-8">
          {/* 중제목 (Title XL) - 25px */}
          <h2 className="text-title-xl text-graygray-90">
            기상특보 예보 시
          </h2>

          <div className="flex flex-col gap-6">
            {/* 소제목 (Title M) - 19px */}
            <h3 className="text-title-m text-graygray-90">
              - 태풍의 진로 및 도달 시간을 파악합니다.
            </h3>

            <ol className="flex flex-col gap-4 pl-2">
              {detailedGuidelines.map((guideline, index) => (
                <li key={index} className="flex gap-2 text-body-m text-graygray-70 leading-relaxed">
                  <span className="shrink-0">{index + 1}.</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        {/* 6. 관련 영상 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {videoCards.map((card, index) => (
            <article
              key={index}
              className="flex flex-col gap-6 p-6 rounded-xl border border-graygray-40 bg-white"
            >
              <div className="flex flex-col gap-4">
                {/* 카드 타이틀 (Title L) - 21px */}
                <h3 className="text-title-l text-graygray-90 truncate">
                  {card.title}
                </h3>
                {/* 카드 설명 (Body M) - 17px */}
                <p className="text-body-m text-graygray-70 line-clamp-2 min-h-[50px]">
                  {card.description}
                </p>
              </div>
              
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-graygray-10">
                <img
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={card.title}
                  src={card.image}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TyphoonBeforeAction;