import { GoogleGenAI, Type } from "@google/genai";
import { Question, Scores, Analysis, AISettings } from './utils';

// Re-implementing the core AI logic for the worker environment
// This adapts the frontend's `aiService.ts` to use environment variables

const handleFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorBody}`);
  }
  return response.json();
};

const getOpenAICompatibleCompletion = async (prompt: string, settings: AISettings, isJsonMode: boolean) => {
  if (!settings.baseUrl) throw new Error("Base URL is required for this AI provider.");
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (settings.apiKey) {
    headers['Authorization'] = `Bearer ${settings.apiKey}`;
  }
  const body: any = {
    model: settings.model,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  };
  if (isJsonMode) {
     body.response_format = { type: 'json_object' };
  }
  const data = await handleFetch(settings.baseUrl, { method: 'POST', headers, body: JSON.stringify(body) });
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Invalid response structure from AI model.");
  return content;
};

const getOllamaCompletion = async (prompt: string, settings: AISettings) => {
  if (!settings.baseUrl) throw new Error("Base URL is required for Ollama provider.");
  const body = { model: settings.model, prompt: prompt, format: 'json', stream: false };
  const data = await handleFetch(settings.baseUrl + '/api/generate', { method: 'POST', body: JSON.stringify(body) });
  return data.response;
};

const langMap = { en: "English", fa: "Persian" };

const getQuestionPrompt = (count: number, lang: 'en' | 'fa', format: 'GEMINI' | 'OPENAI') => {
    const commonPrompt = `
      You are an expert in political science. Generate ${count} unbiased, simple statements for a political compass test in ${langMap[lang]}. Cover both Economic (Left/Right) and Social (Authoritarian/Libertarian) axes.
      Each object must have the structure: {"statement": "The statement.", "axis": "economic" or "social", "effect": 1 or -1}.
      - "axis": "economic" for economy/markets. "social" for personal freedoms/order.
      - "effect" (economic): 1 for Right (capitalism), -1 for Left (socialism).
      - "effect" (social): 1 for Authoritarianism, -1 for Libertarianism.
    `;
    if (format === 'GEMINI') {
        return `${commonPrompt} Return the output as a valid JSON array of objects. Do not include any text, code block markers, or explanations outside the JSON array itself.`;
    }
    return `${commonPrompt} Return the output as a single valid JSON object with a key "questions" whose value is an array of these objects. Do not include any other text or explanations.`;
};

export const generateQuestions = async (count: number, settings: AISettings, lang: 'en' | 'fa'): Promise<Question[]> => {
  let jsonString: string;
  switch (settings.provider) {
    case 'GEMINI':
      const ai = new GoogleGenAI({ apiKey: settings.apiKey as string });
      const response = await ai.models.generateContent({ model: settings.model, contents: getQuestionPrompt(count, lang, 'GEMINI') });
      jsonString = response.text.trim().replace(/^```json\s*|```$/g, '');
      break;
    case 'OPENROUTER':
    case 'CUSTOM':
      const openAIResult = await getOpenAICompatibleCompletion(getQuestionPrompt(count, lang, 'OPENAI'), settings, true);
      const parsedResult = JSON.parse(openAIResult);
      return parsedResult.questions as Question[];
    case 'OLLAMA':
      const ollamaResult = await getOllamaCompletion(getQuestionPrompt(count, lang, 'OPENAI'), settings);
      const parsedOllama = JSON.parse(ollamaResult);
      return parsedOllama.questions as Question[];
    default:
      throw new Error("Unsupported AI provider");
  }
  return JSON.parse(jsonString) as Question[];
};

const getAnalysisPrompt = (scores: Scores, lang: 'en' | 'fa') => `
  You are a political analyst. A user's scores are:
  Economic Axis: ${scores.economic.toFixed(2)} (-10 is far-left, +10 is far-right)
  Social Axis: ${scores.social.toFixed(2)} (-10 is libertarian, +10 is authoritarian)
  Provide an analysis in ${langMap[lang]}.
  Return a single, valid JSON object with the structure:
  {
    "quadrantName": "A short, descriptive name for their quadrant in ${langMap[lang]}.",
    "quadrantDescription": "A paragraph in ${langMap[lang]} explaining this quadrant's core values.",
    "behavioralAnalysis": "A paragraph in ${langMap[lang]} describing likely behavioral patterns and perspectives for someone in this quadrant."
  }
  Do not include any text or code block markers outside the JSON object.
`;

export const analyzeResults = async (scores: Scores, settings: AISettings, lang: 'en' | 'fa'): Promise<Analysis> => {
  const prompt = getAnalysisPrompt(scores, lang);
  let jsonString: string;
  switch (settings.provider) {
    case 'GEMINI':
      const ai = new GoogleGenAI({ apiKey: settings.apiKey as string });
      const response = await ai.models.generateContent({
        model: settings.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quadrantName: { type: Type.STRING },
              quadrantDescription: { type: Type.STRING },
              behavioralAnalysis: { type: Type.STRING },
            }
          }
        }
      });
      jsonString = response.text.trim();
      break;
    case 'OPENROUTER':
    case 'CUSTOM':
      jsonString = await getOpenAICompatibleCompletion(prompt, settings, true);
      break;
    case 'OLLAMA':
      jsonString = await getOllamaCompletion(prompt, settings);
      break;
    default:
      throw new Error("Unsupported AI provider");
  }
  return JSON.parse(jsonString) as Analysis;
};
