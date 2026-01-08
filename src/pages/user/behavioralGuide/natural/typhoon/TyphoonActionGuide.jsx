import GuidePageTemplate from '@/components/shared/GuidePageTemplate';
import VideoCardList from '@/components/shared/VideoCardList';
// 위에서 작성한 데이터 파일 import (같은 폴더에 있다고 가정)
import { typhoonData } from './data';

const TyphoonActionGuide = () => {
  // 데이터 구조 분해 할당
  const { meta, contents } = typhoonData;

  return (
    // 공통 템플릿 사용 (API 연동 시 이곳에 로딩/에러 처리 추가 가능)
    <GuidePageTemplate 
      title={meta.title}
      lastUpdated={meta.lastUpdated}
      breadcrumbItems={meta.breadcrumbs}
      tabs={meta.tabs}
    >
      {/* Render Props 패턴 사용:
        템플릿이 관리하는 activeTab 상태를 받아와서
        해당하는 데이터(contents[activeTab])만 화면에 그립니다.
      */}
      {(activeTab) => {
        const currentContent = contents[activeTab];
        
        // 데이터 방어 로직 (혹시 탭 인덱스에 맞는 데이터가 없을 경우)
        if (!currentContent) return null;

        return (
          <>
            {/* 1. 텍스트 가이드라인 섹션 */}
            <article className="flex flex-col gap-8">
              {/* 중제목 (Title XL: 25px Bold) */}
              <h2 className="text-title-xl text-graygray-90">
                {currentContent.subTitle}
              </h2>

              <div className="flex flex-col gap-6">
                {/* 소제목 (Title M: 19px Bold) */}
                <h3 className="text-title-m text-graygray-90">
                  - 국민행동요령 상세
                </h3>

                {/* 가이드라인 리스트 */}
                <ol className="flex flex-col gap-4 pl-2">
                  {currentContent.guidelines.map((text, idx) => (
                    <li key={idx} className="flex gap-2 text-body-m text-graygray-70 leading-relaxed">
                      {/* 번호와 텍스트 정렬 유지 (shrink-0) */}
                      <span className="shrink-0">{idx + 1}.</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            {/* 2. 관련 영상 카드 섹션 (데이터가 빈 배열이면 자동 숨김 처리됨) */}
            <VideoCardList videos={currentContent.videos} />
          </>
        );
      }}
    </GuidePageTemplate>
  );
};

export default TyphoonActionGuide;