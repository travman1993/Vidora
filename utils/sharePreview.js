/**
 * Utility functions for generating social media share previews
 * and handling social sharing functionality
 */

/**
 * Generates a shareable link for a video
 * @param {string} videoId - The ID of the video
 * @param {string} source - Source platform for tracking (e.g., 'facebook', 'twitter')
 * @returns {string} Full shareable URL 
 */
export const generateShareLink = (videoId, source = '') => {
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://vidorafilms.com';
      
    const url = `${baseUrl}/video/${videoId}`;
    
    // Add source tracking parameter if provided
    if (source) {
      return `${url}?ref=${encodeURIComponent(source)}`;
    }
    
    return url;
  };
  
  /**
   * Generates meta tags for Open Graph and Twitter Card
   * @param {Object} video - Video data object
   * @returns {Object} Object containing all meta tags
   */
  export const generateMetaTags = (video) => {
    if (!video) return {};
    
    const title = video.title || 'Vidora Films';
    const description = video.description 
      ? (video.description.length > 160 
          ? `${video.description.substring(0, 157)}...` 
          : video.description)
      : 'Watch amazing films on Vidora';
    const imageUrl = video.thumbnailUrl || '/previews/default-share.jpg';
    const videoUrl = generateShareLink(video.id);
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: videoUrl,
        type: 'video.other',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        site_name: 'Vidora Films',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@vidorafilms',
        title,
        description,
        image: imageUrl,
      },
    };
  };
  
  /**
   * Share content to various social media platforms
   * @param {Object} options - Share options
   * @param {string} options.platform - Platform to share to ('facebook', 'twitter', 'linkedin', 'email', 'copy')
   * @param {string} options.url - URL to share
   * @param {string} options.title - Title of the content
   * @param {string} options.description - Description of the content
   * @param {string} options.hashtags - Comma-separated hashtags (for Twitter)
   * @param {Function} options.onSuccess - Callback when sharing succeeds
   * @param {Function} options.onError - Callback when sharing fails
   * @returns {Promise<boolean>} Whether sharing was successful
   */
  export const shareContent = async ({
    platform,
    url,
    title,
    description,
    hashtags = '',
    onSuccess = () => {},
    onError = () => {},
  }) => {
    try {
      // Track share event
      trackShareEvent(platform, url);
      
      switch (platform.toLowerCase()) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            'facebook-share-dialog',
            'width=626,height=436'
          );
          onSuccess();
          return true;
          
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}${hashtags ? `&hashtags=${encodeURIComponent(hashtags)}` : ''}`,
            'twitter-share-dialog',
            'width=626,height=436'
          );
          onSuccess();
          return true;
          
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            'linkedin-share-dialog',
            'width=626,height=436'
          );
          onSuccess();
          return true;
          
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\nWatch it here: ${url}`)}`;
          onSuccess();
          return true;
          
        case 'copy':
          // Use Clipboard API if available, otherwise fallback to execCommand
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
            onSuccess();
            return true;
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
              onSuccess();
              return true;
            } else {
              throw new Error('Failed to copy URL');
            }
          }
          
        default:
          throw new Error(`Unsupported sharing platform: ${platform}`);
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      onError(error);
      return false;
    }
  };
  
  /**
   * Tracks a share event in analytics
   * @param {string} platform - The platform shared to
   * @param {string} url - The URL that was shared
   */
  const trackShareEvent = (platform, url) => {
    try {
      // Extract video ID from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const videoId = pathParts[pathParts.indexOf('video') + 1];
      
      // In a real app, this would call the analytics API to track the share
      console.log(`Track share event: ${platform}, video: ${videoId}`);
      
      // Send share data to backend
      if (videoId) {
        fetch('/api/analytics/shares', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoId,
            platform,
            url,
            timestamp: new Date().toISOString(),
          }),
        }).catch(err => console.error('Failed to track share:', err));
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };
  
  /**
   * Generates a preview image for a video
   * Used for social sharing when no custom thumbnail is available
   * @param {string} videoId - ID of the video
   * @returns {string} URL of the generated preview image
   */
  export const generatePreviewImage = (videoId) => {
    // In a real app, this would call an API that generates a preview image
    return `/previews/${videoId}.jpg`;
  };
  
  export default {
    generateShareLink,
    generateMetaTags,
    shareContent,
    generatePreviewImage,
  };