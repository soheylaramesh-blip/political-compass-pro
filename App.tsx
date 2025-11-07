
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import QuizScreen from './components/QuizScreen.tsx';
import ResultsScreen from './components/ResultsScreen.tsx';
import LoadingSpinner from './components/common/LoadingSpinner.tsx';
import { useQuiz } from './hooks/useQuiz.ts';
import SettingsPanel from './components/SettingsPanel.tsx';
import { useTheme } from './contexts/ThemeContext.tsx';
import GuideModal from './components/GuideModal.tsx';
import { useTranslation } from './hooks/useTranslation.ts';

const App: React.FC = () => {
  const {
    gameState,
    level,
    questions,
    currentQuestionIndex,
    answers,
    results,
    isLoading,
    error,
    startTest,
    answerQuestion,
    goToPreviousQuestion,
    finishTest,
    restartTest,
  } = useQuiz();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-200">{t('loadingTest')}</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{t('errorOccurred')}</h2>
            <p className="text-gray-700 bg-red-100 p-3 rounded-lg">{error}</p>
            <button
                onClick={restartTest}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                {t('retry')}
            </button>
        </div>
       );
    }
    
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={startTest} />;
      case 'quiz':
        return (
          <QuizScreen
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onAnswer={answerQuestion}
            onPrevious={goToPreviousQuestion}
            onFinish={finishTest}
          />
        );
      case 'results':
        return <ResultsScreen results={results} onStartNextLevel={startTest} onRestart={restartTest} />;
      default:
        return <WelcomeScreen onStart={startTest} />;
    }
  };

  return (
    <main
      className="min-h-screen text-gray-800 flex items-center justify-center p-4 transition-all duration-500"
    >
      <div className="w-full max-w-4xl mx-auto transition-all duration-500">
        {renderContent()}
      </div>
      <SettingsPanel onOpenGuide={() => setIsGuideOpen(true)} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </main>
  );
};

export default App;