// src/utils/api.js
/**
 * API utility functions for Vidora
 * Centralizes all API requests with consistent error handling and authentication
 */

// Base API URL - would be set from environment variables in a real app
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not found
 */
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vidora_auth_token');
};

/**
 * Helper to create the request headers with authentication
 * @param {Object} customHeaders - Additional headers to include
 * @returns {Object} Headers object
 */
const createHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Process API response and handle errors
 * @param {Response} response - Fetch API response
 * @returns {Promise} Parsed response data or throws error
 */
const processResponse = async (response) => {
  // Handle 401 Unauthorized by redirecting to login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      // Clear token and redirect to login
      localStorage.removeItem('vidora_auth_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized. Please log in.');
  }

  // Handle other error statuses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText || 'An error occurred';
    
    // Create error with additional data for debugging
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Parse JSON response
  return response.json();
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} customHeaders - Additional headers
 * @returns {Promise} API response data
 */
export const get = async (endpoint, params = {}, customHeaders = {}) => {
  // Add query parameters if any
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });

  const url = queryParams.toString() 
    ? `${endpoint}?${queryParams.toString()}` 
    : endpoint;

  try {
    const response = await fetch(`${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`, {
      method: 'GET',
      headers: createHeaders(customHeaders),
    });
    return await processResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} customHeaders - Additional headers
 * @returns {Promise} API response data
 */
export const post = async (endpoint, data = {}, customHeaders = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers: createHeaders(customHeaders),
      body: JSON.stringify(data),
    });
    return await processResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} customHeaders - Additional headers
 * @returns {Promise} API response data
 */
export const put = async (endpoint, data = {}, customHeaders = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'PUT',
      headers: createHeaders(customHeaders),
      body: JSON.stringify(data),
    });
    return await processResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Simple upload function for file uploads
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData with files
 * @returns {Promise} API response data
 */
export const upload = async (endpoint, formData) => {
  try {
    // Get auth token for headers but don't set Content-Type (browser sets it with boundary)
    const headers = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    return await processResponse(response);
  } catch (error) {
    console.error(`Upload Error (${endpoint}):`, error);
    throw error;
  }
};