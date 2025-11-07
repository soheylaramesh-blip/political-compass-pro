import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { AIProvider } from '../types';

const InputField = ({ id, label, value, onChange, type = 'text', placeholder = '' }: { id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string, placeholder?: string }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-[var(--text-secondary-color)]">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 text-sm rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
            dir="ltr"
        />
    </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode, lang: string }> = ({ children, lang }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const textToCopy = React.Children.toArray(children).join('');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-black/50 text-white/90 rounded-lg text-sm my-2 relative group" dir="ltr">
            <div className="px-4 py-1 text-xs text-gray-400 border-b border-gray-600">{lang}</div>
            <pre className="p-4 whitespace-pre-wrap break-all"><code>{children}</code></pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-white/20 hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copied ? t('exportCopied') : t('botConfigCopyButton')}
            </button>
        </div>
    );
};


const BotConfigurator: React.FC = () => {
    const { t } = useTranslation();
    const [config, setConfig] = useState({
        telegramToken: '',
        discordAppId: '',
        discordPublicKey: '',
        discordToken: '',
        kvId: '',
        kvPreviewId: '',
        aiProvider: 'GEMINI' as AIProvider,
        aiApiKey: '',
        aiModel: 'gemini-2.5-flash',
        aiBaseUrl: '',
        randomSecret: ''
    });
    const [generatedOutput, setGeneratedOutput] = useState<{ toml: string; secrets: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setConfig(prev => ({ ...prev, [id]: value }));
    };

    const handleGenerate = () => {
        const toml = `name = "political-compass-bot"
main = "src/index.ts"
compatibility_date = "2024-04-05"

kv_namespaces = [
  { binding = "SESSIONS", id = "${config.kvId}", preview_id = "${config.kvPreviewId}" }
]

[vars]
RANDOM_SECRET = "${config.randomSecret}"
`;

        const secrets = `echo "Setting secrets for Cloudflare Worker..."
wrangler secret put TELEGRAM_BOT_TOKEN <<< "${config.telegramToken}"
wrangler secret put DISCORD_APPLICATION_ID <<< "${config.discordAppId}"
wrangler secret put DISCORD_PUBLIC_KEY <<< "${config.discordPublicKey}"
wrangler secret put DISCORD_BOT_TOKEN <<< "${config.discordToken}"
wrangler secret put AI_PROVIDER <<< "${config.aiProvider}"
wrangler secret put AI_MODEL <<< "${config.aiModel}"
${config.aiApiKey ? `wrangler secret put AI_API_KEY <<< "${config.aiApiKey}"` : ''}
${config.aiBaseUrl ? `wrangler secret put AI_BASE_URL <<< "${config.aiBaseUrl}"` : ''}
echo "All secrets have been set."
`;
        setGeneratedOutput({ toml, secrets: secrets.trim() });
    };

    return (
        <div className="space-y-4 text-sm">
            <p className="text-xs text-center p-2 rounded-md bg-[var(--progress-bg)] text-[var(--text-secondary-color)]">{t('botConfigDescription')}</p>
            
            <details className="space-y-3 bg-black/10 p-3 rounded-lg">
                <summary className="cursor-pointer font-semibold text-[var(--text-color)]">{t('botConfigTelegramTitle')}</summary>
                <InputField id="telegramToken" label={t('botConfigTelegramToken')} value={config.telegramToken} onChange={handleChange} type="password" />
            </details>

            <details className="space-y-3 bg-black/10 p-3 rounded-lg">
                <summary className="cursor-pointer font-semibold text-[var(--text-color)]">{t('botConfigDiscordTitle')}</summary>
                <InputField id="discordAppId" label={t('botConfigDiscordAppId')} value={config.discordAppId} onChange={handleChange} />
                <InputField id="discordPublicKey" label={t('botConfigDiscordPublicKey')} value={config.discordPublicKey} onChange={handleChange} />
                <InputField id="discordToken" label={t('botConfigDiscordToken')} value={config.discordToken} onChange={handleChange} type="password" />
            </details>

            <details className="space-y-3 bg-black/10 p-3 rounded-lg">
                <summary className="cursor-pointer font-semibold text-[var(--text-color)]">{t('botConfigKVTitle')}</summary>
                <InputField id="kvId" label={t('botConfigKVId')} value={config.kvId} onChange={handleChange} />
                <InputField id="kvPreviewId" label={t('botConfigKVPreviewId')} value={config.kvPreviewId} onChange={handleChange} />
            </details>

            <details className="space-y-3 bg-black/10 p-3 rounded-lg" open>
                <summary className="cursor-pointer font-semibold text-[var(--text-color)]">{t('botConfigAIProviderTitle')}</summary>
                <select id="aiProvider" value={config.aiProvider} onChange={handleChange} className="w-full p-2 text-sm rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none">
                    <option value="GEMINI">Google Gemini</option>
                    <option value="OPENROUTER">OpenRouter</option>
                    <option value="OLLAMA">{t('aiProviderOllama')}</option>
                    <option value="CUSTOM">{t('aiProviderCustom')}</option>
                </select>
                <InputField id="aiModel" label={t('aiProviderModelName')} value={config.aiModel} onChange={handleChange} />
                {(config.aiProvider === 'OPENROUTER' || config.aiProvider === 'CUSTOM') &&
                    <InputField id="aiApiKey" label={t('aiProviderCustomApiKey')} value={config.aiApiKey} onChange={handleChange} type="password" />
                }
                 {(config.aiProvider === 'OLLAMA' || config.aiProvider === 'CUSTOM') &&
                    <InputField id="aiBaseUrl" label={t('aiProviderCustomUrl')} value={config.aiBaseUrl} onChange={handleChange} placeholder="http://localhost:11434" />
                }
            </details>

             <details className="space-y-3 bg-black/10 p-3 rounded-lg">
                <summary className="cursor-pointer font-semibold text-[var(--text-color)]">{t('botConfigSecretTitle')}</summary>
                <p className="text-xs text-[var(--text-secondary-color)]">{t('botConfigSecretDescription')}</p>
                <InputField id="randomSecret" label="Secret" value={config.randomSecret} onChange={handleChange} type="password" />
            </details>

            <button onClick={handleGenerate} className="w-full text-center px-3 py-2 text-sm rounded-md transition-colors duration-200 bg-[var(--accent-color)] text-[var(--accent-text)] hover:brightness-110 font-semibold">
                {t('botConfigGenerateButton')}
            </button>

            {generatedOutput && (
                <div className="mt-4 space-y-4">
                    <div>
                        <h5 className="font-bold text-[var(--text-color)]">{t('botConfigTomlTitle')}</h5>
                        <p className="text-xs text-[var(--text-secondary-color)] mb-1">{t('botConfigTomlDescription')}</p>
                        <CodeBlock lang="toml">{generatedOutput.toml}</CodeBlock>
                    </div>
                     <div>
                        <h5 className="font-bold text-[var(--text-color)]">{t('botConfigSecretsTitle')}</h5>
                        <p className="text-xs text-[var(--text-secondary-color)] mb-1">{t('botConfigSecretsDescription')}</p>
                        <CodeBlock lang="shellscript">{generatedOutput.secrets}</CodeBlock>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotConfigurator;
