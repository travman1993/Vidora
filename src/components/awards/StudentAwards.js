// src/components/awards/StudentAwards.js
import React from 'react';
import Link from 'next/link';

const StudentAwards = ({ winner, year }) => {
  if (!winner) return null;
  
  return (
    <div className="student-award-container">
      <h2 className="student-award-title">Student Filmmaker of the Year {year}</h2>
      
      <div className="student-winner-showcase">
        <div className="student-winner-badge">
          <i className="fas fa-graduation-cap"></i>
          <span>#1</span>
        </div>
        
        <div className="student-winner-content">
          <div className="student-winner-profile">
            <img 
              src={winner.filmmaker.profilePicture} 
              alt={winner.filmmaker.name} 
              className="student-winner-image"
            />
            
            <div className="student-winner-info">
              <Link href={`/profile/${winner.filmmaker.id}`} className="student-winner-name">
                {winner.filmmaker.name}
              </Link>
              
              <p className="student-winner-school">{winner.filmmaker.school}</p>
              
              {winner.filmmaker.location && (
                <p className="student-winner-location">
                  <i className="fas fa-map-marker-alt"></i> {winner.filmmaker.location}
                </p>
              )}
            </div>
          </div>
          
          <div className="student-winning-film">
            <h3>Winning Film</h3>
            
            <Link href={`/video/${winner.videoId}`} className="student-film-link">
              <div className="student-film-container">
                <img 
                  src={winner.thumbnailUrl} 
                  alt={winner.title} 
                  className="student-film-thumbnail"
                />
                <div className="student-film-overlay">
                  <i className="fas fa-play-circle"></i>
                </div>
              </div>
            </Link>
            
            <Link href={`/video/${winner.videoId}`} className="student-film-title">
              {winner.title}
            </Link>
            
            <p className="student-film-description">{winner.description}</p>
            
            <div className="student-film-stats">
              <div className="student-film-stat">
                <i className="fas fa-star"></i> {winner.averageRating.toFixed(1)}
              </div>
              <div className="student-film-stat">
                <i className="fas fa-calendar"></i> {year}
              </div>
            </div>
            
            <Link href={`/video/${winner.videoId}`} className="watch-student-film-button">
              Watch Film
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAwards;