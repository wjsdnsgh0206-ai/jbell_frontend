import { useState } from 'react';
import { Play } from 'lucide-react'; // 아이콘 라이브러리 활용 예시

const VideoCard = ({ title, description, image, videoLink }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const hasContent = title || description;
  const fallbackImage = "https://dummyimage.com/600x400/e0e0e0/757575.png&text=No+Image";

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-graygray-20 overflow-hidden hover:shadow-md transition-shadow group h-full">
      {/* 미디어 영역 */}
      <div 
        className={`relative w-full bg-graygray-10 overflow-hidden ${hasContent ? 'aspect-video' : 'h-full min-h-[200px]'} ${videoLink ? 'cursor-pointer' : ''}`}
        onClick={videoLink ? handlePlay : undefined}
      >
        {isPlaying && videoLink ? (
          <iframe
            src={videoLink}
            title={title || "관련 영상"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={image || fallbackImage}
              alt={title || "이미지"}
              className={`w-full h-full object-cover transition-transform duration-500 ${videoLink ? 'group-hover:scale-105' : ''}`}
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            
            {/* 플레이 버튼 오버레이 */}
            {videoLink && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <div className="w-14 h-14 rounded-full bg-secondary-50/90 text-white flex items-center justify-center shadow-xl backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 텍스트 영역 */}
      {hasContent && (
        <div className="flex flex-col gap-2 p-5 border-t border-graygray-10 bg-white">
          {title && <h3 className="text-title-m text-graygray-90 line-clamp-2 leading-snug">{title}</h3>}
          {description && <p className="text-body-s text-graygray-70 line-clamp-2">{description}</p>}
        </div>
      )}
    </article>
  );
};

const VideoCardList = ({ videos = [] }) => {
  if (!videos.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {videos.map((video, index) => (
        <VideoCard key={`video-${index}`} {...video} />
      ))}
    </div>
  );
};

export default VideoCardList;