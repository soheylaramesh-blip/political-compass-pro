
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-border)] transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      <span className="app-button-text">{children}</span>
    </button>
  );
};

export default Button;