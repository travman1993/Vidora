import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

/**
 * Custom hook for fetching and managing leaderboard data
 * 
 * @param {Object} options - Hook options
 * @param {string} options.category - Video category to filter by (optional)
 * @param {string} options.timeframe - Timeframe for rankings ('month', 'year', 'all')
 * @param {number} options.limit - Number of videos to fetch
 * @returns {Object} Leaderboard state and handlers
 */
export const useLeaderboard = ({ 
  category = 'all', 
  timeframe = 'month', 
  limit = 5
} = {}) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch leaderboard data from API
   */
  const fetchLeaderboard = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Merge default params with any additional params
      const queryParams = {
        category: category !== 'all' ? category : undefined,
        timeframe,
        limit,
        ...params
      };
      
      const data = await api.get('/leaderboard', queryParams);
      setLeaderboardData(data);
      setLastUpdated(new Date());
      return data;
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [category, timeframe, limit]);

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  /**
   * Update leaderboard timeframe
   * @param {string} newTimeframe - New timeframe ('month', 'year', 'all')
   */
  const updateTimeframe = useCallback((newTimeframe) => {
    fetchLeaderboard({ timeframe: newTimeframe });
  }, [fetchLeaderboard]);

  /**
   * Update leaderboard category
   * @param {string} newCategory - New category filter
   */
  const updateCategory = useCallback((newCategory) => {
    fetchLeaderboard({ category: newCategory });
  }, [fetchLeaderboard]);

  /**
   * Get a specific ranking by position
   * @param {number} position - Ranking position (1-based)
   * @returns {Object|null} The video at the specified position or null
   */
  const getRankingByPosition = useCallback((position) => {
    const index = position - 1; // Convert from 1-based to 0-based index
    return leaderboardData[index] || null;
  }, [leaderboardData]);

  /**
   * Check if a video is in the top rankings
   * @param {string} videoId - Video ID to check
   * @returns {number|null} The ranking position (1-based) or null if not ranked
   */
  const getVideoRanking = useCallback((videoId) => {
    const index = leaderboardData.findIndex(video => video.id === videoId);
    return index !== -1 ? index + 1 : null;
  }, [leaderboardData]);

  return {
    leaderboardData,
    loading,
    error,
    lastUpdated,
    fetchLeaderboard,
    updateTimeframe,
    updateCategory,
    getRankingByPosition,
    getVideoRanking
  };
};

export default useLeaderboard;