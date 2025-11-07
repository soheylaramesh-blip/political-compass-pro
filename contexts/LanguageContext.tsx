
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Language } from '../types.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  loading: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'fa',
  setLanguage: () => console.warn('no language provider'),
  translations: {},
  loading: true,
});

const LANGUAGE_KEY = 'app-language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const storedLang = window.localStorage.getItem(LANGUAGE_KEY);
      return storedLang === 'en' || storedLang === 'fa' ? storedLang : 'fa';
    } catch {
      return 'fa';
    }
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      setLoading(true);
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${language}`);
        }
        const data = await response.json();
        setTranslations(data);

        // Update document attributes and title after translations are loaded
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
        document.title = data.welcomeTitle || (language === 'fa' ? 'آزمون گرایش سیاسی' : 'Political Compass Test');
        
        window.localStorage.setItem(LANGUAGE_KEY, language);
      } catch (error) {
        console.error('Could not load translations:', error);
        // Fallback or error handling can be added here
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {!loading ? children : null}
    </LanguageContext.Provider>
  );
};