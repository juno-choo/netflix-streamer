// VideoThumbnail.js
import React, { useRef } from 'react';

const VideoThumbnail = ({ video, onClick }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div
      className="relative cursor-pointer group transform hover:scale-105 transition-transform duration-300 overflow-hidden rounded-lg"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-48">
        <video
          ref={videoRef}
          src={video.src}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg group-hover:opacity-100 opacity-0 transition-opacity duration-300"
        />
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg group-hover:opacity-0 opacity-100 transition-opacity duration-300"
        />
      </div>
    
      <h2 className="text-white text-lg mt-2 text-center">{video.title}</h2>
    </div>
  );
};

export default VideoThumbnail;
