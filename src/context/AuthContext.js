// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as api from '../../utils/api';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have an auth token
        const token = localStorage.getItem('vidora_auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch current user data
        const userData = await api.get('/auth/user');
        setUser(userData);
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Clear invalid token
        localStorage.removeItem('vidora_auth_token');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to keep the user logged in
   * @returns {Promise<Object>} - User data
   */
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Save auth token
      localStorage.setItem('vidora_auth_token', response.token);
      
      // Set user data
      setUser(response.user);
      
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - New user data
   */
  const signup = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/register', userData);
      
      // Save auth token if registration auto-logs in
      if (response.token) {
        localStorage.setItem('vidora_auth_token', response.token);
        setUser(response.user);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify a student filmmaker account
   * @param {string} email - Student email
   * @param {string} code - Verification code
   * @returns {Promise<Object>} - Response data
   */
  const verifyStudentCode = async (email, code) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/verify-student', { email, code });
      
      // Update user data if already logged in
      if (user && user.email === email) {
        setUser({
          ...user,
          isStudent: true,
          isVerified: true
        });
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    try {
      // Call logout endpoint (optional, depends on your backend)
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token and user data regardless of API success
      localStorage.removeItem('vidora_auth_token');
      setUser(null);
    }
  };

  /**
   * Update user profile data
   * @param {Object|FormData} data - Updated user data
   * @returns {Promise<Object>} - Updated user data
   */
  const updateUserProfile = async (data) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Check if data is FormData (contains files) or regular object
      if (data instanceof FormData) {
        response = await api.upload('/users/profile', data);
      } else {
        response = await api.put('/users/profile', data);
      }
      
      // Update local user state with new data
      setUser(prevUser => ({
        ...prevUser,
        ...response
      }));
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password using email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - Response data
   */
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise<Object>} - Response data
   */
  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);

    try {
      return await api.post('/auth/reset-password', { token, password });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    verifyStudentCode,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;