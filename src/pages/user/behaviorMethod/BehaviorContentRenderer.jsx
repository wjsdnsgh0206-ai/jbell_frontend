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
        <article key={`sec-${secIdx}`} className="flex flex-col gap-8">

          {/* 섹션 헤더 */}
          {section.title && (
            <div className="flex items-center gap-3 pb-2 border-b-2 border-graygray-20">
              <span className="w-1.5 h-6 bg-secondary-50 rounded-sm"></span>
              <h3 className="text-title-xl text-graygray-90">{section.title}</h3>
            </div>
          )}

          {/* 스텝 리스트 */}
          <div className="flex flex-col gap-8">
            {section.steps.map((step, stepIdx) => {
              // 1. 미디어 타입 (영상/이미지)
              if (step.type === 'MEDIA') {
                const mediaItems = [];
                // 비디오
                if (step.videoLink) {
                    mediaItems.push({ title: step.mediaTitle, videoLink: step.videoLink });
                }
                // 이미지 (배열 순회)
                step.images.forEach(img => {
                    mediaItems.push({ image: img }); // 이미지는 보통 타이틀 없이 처리
                });
                
                return (
                    <div key={`step-${stepIdx}`} className="w-full">
                        <VideoCardList videos={mediaItems} />
                    </div>
                );
              }

              // 2. 가이드라인 텍스트 타입
              if (step.type === 'GUIDELINE') {
                return (
                  <div key={`step-${stepIdx}`} className="bg-white border border-graygray-20 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <ul className="flex flex-col gap-3">
                      {step.guidelines.map((text, txtIdx) => (
                        <li key={txtIdx} className="text-body-m text-graygray-80 leading-relaxed">
                          {/* [수정 후] HTML 태그를 해석해서 보여줌 */}
                          <div 
                             dangerouslySetInnerHTML={{ __html: text }} 
                             className="[&>p]:mb-1 last:[&>p]:mb-0" // Quill의 p 태그 스타일 보정 (Tailwind)
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