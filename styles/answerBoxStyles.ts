export interface AnswerBoxStyle {
  name: string;
  background: string;
  border: string;
  hoverBackground: string;
}

export const answerBoxStyles: AnswerBoxStyle[] = [
  { name: 'Default', background: 'rgba(255, 255, 255, 0.95)', border: 'rgba(230, 230, 230, 0.8)', hoverBackground: 'rgba(243, 244, 246, 0.95)' },
  { name: 'Dark', background: 'rgba(55, 65, 81, 0.7)', border: 'rgba(75, 85, 99, 1)', hoverBackground: 'rgba(75, 85, 99, 0.9)' },
  { name: 'Subtle', background: 'rgba(238, 234, 242, 0.8)', border: 'rgba(209, 213, 219, 0.8)', hoverBackground: 'rgba(221, 214, 234, 0.9)' },
  { name: 'Transparent', background: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)', hoverBackground: 'rgba(255, 255, 255, 0.2)' },
  { name: 'Teal', background: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.3)', hoverBackground: 'rgba(20, 184, 166, 0.25)' },
];

export const answerBoxStylesMap: { [key: string]: AnswerBoxStyle } = answerBoxStyles.reduce((acc, style) => {
    acc[style.name] = style;
    return acc;
}, {} as { [key: string]: AnswerBoxStyle });