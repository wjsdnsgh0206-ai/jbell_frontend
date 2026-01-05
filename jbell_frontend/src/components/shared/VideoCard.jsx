const VideoCard = ({ title, description, image }) => {
  return (
    <article className="flex flex-col gap-6 p-6 rounded-xl border border-graygray-40 bg-white h-full hover:shadow-1 transition-shadow duration-200">
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-4">
        {/* 타이틀: 한 줄 말줄임 */}
        <h3 className="text-title-l text-graygray-90 truncate" title={title}>
          {title}
        </h3>
        {/* 설명: 두 줄 말줄임 + 최소 높이 확보 */}
        <p className="text-body-m text-graygray-70 line-clamp-2 min-h-[50px]">
          {description}
        </p>
      </div>
      
      {/* 썸네일 영역 */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-graygray-10 mt-auto">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          alt={title}
          src={image}
        />
      </div>
    </article>
  );
};

export default VideoCard;