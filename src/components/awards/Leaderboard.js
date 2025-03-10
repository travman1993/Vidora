// src/components/awards/Leaderboard.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatViews } from '../../utils/formatViews';

const Leaderboard = ({ initialData, category = 'all', isMonthly = true }) => {
  const [leaderboardData, setLeaderboardData] = useState(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [timeframe, setTimeframe] = useState(isMonthly ? 'monthly' : 'yearly');
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'short-film', name: 'Short Films' },
    { id: 'commercial', name: 'Commercials' },
    { id: 'music-video', name: 'Music Videos' },
    { id: 'indie-film', name: 'Indie Films' },
    { id: 'promotional', name: 'Promotional Videos' },
    { id: 'event', name: 'Event Highlights' }
  ];
  
  useEffect(() => {
    // If we don't have initial data or if category or timeframe changes, fetch data
    if (!initialData || selectedCategory !== category || 
        (isMonthly && timeframe !== 'monthly') || (!isMonthly && timeframe !== 'yearly')) {
      fetchLeaderboardData();
    }
  }, [selectedCategory, timeframe]);
  
  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      const response = await fetch(`/api/leaderboard?category=${selectedCategory}&timeframe=${timeframe}`);
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">
          {timeframe === 'monthly' ? 'Monthly' : 'Yearly'} Top 5
        </h2>
        
        <div className="leaderboard-filters">
          <div className="category-filter">
            <label htmlFor="category-select">Category:</label>
            <select 
              id="category-select"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="timeframe-toggle">
            <button 
              className={timeframe === 'monthly' ? 'active' : ''}
              onClick={() => handleTimeframeChange('monthly')}
            >
              Monthly
            </button>
            <button 
              className={timeframe === 'yearly' ? 'active' : ''}
              onClick={() => handleTimeframeChange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="leaderboard-loading">
          <p>Loading leaderboard data...</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="leaderboard-empty">
          <p>No videos found for this category and timeframe.</p>
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className="leaderboard-table-header">
            <div className="rank-column">Rank</div>
            <div className="video-column">Video</div>
            <div className="filmmaker-column">Filmmaker</div>
            <div className="stats-column">Stats</div>
          </div>
          
          {leaderboardData.map((entry, index) => (
            <div key={entry.videoId} className="leaderboard-row">
              <div className="rank-column">
                <span className={`rank rank-${index + 1}`}>#{index + 1}</span>
              </div>
              
              <div className="video-column">
                <Link href={`/video/${entry.videoId}`} className="video-thumbnail-link">
                  <img 
                    src={entry.thumbnailUrl} 
                    alt={entry.title} 
                    className="video-thumbnail"
                  />
                </Link>
                
                <div className="video-info">
                  <Link href={`/video/${entry.videoId}`} className="video-title">
                    {entry.title}
                  </Link>
                  <span className="video-category">{entry.category}</span>
                </div>
              </div>
              
              <div className="filmmaker-column">
                <Link href={`/profile/${entry.filmmaker.id}`} className="filmmaker-link">
                  {entry.filmmaker.name}
                </Link>
              </div>
              
              <div className="stats-column">
                <div className="stat">
                  <i className="fas fa-eye"></i> {formatViews(entry.views)}
                </div>
                <div className="stat">
                  <i className="fas fa-star"></i> {entry.averageRating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;