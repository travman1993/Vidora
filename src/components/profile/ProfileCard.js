// src/components/profile/ProfileCard.js
import React from 'react';
import Link from 'next/link';
import PortfolioLinks from './PortfolioLinks';
import Achievements from './Achievements';

const ProfileCard = ({ filmmaker, isPreview = false }) => {
  if (!filmmaker) return null;
  
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={filmmaker.profilePicture || "/icons/default-avatar.png"} 
            alt={filmmaker.name} 
            className="profile-image"
          />
          {filmmaker.isVerified && (
            <span className="verified-badge" title="Verified Filmmaker">
              <i className="fas fa-check-circle"></i>
            </span>
          )}
        </div>
        
        <div className="profile-header-info">
          <h1 className="profile-name">{filmmaker.name}</h1>
          
          {filmmaker.isStudent && (
            <span className="student-badge">
              Student Filmmaker
            </span>
          )}
          
          <p className="profile-location">
            <i className="fas fa-map-marker-alt"></i> {filmmaker.location}
          </p>
          
          <p className="profile-joined">
            Member since {new Date(filmmaker.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      
      {!isPreview && (
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{filmmaker.totalVideos}</span>
            <span className="stat-label">Videos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{filmmaker.totalViews.toLocaleString()}</span>
            <span className="stat-label">Views</span>
          </div>
          <div className="stat">
            <span className="stat-value">{filmmaker.averageRating.toFixed(1)}</span>
            <span className="stat-label">Avg. Rating</span>
          </div>
        </div>
      )}
      
      <div className="profile-bio">
        <h3>About</h3>
        <p>{filmmaker.bio}</p>
      </div>
      
      <PortfolioLinks 
        portfolioLinks={filmmaker.portfolioLinks}
        socialLinks={filmmaker.socialLinks}
      />
      
      {!isPreview && filmmaker.achievements && filmmaker.achievements.length > 0 && (
        <Achievements achievements={filmmaker.achievements} />
      )}
      
      {isPreview ? (
        <Link href={`/profile/${filmmaker.id}`} className="view-full-profile">
          View Full Profile
        </Link>
      ) : null}
    </div>
  );
};

export default ProfileCard;