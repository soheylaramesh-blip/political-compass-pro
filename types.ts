export interface Question {
  statement: string;
  axis: 'economic' | 'social';
  effect: 1 | -1;
}

export interface Answer {
  questionIndex: number;
  value: number;
}

export interface Scores {
  economic: number;
  social: number;
}

export interface Analysis {
  quadrantName: string;
  quadrantDescription: string;
  behavioralAnalysis: string;
}

export interface Results {
  level: number;
  scores: Scores;
  analysis: Analysis;
}

export type GameState = 'welcome' | 'quiz' | 'results';

export type AIProvider = 'GEMINI' | 'OPENROUTER' | 'OLLAMA' | 'CUSTOM';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export type Language = 'en' | 'fa';
