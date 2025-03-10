// src/components/video/VideoPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const VideoPlayer = ({ videoUrl, title, filmmaker }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { user } = useAuth();
  
  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [isPlaying, showControls]);
  
  // Update progress as video plays
  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const calculatedProgress = (currentTime / duration) * 100;
        setProgress(calculatedProgress);
      }
    };
    
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', updateProgress);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };
  
  const handleMuteToggle = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };
  
  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
  };
  
  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Track when video view is counted (15 seconds or 25% watched)
  useEffect(() => {
    let viewTracked = false;
    
    const trackView = () => {
      if (
        !viewTracked && 
        videoRef.current && 
        (videoRef.current.currentTime > 15 || videoRef.current.currentTime / videoRef.current.duration > 0.25)
      ) {
        // Record view in database
        // This would typically call an API endpoint
        console.log('View tracked for video');
        viewTracked = true;
      }
    };
    
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', trackView);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', trackView);
      }
    };
  }, []);
  
  return (
    <div 
      className="video-player-container"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="video-player"
        onClick={handlePlayPause}
        onEnded={() => setIsPlaying(false)}
      />
      
      {showControls && (
        <div className="video-controls">
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="progress-slider"
            />
          </div>
          
          <div className="controls-bottom">
            <div className="left-controls">
              <button onClick={handlePlayPause} className="control-button">
                {isPlaying ? (
                  <i className="fas fa-pause"></i>
                ) : (
                  <i className="fas fa-play"></i>
                )}
              </button>
              
              <div className="volume-control">
                <button onClick={handleMuteToggle} className="control-button">
                  {isMuted ? (
                    <i className="fas fa-volume-mute"></i>
                  ) : volume > 0.5 ? (
                    <i className="fas fa-volume-up"></i>
                  ) : (
                    <i className="fas fa-volume-down"></i>
                  )}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
            
            <div className="center-controls">
              <h3 className="video-title">{title}</h3>
              <p className="filmmaker-name">by {filmmaker.name}</p>
            </div>
            
            <div className="right-controls">
              <button onClick={handleFullscreenToggle} className="control-button">
                {isFullscreen ? (
                  <i className="fas fa-compress"></i>
                ) : (
                  <i className="fas fa-expand"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;