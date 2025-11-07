import React from 'react';
import { Question, Answer } from '../types';
import Card from './common/Card';
import { useTranslation } from '../hooks/useTranslation';

interface QuizScreenProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  onAnswer: (questionIndex: number, value: number) => void;
  onPrevious: () => void;
  onFinish: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  onAnswer,
  onPrevious,
  onFinish,
}) => {
  const { t } = useTranslation();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionIndex === currentQuestionIndex)?.value;
  
  const answerOptions = [
    { label: t('answerStronglyDisagree'), value: -2 },
    { label: t('answerDisagree'), value: -1 },
    { label: t('answerNeutral'), value: 0 },
    { label: t('answerAgree'), value: 1 },
    { label: t('answerStronglyAgree'), value: 2 },
  ];

  if (!currentQuestion) {
    return <div>{t('noQuestion')}</div>;
  }

  const unselectedClasses = 'bg-[var(--answer-box-bg)] border-[var(--answer-box-border)] hover:bg-[var(--answer-box-hover-bg)] hover:border-[var(--accent-border)]';

  return (
    <Card>
      <div className="p-6 sm:p-8">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[var(--progress-bg)]">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] transition-all duration-500"
            ></div>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t('questionProgress', { current: currentQuestionIndex + 1, total: questions.length })}</p>
        </div>

        <h2 className="app-title font-semibold mb-8 text-center min-h-[6rem] flex items-center justify-center">
          {currentQuestion.statement}
        </h2>

        <div className="space-y-3">
          {answerOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onAnswer(currentQuestionIndex, value)}
              className={`w-full text-start p-4 rounded-lg border-2 transition-all duration-200 ${
                currentAnswer === value
                  ? 'bg-[var(--accent-color)] border-[var(--accent-border)] text-[var(--accent-text)] shadow-md'
                  : unselectedClasses
              }`}
            >
              <span className={currentAnswer === value ? '' : 'app-body-text'}>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
            <button
                onClick={onPrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span className="app-button-text font-semibold" style={{'--button-font-color': '#4B5563'} as React.CSSProperties}>{t('previousButton')}</span>
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
                <button
                    onClick={onFinish}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 transition-opacity"
                >
                    <span className="app-button-text font-semibold" style={{'--button-font-color': '#FFFFFF'} as React.CSSProperties}>{t('viewResultsButton')}</span>
                </button>
            ) : (
                <button 
                    disabled
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 opacity-50 cursor-not-allowed"
                >
                     <span className="app-button-text font-semibold" style={{'--button-font-color': '#4B5563'} as React.CSSProperties}>{t('nextButton')}</span>
                </button>
            )}
        </div>
      </div>
    </Card>
  );
};

export default QuizScreen;