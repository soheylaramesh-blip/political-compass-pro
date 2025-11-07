import { Router, IRequest } from 'itty-router';
import { handleTelegramUpdate } from './telegram';
import { handleDiscordInteraction, registerDiscordCommands } from './discord';
import { Env } from './utils';

// FIX: Add type definition for ExecutionContext, which is a Cloudflare Workers global.
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

const router = Router();

// Endpoint for Telegram Bot Webhook
router.post('/telegram', (request: IRequest, env: Env) => handleTelegramUpdate(request, env));

// Endpoint for Discord Bot Interactions
router.post('/discord', (request: IRequest, env: Env) => handleDiscordInteraction(request, env));

// Secure endpoint to register Discord commands
// You should call this once after deployment.
router.post('/register-discord-commands', async (request: IRequest, env: Env) => {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    if (secret !== env.RANDOM_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    try {
        await registerDiscordCommands(env);
        return new Response('Discord commands registered successfully!');
    } catch (e: any) {
        console.error("Failed to register commands", e);
        return new Response(`Failed to register commands: ${e.message}`, { status: 500 });
    }
});


// 404 handler
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return router.handle(request, env, ctx);
    },
};