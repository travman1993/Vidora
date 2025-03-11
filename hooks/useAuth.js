// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    // Use a simple mock if context is not available
    return {
      user: null,
      loading: false,
      error: null,
      login: async () => console.log('Mock login called'),
      signup: async () => console.log('Mock signup called'),
      logout: async () => console.log('Mock logout called'),
      isAuthenticated: false
    };
  }
  
  return context;
};

export default useAuth;