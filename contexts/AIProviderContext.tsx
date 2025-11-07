import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AISettings, AIProvider } from '../types.ts';

interface AIContextType {
  aiSettings: AISettings;
  setAiSettings: (settings: Partial<AISettings>) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const AI_SETTINGS_KEY = 'app-ai-settings';

const defaultSettings: AISettings = {
  provider: 'GEMINI',
  apiKey: '',
  baseUrl: '',
  model: 'gemini-2.5-flash',
};

// FIX: Renamed component to AIContextProvider to avoid naming conflict with the AIProvider type.
export const AIContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiSettings, setSettingsState] = useState<AISettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(AI_SETTINGS_KEY);
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
    } catch (error) {
      console.warn('Could not save AI settings to localStorage', error);
    }
  }, [aiSettings]);
  
  const setAiSettings = (newSettings: Partial<AISettings>) => {
    setSettingsState(prev => {
        const updated = {...prev, ...newSettings};
        // When provider changes, set sensible defaults for other fields
        if(newSettings.provider && newSettings.provider !== prev.provider) {
            switch(newSettings.provider) {
                case 'GEMINI':
                    updated.model = 'gemini-2.5-flash';
                    updated.baseUrl = '';
                    updated.apiKey = '';
                    break;
                case 'OPENROUTER':
                    updated.model = 'google/gemini-flash-1.5';
                    updated.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
                    updated.apiKey = '';
                    break;
                case 'OLLAMA':
                    updated.model = 'llama3';
                    updated.baseUrl = 'http://localhost:11434';
                    updated.apiKey = '';
                    break;
                case 'CUSTOM':
                    updated.model = '';
                    updated.baseUrl = '';
                    updated.apiKey = '';
                    break;
            }
        }
        return updated;
    });
  };

  const value = useMemo(() => ({
    aiSettings,
    setAiSettings,
  }), [aiSettings]);

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = (): AIContextType => {
  const context = useContext(AIContext);
  if (!context) {
    // FIX: Updated error message to reflect component rename.
    throw new Error('useAI must be used within an AIContextProvider');
  }
  return context;
};