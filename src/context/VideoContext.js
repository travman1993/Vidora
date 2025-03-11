// src/context/VideoContext.js
import React, { createContext, useState } from 'react';
import * as api from '../../utils/api'; // Corrected import path

// Create the video context
export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simplified mock implementations
  const value = {
    featuredVideos,
    categories: [],
    popularVideos: [],
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