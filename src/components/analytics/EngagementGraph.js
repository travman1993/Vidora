// src/components/analytics/EngagementGraph.js
import React, { useState, useEffect } from 'react';

const EngagementGraph = ({ videoId, type = 'views', timeframe = 'month' }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchEngagementData();
  }, [videoId, type, timeframe]);
  
  const fetchEngagementData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/engagement?videoId=${videoId}&type=${type}&timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch engagement data');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderChart = () => {
    // This would typically use a chart library like Recharts
    // For now, we'll just show a placeholder
    return (
      <div className="chart-placeholder">
        <p>Engagement {type} over {timeframe} would display here</p>
        <div className="mock-chart">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="chart-bar" 
              style={{ height: `${item.value / 2}%` }}
              title={`${item.date}: ${item.value}`}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return <div className="loading-chart">Loading engagement data...</div>;
  }
  
  if (error) {
    return <div className="error-chart">Error: {error}</div>;
  }
  
  return (
    <div className="engagement-graph">
      <div className="graph-controls">
        <div className="type-selector">
          <button 
            className={type === 'views' ? 'active' : ''} 
            onClick={() => setType('views')}
          >
            Views
          </button>
          <button 
            className={type === 'ratings' ? 'active' : ''} 
            onClick={() => setType('ratings')}
          >
            Ratings
          </button>
          <button 
            className={type === 'watchTime' ? 'active' : ''} 
            onClick={() => setType('watchTime')}
          >
            Watch Time
          </button>
          <button 
            className={type === 'shares' ? 'active' : ''} 
            onClick={() => setType('shares')}
          >
            Shares
          </button>
        </div>
        
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'week' ? 'active' : ''} 
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''} 
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={timeframe === 'year' ? 'active' : ''} 
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
          <button 
            className={timeframe === 'all' ? 'active' : ''} 
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>
      
      <div className="graph-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default EngagementGraph;