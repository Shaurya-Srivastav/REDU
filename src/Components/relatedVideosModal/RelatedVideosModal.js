import React, { useState, useEffect } from 'react';
import './RelatedVideosModal.css';

const RelatedVideosModal = ({ book, onClose }) => {
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateVideoSearchQuery = async () => {
      try {
        const response = await fetch('http://150.136.47.221:5000/api/generate-video-search-query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchQuery: book.Title, pageText: book.Page_Text }),
        });
        const data = await response.json();
        setVideoSearchQuery(data.videoSearchQuery);
      } catch (error) {
        console.error('Error generating video search query:', error);
      }
    };

    generateVideoSearchQuery();
  }, [book]);

  useEffect(() => {
    const searchRelatedVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://150.136.47.221:5000/api/search-related-videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoSearchQuery }),
        });
        const data = await response.json();
        setRelatedVideos(data.videos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error searching related videos:', error);
        setIsLoading(false);
      }
    };

    if (videoSearchQuery) {
      searchRelatedVideos();
    }
  }, [videoSearchQuery]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="related-videos-modal-overlay">
      <div className="related-videos-modal">
        <div className="related-videos-modal-header">
          <h2>Related Videos</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="related-videos-modal-body">
          {isLoading ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="related-videos-grid">
              {relatedVideos.slice(0, 25).map((video, index) => (
                <div key={index} className="video-item" onClick={() => handleVideoClick(video)}>
                  <img src={video.thumbnail} alt={video.title} />
                  <p>{video.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedVideo && (
        <div className="video-overlay" onClick={handleCloseVideo}>
          <div className="video-container">
            <iframe
              title={selectedVideo.title}
              width="100%"
              height="100%"
              src={selectedVideo.url}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedVideosModal;