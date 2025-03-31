import React, { useRef, useState } from "react";
import videoFile from "../../assets/发现更多精彩视频 - 抖音搜索_3.mp4";

const UserReelsCard = ({ views = 0, title = "", isPinned = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = (e) => {
    e.preventDefault(); // Prevent default behavior
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Prevent drag events
  const preventDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Prevent right click
  const preventRightClick = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="relative aspect-[3/4] w-full bg-[#0a0a0a]"
      onDragStart={preventDrag}
      onDrop={preventDrag}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onContextMenu={preventRightClick}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        playsInline
        controls={false}
        draggable={false}
        style={{ pointerEvents: "none" }}
      >
        <source src={videoFile} type="video/mp4" />
      </video>

      {/* Clickable overlay for play/pause */}
      <div
        className="absolute inset-0 z-10"
        onClick={togglePlay}
        onContextMenu={preventRightClick}
        style={{ cursor: "pointer" }}
      >
        {/* Pinned label */}
        {isPinned && (
          <div className="absolute top-2 left-2 bg-[#ff4757] text-white px-2 py-0.5 text-sm rounded">
            Đã ghim
          </div>
        )}

        {/* Play icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3 bg-black/50 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* View count and title */}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center mb-1">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-1"
              fill="currentColor"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <span>{views}</span>
          </div>
          <p className="text-sm truncate">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default UserReelsCard;
