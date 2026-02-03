import VideoCardList from '@/components/shared/VideoCardList';

/**
 * 탭 내부의 섹션과 스텝을 렌더링하는 컴포넌트
 */
const BehaviorContentRenderer = ({ content }) => {
  if (!content) {
    return (
      <div className="py-20 text-center text-graygray-60">
        해당 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 animate-fade-in-up">
      {content.sections.map((section, secIdx) => (
        <article key={`sec-${secIdx}`} className="flex flex-col gap-10">

          {/* 섹션 헤더 */}
          {section.title && (
            <div className="flex items-center gap-3 pb-3 border-b-2 border-graygray-20">
              <span className="w-1.5 h-6 bg-secondary-50 rounded-sm"></span>
              <h3 className="text-title-xl text-graygray-90 font-bold">{section.title}</h3>
            </div>
          )}

          {/* 스텝 리스트 */}
          <div className="flex flex-col gap-8">
            {section.steps.map((step, stepIdx) => {
              
              // 1. 미디어 타입 (영상/이미지)
              if (step.type === 'MEDIA') {
                const mediaItems = [];
                if (step.videoLink) mediaItems.push({ title: step.mediaTitle, videoLink: step.videoLink });
                step.images.forEach(img => mediaItems.push({ image: img }));
                
                return (
                  <div key={`step-${stepIdx}`} className="w-full">
                    <VideoCardList videos={mediaItems} />
                  </div>
                );
              }

              // 2. [추가] Q&A 타입 렌더링 (질문과 답변 스타일)
              if (step.type === 'QA') {
                return (
                  <div key={`step-${stepIdx}`} className="bg-primary-5 rounded-2xl p-6 border-l-4 border-primary-50">
                    <div className="flex gap-3">
                      <span className="text-primary-60 font-black text-xl italic">Q.</span>
                      <div 
                        className="text-body-m text-graygray-90 font-semibold leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: step.content }} 
                      />
                    </div>
                  </div>
                );
              }

              // 3. 가이드라인 텍스트 타입
              if (step.type === 'GUIDELINE') {
                return (
                  <div key={`step-${stepIdx}`} className="bg-white border border-graygray-20 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <ul className="flex flex-col gap-4">
                      {step.guidelines.map((text, txtIdx) => (
                        <li key={txtIdx} className="flex gap-3 text-body-m text-graygray-80 leading-relaxed">
                          {/* 리스트 불렛 포인트 (커스텀) */}
                          <span className="shrink-0 w-1.5 h-1.5 mt-2.5 bg-graygray-30 rounded-full" />
                          <div 
                             dangerouslySetInnerHTML={{ __html: text }} 
                             className="[&>p]:mb-1 last:[&>p]:mb-0 flex-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>
      ))}
    </div>
  );
};

export default BehaviorContentRenderer;