// src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import * as api from '../../utils/api';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simplified mock implementations
  const login = async (email, password) => {
    console.log('Login called', { email, password });
    setUser({ id: '123', name: 'Test User', email });
    return { success: true };
  };

  const signup = async (userData) => {
    console.log('Signup called', userData);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    console.log('Logout called');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    verifyStudentCode: async () => ({}),
    updateUserProfile: async () => ({}),
    forgotPassword: async () => ({}),
    resetPassword: async () => ({}),
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;