
import { useState, useCallback } from 'react';
import { GameState, Question, Answer, Results, Scores } from '../types.ts';
import { generateQuestions, analyzeResults } from '../services/aiService.ts';
import { QUESTIONS_PER_LEVEL } from '../constants.ts';
import { useAI } from '../contexts/AIProviderContext.tsx';
import { useTranslation } from './useTranslation.ts';

export const useQuiz = () => {
  const { aiSettings } = useAI();
  const { t, language } = useTranslation();
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startTest = useCallback(async (startLevel: number) => {
    setIsLoading(true);
    setError(null);
    setGameState('welcome'); // to show loader on welcome bg
    try {
      const questionCount = QUESTIONS_PER_LEVEL[startLevel];
      const newQuestions = await generateQuestions(questionCount, aiSettings, language);
      
      setQuestions(prev => startLevel === 1 ? newQuestions : [...prev, ...newQuestions]);
      setLevel(startLevel);
      setCurrentQuestionIndex(startLevel === 1 ? 0 : questions.length);
      if (startLevel === 1) {
          setAnswers([]);
      }
      setGameState('quiz');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`${t('errorFetchQuestions')} (${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  }, [questions.length, aiSettings, language, t]);

  const answerQuestion = (questionIndex: number, value: number) => {
    const newAnswers = answers.filter(a => a.questionIndex !== questionIndex);
    setAnswers([...newAnswers, { questionIndex, value }]);
    
    // Automatically move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const scores: Scores = { economic: 0, social: 0 };
      answers.forEach(answer => {
        const question = questions[answer.questionIndex];
        if (question) {
          if (question.axis === 'economic') {
            scores.economic += answer.value * question.effect;
          } else if (question.axis === 'social') {
            scores.social += answer.value * question.effect;
          }
        }
      });
      
      const maxScore = answers.length * 2; // Max possible deviation from center
      scores.economic = (scores.economic / maxScore) * 10;
      scores.social = (scores.social / maxScore) * 10;

      const analysis = await analyzeResults(scores, aiSettings, language);
      const finalResults: Results = { level, scores, analysis };
      setResults(finalResults);
      setGameState('results');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`${t('errorAnalyzeResults')} (${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  }, [answers, questions, level, aiSettings, language, t]);

  const restartTest = () => {
    setGameState('welcome');
    setLevel(1);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
    setError(null);
  };

  return {
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
  };
};