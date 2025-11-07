import React from 'react';

export interface AppBackground {
  name: string;
  style: React.CSSProperties;
}

export interface QuadrantColors {
    libertarianLeft: { bg: string; text: string; };
    libertarianRight: { bg: string; text: string; };
    authoritarianLeft: { bg: string; text: string; };
    authoritarianRight: { bg: string; text: string; };
}

export interface Theme {
  name: string;
  chart: {
    quadrantColors: QuadrantColors;
  };
  font: {
    titleSize: string;
    titleColor: string;
    bodySize: string;
    bodyColor: string;
    buttonSize: string;
    buttonColor: string;
  };
  colors: {
    '--gradient-from': string;
    '--gradient-to': string;
    '--accent-color': string;
    '--accent-text': string;
    '--accent-border': string;
    '--secondary-accent': string;
    '--progress-bg': string;
    '--text-color': string;
    '--text-secondary-color': string;
  };
}

const defaultLightQuadrantColors: QuadrantColors = {
    libertarianLeft: { bg: "#d4edda", text: "#155724" },
    libertarianRight: { bg: "#d1ecf1", text: "#0c5460" },
    authoritarianLeft: { bg: "#f8d7da", text: "#721c24" },
    authoritarianRight: { bg: "#fff3cd", text: "#856404" },
};

const defaultDarkQuadrantColors: QuadrantColors = {
    libertarianLeft: { bg: "#155724", text: "#d4edda" },
    libertarianRight: { bg: "#0c5460", text: "#d1ecf1" },
    authoritarianLeft: { bg: "#721c24", text: "#f8d7da" },
    authoritarianRight: { bg: "#856404", text: "#fff3cd" },
};

export const themes: Theme[] = [
  {
    name: 'Default Light',
    chart: { quadrantColors: defaultLightQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#1F2937', bodySize: '1rem', bodyColor: '#4B5563', buttonSize: '1rem', buttonColor: '#FFFFFF' },
    colors: {
      '--gradient-from': '#8B5CF6',
      '--gradient-to': '#3B82F6',
      '--accent-color': '#8B5CF6',
      '--accent-text': '#FFFFFF',
      '--accent-border': '#7C3AED',
      '--secondary-accent': '#14B8A6',
      '--progress-bg': '#E9D5FF',
      '--text-color': '#1F2937',
      '--text-secondary-color': '#4B5563',
    },
  },
  {
    name: 'Default Dark',
    chart: { quadrantColors: defaultDarkQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#F9FAFB', bodySize: '1rem', bodyColor: '#D1D5DB', buttonSize: '1rem', buttonColor: '#F9FAFB' },
    colors: {
      '--gradient-from': '#A78BFA',
      '--gradient-to': '#60A5FA',
      '--accent-color': '#A78BFA',
      '--accent-text': '#1F2937',
      '--accent-border': '#8B5CF6',
      '--secondary-accent': '#2DD4BF',
      '--progress-bg': '#374151',
      '--text-color': '#F9FAFB',
      '--text-secondary-color': '#D1D5DB',
    },
  },
  {
    name: 'Neon Dreams',
    chart: { quadrantColors: defaultDarkQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#FFFFFF', bodySize: '1rem', bodyColor: '#E5E7EB', buttonSize: '1rem', buttonColor: '#FFFFFF' },
    colors: {
      '--gradient-from': '#F472B6',
      '--gradient-to': '#60A5FA',
      '--accent-color': '#F472B6',
      '--accent-text': '#FFFFFF',
      '--accent-border': '#EC4899',
      '--secondary-accent': '#38BDF8',
      '--progress-bg': 'rgba(244, 114, 182, 0.2)',
      '--text-color': '#FFFFFF',
      '--text-secondary-color': '#E5E7EB',
    },
  },
  {
    name: 'Amber Glow',
    chart: { quadrantColors: defaultDarkQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#FEF3C7', bodySize: '1rem', bodyColor: '#FDE68A', buttonSize: '1rem', buttonColor: '#451a03' },
    colors: {
      '--gradient-from': '#FBBF24',
      '--gradient-to': '#FB923C',
      '--accent-color': '#FBBF24',
      '--accent-text': '#451a03',
      '--accent-border': '#F59E0B',
      '--secondary-accent': '#F97316',
      '--progress-bg': 'rgba(251, 191, 36, 0.2)',
      '--text-color': '#FEF3C7',
      '--text-secondary-color': '#FDE68A',
    },
  },
  {
    name: 'Emerald Forest',
    chart: { quadrantColors: defaultDarkQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#D1FAE5', bodySize: '1rem', bodyColor: '#A7F3D0', buttonSize: '1rem', buttonColor: '#064E3B' },
    colors: {
      '--gradient-from': '#34D399',
      '--gradient-to': '#2DD4BF',
      '--accent-color': '#34D399',
      '--accent-text': '#064E3B',
      '--accent-border': '#10B981',
      '--secondary-accent': '#14B8A6',
      '--progress-bg': 'rgba(52, 211, 153, 0.2)',
      '--text-color': '#D1FAE5',
      '--text-secondary-color': '#A7F3D0',
    },
  },
  {
    name: 'Oceanic Breeze',
    chart: { quadrantColors: defaultLightQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#006064', bodySize: '1rem', bodyColor: '#00838F', buttonSize: '1rem', buttonColor: '#FFFFFF' },
    colors: {
      '--gradient-from': '#26A69A',
      '--gradient-to': '#26C6DA',
      '--accent-color': '#00BCD4',
      '--accent-text': '#FFFFFF',
      '--accent-border': '#00ACC1',
      '--secondary-accent': '#80DEEA',
      '--progress-bg': 'rgba(0, 188, 212, 0.2)',
      '--text-color': '#006064',
      '--text-secondary-color': '#00838F',
    },
  },
  {
    name: 'Crimson Night',
    chart: { quadrantColors: defaultDarkQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#FEE2E2', bodySize: '1rem', bodyColor: '#FECACA', buttonSize: '1rem', buttonColor: '#FFFFFF' },
    colors: {
      '--gradient-from': '#EF4444',
      '--gradient-to': '#D946EF',
      '--accent-color': '#F44336',
      '--accent-text': '#FFFFFF',
      '--accent-border': '#E53935',
      '--secondary-accent': '#EC4899',
      '--progress-bg': 'rgba(244, 67, 54, 0.2)',
      '--text-color': '#FEE2E2',
      '--text-secondary-color': '#FECACA',
    },
  },
  {
    name: 'Vintage Paper',
    chart: { quadrantColors: defaultLightQuadrantColors },
    font: { titleSize: '1.875rem', titleColor: '#4E342E', bodySize: '1rem', bodyColor: '#6D4C41', buttonSize: '1rem', buttonColor: '#FFFFFF' },
    colors: {
      '--gradient-from': '#A1887F',
      '--gradient-to': '#FFB74D',
      '--accent-color': '#795548',
      '--accent-text': '#FFFFFF',
      '--accent-border': '#6D4C41',
      '--secondary-accent': '#BCAAA4',
      '--progress-bg': 'rgba(121, 85, 72, 0.15)',
      '--text-color': '#4E342E',
      '--text-secondary-color': '#6D4C41',
    },
  },
];

export const themesMap: { [key: string]: Theme } = themes.reduce((acc, theme) => {
    acc[theme.name] = theme;
    return acc;
}, {} as { [key: string]: Theme });