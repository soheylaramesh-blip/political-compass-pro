
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { language, translations } = useContext(LanguageContext);

  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[key] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([replKey, value]) => {
        translation = translation.replace(`{${replKey}}`, String(value));
      });
    }
    
    return translation;
  };

  return { t, language, dir: language === 'fa' ? 'rtl' : 'ltr' };
};
