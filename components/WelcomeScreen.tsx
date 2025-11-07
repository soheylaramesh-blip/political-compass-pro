
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { useTranslation } from '../hooks/useTranslation';

interface WelcomeScreenProps {
  onStart: (level: number) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="text-center p-6 sm:p-8">
        <h1 className="app-title font-bold mb-4">
          {t('welcomeTitle')}
        </h1>
        <p className="app-body-text mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary-color)'}}>
          {t('welcomeDescription')}
        </p>
        <Button onClick={() => onStart(1)}>
          {t('startLevel1Button')}
        </Button>
      </div>
    </Card>
  );
};

export default WelcomeScreen;