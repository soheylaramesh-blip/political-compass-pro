import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { cardStyles, cardStylesMap, CardStyle } from '../styles/cardStyles.ts';

interface CardStyleContextType {
  cardStyle: CardStyle;
  setCardStyle: (name: string) => void;
}

const CardStyleContext = createContext<CardStyleContextType | undefined>(undefined);

const CARD_STYLE_KEY = 'app-card-style';

export const CardStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cardStyleName, setCardStyleName] = useState<string>(() => {
    try {
      const storedStyle = window.localStorage.getItem(CARD_STYLE_KEY);
      return storedStyle && cardStylesMap[storedStyle] ? storedStyle : 'Dark';
    } catch {
      return 'Dark';
    }
  });

  useEffect(() => {
    const currentStyle = cardStylesMap[cardStyleName];
    if (currentStyle) {
      const root = document.documentElement;
      root.style.setProperty('--card-bg', currentStyle.background);
      root.style.setProperty('--card-border', currentStyle.border);
      
      try {
        window.localStorage.setItem(CARD_STYLE_KEY, cardStyleName);
      } catch (error) {
        console.warn('Could not save card style to localStorage', error);
      }
    }
  }, [cardStyleName]);

  const value = useMemo(() => ({
    cardStyle: cardStylesMap[cardStyleName],
    setCardStyle: setCardStyleName,
  }), [cardStyleName, setCardStyleName]);

  return <CardStyleContext.Provider value={value}>{children}</CardStyleContext.Provider>;
};

export const useCardStyle = (): CardStyleContextType => {
  const context = useContext(CardStyleContext);
  if (!context) {
    throw new Error('useCardStyle must be used within a CardStyleProvider');
  }
  return context;
};