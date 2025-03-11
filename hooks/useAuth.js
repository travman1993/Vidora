import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides access to authentication state and methods from the AuthContext
 * 
 * @returns {Object} Authentication context value
 * @property {Object|null} user - Current authenticated user or null if not authenticated
 * @property {boolean} loading - Whether authentication is in progress
 * @property {string|null} error - Authentication error message, if any
 * @property {Function} login - Function to log in a user
 * @property {Function} signup - Function to register a new user
 * @property {Function} logout - Function to log out the current user
 * @property {Function} verifyStudentCode - Function to verify a student account
 * @property {Function} updateUserProfile - Function to update user profile
 * @property {Function} forgotPassword - Function to request password reset
 * @property {Function} resetPassword - Function to reset password with token
 * @property {boolean} isAuthenticated - Whether user is authenticated
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;