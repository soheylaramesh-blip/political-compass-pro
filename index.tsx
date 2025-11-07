import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { AIContextProvider } from './contexts/AIProviderContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { BackgroundProvider } from './contexts/BackgroundContext.tsx';
import { CardStyleProvider } from './contexts/CardStyleContext.tsx';
import { AnswerBoxStyleProvider } from './contexts/AnswerBoxStyleContext.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BackgroundProvider>
        <CardStyleProvider>
          <AnswerBoxStyleProvider>
            <ThemeProvider>
              <AIContextProvider>
                <App />
              </AIContextProvider>
            </ThemeProvider>
          </AnswerBoxStyleProvider>
        </CardStyleProvider>
      </BackgroundProvider>
    </LanguageProvider>
  </React.StrictMode>
);