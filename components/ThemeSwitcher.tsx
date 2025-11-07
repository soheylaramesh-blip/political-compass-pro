
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../styles/themes';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {themes.map((t) => (
        <button
          key={t.name}
          title={t.name}
          onClick={() => setTheme(t.name)}
          className={`w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none ${
            theme.name === t.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''
          }`}
          style={{
            background: `linear-gradient(to right, ${t.colors['--gradient-from']}, ${t.colors['--gradient-to']})`,
          }}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;