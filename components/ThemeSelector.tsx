import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../styles/themes';
import { useTranslation } from '../hooks/useTranslation';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themeNames: { [key: string]: string } = {
      'Default Light': t('themeDefaultLight'),
      'Default Dark': t('themeDefaultDark'),
      'Neon Dreams': t('themeNeonDreams'),
      'Amber Glow': t('themeAmberGlow'),
      'Emerald Forest': t('themeEmeraldForest'),
      'Oceanic Breeze': t('themeOceanicBreeze'),
      'Crimson Night': t('themeCrimsonNight'),
      'Vintage Paper': t('themeVintagePaper'),
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map((t) => (
        <div key={t.name} className="flex flex-col items-center">
            <button
              title={themeNames[t.name] || t.name}
              onClick={() => setTheme(t.name)}
              className={`w-full h-20 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none flex flex-col justify-end p-2 ${
                theme.name === t.name ? 'ring-2 ring-offset-2 ring-[var(--accent-color)] ring-offset-transparent' : 'ring-1 ring-gray-500/50'
              }`}
            >
              {/* FIX: The 'Theme' type does not have a 'card' property. Using the theme's progress bar background color as a representative color for the card preview. */}
              <div className="w-full h-1/2 rounded-md p-1" style={{ backgroundColor: t.colors['--progress-bg'] }}>
                  <div className="w-full h-full rounded" style={{ background: `linear-gradient(to right, ${t.colors['--gradient-from']}, ${t.colors['--gradient-to']})` }}></div>
              </div>
            </button>
            <span className="text-xs mt-1 text-center" style={{ color: 'var(--text-secondary-color)'}}>{themeNames[t.name] || t.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ThemeSelector;