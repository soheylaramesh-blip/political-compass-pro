import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { themes, themesMap, Theme } from '../styles/themes';
import { useBackground } from './BackgroundContext';
import { titleGradientsMap, bodyGradientsMap, buttonGradientsMap, TitleGradient } from '../styles/gradients';

interface CustomSettings {
  titleSize: string;
  titleColor: string;
  titleGradient: string;
  bodySize: string;
  bodyColor: string;
  bodyGradient: string;
  buttonSize: string;
  buttonColor: string;
  buttonGradient: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (name: string) => void;
  // Title
  setTitleFontSize: (size: string) => void;
  setTitleFontColor: (color: string) => void;
  setTitleGradient: (name: string) => void;
  // Body
  setBodyFontSize: (size: string) => void;
  setBodyFontColor: (color: string) => void;
  setBodyFontGradient: (name: string) => void;
  // Button
  setButtonFontSize: (size: string) => void;
  setButtonFontColor: (color: string) => void;
  setButtonFontGradient: (name: string) => void;

  customSettings: CustomSettings;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const SETTINGS_KEY = 'app-font-settings-v2';
const THEME_KEY = 'app-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { background } = useBackground();

  const [themeName, setThemeName] = useState<string>(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_KEY);
      return storedTheme && themesMap[storedTheme] ? storedTheme : 'Default Dark';
    } catch {
      return 'Default Dark';
    }
  });

  const [customSettings, setCustomSettings] = useState<CustomSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
      const defaults = { 
        titleSize: '', titleColor: '', titleGradient: '',
        bodySize: '', bodyColor: '', bodyGradient: '',
        buttonSize: '', buttonColor: '', buttonGradient: ''
      };
      return storedSettings ? { ...defaults, ...JSON.parse(storedSettings) } : defaults;
    } catch {
      return { 
        titleSize: '', titleColor: '', titleGradient: '',
        bodySize: '', bodyColor: '', bodyGradient: '',
        buttonSize: '', buttonColor: '', buttonGradient: ''
      };
    }
  });

  useEffect(() => {
    const currentTheme = themesMap[themeName];
    if (currentTheme) {
      const root = document.documentElement;
      
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      
      const applyStyle = (
        prefix: 'title' | 'body' | 'button',
        size: string,
        color: string,
        gradientName: string,
        gradientsMap: { [key: string]: TitleGradient },
        defaultSize: string,
        defaultColor: string,
        defaultGradientFrom: string,
        defaultGradientTo: string
      ) => {
          root.style.setProperty(`--${prefix}-font-size`, size || defaultSize);

          const customGradient = gradientName ? gradientsMap[gradientName] : null;
          let fromColor, toColor, solidColor;

          if (customGradient && customGradient.name !== 'Default') {
              fromColor = customGradient.from;
              toColor = customGradient.to;
              solidColor = 'transparent'; 
          } else if (color) {
              fromColor = color;
              toColor = color;
              solidColor = color;
          } else {
              fromColor = defaultGradientFrom;
              toColor = defaultGradientTo;
              solidColor = defaultColor;
          }
          root.style.setProperty(`--${prefix}-gradient-from`, fromColor);
          root.style.setProperty(`--${prefix}-gradient-to`, toColor);
          root.style.setProperty(`--${prefix}-font-color`, solidColor);
      };
      
      applyStyle('title', customSettings.titleSize, customSettings.titleColor, customSettings.titleGradient, titleGradientsMap, currentTheme.font.titleSize, currentTheme.font.titleColor, currentTheme.colors['--gradient-from'], currentTheme.colors['--gradient-to']);
      applyStyle('body', customSettings.bodySize, customSettings.bodyColor, customSettings.bodyGradient, bodyGradientsMap, currentTheme.font.bodySize, currentTheme.font.bodyColor, currentTheme.font.bodyColor, currentTheme.font.bodyColor);
      applyStyle('button', customSettings.buttonSize, customSettings.buttonColor, customSettings.buttonGradient, buttonGradientsMap, currentTheme.font.buttonSize, currentTheme.font.buttonColor, currentTheme.font.buttonColor, currentTheme.font.buttonColor);

      if (background.textColor) {
          root.style.setProperty('--text-color', background.textColor);
          const secondaryColor = background.textColor === '#FFFFFF' 
              ? 'rgba(255, 255, 255, 0.85)' 
              : 'rgba(0, 0, 0, 0.75)';
          root.style.setProperty('--text-secondary-color', secondaryColor);
      }
      
      try {
        window.localStorage.setItem(THEME_KEY, themeName);
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(customSettings));
      } catch (error) {
        console.warn('Could not save settings to localStorage', error);
      }
    }
  }, [themeName, customSettings, background]);
  
  // Title Setters
  const setTitleFontSize = useCallback((size: string) => setCustomSettings(prev => ({ ...prev, titleSize: size })), []);
  const setTitleFontColor = useCallback((color: string) => setCustomSettings(prev => ({ ...prev, titleColor: color, titleGradient: '' })), []);
  const setTitleGradient = useCallback((name: string) => setCustomSettings(prev => ({ ...prev, titleGradient: name, titleColor: '' })), []);

  // Body Setters
  const setBodyFontSize = useCallback((size: string) => setCustomSettings(prev => ({ ...prev, bodySize: size })), []);
  const setBodyFontColor = useCallback((color: string) => setCustomSettings(prev => ({ ...prev, bodyColor: color, bodyGradient: '' })), []);
  const setBodyFontGradient = useCallback((name: string) => setCustomSettings(prev => ({ ...prev, bodyGradient: name, bodyColor: '' })), []);

  // Button Setters
  const setButtonFontSize = useCallback((size: string) => setCustomSettings(prev => ({ ...prev, buttonSize: size })), []);
  const setButtonFontColor = useCallback((color: string) => setCustomSettings(prev => ({ ...prev, buttonColor: color, buttonGradient: '' })), []);
  const setButtonFontGradient = useCallback((name: string) => setCustomSettings(prev => ({ ...prev, buttonGradient: name, buttonColor: '' })), []);


  const value = useMemo(() => {
    const baseTheme = themesMap[themeName];
    const mergedTheme: Theme = {
        ...baseTheme,
        font: {
            ...baseTheme.font,
            titleSize: customSettings.titleSize || baseTheme.font.titleSize,
            titleColor: customSettings.titleColor || baseTheme.font.titleColor,
            bodySize: customSettings.bodySize || baseTheme.font.bodySize,
            bodyColor: customSettings.bodyColor || baseTheme.font.bodyColor,
            buttonSize: customSettings.buttonSize || baseTheme.font.buttonSize,
            buttonColor: customSettings.buttonColor || baseTheme.font.buttonColor,
        }
    };
    
    return {
        theme: mergedTheme,
        setTheme: setThemeName,
        setTitleFontSize,
        setTitleFontColor,
        setTitleGradient,
        setBodyFontSize,
        setBodyFontColor,
        setBodyFontGradient,
        setButtonFontSize,
        setButtonFontColor,
        setButtonFontGradient,
        customSettings,
    };
  }, [themeName, customSettings]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};