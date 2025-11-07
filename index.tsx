import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AIContextProvider } from './contexts/AIProviderContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { CardStyleProvider } from './contexts/CardStyleContext';
import { AnswerBoxStyleProvider } from './contexts/AnswerBoxStyleContext';

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