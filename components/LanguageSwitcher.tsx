import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext.tsx';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="flex justify-center bg-[var(--progress-bg)] rounded-lg p-1">
      <button
        onClick={() => setLanguage('fa')}
        className={`w-full text-center px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
          language === 'fa'
            ? 'bg-[var(--accent-color)] text-[var(--accent-text)] shadow'
            : 'text-[var(--text-color)] hover:bg-white/20'
        }`}
      >
        فارسی
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`w-full text-center px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
          language === 'en'
            ? 'bg-[var(--accent-color)] text-[var(--accent-text)] shadow'
            : 'text-[var(--text-color)] hover:bg-white/20'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;