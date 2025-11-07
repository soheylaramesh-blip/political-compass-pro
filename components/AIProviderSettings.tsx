import React from 'react';
import { useAI } from '../contexts/AIProviderContext.tsx';
import { AIProvider } from '../types.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

const AIProviderSettings: React.FC = () => {
  const { aiSettings, setAiSettings } = useAI();
  const { t } = useTranslation();
  const { provider, apiKey, baseUrl, model } = aiSettings;

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAiSettings({ provider: e.target.value as AIProvider });
  };
  
  const renderSettings = () => {
    switch (provider) {
      case 'GEMINI':
        return <p className="text-xs text-center p-2 rounded-md bg-[var(--progress-bg)] text-[var(--text-secondary-color)]">{t('aiProviderGeminiDescription')}</p>;
      case 'OPENROUTER':
        return (
          <div className="space-y-2">
            <input
              type="password"
              placeholder={t('aiProviderOpenRouterApiKey')}
              value={apiKey}
              onChange={(e) => setAiSettings({ apiKey: e.target.value })}
              className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
            />
            <input
              type="text"
              placeholder={t('aiProviderModelName')}
              value={model}
              onChange={(e) => setAiSettings({ model: e.target.value })}
              className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
            />
          </div>
        );
      case 'OLLAMA':
        return (
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder={t('aiProviderOllamaUrl')}
                    value={baseUrl}
                    onChange={(e) => setAiSettings({ baseUrl: e.target.value })}
                    className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                    dir="ltr"
                />
                <input
                    type="text"
                    placeholder={t('aiProviderModelName')}
                    value={model}
                    onChange={(e) => setAiSettings({ model: e.target.value })}
                    className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                />
            </div>
        );
      case 'CUSTOM':
        return (
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder={t('aiProviderCustomUrl')}
                    value={baseUrl}
                    onChange={(e) => setAiSettings({ baseUrl: e.target.value })}
                    className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                    dir="ltr"
                />
                <input
                    type="password"
                    placeholder={t('aiProviderCustomApiKey')}
                    value={apiKey}
                    onChange={(e) => setAiSettings({ apiKey: e.target.value })}
                    className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                />
                 <input
                    type="text"
                    placeholder={t('aiProviderModelName')}
                    value={model}
                    onChange={(e) => setAiSettings({ model: e.target.value })}
                    className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-color)] placeholder:text-[var(--text-secondary-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
                />
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <select
        value={provider}
        onChange={handleProviderChange}
        className="w-full p-2 rounded-md bg-[var(--progress-bg)] border border-white/20 text-[var(--text-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:outline-none"
      >
        <option value="GEMINI">Google Gemini</option>
        <option value="OPENROUTER">OpenRouter</option>
        <option value="OLLAMA">{t('aiProviderOllama')}</option>
        <option value="CUSTOM">{t('aiProviderCustom')}</option>
      </select>
      {renderSettings()}
    </div>
  );
};

export default AIProviderSettings;