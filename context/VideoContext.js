import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

// Create the video context
export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch featured videos and categories in parallel
        const [videosResponse, categoriesResponse] = await Promise.all([
          api.get('/videos/featured'),
          api.get('/videos/categories')
        ]);
        
        setFeaturedVideos(videosResponse);
        setCategories(categoriesResponse);
      } catch (err) {
        console.error('Error fetching initial video data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /**
   * Fetch videos by category
   * @param {string} categoryId - Category ID
   * @param {Object} options - Query options (limit, page, sort)
   * @returns {Promise<Array>} - Array of videos
   */
  const fetchVideosByCategory = useCallback(async (categoryId, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/videos/category/${categoryId}`, options);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch popular videos
   * @param {Object} options - Query options (limit, timeframe)
   * @returns {Promise<Array>} - Array of popular videos
   */
  const fetchPopularVideos = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/videos/popular', options);
      setPopularVideos(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single video by ID
   * @param {string} videoId - Video ID
   * @returns {Promise<Object>} - Video data
   */
  const fetchVideo = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/videos/${videoId}`);
      setActiveVideo(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search videos by query
   * @param {string} query - Search query
   * @param {Object} options - Search options (filters, sort, page)
   * @returns {Promise<Object>} - Search results
   */
  const searchVideos = useCallback(async (query, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      return await api.get('/videos/search', { query, ...options });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rate a video
   * @param {string} videoId - Video ID
   * @param {number} rating - Rating (0.5 to 5 in 0.5 increments)
   * @returns {Promise<Object>} - Updated video data
   */
  const rateVideo = useCallback(async (videoId, rating) => {
    setError(null);

    try {
      const response = await api.post(`/videos/${videoId}/rate`, { rating });
      
      // Update active video if it's the one being rated
      if (activeVideo && activeVideo.id === videoId) {
        setActiveVideo(prev => ({
          ...prev,
          averageRating: response.averageRating,
          ratingCount: response.ratingCount,
          userRating: rating
        }));
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [activeVideo]);

  /**
   * Track a video view
   * @param {string} videoId - Video ID
   * @returns {Promise<Object>} - Response data
   */
  const trackVideoView = useCallback(async (videoId) => {
    try {
      return await api.post(`/videos/${videoId}/view`);
    } catch (err) {
      console.error('Error tracking video view:', err);
      // Don't set error state for view tracking failures
      // as they shouldn't disrupt the user experience
    }
  }, []);

  /**
   * Add a video to the user's watch history
   * @param {string} videoId - Video ID
   * @param {number} progress - Playback progress percentage (0-100)
   * @returns {Promise<Object>} - Response data
   */
  const updateWatchHistory = useCallback(async (videoId, progress) => {
    try {
      return await api.post(`/users/history`, { videoId, progress });
    } catch (err) {
      console.error('Error updating watch history:', err);
      // Don't set error state for history tracking failures
    }
  }, []);
  
  /**
   * Record video watch time
   * @param {string} videoId - Video ID
   * @param {number} seconds - Seconds watched
   * @param {number} percentage - Percentage of video watched
   * @returns {Promise<Object>} - Response data
   */
  const recordWatchTime = useCallback(async (videoId, seconds, percentage) => {
    try {
      return await api.post(`/analytics/watch-time`, { 
        videoId, 
        watchTimeSeconds: seconds,
        percentageWatched: percentage
      });
    } catch (err) {
      console.error('Error recording watch time:', err);
      // Don't set error state for watch time tracking failures
    }
  }, []);

  // Context value
  const value = {
    featuredVideos,
    categories,
    popularVideos,
    loading,
    error,
    activeVideo,
    fetchVideosByCategory,
    fetchPopularVideos,
    fetchVideo,
    searchVideos,
    rateVideo,
    trackVideoView,
    updateWatchHistory,
    recordWatchTime,
    setActiveVideo
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export default VideoContext;