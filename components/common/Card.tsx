
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border ${className}`}
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      {children}
    </div>
  );
};

export default Card;