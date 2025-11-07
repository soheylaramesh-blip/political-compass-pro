import React, { useState } from 'react';
import Modal from './common/Modal';
import { useTranslation } from '../hooks/useTranslation';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] hover:underline font-semibold">
        {children}
    </a>
);

const CodeBlock: React.FC<{ children: React.ReactNode, allowCopy?: boolean }> = ({ children, allowCopy = true }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = React.Children.toArray(children).join('');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-black/50 text-white/90 p-4 rounded-lg overflow-x-auto text-sm my-2 relative group" dir="ltr">
            <code><pre className="whitespace-pre-wrap break-all">{children}</pre></code>
            {allowCopy && (
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-white/20 hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            )}
        </div>
    );
};

const GuideImage: React.FC<{ src: string, alt: string, caption: string }> = ({ src, alt, caption }) => (
    <figure className="my-4">
        <img src={src} alt={alt} className="rounded-lg border border-white/20 w-full max-w-2xl mx-auto" />
        <figcaption className="text-center text-sm mt-2 text-[var(--text-secondary-color)]">{caption}</figcaption>
    </figure>
);

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'about' | 'deploy'>('about');

    const TabButton: React.FC<{ tabId: 'about' | 'deploy', children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === tabId ? 'bg-[var(--card-bg)] text-[var(--text-color)]' : 'bg-black/20 text-[var(--text-secondary-color)] hover:bg-black/30'}`}
        >
            {children}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('guideTitle')}>
            <div className="flex border-b border-white/20">
                <TabButton tabId="about">{t('guideTabAbout')}</TabButton>
                {/* FIX: Corrected typo from Tab_Button to TabButton. */}
                <TabButton tabId="deploy">{t('guideTabDeploy')}</TabButton>
            </div>
            <div className="space-y-6 text-[var(--text-secondary-color)] leading-loose pt-6">
                {activeTab === 'about' && (
                    <section>
                        <h3 className="app-title text-lg font-bold mb-3 border-r-4 border-[var(--accent-color)] pr-3">{t('aboutTitle')}</h3>
                        <p>{t('aboutDesc1')}</p>
                        <p>{t('aboutDesc2')}</p>

                        <h4 className="app-title font-semibold mt-6 mb-3">{t('aboutFeaturesTitle')}</h4>
                        <ul className="list-disc list-inside space-y-2 pr-4">
                            <li>{t('featureMultiLevel')}</li>
                            <li>{t('featureDynamicQuestions')}</li>
                            <li>{t('featureVisualResults')}</li>
                            <li>{t('featureCustomizable')}</li>
                            <li>{t('featureExport')}</li>
                            <li>{t('featureMultiLanguage')}</li>
                            <li>{t('featureBots')}</li>
                        </ul>
                        
                        <h4 className="app-title font-semibold mt-6 mb-3">{t('aboutGalleryTitle')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <GuideImage src="/images/gallery-welcome.png" alt={t('galleryWelcomeAlt')} caption={t('galleryWelcomeCaption')} />
                           <GuideImage src="/images/gallery-quiz.png" alt={t('galleryQuizAlt')} caption={t('galleryQuizCaption')} />
                           <GuideImage src="/images/gallery-loading.png" alt={t('galleryLoadingAlt')} caption={t('galleryLoadingCaption')} />
                           <GuideImage src="/images/gallery-results.png" alt={t('galleryResultsAlt')} caption={t('galleryResultsCaption')} />
                        </div>
                    </section>
                )}
                {activeTab === 'deploy' && (
                     <section>
                        <h3 className="app-title text-lg font-bold mb-3 border-r-4 border-[var(--accent-color)] pr-3">{t('deployIntroTitle')}</h3>
                        <p>{t('deployIntroDescV2')}</p>

                        <h4 className="app-title font-semibold mt-6 mb-3">{t('deployPart1')}</h4>
                         <ol className="list-decimal list-inside space-y-3 pr-4">
                            <li>{t('deployPrereq1')} <GuideLink href="https://nodejs.org/">Node.js & npm</GuideLink>.</li>
                            <li>{t('deployPrereq2')} <GuideLink href="https://github.com/">GitHub</GuideLink>.</li>
                            <li>{t('deployPrereq3')} <GuideLink href="https://dash.cloudflare.com/sign-up">Cloudflare</GuideLink>.</li>
                         </ol>
                        
                        <h4 className="app-title font-semibold mt-6 mb-3">{t('deployPart2')}</h4>
                        <ol className="list-decimal list-inside space-y-3 pr-4">
                             <li>{t('deployFrontendCFLogin')}</li>
                             <li>{t('deployFrontendCFSelect')}</li>
                             <li>{t('deployFrontendCFConnect')}</li>
                             <li>{t('deployFrontendCFSettings')}
                                <CodeBlock allowCopy={false}>- Framework preset: <strong>None</strong>
- Build command: <i>(leave blank)</i>
- Build output directory: <strong>/</strong></CodeBlock>
                             </li>
                             <li>{t('deployFrontendCFDeploy')}</li>
                        </ol>

                        <h4 className="app-title font-semibold mt-6 mb-3">{t('deployPart3')}</h4>
                         <ol className="list-decimal list-inside space-y-3 pr-4">
                            <li>{t('deployBotsCreateTelegram')} <GuideLink href="https://t.me/BotFather">BotFather</GuideLink> {t('deployBotsAndSaveToken')}</li>
                            <li>{t('deployBotsCreateDiscord')} <GuideLink href="https://discord.com/developers/applications">Discord Developer Portal</GuideLink>. {t('deployBotsSaveDiscordIDs')}</li>
                         </ol>

                        <h4 className="app-title font-semibold mt-6 mb-3">{t('deployPart4')}</h4>
                         <ol className="list-decimal list-inside space-y-3 pr-4">
                            <li>{t('deployWorkerGetCode')}</li>
                            <li>{t('deployWorkerNav')} <CodeBlock allowCopy={false}>cd worker</CodeBlock></li>
                            <li>{t('deployWorkerInstall')} <CodeBlock allowCopy={false}>npm install</CodeBlock></li>
                            <li>{t('deployWorkerKV')} <CodeBlock>wrangler kv:namespace create SESSIONS</CodeBlock> {t('deployWorkerKV2')}</li>
                            <li>{t('deployWorkerConfigUI')}</li>
                            <li>{t('deployWorkerToml')}</li>
                            <li>{t('deployWorkerSecrets')}</li>
                            <li>{t('deployWorkerDeploy')} <CodeBlock>npm run deploy</CodeBlock></li>
                         </ol>
                        
                        <h4 className="app-title font-semibold mt-6 mb-3">{t('deployPart5')}</h4>
                         <ol className="list-decimal list-inside space-y-3 pr-4">
                             <li>{t('deployConnectGetURL')}</li>
                             <li><strong>{t('deployConnectTelegram')}</strong> {t('deployConnectTelegram2')}
                                 <CodeBlock>{`curl "https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=<YOUR_WORKER_URL>/telegram"`}</CodeBlock>
                             </li>
                              <li><strong>{t('deployConnectDiscord')}</strong> {t('deployConnectDiscord2')}
                                <CodeBlock>{`<YOUR_WORKER_URL>/discord`}</CodeBlock>
                             </li>
                             <li><strong>{t('deployConnectDiscordCmd')}</strong> {t('deployConnectDiscordCmd2')}
                                <CodeBlock>{`curl -X POST "<YOUR_WORKER_URL>/register-discord-commands?secret=<YOUR_RANDOM_SECRET>"`}</CodeBlock>
                                {t('deployConnectDiscordCmd3')}
                             </li>
                         </ol>
                         <p className="mt-6 font-semibold text-[var(--text-color)]">{t('deployDone')}</p>
                    </section>
                )}
            </div>
        </Modal>
    );
};

export default GuideModal;