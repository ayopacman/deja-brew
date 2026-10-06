'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CafeTheme = 'blossom' | 'matcha' | 'caramel-dark';

interface ThemeContextType {
  theme: CafeTheme;
  setTheme: (theme: CafeTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<CafeTheme>('blossom');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('dejabrew_theme') as CafeTheme;
      if (savedTheme && (savedTheme === 'blossom' || savedTheme === 'matcha' || savedTheme === 'caramel-dark')) {
        setThemeState(savedTheme);
      }
    } catch (e) {
      console.warn('Theme storage error', e);
    }
  }, []);

  const setTheme = (newTheme: CafeTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('dejabrew_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.warn('Save theme error', e);
    }
  };

  const toggleTheme = () => {
    if (theme === 'blossom') setTheme('matcha');
    else if (theme === 'matcha') setTheme('caramel-dark');
    else setTheme('blossom');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
