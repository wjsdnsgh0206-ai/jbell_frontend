// src/components/shared/VideoCardList.jsx

const VideoCard = ({ title, description, image }) => {
  return (
    <article className="flex flex-col gap-6 p-6 rounded-xl border border-graygray-40 bg-white h-full hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <h3 className="text-title-l text-graygray-90 truncate" title={title}>{title}</h3>
        {description && <p className="text-body-m text-graygray-70 line-clamp-2 min-h-[50px]">{description}</p>}
      </div>
      
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-graygray-10 mt-auto border border-graygray-20">
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            // 로컬에 이미지가 없다면 안정적인 외부 더미 이미지 사용
            e.target.src = "https://dummyimage.com/600x400/e0e0e0/757575.png&text=No+Image";
          }}
        />
      </div>
    </article>
  );
};
// ... (VideoCardList 부분은 동일)