/**
 * Formats a number of views to a human-readable string
 * @param {number} views - The number of views to format
 * @param {boolean} abbreviated - Whether to use abbreviated format (e.g., "1.2K" instead of "1,234")
 * @returns {string} - The formatted views string
 */
export const formatViews = (views, abbreviated = true) => {
    if (views === undefined || views === null) return '0 views';
    
    // Handle non-numeric values
    if (isNaN(views)) return '0 views';
    
    // Convert to number if it's a string
    const viewCount = typeof views === 'string' ? parseInt(views, 10) : views;
    
    // If viewCount is less than 1, return 0 views
    if (viewCount < 1) return '0 views';
    
    if (abbreviated) {
      // Format with abbreviations (K, M, B)
      if (viewCount >= 1000000000) {
        return `${(viewCount / 1000000000).toFixed(1).replace(/\.0$/, '')}B views`;
      }
      
      if (viewCount >= 1000000) {
        return `${(viewCount / 1000000).toFixed(1).replace(/\.0$/, '')}M views`;
      }
      
      if (viewCount >= 1000) {
        return `${(viewCount / 1000).toFixed(1).replace(/\.0$/, '')}K views`;
      }
      
      return `${viewCount} ${viewCount === 1 ? 'view' : 'views'}`;
    } else {
      // Format with commas (e.g., 1,234,567)
      return `${viewCount.toLocaleString()} ${viewCount === 1 ? 'view' : 'views'}`;
    }
  };
  
  /**
   * Formats a number to a human-readable string without the "views" text
   * Useful for displaying counts of other metrics (likes, shares, etc.)
   * @param {number} count - The number to format
   * @param {boolean} abbreviated - Whether to use abbreviated format (e.g., "1.2K" instead of "1,234")
   * @returns {string} - The formatted count string
   */
  export const formatCount = (count, abbreviated = true) => {
    if (count === undefined || count === null) return '0';
    
    // Handle non-numeric values
    if (isNaN(count)) return '0';
    
    // Convert to number if it's a string
    const numCount = typeof count === 'string' ? parseInt(count, 10) : count;
    
    // If numCount is less than 1, return 0
    if (numCount < 1) return '0';
    
    if (abbreviated) {
      // Format with abbreviations (K, M, B)
      if (numCount >= 1000000000) {
        return `${(numCount / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
      }
      
      if (numCount >= 1000000) {
        return `${(numCount / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
      }
      
      if (numCount >= 1000) {
        return `${(numCount / 1000).toFixed(1).replace(/\.0$/, '')}K`;
      }
      
      return `${numCount}`;
    } else {
      // Format with commas (e.g., 1,234,567)
      return `${numCount.toLocaleString()}`;
    }
  };
  
  export default formatViews;