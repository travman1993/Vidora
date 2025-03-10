// src/components/upload/UploadForm.js
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

const UploadForm = ({ initialData = null, isEditing = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const trailerInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'short-film',
    videoFile: null,
    thumbnailFile: null,
    trailerFile: null,
    customThumbnail: initialData?.customThumbnail || false,
    hasTrailer: initialData?.hasTrailer || false,
    isPublic: initialData?.isPublic !== false, // Default to true if not specified
    tags: initialData?.tags?.join(', ') || ''
  });
  
  const [preview, setPreview] = useState({
    thumbnail: initialData?.thumbnailUrl || null,
    video: initialData?.videoUrl || null,
    trailer: initialData?.trailerUrl || null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const categories = [
    { id: 'short-film', name: 'Short Film' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'music-video', name: 'Music Video' },
    { id: 'indie-film', name: 'Indie Film' },
    { id: 'promotional', name: 'Promotional Video' },
    { id: 'event', name: 'Event Highlight' }
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check if it's a video file
    if (name === 'videoFile' && !file.type.includes('video/')) {
      setError('Please upload a valid video file');
      return;
    }
    
    // Check if it's an image file for thumbnail
    if (name === 'thumbnailFile' && !file.type.includes('image/')) {
      setError('Please upload a valid image file for the thumbnail');
      return;
    }
    
    // Check if it's a video file for trailer
    if (name === 'trailerFile' && !file.type.includes('video/')) {
      setError('Please upload a valid video file for the trailer');
      return;
    }
    
    // Update form data
    setFormData({
      ...formData,
      [name]: file
    });
    
    // Create URL for preview
    const previewUrl = URL.createObjectURL(file);
    
    if (name === 'videoFile') {
      setPreview({
        ...preview,
        video: previewUrl
      });
    } else if (name === 'thumbnailFile') {
      setPreview({
        ...preview,
        thumbnail: previewUrl
      });
    } else if (name === 'trailerFile') {
      setPreview({
        ...preview,
        trailer: previewUrl
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate the form
    if (!formData.title) {
      setError('Please enter a title');
      return;
    }
    
    if (!formData.description) {
      setError('Please enter a description');
      return;
    }
    
    if (!isEditing && !formData.videoFile) {
      setError('Please upload a video file');
      return;
    }
    
    if (formData.customThumbnail && !formData.thumbnailFile && !preview.thumbnail) {
      setError('Please upload a custom thumbnail');
      return;
    }
    
    if (formData.hasTrailer && !formData.trailerFile && !preview.trailer) {
      setError('Please upload a trailer');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('isPublic', formData.isPublic);
      uploadData.append('tags', formData.tags);
      
      if (formData.videoFile) {
        uploadData.append('videoFile', formData.videoFile);
      }
      
      if (formData.customThumbnail && formData.thumbnailFile) {
        uploadData.append('thumbnailFile', formData.thumbnailFile);
      }
      
      if (formData.hasTrailer && formData.trailerFile) {
        uploadData.append('trailerFile', formData.trailerFile);
      }
      
      // Add video ID if editing
      if (isEditing && initialData?.id) {
        uploadData.append('videoId', initialData.id);
      }
      
      // Mock upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      // API endpoint based on whether we're editing or creating
      const endpoint = isEditing ? '/api/videos/update' : '/api/videos/upload';
      
      // Send the upload request
      const response = await fetch(endpoint, {
        method: 'POST',
        body: uploadData
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload video');
      }
      
      const result = await response.json();
      
      setUploadProgress(100);
      
      // Redirect to the video page after successful upload
      setTimeout(() => {
        router.push(`/video/${result.videoId}`);
      }, 1500);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  return (
    <div className="upload-form-container">
      <h2 className="upload-title">
        {isEditing ? 'Edit Video' : 'Upload New Video'}
      </h2>
      
      {error && (
        <div className="upload-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your video a title"
              required
              disabled={isUploading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your video"
              rows="4"
              required
              disabled={isUploading}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isUploading}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. drama, animation, documentary"
              disabled={isUploading}
            />
          </div>
          
          <div className="form-group toggle-group">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              checked={formData.isPublic}
              onChange={handleChange}
              disabled={isUploading}
            />
            <label htmlFor="isPublic">Make video public</label>
            <p className="form-note">
              If unchecked, your video will be private and only accessible with a direct link
            </p>
          </div>
        </div>
        
        <div className="form-section media-section">
          <div className="video-upload-container">
            <h3>Video File {!isEditing && '*'}</h3>
            
            {preview.video ? (
              <div className="video-preview">
                <video controls>
                  <source src={preview.video} type={formData.videoFile?.type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
                
                {!isUploading && (
                  <button 
                    type="button" 
                    className="change-video-button"
                    onClick={() => triggerFileInput(videoInputRef)}
                  >
                    Change Video
                  </button>
                )}
              </div>
            ) : (
              <div 
                className="video-upload-area"
                onClick={() => triggerFileInput(videoInputRef)}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <p>
                  {isEditing ? 'Upload a new video file' : 'Click to upload your video'}
                </p>
                <p className="upload-note">
                  Supported formats: MP4, MOV, AVI, WebM (max 500MB {user?.subscription === 'Elite' ? '/ 30 min' : ''})
                </p>
                
                {isEditing && (
                  <p className="current-video-note">
                    Current video will be used if no new file is uploaded
                  </p>
                )}
              </div>
            )}
            
            <input
              ref={videoInputRef}
              type="file"
              name="videoFile"
              onChange={handleFileChange}
              accept="video/*"
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </div>
          
          <div className="thumbnail-container">
            <div className="form-group toggle-group">
              <input
                id="customThumbnail"
                name="customThumbnail"
                type="checkbox"
                checked={formData.customThumbnail}
                onChange={handleChange}
                disabled={isUploading}
              />
              <label htmlFor="customThumbnail">Use custom thumbnail</label>
            </div>
            
            {formData.customThumbnail && (
              <div className="thumbnail-upload">
                {preview.thumbnail ? (
                  <div className="thumbnail-preview">
                    <img src={preview.thumbnail} alt="Video thumbnail" />
                    
                    {!isUploading && (
                      <button 
                        type="button" 
                        className="change-thumbnail-button"
                        onClick={() => triggerFileInput(thumbnailInputRef)}
                      >
                        Change Thumbnail
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className="thumbnail-upload-area"
                    onClick={() => triggerFileInput(thumbnailInputRef)}
                  >
                    <i className="fas fa-image"></i>
                    <p>Upload a custom thumbnail</p>
                    <p className="upload-note">Recommended: 1280x720px JPG, PNG</p>
                  </div>
                )}
                
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  name="thumbnailFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
          
          <div className="trailer-container">
            <div className="form-group toggle-group">
              <input
                id="hasTrailer"
                name="hasTrailer"
                type="checkbox"
                checked={formData.hasTrailer}
                onChange={handleChange}
                disabled={isUploading}
              />
              <label htmlFor="hasTrailer">Upload a trailer (optional)</label>
              <p className="form-note">
                A short preview that will play when users hover over your video
              </p>
            </div>
            
            {formData.hasTrailer && (
              <div className="trailer-upload">
                {preview.trailer ? (
                  <div className="trailer-preview">
                    <video controls>
                      <source src={preview.trailer} type={formData.trailerFile?.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                    
                    {!isUploading && (
                      <button 
                        type="button" 
                        className="change-trailer-button"
                        onClick={() => triggerFileInput(trailerInputRef)}
                      >
                        Change Trailer
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className="trailer-upload-area"
                    onClick={() => triggerFileInput(trailerInputRef)}
                  >
                    <i className="fas fa-film"></i>
                    <p>Upload a trailer</p>
                    <p className="upload-note">Recommended: 15-30 seconds, MP4 format</p>
                  </div>
                )}
                
                <input
                  ref={trailerInputRef}
                  type="file"
                  name="trailerFile"
                  onChange={handleFileChange}
                  accept="video/*"
                  style={{ display: 'none' }}
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
        </div>
        
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {uploadProgress < 100 ? (
                `Uploading... ${uploadProgress}%`
              ) : (
                'Upload complete! Redirecting...'
              )}
            </p>
          </div>
        )}
        
        <div className="form-buttons">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => router.back()}
            disabled={isUploading}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : isEditing ? 'Save Changes' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;