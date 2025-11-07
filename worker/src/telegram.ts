import { IRequest } from 'itty-router';
import { Env, UserSession, Scores } from './utils';
import { generateQuestions, analyzeResults } from './ai';

const API_URL = 'https://api.telegram.org/bot';
const QUESTIONS_PER_LEVEL = 10; // Shorter for bot interaction

interface TelegramUpdate {
    message?: {
        message_id: number;
        chat: { id: number };
        text?: string;
    };
    callback_query?: {
        id: string;
        from: { id: number };
        message: { chat: { id: number }, message_id: number };
        data: string;
    }
}

async function api(method: string, token: string, params?: object) {
    const response = await fetch(`${API_URL}${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    const data = await response.json();
    if (!data.ok) {
        console.error('Telegram API Error:', data);
    }
    return data;
}

const fa = {
    welcome: "به آزمون گرایش سیاسی خوش آمدید! برای شروع /quiz را ارسال کنید یا دکمه زیر را بزنید.",
    quizInProgress: "شما در حال حاضر یک آزمون در حال انجام دارید. برای شروع مجدد /reset را ارسال کنید.",
    generatingQuestions: "⏳ در حال تولید سوالات برای شما...",
    question: "سوال {current} از {total}:\n\n{statement}",
    agree: "موافقم",
    disagree: "مخالفم",
    stronglyAgree: "کاملاً موافقم",
    stronglyDisagree: "کاملاً مخالفم",
    neutral: "بی‌تفاوت",
    analyzing: "⏳ در حال تحلیل نتایج شما...",
    resultsTitle: "📊 نتایج آزمون شما",
    quadrant: "گرایش سیاسی: {quadrantName}",
    scores: "امتیازها:\nاقتصادی: {economic}\nاجتماعی: {social}",
    description: "توضیحات:\n{quadrantDescription}",
    behavioral: "تحلیل رفتاری:\n{behavioralAnalysis}",
    reset: "آزمون شما بازنشانی شد. برای شروع مجدد /quiz را ارسال کنید.",
    error: "خطایی رخ داد. لطفاً دوباره تلاش کنید."
};

const en = {
    welcome: "Welcome to the Political Compass Test! Send /quiz or press the button below to start.",
    quizInProgress: "You already have a quiz in progress. Send /reset to start over.",
    generatingQuestions: "⏳ Generating questions for you...",
    question: "Question {current} of {total}:\n\n{statement}",
    agree: "Agree",
    disagree: "Disagree",
    stronglyAgree: "Strongly Agree",
    stronglyDisagree: "Strongly Disagree",
    neutral: "Neutral",
    analyzing: "⏳ Analyzing your results...",
    resultsTitle: "📊 Your Test Results",
    quadrant: "Political Quadrant: {quadrantName}",
    scores: "Scores:\nEconomic: {economic}\nSocial: {social}",
    description: "Description:\n{quadrantDescription}",
    behavioral: "Behavioral Analysis:\n{behavioralAnalysis}",
    reset: "Your test has been reset. Send /quiz to start a new one.",
    error: "An error occurred. Please try again."
};

const getT = (lang: 'fa' | 'en') => (lang === 'fa' ? fa : en);

async function sendQuestion(chatId: number, session: UserSession, env: Env) {
    const t = getT(session.lang);
    const question = session.questions[session.currentQuestionIndex];
    const text = t.question
        .replace('{current}', (session.currentQuestionIndex + 1).toString())
        .replace('{total}', session.questions.length.toString())
        .replace('{statement}', question.statement);
    
    const keyboard = {
        inline_keyboard: [
            [{ text: t.stronglyAgree, callback_data: '2' }, { text: t.agree, callback_data: '1' }],
            [{ text: t.neutral, callback_data: '0' }],
            [{ text: t.disagree, callback_data: '-1' }, { text: t.stronglyDisagree, callback_data: '-2' }]
        ]
    };

    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, {
        chat_id: chatId,
        text: text,
        reply_markup: keyboard
    });
}

async function finishQuiz(chatId: number, session: UserSession, env: Env) {
    const t = getT(session.lang);
    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: t.analyzing });

    const scores: Scores = { economic: 0, social: 0 };
    session.answers.forEach((answerValue, index) => {
        const question = session.questions[index];
        if (question.axis === 'economic') scores.economic += answerValue * question.effect;
        else if (question.axis === 'social') scores.social += answerValue * question.effect;
    });

    const maxScore = session.questions.length * 2;
    scores.economic = (scores.economic / maxScore) * 10;
    scores.social = (scores.social / maxScore) * 10;

    const aiSettings = {
        provider: env.AI_PROVIDER,
        apiKey: env.AI_API_KEY,
        model: env.AI_MODEL,
        baseUrl: env.AI_BASE_URL
    };
    const analysis = await analyzeResults(scores, aiSettings, session.lang);

    const resultText = `
*${t.resultsTitle}*

*${t.quadrant.replace('{quadrantName}', analysis.quadrantName)}*

_${t.scores.replace('{economic}', scores.economic.toFixed(2)).replace('{social}', scores.social.toFixed(2))}_

*${t.description.split(':')[0]}:*
${analysis.quadrantDescription}

*${t.behavioral.split(':')[0]}:*
${analysis.behavioralAnalysis}
    `;

    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, {
        chat_id: chatId,
        text: resultText,
        parse_mode: 'Markdown'
    });

    await env.SESSIONS.delete(chatId.toString());
}


export async function handleTelegramUpdate(request: IRequest, env: Env): Promise<Response> {
    const body: TelegramUpdate = await request.json();

    try {
        if (body.message && body.message.text) {
            const chatId = body.message.chat.id;
            const text = body.message.text;
            const userId = chatId.toString();
            const session: UserSession | null = await env.SESSIONS.get(userId, { type: 'json' });

            if (text.startsWith('/start')) {
                const lang = text.includes('start fa') ? 'fa' : 'en';
                const t = getT(lang);
                if (session) {
                    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: t.quizInProgress });
                } else {
                    const keyboard = { inline_keyboard: [[{ text: "Start Quiz / شروع آزمون", callback_data: `start_${lang}` }]] };
                    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: t.welcome, reply_markup: keyboard });
                }
            } else if (text.startsWith('/quiz')) {
                 if (session) {
                    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: getT(session.lang).quizInProgress });
                } else {
                    const lang = text.includes('quiz fa') ? 'fa' : 'en';
                    const t = getT(lang);
                    await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: t.generatingQuestions });
                    const aiSettings = { provider: env.AI_PROVIDER, apiKey: env.AI_API_KEY, model: env.AI_MODEL, baseUrl: env.AI_BASE_URL };
                    const questions = await generateQuestions(QUESTIONS_PER_LEVEL, aiSettings, lang);
                    const newSession: UserSession = { questions, answers: [], currentQuestionIndex: 0, level: 1, lang };
                    await env.SESSIONS.put(userId, JSON.stringify(newSession));
                    await sendQuestion(chatId, newSession, env);
                }
            } else if (text.startsWith('/reset')) {
                const lang = session ? session.lang : 'en';
                await env.SESSIONS.delete(userId);
                await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: getT(lang).reset });
            }

        } else if (body.callback_query) {
            const chatId = body.callback_query.message.chat.id;
            const userId = chatId.toString();
            const callbackData = body.callback_query.data;

            await api('answerCallbackQuery', env.TELEGRAM_BOT_TOKEN, { callback_query_id: body.callback_query.id });

            if (callbackData.startsWith('start_')) {
                const lang = callbackData.split('_')[1] as 'en' | 'fa';
                const t = getT(lang);
                await api('editMessageText', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, message_id: body.callback_query.message.message_id, text: t.generatingQuestions, reply_markup: {} });
                const aiSettings = { provider: env.AI_PROVIDER, apiKey: env.AI_API_KEY, model: env.AI_MODEL, baseUrl: env.AI_BASE_URL };
                const questions = await generateQuestions(QUESTIONS_PER_LEVEL, aiSettings, lang);
                const newSession: UserSession = { questions, answers: [], currentQuestionIndex: 0, level: 1, lang };
                await env.SESSIONS.put(userId, JSON.stringify(newSession));
                await sendQuestion(chatId, newSession, env);
                return new Response('OK');
            }

            const session: UserSession | null = await env.SESSIONS.get(userId, { type: 'json' });
            if (!session) return new Response('OK'); // No session, ignore callback

            const answerValue = parseInt(callbackData, 10);
            session.answers[session.currentQuestionIndex] = answerValue;
            session.currentQuestionIndex++;
            
            await api('deleteMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, message_id: body.callback_query.message.message_id });

            if (session.currentQuestionIndex < session.questions.length) {
                await env.SESSIONS.put(userId, JSON.stringify(session));
                await sendQuestion(chatId, session, env);
            } else {
                await finishQuiz(chatId, session, env);
            }
        }
    } catch (e: any) {
        console.error('Error handling Telegram update:', e);
        const chatId = body.message?.chat.id || body.callback_query?.message.chat.id;
        if(chatId) {
             await api('sendMessage', env.TELEGRAM_BOT_TOKEN, { chat_id: chatId, text: en.error });
        }
    }

    return new Response('OK');
}