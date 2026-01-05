import VideoCard from './VideoCard'; // 분리한 컴포넌트 import

const VideoCardList = ({ videos = [] }) => {
  // 데이터가 없으면 렌더링 안 함
  if (!videos || videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          title={video.title}
          description={video.description}
          image={video.image}
        />
      ))}
    </div>
  );
};

export default VideoCardList;