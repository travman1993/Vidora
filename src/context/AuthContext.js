// src/context/AuthContext.js
import React, { createContext } from 'react';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // This will be expanded with actual authentication logic later
  const value = {
    user: null,
    loading: false,
    error: null,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    isAuthenticated: false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;