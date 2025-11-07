export interface CardStyle {
  name: string;
  background: string;
  border: string;
}

export const cardStyles: CardStyle[] = [
  { name: 'Default', background: 'rgba(255, 255, 255, 0.95)', border: 'rgba(230, 230, 230, 0.5)' },
  { name: 'Dark', background: 'rgba(31, 41, 55, 0.95)', border: 'rgba(75, 85, 99, 0.5)' },
  { name: 'Transparent', background: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)' },
  { name: 'Neon Blue', background: 'rgba(12, 23, 54, 0.8)', border: 'rgba(59, 130, 246, 0.7)' },
  { name: 'Neon Pink', background: 'rgba(49, 11, 44, 0.8)', border: 'rgba(236, 72, 153, 0.7)' },
  { name: 'Frosted Glass', background: 'rgba(255, 255, 255, 0.4)', border: 'rgba(255, 255, 255, 0.3)' },
];

export const cardStylesMap: { [key: string]: CardStyle } = cardStyles.reduce((acc, style) => {
    acc[style.name] = style;
    return acc;
}, {} as { [key: string]: CardStyle });
