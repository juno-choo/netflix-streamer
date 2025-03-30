// App.js
import React, { useState } from 'react';
import videos from './videos';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';

function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [startRect, setStartRect] = useState(null);

  const handleVideoSelect = (video, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setStartRect(rect);
    setSelectedVideo(video);
  };

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedVideo(null);
      setIsClosing(false);
      setStartRect(null);
    }, 600); // smooth exit
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      <h1 className="text-4xl font-bold text-white mb-8">Jun Hoe's Netflix 🎥</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoThumbnail
            key={video.id}
            video={video}
            onClick={(e) => handleVideoSelect(video, e)}
          />
        ))}
      </div>

      {selectedVideo && (
        <>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-500" />
          <div className="absolute inset-0 z-50">
            <VideoPlayer
              video={selectedVideo}
              onBack={handleBack}
              isClosing={isClosing}
              startRect={startRect}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
