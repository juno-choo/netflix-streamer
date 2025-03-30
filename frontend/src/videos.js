// src/videos.js
const videos = [
    {
      id: 1,
      title: 'Finding Nemo',
      thumbnail: 'https://via.placeholder.com/300x170.png?text=Panda+Adventure',
      src: '/videos/panda-adventure.mp4',
      subtitles: [
        { label: 'English', src: '/subtitles/panda-en.vtt', lang: 'en' },
        { label: 'Spanish', src: '/subtitles/panda-es.vtt', lang: 'es' }
      ]
    },
    {
      id: 2,
      title: 'Drama in the Rain',
      thumbnail: 'https://via.placeholder.com/300x170.png?text=Drama+Rain',
      src: '/videos/drama-rain.mp4',
      subtitles: [
        { label: 'English', src: '/subtitles/drama-en.vtt', lang: 'en' }
      ]
    }
  ];
  
  export default videos;
  