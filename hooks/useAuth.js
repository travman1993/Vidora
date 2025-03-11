// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides access to authentication state and methods from the AuthContext
 */
export const useAuth = () => {
  // For now, return a mock implementation since we haven't set up the full AuthContext yet
  return {
    user: null,
    loading: false,
    error: null,
    login: async () => {
      console.log('Mock login called');
      return { success: true };
    },
    signup: async () => {
      console.log('Mock signup called');
      return { success: true };
    },
    logout: async () => {
      console.log('Mock logout called');
    },
    isAuthenticated: false
  };
};

export default useAuth;