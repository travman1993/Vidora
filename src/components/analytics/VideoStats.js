// src/components/analytics/VideoStats.js
import React from 'react';
import { formatViews } from '../../utils/formatViews';
import { formatDate } from '../../utils/formatDate';

const VideoStats = ({ video, timeframe = 'all' }) => {
  if (!video) return null;
  
  return (
    <div className="video-stats-card">
      <div className="stats-header">
        <h3 className="stats-title">{video.title}</h3>
        <p className="stats-date">
          Uploaded on {formatDate(video.uploadDate)}
        </p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-eye"></i>
          </div>
          <div className="stat-info">
            <h4>Total Views</h4>
            <p className="stat-value">{formatViews(video.views)}</p>
            {video.viewsChange !== undefined && (
              <p className="stat-change">
                {video.viewsChange >= 0 ? (
                  <span className="positive">+{video.viewsChange}%</span>
                ) : (
                  <span className="negative">{video.viewsChange}%</span>
                )}
                <span className="period">vs. previous {timeframe}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h4>Average Rating</h4>
            <p className="stat-value">{video.averageRating.toFixed(1)}</p>
            <p className="stat-detail">from {video.ratingCount} ratings</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h4>Avg. Watch Time</h4>
            <p className="stat-value">{video.averageWatchTime}%</p>
            <p className="stat-detail">of total duration</p>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-share-alt"></i>
          </div>
          <div className="stat-info">
            <h4>Shares</h4>
            <p className="stat-value">{video.shares}</p>
            {video.sharesChange !== undefined && (
              <p className="stat-change">
                {video.sharesChange >= 0 ? (
                  <span className="positive">+{video.sharesChange}%</span>
                ) : (
                  <span className="negative">{video.sharesChange}%</span>
                )}
                <span className="period">vs. previous {timeframe}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="stats-details">
        <div className="detail-item">
          <h4>Viewer Demographics</h4>
          <div className="demographics-chart">
            {/* This would be a chart in a real implementation */}
            <div className="chart-placeholder">
              <p>Viewer location and demographics chart</p>
            </div>
          </div>
        </div>
        
        <div className="detail-item">
          <h4>Traffic Sources</h4>
          <ul className="traffic-sources">
            {video.trafficSources?.map((source, index) => (
              <li key={index} className="traffic-source">
                <span className="source-name">{source.name}</span>
                <span className="source-value">{source.percentage}%</span>
                <div className="source-bar">
                  <div 
                    className="source-bar-fill" 
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VideoStats;