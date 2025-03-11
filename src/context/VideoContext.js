// src/context/VideoContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../../utils/api';

// Create the video context
export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetch initial data (commented out to prevent API calls until your backend is ready)
  /*
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
  */

  // Provide the context value with empty implementations for now
  const value = {
    featuredVideos,
    categories,
    popularVideos,
    loading,
    error,
    activeVideo,
    fetchVideosByCategory: async () => [],
    fetchPopularVideos: async () => [],
    fetchVideo: async () => ({}),
    searchVideos: async () => [],
    rateVideo: async () => ({}),
    trackVideoView: async () => ({}),
    updateWatchHistory: async () => ({}),
    recordWatchTime: async () => ({}),
    setActiveVideo
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export default VideoContext;