
import React, { useRef } from 'react';
import { Results } from '../types.ts';
import Card from './common/Card.tsx';
import Button from './common/Button.tsx';
import PoliticalCompassChart from './PoliticalCompassChart.tsx';
import ExportShare from './ExportShare.tsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';
import { useCardStyle } from '../contexts/CardStyleContext.tsx';

interface ResultsScreenProps {
  results: Results | null;
  onStartNextLevel: (level: number) => void;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onStartNextLevel, onRestart }) => {
  const { theme } = useTheme();
  const { cardStyle } = useCardStyle();
  const { t } = useTranslation();
  const resultsRef = useRef<HTMLDivElement>(null);

  if (!results) {
    return <p>{t('noResults')}</p>;
  }

  const { level, scores, analysis } = results;
  const nextLevel = level + 1;
  const canGoToNextLevel = nextLevel <= 3;

  const barData = [
    { name: t('economicAxis'), value: scores.economic, label: scores.economic > 0 ? t('right') : t('left') },
    { name: t('socialAxis'), value: scores.social, label: scores.social > 0 ? t('authoritarian') : t('libertarian') },
  ];
  
  const accentColor = theme.colors['--accent-color'];
  const secondaryAccentColor = theme.colors['--secondary-accent'];
  const quadrantColors = theme.chart.quadrantColors;
  const textColor = theme.colors['--text-color'];

  return (
    <>
      <div ref={resultsRef} className="space-y-6">
        <Card>
          <div className="p-6 text-center">
            <h1 className="app-title font-bold mb-2">
              {t('resultsTitle', { level })}
            </h1>
            <h2 className="app-title font-semibold">{analysis.quadrantName}</h2>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-4 h-96">
              <h3 className="app-title font-semibold text-center mb-2">{t('yourPoliticalCompass')}</h3>
              <PoliticalCompassChart scores={scores} accentColor={accentColor} quadrantColors={quadrantColors} />
            </div>
          </Card>
          <Card>
            <div className="p-4 h-96">
              <h3 className="app-title font-semibold text-center mb-2">{t('axesScores')}</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[-10, 10]} hide />
                    <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} tick={{ fill: textColor }} />
                    <Tooltip 
                      cursor={{fill: 'rgba(238, 234, 242, 0.5)'}} 
                      formatter={(value: number) => value.toFixed(2)}
                      contentStyle={{ backgroundColor: cardStyle.background, border: `1px solid ${cardStyle.border}`, color: 'var(--text-color)' }}
                     />
                    <Bar dataKey="value" barSize={30}>
                      {
                        barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value > 0 ? accentColor : secondaryAccentColor} />
                        ))
                      }
                    </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <h3 className="app-title font-semibold mb-3 border-r-4 border-[var(--accent-color)] pr-4">{t('quadrantDescriptionTitle')}</h3>
            <p className="app-body-text leading-relaxed" style={{ color: 'var(--text-secondary-color)'}}>{analysis.quadrantDescription}</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="app-title font-semibold mb-3 border-r-4 border-[var(--secondary-accent)] pr-4">{t('behavioralAnalysisTitle')}</h3>
            <p className="app-body-text leading-relaxed" style={{ color: 'var(--text-secondary-color)'}}>{analysis.behavioralAnalysis}</p>
          </div>
        </Card>
      </div>

      <ExportShare results={results} resultsRef={resultsRef} />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        {canGoToNextLevel && (
          <Button onClick={() => onStartNextLevel(nextLevel)}>
            {t('startNextLevelButton', { nextLevel })}
          </Button>
        )}
        <button
          onClick={onRestart}
          className="px-8 py-3 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <span className="app-button-text font-semibold" style={{'--button-font-color': '#4B5563'} as React.CSSProperties}>{t('restartTestButton')}</span>
        </button>
      </div>
    </>
  );
};

export default ResultsScreen;