import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Scores } from '../types';
import { QuadrantColors } from '../styles/themes';
import { useTranslation } from '../hooks/useTranslation';

interface PoliticalCompassChartProps {
  scores: Scores;
  accentColor: string;
  quadrantColors: QuadrantColors;
}

const PoliticalCompassChart: React.FC<PoliticalCompassChartProps> = ({ scores, accentColor, quadrantColors }) => {
  const data = [{ x: scores.economic, y: scores.social }];
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" name={t('economicAxis')} domain={[-10, 10]} label={{ value: t('economicAxisLabel'), position: 'insideBottom', offset: -10, fill: quadrantColors.libertarianLeft.text }} tick={{ fill: quadrantColors.libertarianLeft.text }} />
        <YAxis type="number" dataKey="y" name={t('socialAxis')} domain={[-10, 10]} label={{ value: t('socialAxisLabel'), angle: -90, position: 'insideLeft', fill: quadrantColors.libertarianLeft.text }} tick={{ fill: quadrantColors.libertarianLeft.text }} />
        
        {/* Quadrant Backgrounds */}
        <ReferenceArea x1={-10} x2={0} y1={-10} y2={0} stroke="none" fill={quadrantColors.libertarianLeft.bg} fillOpacity={0.4} label={{value: t('quadrantLibLeft'), position: "inside", fill: quadrantColors.libertarianLeft.text}} />
        <ReferenceArea x1={0} x2={10} y1={-10} y2={0} stroke="none" fill={quadrantColors.libertarianRight.bg} fillOpacity={0.4} label={{value: t('quadrantLibRight'), position: "inside", fill: quadrantColors.libertarianRight.text}} />
        <ReferenceArea x1={-10} x2={0} y1={0} y2={10} stroke="none" fill={quadrantColors.authoritarianLeft.bg} fillOpacity={0.4} label={{value: t('quadrantAuthLeft'), position: "inside", fill: quadrantColors.authoritarianLeft.text}} />
        <ReferenceArea x1={0} x2={10} y1={0} y2={10} stroke="none" fill={quadrantColors.authoritarianRight.bg} fillOpacity={0.4} label={{value: t('quadrantAuthRight'), position: "inside", fill: quadrantColors.authoritarianRight.text}} />

        <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: number) => value.toFixed(2)} />
        <Scatter name={t('yourPosition')} data={data} fill={accentColor}>
           <svg x={-10} y={-10} width={20} height={20} fill={accentColor} viewBox="0 0 1024 1024">
              <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 928C282.3 928 96 741.7 96 512S282.3 96 512 96s416 186.3 416 416-186.3 416-416 416z"/>
              <path d="M512 384c-70.7 0-128 57.3-128 128s57.3 128 128 128 128-57.3 128-128-57.3-128-128-128zm0 192c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"/>
          </svg>
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default PoliticalCompassChart;