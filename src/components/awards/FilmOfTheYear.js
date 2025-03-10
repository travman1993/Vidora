// src/components/awards/FilmOfTheYear.js
import React from 'react';
import Link from 'next/link';
import { formatViews } from '../../utils/formatViews';

const FilmOfTheYear = ({ winner, runnerUps }) => {
  if (!winner) return null;
  
  return (
    <div className="film-of-year-container">
      <h2 className="awards-title">Film of the Year</h2>
      
      <div className="winner-showcase">
        <div className="winner-badge">
          <i className="fas fa-trophy"></i>
          <span>#1</span>
        </div>
        
        <div className="winner-content">
          <Link href={`/video/${winner.videoId}`} className="winner-video-link">
            <div className="winner-video-container">
              <img 
                src={winner.thumbnailUrl} 
                alt={winner.title} 
                className="winner-thumbnail"
              />
              <div className="winner-overlay">
                <i className="fas fa-play-circle"></i>
              </div>
            </div>
          </Link>
          
          <div className="winner-info">
            <h3 className="winner-title">{winner.title}</h3>
            
            <Link href={`/profile/${winner.filmmaker.id}`} className="winner-filmmaker">
              {winner.filmmaker.name}
            </Link>
            
            <div className="winner-stats">
              <div className="winner-stat">
                <i className="fas fa-eye"></i> {formatViews(winner.views)}
              </div>
              <div className="winner-stat">
                <i className="fas fa-star"></i> {winner.averageRating.toFixed(1)}
              </div>
              <div className="winner-stat">
                <i className="fas fa-calendar"></i> {winner.year}
              </div>
            </div>
            
            <p className="winner-description">{winner.description}</p>
            
            <Link href={`/video/${winner.videoId}`} className="watch-button">
              Watch Now
            </Link>
          </div>
        </div>
      </div>
      
      {runnerUps && runnerUps.length > 0 && (
        <div className="runner-ups">
          <h3 className="runner-ups-title">Runner-Ups</h3>
          
          <div className="runner-ups-grid">
            {runnerUps.map((runnerUp, index) => (
              <div key={runnerUp.videoId} className="runner-up-card">
                <div className="runner-up-badge">
                  <span>#{index + 2}</span>
                </div>
                
                <Link href={`/video/${runnerUp.videoId}`} className="runner-up-thumbnail-link">
                  <img 
                    src={runnerUp.thumbnailUrl} 
                    alt={runnerUp.title} 
                    className="runner-up-thumbnail"
                  />
                </Link>
                
                <div className="runner-up-info">
                  <Link href={`/video/${runnerUp.videoId}`} className="runner-up-title">
                    {runnerUp.title}
                  </Link>
                  
                  <Link href={`/profile/${runnerUp.filmmaker.id}`} className="runner-up-filmmaker">
                    {runnerUp.filmmaker.name}
                  </Link>
                  
                  <div className="runner-up-stats">
                    <div className="runner-up-stat">
                      <i className="fas fa-star"></i> {runnerUp.averageRating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmOfTheYear;