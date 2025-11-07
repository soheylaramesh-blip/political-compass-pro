import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { answerBoxStyles, answerBoxStylesMap, AnswerBoxStyle } from '../styles/answerBoxStyles';

interface AnswerBoxStyleContextType {
  answerBoxStyle: AnswerBoxStyle;
  setAnswerBoxStyle: (name: string) => void;
}

const AnswerBoxStyleContext = createContext<AnswerBoxStyleContextType | undefined>(undefined);

const ANSWER_BOX_STYLE_KEY = 'app-answer-box-style';

export const AnswerBoxStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answerBoxStyleName, setAnswerBoxStyleName] = useState<string>(() => {
    try {
      const storedStyle = window.localStorage.getItem(ANSWER_BOX_STYLE_KEY);
      return storedStyle && answerBoxStylesMap[storedStyle] ? storedStyle : 'Default';
    } catch {
      return 'Default';
    }
  });

  useEffect(() => {
    const currentStyle = answerBoxStylesMap[answerBoxStyleName];
    if (currentStyle) {
      const root = document.documentElement;
      root.style.setProperty('--answer-box-bg', currentStyle.background);
      root.style.setProperty('--answer-box-border', currentStyle.border);
      root.style.setProperty('--answer-box-hover-bg', currentStyle.hoverBackground);
      
      try {
        window.localStorage.setItem(ANSWER_BOX_STYLE_KEY, answerBoxStyleName);
      } catch (error) {
        console.warn('Could not save answer box style to localStorage', error);
      }
    }
  }, [answerBoxStyleName]);

  const value = useMemo(() => ({
    answerBoxStyle: answerBoxStylesMap[answerBoxStyleName],
    setAnswerBoxStyle: setAnswerBoxStyleName,
  }), [answerBoxStyleName]);

  return <AnswerBoxStyleContext.Provider value={value}>{children}</AnswerBoxStyleContext.Provider>;
};

export const useAnswerBoxStyle = (): AnswerBoxStyleContextType => {
  const context = useContext(AnswerBoxStyleContext);
  if (!context) {
    throw new Error('useAnswerBoxStyle must be used within a AnswerBoxStyleProvider');
  }
  return context;
};