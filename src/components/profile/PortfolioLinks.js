// src/components/profile/PortfolioLinks.js
import React from 'react';

const PortfolioLinks = ({ portfolioLinks, socialLinks }) => {
  const renderSocialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'instagram':
        return <i className="fab fa-instagram"></i>;
      case 'twitter':
        return <i className="fab fa-twitter"></i>;
      case 'facebook':
        return <i className="fab fa-facebook-f"></i>;
      case 'linkedin':
        return <i className="fab fa-linkedin-in"></i>;
      case 'youtube':
        return <i className="fab fa-youtube"></i>;
      case 'vimeo':
        return <i className="fab fa-vimeo-v"></i>;
      case 'imdb':
        return <i className="fab fa-imdb"></i>;
      case 'website':
        return <i className="fas fa-globe"></i>;
      default:
        return <i className="fas fa-link"></i>;
    }
  };
  
  return (
    <div className="profile-links">
      {portfolioLinks && portfolioLinks.length > 0 && (
        <div className="portfolio-links">
          <h3>Portfolio</h3>
          <ul>
            {portfolioLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                  {link.title || link.url}
                </a>
                {link.description && <p className="link-description">{link.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {socialLinks && socialLinks.length > 0 && (
        <div className="social-links">
          <h3>Connect</h3>
          <div className="social-icons">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                title={link.type}
              >
                {renderSocialIcon(link.type)}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioLinks;