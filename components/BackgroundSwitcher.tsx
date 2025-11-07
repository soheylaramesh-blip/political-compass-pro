
import React from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import { backgrounds } from '../styles/backgrounds';

const BackgroundSwitcher: React.FC = () => {
  const { background, setBackground } = useBackground();

  return (
    <div className="grid grid-cols-4 gap-2">
      {backgrounds.map((bg) => (
        <button
          key={bg.name}
          title={bg.name}
          onClick={() => setBackground(bg.name)}
          className={`w-full h-12 rounded-md transition-all duration-200 hover:scale-110 focus:outline-none border-2 ${
            background.name === bg.name ? 'ring-2 ring-offset-2 ring-[var(--accent-color)] border-transparent' : 'border-gray-500/50'
          }`}
          style={bg.style}
        />
      ))}
    </div>
  );
};

export default BackgroundSwitcher;