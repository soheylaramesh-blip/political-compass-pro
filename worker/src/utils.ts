// FIX: Add type definition for KVNamespace, which is a Cloudflare Workers global.
interface KVNamespace {
    get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
    put(key: string, value: string | ReadableStream | ArrayBuffer | FormData, options?: { expiration?: string | number; expirationTtl?: string | number; metadata?: any; }): Promise<void>;
    delete(key: string): Promise<void>;
}

// Shared types for the worker
export interface Question {
  statement: string;
  axis: 'economic' | 'social';
  effect: 1 | -1;
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

export interface AISettings {
  provider: 'GEMINI' | 'OPENROUTER' | 'CUSTOM' | 'OLLAMA';
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export interface UserSession {
    questions: Question[];
    answers: number[]; // Array of values (-2 to 2)
    currentQuestionIndex: number;
    level: number;
    lang: 'en' | 'fa';
    // For Discord, we need to store interaction details for follow-ups
    interactionToken?: string; 
    applicationId?: string;
}

// Environment variables provided by Cloudflare
export interface Env {
    // KV Namespace
    SESSIONS: KVNamespace;

    // Bot Tokens
    TELEGRAM_BOT_TOKEN: string;
    DISCORD_BOT_TOKEN: string;
    DISCORD_PUBLIC_KEY: string;
    DISCORD_APPLICATION_ID: string;

    // AI Provider Settings
    AI_PROVIDER: 'GEMINI' | 'OPENROUTER' | 'CUSTOM' | 'OLLAMA';
    AI_API_KEY: string;
    AI_MODEL: string;
    AI_BASE_URL?: string;

    // Worker secret
    RANDOM_SECRET: string;
}