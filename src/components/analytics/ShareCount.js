// src/components/analytics/ShareCount.js
import React, { useState, useEffect } from 'react';

const ShareCount = ({ videoId }) => {
  const [shareData, setShareData] = useState({
    total: 0,
    platforms: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchShareData();
  }, [videoId]);
  
  const fetchShareData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/shares?videoId=${videoId}`);
      const data = await response.json();
      setShareData(data);
    } catch (error) {
      console.error('Error fetching share data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="loading-shares">Loading share data...</div>;
  }
  
  return (
    <div className="share-count-widget">
      <div className="share-total">
        <h3>Total Shares</h3>
        <p className="share-number">{shareData.total}</p>
      </div>
      
      <div className="share-platforms">
        <h4>By Platform</h4>
        <ul className="platform-list">
          {shareData.platforms.map((platform, index) => (
            <li key={index} className="platform-item">
              <span className="platform-icon">
                {platform.platform === 'facebook' && <i className="fab fa-facebook"></i>}
                {platform.platform === 'twitter' && <i className="fab fa-twitter"></i>}
                {platform.platform === 'linkedin' && <i className="fab fa-linkedin"></i>}
                {platform.platform === 'email' && <i className="fas fa-envelope"></i>}
                {platform.platform === 'copy' && <i className="fas fa-link"></i>}
                {platform.platform === 'other' && <i className="fas fa-share-alt"></i>}
              </span>
              <span className="platform-name">{platform.platform}</span>
              <span className="platform-count">{platform.count}</span>
              <span className="platform-percent">
                ({Math.round((platform.count / shareData.total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="share-cta">
        <p>Want more shares?</p>
        <button className="share-now-button">
          <i className="fas fa-share-alt"></i> Share Now
        </button>
      </div>
    </div>
  );
};

export default ShareCount;