import { IRequest } from 'itty-router';
import { Env, UserSession, Scores } from './utils';
import { generateQuestions, analyzeResults } from './ai';
import {
    APIInteraction,
    APIInteractionResponse,
    InteractionType,
    InteractionResponseType,
    MessageFlags,
    APIApplicationCommandInteraction,
    APIMessageComponentButtonInteraction,
    ButtonStyle
} from 'discord-api-types/v10';
import { verifyKey } from './discord-verify';

const QUESTIONS_PER_LEVEL = 10; // Shorter for bot interaction

const fa = {
    quizCmdName: "آزمون",
    quizCmdDesc: "یک آزمون گرایش سیاسی جدید را شروع کنید.",
    langOptionName: "زبان",
    langOptionDesc: "زبانی که برای آزمون استفاده می‌شود.",
    langEn: "English",
    langFa: "فارسی",
    quizInProgress: "شما در حال حاضر یک آزمون در حال انجام دارید. لطفاً آن را تمام کنید.",
    generatingQuestions: "⏳ در حال تولید سوالات برای شما...",
    questionTitle: "سوال {current} از {total}",
    agree: "موافقم",
    disagree: "مخالفم",
    stronglyAgree: "کاملاً موافقم",
    stronglyDisagree: "کاملاً مخالفم",
    neutral: "بی‌تفاوت",
    analyzing: "⏳ در حال تحلیل نتایج شما...",
    resultsTitle: "📊 نتایج آزمون شما",
    quadrant: "**گرایش سیاسی**: {quadrantName}",
    scores: "**امتیازها**:\nاقتصادی: `{economic}`\nاجتماعی: `{social}`",
    description: "**توضیحات**:\n{quadrantDescription}",
    behavioral: "**تحلیل رفتاری**:\n{behavioralAnalysis}",
    error: "خطایی رخ داد. لطفاً دوباره تلاش کنید."
};
const en = {
    quizCmdName: "quiz",
    quizCmdDesc: "Start a new political compass test.",
    langOptionName: "language",
    langOptionDesc: "The language to use for the test.",
    langEn: "English",
    langFa: "Persian",
    quizInProgress: "You already have a quiz in progress. Please complete it first.",
    generatingQuestions: "⏳ Generating questions for you...",
    questionTitle: "Question {current} of {total}",
    agree: "Agree",
    disagree: "Disagree",
    stronglyAgree: "Strongly Agree",
    stronglyDisagree: "Strongly Disagree",
    neutral: "Neutral",
    analyzing: "⏳ Analyzing your results...",
    resultsTitle: "📊 Your Test Results",
    quadrant: "**Political Quadrant**: {quadrantName}",
    scores: "**Scores**:\nEconomic: `{economic}`\nSocial: `{social}`",
    description: "**Description**:\n{quadrantDescription}",
    behavioral: "**Behavioral Analysis**:\n{behavioralAnalysis}",
    error: "An error occurred. Please try again."
};
const getT = (lang: 'fa' | 'en' = 'en') => (lang === 'fa' ? fa : en);


async function sendQuestion(session: UserSession, env: Env) {
    const t = getT(session.lang);
    const question = session.questions[session.currentQuestionIndex];
    const questionText = t.questionTitle
        .replace('{current}', (session.currentQuestionIndex + 1).toString())
        .replace('{total}', session.questions.length.toString());
    
    const response = {
        type: InteractionResponseType.UpdateMessage,
        data: {
            embeds: [{
                title: questionText,
                description: question.statement,
                color: 0x5865F2, // Discord blurple
            }],
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, style: ButtonStyle.Success, label: t.stronglyAgree, custom_id: '2' },
                        { type: 2, style: ButtonStyle.Success, label: t.agree, custom_id: '1' }
                    ]
                },
                {
                    type: 1,
                    components: [
                         { type: 2, style: ButtonStyle.Secondary, label: t.neutral, custom_id: '0' }
                    ]
                },
                {
                    type: 1,
                    components: [
                        { type: 2, style: ButtonStyle.Danger, label: t.disagree, custom_id: '-1' },
                        { type: 2, style: ButtonStyle.Danger, label: t.stronglyDisagree, custom_id: '-2' }
                    ]
                }
            ]
        }
    };
    
    await fetch(`https://discord.com/api/v10/webhooks/${session.applicationId}/${session.interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.data)
    });
}

async function finishQuiz(session: UserSession, env: Env) {
    const t = getT(session.lang);
    
    const scores: Scores = { economic: 0, social: 0 };
    session.answers.forEach((answerValue, index) => {
        const question = session.questions[index];
        if (question.axis === 'economic') scores.economic += answerValue * question.effect;
        else if (question.axis === 'social') scores.social += answerValue * question.effect;
    });

    const maxScore = session.questions.length * 2;
    scores.economic = (scores.economic / maxScore) * 10;
    scores.social = (scores.social / maxScore) * 10;

    const aiSettings = { provider: env.AI_PROVIDER, apiKey: env.AI_API_KEY, model: env.AI_MODEL, baseUrl: env.AI_BASE_URL };
    const analysis = await analyzeResults(scores, aiSettings, session.lang);

    const description = [
        t.quadrant.replace('{quadrantName}', analysis.quadrantName),
        t.scores.replace('{economic}', scores.economic.toFixed(2)).replace('{social}', scores.social.toFixed(2)),
        t.description.replace('{quadrantDescription}', analysis.quadrantDescription),
        t.behavioral.replace('{behavioralAnalysis}', analysis.behavioralAnalysis)
    ].join('\n\n');

    await fetch(`https://discord.com/api/v10/webhooks/${session.applicationId}/${session.interactionToken}/messages/@original`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: t.resultsTitle,
                description: description,
                color: 0x2ECC71, // Green
            }],
            components: []
        })
    });

    await env.SESSIONS.delete(session.applicationId + session.interactionToken);
}

export async function handleDiscordInteraction(request: IRequest, env: Env): Promise<Response> {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const isValid = signature && timestamp && verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
    if (!isValid) return new Response('Invalid signature', { status: 401 });

    const interaction: APIInteraction = JSON.parse(body);
    const userId = interaction.member?.user.id || interaction.user?.id;
    if (!userId) return new Response('Could not identify user', { status: 400 });
    
    try {
        if (interaction.type === InteractionType.Ping) {
            return new Response(JSON.stringify({ type: InteractionResponseType.Pong }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = interaction as APIApplicationCommandInteraction;
            const lang = command.data.options?.find(opt => opt.name === 'language')?.value as 'en' | 'fa' || 'en';
            const t = getT(lang);
            
            const existingSession: UserSession | null = await env.SESSIONS.get(userId);
            if (existingSession) {
                 return new Response(JSON.stringify({
                    type: InteractionResponseType.ChannelMessageWithSource,
                    data: { content: t.quizInProgress, flags: MessageFlags.Ephemeral }
                }), { headers: { 'Content-Type': 'application/json' } });
            }
            
            // Acknowledge the interaction first
            const ackResponse: APIInteractionResponse = {
                type: InteractionResponseType.DeferredChannelMessageWithSource,
                data: { content: t.generatingQuestions }
            };
            
            // Start generation in background after acknowledging
            setTimeout(async () => {
                const aiSettings = { provider: env.AI_PROVIDER, apiKey: env.AI_API_KEY, model: env.AI_MODEL, baseUrl: env.AI_BASE_URL };
                const questions = await generateQuestions(QUESTIONS_PER_LEVEL, aiSettings, lang);
                const newSession: UserSession = {
                    questions, answers: [], currentQuestionIndex: 0, level: 1, lang,
                    applicationId: interaction.application_id,
                    interactionToken: interaction.token,
                };
                await env.SESSIONS.put(userId, JSON.stringify(newSession), { expirationTtl: 3600 }); // 1 hour expiry
                await sendQuestion(newSession, env);
            }, 0);

            return new Response(JSON.stringify(ackResponse), { headers: { 'Content-Type': 'application/json' } });
        }

        if (interaction.type === InteractionType.MessageComponent) {
            const componentInteraction = interaction as APIMessageComponentButtonInteraction;
            const session: UserSession | null = await env.SESSIONS.get(userId, { type: 'json' });
            if (!session) return new Response(JSON.stringify({
                type: InteractionResponseType.UpdateMessage,
                data: { content: "This quiz has expired.", embeds: [], components: [] }
            }), { headers: { 'Content-Type': 'application/json' } });

            const answerValue = parseInt(componentInteraction.data.custom_id, 10);
            session.answers[session.currentQuestionIndex] = answerValue;
            session.currentQuestionIndex++;

            if (session.currentQuestionIndex < session.questions.length) {
                await env.SESSIONS.put(userId, JSON.stringify(session), { expirationTtl: 3600 });
                // We don't return a response here because `sendQuestion` will update the original message
                setTimeout(() => sendQuestion(session, env), 0);
            } else {
                 await env.SESSIONS.delete(userId);
                 const t = getT(session.lang);
                 const ackResponse = { type: InteractionResponseType.UpdateMessage, data: { content: t.analyzing, embeds: [], components: [] }};
                 setTimeout(() => finishQuiz(session, env), 0);
                 return new Response(JSON.stringify(ackResponse), { headers: { 'Content-Type': 'application/json' }});
            }
            
            // Acknowledge the button press immediately
            return new Response(JSON.stringify({ type: InteractionResponseType.DeferredUpdateMessage }), { headers: { 'Content-Type': 'application/json' } });

        }
    } catch (e: any) {
        console.error("Error in Discord handler:", e);
        if (interaction.token) {
            await fetch(`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: "An error occurred. Please try again.", embeds: [], components: [] })
            });
        }
    }

    return new Response('Interaction not handled', { status: 400 });
}

export async function registerDiscordCommands(env: Env) {
    const url = `https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/commands`;
    const quizCommand = {
        name: en.quizCmdName,
        description: en.quizCmdDesc,
        name_localizations: { fa: fa.quizCmdName },
        description_localizations: { fa: fa.quizCmdDesc },
        options: [{
            name: en.langOptionName,
            description: en.langOptionDesc,
            name_localizations: { fa: fa.langOptionName },
            description_localizations: { fa: fa.langOptionDesc },
            type: 3, // STRING
            required: false,
            choices: [
                { name: en.langEn, value: 'en', name_localizations: { fa: en.langEn } },
                { name: fa.langFa, value: 'fa', name_localizations: { fa: fa.langFa } }
            ]
        }]
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${env.DISCORD_BOT_TOKEN}`
        },
        body: JSON.stringify([quizCommand])
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to register commands: ${text}`);
    }
    console.log("Commands registered successfully!");
    return response;
}
