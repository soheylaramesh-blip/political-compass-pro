import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { backgrounds, backgroundsMap, AppBackground } from '../styles/backgrounds';

interface BackgroundContextType {
  background: AppBackground;
  setBackground: (name: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const BACKGROUND_KEY = 'app-background';

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundName, setBackgroundName] = useState<string>(() => {
    try {
      const storedBg = window.localStorage.getItem(BACKGROUND_KEY);
      return storedBg && backgroundsMap[storedBg] ? storedBg : 'Cosmic';
    } catch {
      return 'Cosmic';
    }
  });

  useEffect(() => {
    const currentBg = backgroundsMap[backgroundName];
    if (currentBg) {
      // Clear old styles first
      document.body.style.background = '';
      
      Object.assign(document.body.style, currentBg.style);
      
      try {
        window.localStorage.setItem(BACKGROUND_KEY, backgroundName);
      } catch (error) {
        console.warn('Could not save background to localStorage', error);
      }
    }
  }, [backgroundName]);

  const value = useMemo(() => ({
    background: backgroundsMap[backgroundName],
    setBackground: setBackgroundName,
  }), [backgroundName]);

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
};

export const useBackground = (): BackgroundContextType => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};