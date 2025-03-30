import React, { useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa';
import './VideoPlayer.css';


const VideoPlayer = ({ video, onBack, isClosing, startRect }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [style, setStyle] = useState({});
  const [setIsPlaying] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorType, setIndicatorType] = useState("play");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  let hideTimeout = null;

  // Entry animation logic
  useEffect(() => {
    if (!startRect) return;

    const { top, left, width, height } = startRect;
    const endWidth = window.innerWidth;
    const endHeight = window.innerHeight;

    const scaleX = width / endWidth;
    const scaleY = height / endHeight;
    const translateX = left + width / 2 - endWidth / 2;
    const translateY = top + height / 2 - endHeight / 2;

    // Initial transform
    setStyle({
      transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
      opacity: 0
    });

    // Trigger animation after 2 frames
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStyle({
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
          transition: 'all 0.5s ease-in-out',
        });
      });
    });
  }, [startRect]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
      triggerIndicator("play");
    } else {
      vid.pause();
      setIsPlaying(false);
      triggerIndicator("pause");
    }
  };

  const triggerIndicator = (type) => {
    setIndicatorType(type);
    setShowIndicator(true);
    setTimeout(() => setShowIndicator(false), 1000);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleProgressChange = (e) => {
    const vid = videoRef.current;
    const percent = e.target.value;
    vid.currentTime = (percent / 100) * duration;
    setCurrentTime(vid.currentTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
  
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
      setIsFullscreen(false);
    }
  };
  
  

  const resetInactivityTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => setShowControls(false), 2000);
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("mousemove", resetInactivityTimer);
    container.addEventListener("click", resetInactivityTimer);
    return () => {
      container.removeEventListener("mousemove", resetInactivityTimer);
      container.removeEventListener("click", resetInactivityTimer);
    };
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleTimeUpdate = () => {
      setCurrentTime(vid.currentTime);
      setDuration(vid.duration);
    };

    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Autoplay when video loads
useEffect(() => {
  const vid = videoRef.current;
  if (!vid) return;

  const tryPlay = () => {
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn("Autoplay blocked or failed:", err);
        });
    }
  };

  tryPlay();
}, []);


  return (
    <div
      ref={containerRef}
      style={style}
      className={`absolute top-0 left-0 w-full h-full bg-black flex flex-col items-center justify-center group ${
        isClosing ? 'scale-75 opacity-0 transition-all duration-500' : ''
      }`}
    >
      <button
  onClick={onBack}
  className="absolute top-4 left-4 z-20 p-2 text-white hover:scale-110 transition-transform"
  style={{ background: 'transparent' }}
>
  <FaArrowLeft size={24} />
</button>


      <div className="relative w-full h-full bg-black" onClick={togglePlay}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
        >
          <source src={video.src} type="video/mp4" />
          <track
            key={video.subtitles[0].lang}
            label={video.subtitles[0].label}
            kind="subtitles"
            srcLang={video.subtitles[0].lang}
            src={video.subtitles[0].src}
            default
          />
        </video>

        {showIndicator && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white opacity-80 animate-fadeOut">
  {indicatorType === "play" ? <FaPlay size={64} /> : <FaPause size={64} />}
</span>

          </div>
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent px-6 py-4 transition-opacity duration-500 ${
            showControls ? 'opacity-100' : 'opacity-0'
          } group-hover:opacity-100`}
        >
          <input
            type="range"
            className="w-full h-1 bg-gray-700 appearance-none rounded mb-2"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
          />
          <div className="flex justify-between items-center text-white text-sm">
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            <button
  onClick={(e) => {
    e.stopPropagation();
    toggleFullscreen();
  }}
  className="hover:text-red-500"
>
  {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
</button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
