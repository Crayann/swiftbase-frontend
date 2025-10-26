'use client'

import { createContext, useContext, useState } from 'react';
import { authAPI } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage (runs only once before first render)
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return authAPI.getUser();
      } catch (error) {
        console.error('Failed to load user:', error);
        return null;
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      authAPI.saveAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      authAPI.saveAuth(response.data.token, response.data.user);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        loading,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};