import React from 'react';

export interface AppBackground {
  name: string;
  style: React.CSSProperties;
  textColor?: string;
}

export const backgrounds: AppBackground[] = [
  {
    name: 'Default',
    style: { background: '#F9FAFB' }, // bg-gray-50
  },
  {
    name: 'Cosmic',
    style: {
      background: 'linear-gradient(135deg, rgb(15, 12, 41), rgb(48, 43, 99), rgb(36, 36, 62))',
    },
    textColor: '#FFFFFF',
  },
  {
    name: 'Sunset',
    style: {
      background: 'linear-gradient(to right, rgb(255, 126, 95), rgb(254, 180, 123))',
    },
  },
  {
    name: 'Neon',
    style: {
      background: 'linear-gradient(45deg, rgb(240, 47, 194) 0%, rgb(96, 148, 234) 100%)',
    },
    textColor: '#FFFFFF',
  },
  {
    name: 'Forest',
    style: {
      background: 'linear-gradient(to top, rgb(9, 32, 63) 0%, rgb(83, 120, 149) 100%)',
    },
    textColor: '#FFFFFF',
  },
];

export const backgroundsMap: { [key: string]: AppBackground } = backgrounds.reduce((acc, bg) => {
    acc[bg.name] = bg;
    return acc;
}, {} as { [key: string]: AppBackground });