// Mock context providers for static deployment
import React, { createContext, useContext, useState } from 'react';

// Mock Auth Context
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAdmin: false,
  isSeller: false,
  hasRole: () => false,
  isLoading: false,
  error: null
});

export const StaticAuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async () => {
    console.log('Mock login in demo mode');
    return { id: 'demo-user', name: 'Demo User', email: 'demo@example.com' };
  };
  
  const register = async () => {
    console.log('Mock register in demo mode');
    return { id: 'demo-user', name: 'Demo User', email: 'demo@example.com' };
  };
  
  const logout = async () => {
    console.log('Mock logout in demo mode');
  };
  
  const hasRole = () => false;
  
  return (
    <AuthContext.Provider 
      value={{
        user: null,
        isAuthenticated: false,
        login,
        register,
        logout,
        isAdmin: false,
        isSeller: false,
        hasRole,
        isLoading,
        error: null,
        clearError: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Mock Language Context
const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  isRtl: false
});

export const StaticLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const isRtl = language === 'ar';
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// Mock Analytics
export const StaticGoogleAnalytics = () => {
  // No-op implementation
  return null;
};

// Mock Performance Monitor
export const StaticPerformanceMonitor = () => {
  // No-op implementation
  return null;
};
