// src/components/video/VideoGrid.js
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, category, showFilters = true }) => {
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    let filtered = [...videos];
    
    // Apply category filter if specified
    if (category && category !== 'all') {
      filtered = filtered.filter(video => video.category === category);
    }
    
    // Apply duration filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'short':
          filtered = filtered.filter(video => video.duration < 300); // Less than 5 minutes
          break;
        case 'medium':
          filtered = filtered.filter(video => video.duration >= 300 && video.duration < 900); // 5-15 minutes
          break;
        case 'long':
          filtered = filtered.filter(video => video.duration >= 900); // Over 15 minutes
          break;
      }
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
    }
    
    setFilteredVideos(filtered);
  }, [videos, category, activeFilter, sortBy]);
  
  return (
    <div className="video-grid-container">
      {showFilters && (
        <div className="filter-controls">
          <div className="duration-filters">
            <button 
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
            >
              All Durations
            </button>
            <button 
              className={activeFilter === 'short' ? 'active' : ''}
              onClick={() => setActiveFilter('short')}
            >
              Short (< 5 min)
            </button>
            <button 
              className={activeFilter === 'medium' ? 'active' : ''}
              onClick={() => setActiveFilter('medium')}
            >
              Medium (5-15 min)
            </button>
            <button 
              className={activeFilter === 'long' ? 'active' : ''}
              onClick={() => setActiveFilter('long')}
            >
              Long (> 15 min)
            </button>
          </div>
          
          <div className="sort-controls">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : (
          <div className="no-videos-message">
            <p>No videos match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;