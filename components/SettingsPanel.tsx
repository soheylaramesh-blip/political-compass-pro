import React, { useState } from 'react';
import ThemeSelector from './ThemeSelector';
import AIProviderSettings from './AIProviderSettings';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';
import BackgroundSwitcher from './BackgroundSwitcher';
import CardStyleSelector from './CardStyleSelector';
import { useTheme } from '../contexts/ThemeContext';
import FontSettingsGroup from './FontSettingsGroup';
import { titleGradients, bodyGradients, buttonGradients } from '../styles/gradients';
import AnswerBoxStyleSelector from './AnswerBoxStyleSelector';
import BotConfigurator from './BotConfigurator';

interface SettingsPanelProps {
  onOpenGuide: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onOpenGuide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { customSettings, 
    setTitleFontSize, setTitleFontColor, setTitleGradient,
    setBodyFontSize, setBodyFontColor, setBodyFontGradient,
    setButtonFontSize, setButtonFontColor, setButtonFontGradient,
  } = useTheme();

  const titleSizeConfig = [ { name: t('sizeSmall'), value: '1.5rem' }, { name: t('sizeMedium'), value: '1.875rem' }, { name: t('sizeLarge'), value: '2.25rem' }];
  const bodySizeConfig = [ { name: t('sizeSmall'), value: '0.875rem' }, { name: t('sizeMedium'), value: '1rem' }, { name: t('sizeLarge'), value: '1.125rem' }];
  const buttonSizeConfig = [ { name: t('sizeSmall'), value: '0.875rem' }, { name: t('sizeMedium'), value: '1rem' }, { name: t('sizeLarge'), value: '1.125rem' }];


  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`absolute bottom-full right-0 mb-3 rounded-lg shadow-2xl bg-[var(--card-bg)] backdrop-blur-md border border-[var(--card-border)] transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ width: '280px' }}
      >
        <div className="space-y-4 p-4 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsLanguage')}</h4>
            <LanguageSwitcher />
          </div>
          <hr className="border-white/20" />
          <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsTheme')}</h4>
            <ThemeSelector />
          </div>
          <hr className="border-white/20" />
           <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsCardStyle')}</h4>
            <CardStyleSelector />
          </div>
          <hr className="border-white/20" />
          <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsAnswerBoxStyle')}</h4>
            <AnswerBoxStyleSelector />
          </div>
          <hr className="border-white/20" />
          <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsSelectBackground')}</h4>
            <BackgroundSwitcher />
          </div>
          <hr className="border-white/20" />
           <FontSettingsGroup
              title={t('settingsTitleFont')}
              sizeConfig={titleSizeConfig}
              currentSize={customSettings.titleSize}
              onSizeChange={setTitleFontSize}
              currentColor={customSettings.titleColor}
              onColorChange={setTitleFontColor}
              gradientConfig={titleGradients}
              currentGradient={customSettings.titleGradient}
              onGradientChange={setTitleGradient}
            />
          <hr className="border-white/20" />
            <FontSettingsGroup
              title={t('settingsContentFont')}
              sizeConfig={bodySizeConfig}
              currentSize={customSettings.bodySize}
              onSizeChange={setBodyFontSize}
              currentColor={customSettings.bodyColor}
              onColorChange={setBodyFontColor}
              gradientConfig={bodyGradients}
              currentGradient={customSettings.bodyGradient}
              onGradientChange={setBodyFontGradient}
            />
          <hr className="border-white/20" />
            <FontSettingsGroup
              title={t('settingsButtonFont')}
              sizeConfig={buttonSizeConfig}
              currentSize={customSettings.buttonSize}
              onSizeChange={setButtonFontSize}
              currentColor={customSettings.buttonColor}
              onColorChange={setButtonFontColor}
              gradientConfig={buttonGradients}
              currentGradient={customSettings.buttonGradient}
              onGradientChange={setButtonFontGradient}
            />
           <hr className="border-white/20" />
           <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('settingsAIConfig')}</h4>
            <AIProviderSettings />
          </div>
           <hr className="border-white/20" />
           <div>
            <h4 className="app-title font-semibold mb-2 text-center">{t('botConfigTitle')}</h4>
            <BotConfigurator />
          </div>
          <hr className="border-white/20" />
          <button
            onClick={onOpenGuide}
            className="w-full text-center px-3 py-2 text-sm rounded-md transition-colors duration-200 bg-white/10 text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-text)]"
          >
            {t('settingsViewGuide')}
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[var(--card-bg)] shadow-lg flex items-center justify-center hover:brightness-110 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 ring-offset-2 ring-[var(--accent-color)]"
        aria-label={t('settingsAriaLabel')}
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24" stroke="var(--text-color)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SettingsPanel;