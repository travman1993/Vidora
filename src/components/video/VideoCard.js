// src/components/video/VideoCard.js
import React, { useState } from 'react';
import Link from 'next/link';
import { formatViews } from '../../utils/formatViews';
import { formatDate } from '../../utils/formatDate';

const VideoCard = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      if (isHovered) {
        setIsPlaying(true);
      }
    }, 700); // Start playing after 700ms hover
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
  };
  
  return (
    <div 
      className="video-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/video/${video.id}`}>
        <div className="video-thumbnail">
          {isPlaying && video.trailerUrl ? (
            <video 
              src={video.trailerUrl} 
              autoPlay 
              muted 
              className="preview-video"
            />
          ) : (
            <img 
              src={video.coverImageUrl || `/previews/${video.id}.jpg`} 
              alt={video.title} 
              className="thumbnail-image"
            />
          )}
          
          <div className="video-duration">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
          </div>
          
          {video.awards && video.awards.length > 0 && (
            <div className="video-awards">
              {video.awards.map(award => (
                <span key={award.id} className="award-badge" title={award.name}>
                  {award.icon}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
          
          <div className="video-meta">
            <Link href={`/profile/${video.filmmaker.id}`} className="filmmaker-name">
              {video.filmmaker.name}
            </Link>
            
            <div className="video-stats">
              <span className="views">{formatViews(video.views)}</span>
              <span className="rating">★ {video.averageRating.toFixed(1)}</span>
              <span className="upload-date">{formatDate(video.uploadDate)}</span>
            </div>
            
            <p className="video-category">{video.category}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;