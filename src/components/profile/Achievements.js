// src/components/profile/Achievements.js
import React from 'react';

const Achievements = ({ achievements }) => {
  // Group achievements by type
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const type = achievement.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(achievement);
    return acc;
  }, {});
  
  const renderAchievementIcon = (achievement) => {
    // Determine icon based on achievement type
    if (achievement.icon) {
      return <i className={achievement.icon}></i>;
    }
    
    switch (achievement.type) {
      case 'Film of the Month':
        return <i className="fas fa-trophy"></i>;
      case 'Film of the Year':
        return <i className="fas fa-award"></i>;
      case 'Student Award':
        return <i className="fas fa-graduation-cap"></i>;
      case 'Top 5':
        return <i className="fas fa-star"></i>;
      default:
        return <i className="fas fa-medal"></i>;
    }
  };
  
  return (
    <div className="achievements-section">
      <h3>Achievements</h3>
      
      {Object.entries(groupedAchievements).map(([type, typeAchievements]) => (
        <div key={type} className="achievement-group">
          <h4>{type}</h4>
          <div className="achievements-list">
            {typeAchievements.map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className="achievement-icon">
                  {renderAchievementIcon(achievement)}
                </div>
                <div className="achievement-details">
                  <p className="achievement-title">{achievement.title}</p>
                  {achievement.date && (
                    <p className="achievement-date">
                      {new Date(achievement.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}
                  {achievement.description && (
                    <p className="achievement-description">{achievement.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;