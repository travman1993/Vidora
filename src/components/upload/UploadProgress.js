/ src/components/upload/UploadProgress.js
import React, { useState, useEffect } from 'react';

const UploadProgress = ({ 
  videoFile, 
  thumbnailFile, 
  trailerFile, 
  metadata,
  onComplete,
  onError
}) => {
  const [stage, setStage] = useState('preparing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const stages = {
    preparing: 'Preparing your files',
    uploading: 'Uploading video',
    processing: 'Processing video',
    thumbnail: 'Generating thumbnail',
    trailer: 'Processing trailer',
    finalizing: 'Finalizing upload',
    complete: 'Upload complete'
  };
  
  useEffect(() => {
    if (!videoFile) {
      setError('No video file provided');
      if (onError) onError('No video file provided');
      return;
    }
    
    startUpload();
  }, []);
  
  const startUpload = async () => {
    try {
      // Step 1: Prepare upload (mock)
      setStage('preparing');
      await simulateProgress(10);
      
      // Step 2: Upload video
      setStage('uploading');
      await simulateProgress(70);
      
      // Step 3: Process video
      setStage('processing');
      await simulateProgress(85);
      
      // Step 4: Handle thumbnail
      setStage('thumbnail');
      await simulateProgress(90);
      
      // Step 5: Handle trailer if present
      if (trailerFile) {
        setStage('trailer');
        await simulateProgress(95);
      }
      
      // Step 6: Finalize
      setStage('finalizing');
      await simulateProgress(100);
      
      // Complete
      setStage('complete');
      
      if (onComplete) {
        onComplete({
          videoId: 'mock-video-id-123',
          thumbnailUrl: thumbnailFile ? URL.createObjectURL(thumbnailFile) : 'mock-thumbnail-url',
          videoUrl: URL.createObjectURL(videoFile),
          trailerUrl: trailerFile ? URL.createObjectURL(trailerFile) : null
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'An error occurred during upload');
      if (onError) onError(error.message || 'An error occurred during upload');
    }
  };
  
  const simulateProgress = (targetProgress) => {
    return new Promise((resolve) => {
      let currentProgress = progress;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        
        if (currentProgress >= targetProgress) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };
  
  if (error) {
    return (
      <div className="upload-error-container">
        <div className="upload-error">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Upload Failed</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={startUpload}>
            Retry Upload
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="upload-progress-container">
      <h3 className="progress-title">
        {stages[stage]}
      </h3>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-percentage">{progress}%</p>
      </div>
      
      <div className="upload-stages">
        {Object.entries(stages).map(([key, label], index) => (
          <div 
            key={key}
            className={`stage-item ${
              stage === key 
                ? 'active' 
                : Object.keys(stages).indexOf(stage) > index 
                  ? 'completed' 
                  : ''
            }`}
          >
            <div className="stage-marker">
              {Object.keys(stages).indexOf(stage) > index ? (
                <i className="fas fa-check"></i>
              ) : (
                index + 1
              )}
            </div>
            <span className="stage-label">{label}</span>
          </div>
        ))}
      </div>
      
      <div className="upload-details">
        <p className="file-name">
          <strong>File:</strong> {videoFile.name}
        </p>
        <p className="file-size">
          <strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
        </p>
        {metadata?.title && (
          <p className="video-title">
            <strong>Title:</strong> {metadata.title}
          </p>
        )}
      </div>
      
      {stage === 'complete' && (
        <div className="upload-complete">
          <i className="fas fa-check-circle"></i>
          <h3>Upload Complete!</h3>
          <p>Your video has been successfully uploaded and is now being processed.</p>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;