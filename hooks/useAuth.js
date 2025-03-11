// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication
 * Provides access to authentication state and methods from the AuthContext
 */
export const useAuth = () => {
  const auth = useContext(AuthContext);
  
  if (auth === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return auth;
};

export default useAuth;