// context/ThemeContext.jsx
import React, { createContext, useContext } from 'react';
import { useTheme as useThemeHook } from '@/lib/hooks/useTheme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themeData = useThemeHook();
  
  console.log('ThemeProvider - theme data:', themeData);
  
  
  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};