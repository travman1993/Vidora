/**
 * Formats a date string to a human-readable format
 * @param {string|Date} dateString - The date to format (ISO string or Date object)
 * @param {string} format - Optional format type: 'default', 'short', 'relative', 'long'
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString, format = 'default') => {
    if (!dateString) return '';
  
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    
    // Return empty string for invalid dates
    if (isNaN(date.getTime())) {
      return '';
    }
  
    // Format options
    switch (format) {
      case 'short':
        // Format: "Jan 12, 2023"
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      
      case 'long':
        // Format: "January 12, 2023 at 3:45 PM"
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      
      case 'relative':
        // Calculate relative time (e.g., "3 days ago")
        return getRelativeTimeString(date);
      
      case 'default':
      default:
        // Format: "Jan 12, 2023"
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
    }
  };
  
  /**
   * Returns a relative time string (e.g., "3 days ago", "just now")
   * @param {Date} date - The date to compare to current time
   * @returns {string} - Relative time string
   */
  const getRelativeTimeString = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Less than a month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };
  
  export default formatDate;