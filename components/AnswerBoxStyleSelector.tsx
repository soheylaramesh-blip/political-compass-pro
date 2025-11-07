import React from 'react';
import { useAnswerBoxStyle } from '../contexts/AnswerBoxStyleContext';
import { answerBoxStyles } from '../styles/answerBoxStyles';
import { useTranslation } from '../hooks/useTranslation';

const AnswerBoxStyleSelector: React.FC = () => {
  const { answerBoxStyle, setAnswerBoxStyle } = useAnswerBoxStyle();
  const { t } = useTranslation();

  const styleNames: { [key: string]: string } = {
      'Default': t('answerBoxStyleDefault'),
      'Dark': t('answerBoxStyleDark'),
      'Subtle': t('answerBoxStyleSubtle'),
      'Transparent': t('answerBoxStyleTransparent'),
      'Teal': t('answerBoxStyleTeal'),
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {answerBoxStyles.map((style) => (
        <button
          key={style.name}
          title={styleNames[style.name] || style.name}
          onClick={() => setAnswerBoxStyle(style.name)}
          className={`w-full h-12 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none flex items-center justify-center p-2 text-xs text-center font-semibold ${
            answerBoxStyle.name === style.name ? 'ring-2 ring-offset-2 ring-[var(--accent-color)] ring-offset-[var(--card-bg)]' : ''
          }`}
          style={{
            background: style.background,
            border: `2px solid ${style.border}`,
            color: 'var(--text-color)',
          }}
        >
          {styleNames[style.name] || style.name}
        </button>
      ))}
    </div>
  );
};

export default AnswerBoxStyleSelector;