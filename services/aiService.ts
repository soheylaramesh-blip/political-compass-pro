import { GoogleGenAI, Type } from "@google/genai";
import { Question, Scores, Analysis, AISettings, Language } from '../types.ts';

const handleFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorBody}`);
  }
  return response.json();
};

const getOpenAICompatibleCompletion = async (prompt: string, settings: AISettings, isJsonMode: boolean) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
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

  const data = await handleFetch(settings.baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const content = data.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Invalid response structure from AI model.");
  }
  return content;
};

const getOllamaCompletion = async (prompt: string, settings: AISettings) => {
  const body = {
    model: settings.model,
    prompt: prompt,
    format: 'json',
    stream: false,
  };
  const data = await handleFetch(settings.baseUrl + '/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data.response; // Ollama nests the JSON string in the 'response' key
};


// --- Questions Generation ---
const langMap: Record<Language, string> = {
  en: "English",
  fa: "Persian",
};

const getQuestionPrompt_Gemini = (count: number, lang: Language) => `
  You are an expert in political science and psychometrics. Generate ${count} unbiased, simple, and clear statements for a political compass test in ${langMap[lang]}. The statements should cover a range of topics for both the Economic (Left/Right) and Social (Authoritarian/Libertarian) axes.
  Return the output as a valid JSON array of objects. Do not include any text, code block markers, or explanations outside the JSON array itself.
  Each object must have the following structure:
  {
    "statement": "The ${langMap[lang]} statement for the user to respond to.",
    "axis": "economic" or "social",
    "effect": 1 or -1
  }
  - "axis": "economic" for statements related to economy, markets, and wealth distribution.
  - "axis": "social" for statements related to personal freedoms, social order, and traditions.
  - "effect": 
    - For "economic" axis: 1 means agreement moves the score towards the Right (capitalism). -1 means agreement moves the score towards the Left (socialism).
    - For "social" axis: 1 means agreement moves the score towards Authoritarianism (state control). -1 means agreement moves the score towards Libertarianism (personal freedom).
`;

const getQuestionPrompt_OpenAI = (count: number, lang: Language) => `
  You are an expert in political science and psychometrics. Generate ${count} unbiased, simple, and clear statements for a political compass test in ${langMap[lang]}.
  Return the output as a single valid JSON object with a key "questions". The value of "questions" should be an array of objects.
  Each object must have the structure: {"statement": "The ${langMap[lang]} statement.", "axis": "economic" or "social", "effect": 1 or -1}.
  - "axis": "economic" for economy/markets. "social" for personal freedoms/order.
  - "effect" (economic): 1 for Right (capitalism), -1 for Left (socialism).
  - "effect" (social): 1 for Authoritarianism, -1 for Libertarianism.
  Do not include any other text or explanations.
`;

export const generateQuestions = async (count: number, settings: AISettings, lang: Language): Promise<Question[]> => {
  try {
    let jsonString: string;

    switch (settings.provider) {
      case 'GEMINI':
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: settings.model,
            contents: getQuestionPrompt_Gemini(count, lang),
        });
        jsonString = response.text.trim().replace(/^```json\s*|```$/g, '');
        break;

      case 'OPENROUTER':
      case 'CUSTOM':
        const openAIResult = await getOpenAICompatibleCompletion(getQuestionPrompt_OpenAI(count, lang), settings, true);
        const parsedResult = JSON.parse(openAIResult);
        return parsedResult.questions as Question[];

      case 'OLLAMA':
        const ollamaResult = await getOllamaCompletion(getQuestionPrompt_OpenAI(count, lang), settings);
        const parsedOllama = JSON.parse(ollamaResult);
        return parsedOllama.questions as Question[];
        
      default:
        throw new Error("Unsupported AI provider");
    }

    return JSON.parse(jsonString) as Question[];

  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch questions from the AI model.");
  }
};


// --- Results Analysis ---

const getAnalysisPrompt = (scores: Scores, lang: Language) => `
  You are a political analyst. A user has completed a political compass test. Their final scores are:
  Economic Axis: ${scores.economic.toFixed(2)} (where -10 is far-left and +10 is far-right)
  Social Axis: ${scores.social.toFixed(2)} (where -10 is libertarian and +10 is authoritarian)
  Based on these scores, provide a detailed analysis in ${langMap[lang]}.
  Return the output as a single, valid JSON object. Do not include any text, code block markers, or explanations outside the JSON object itself.
  The JSON object must have the following structure:
  {
    "quadrantName": "A short, descriptive name for their political quadrant in ${langMap[lang]} (e.g., 'Left Libertarian', 'Authoritarian Conservative', 'Centrist').",
    "quadrantDescription": "A paragraph in ${langMap[lang]} explaining what this political quadrant generally represents, its core values, and common beliefs.",
    "behavioralAnalysis": "A paragraph in ${langMap[lang]} describing the likely behavioral patterns, decision-making styles, and perspectives on social and political issues for someone in this quadrant."
  }
`;

export const analyzeResults = async (scores: Scores, settings: AISettings, lang: Language): Promise<Analysis> => {
  const prompt = getAnalysisPrompt(scores, lang);

  try {
     let jsonString: string;
     switch (settings.provider) {
        case 'GEMINI':
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
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
  } catch (error) {
    console.error("Error analyzing results:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze results from the AI model.");
  }
};