import React from 'react';
import { useCardStyle } from '../contexts/CardStyleContext.tsx';
import { cardStyles } from '../styles/cardStyles.ts';

const CardStyleSelector: React.FC = () => {
  const { cardStyle, setCardStyle } = useCardStyle();

  return (
    <div className="grid grid-cols-3 gap-2">
      {cardStyles.map((style) => (
        <button
          key={style.name}
          title={style.name}
          onClick={() => setCardStyle(style.name)}
          className={`w-full h-16 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none flex items-center justify-center p-2 text-xs text-center font-semibold ${
            cardStyle.name === style.name ? 'ring-2 ring-offset-2 ring-[var(--accent-color)] ring-offset-[var(--card-bg)]' : ''
          }`}
          style={{
            background: style.background,
            border: `2px solid ${style.border}`,
            color: 'var(--text-color)',
          }}
        >
          {style.name}
        </button>
      ))}
    </div>
  );
};

export default CardStyleSelector;