export interface TitleGradient {
    name: string;
    from: string;
    to: string;
}

export const titleGradients: TitleGradient[] = [
    { name: 'Default', from: '', to: '' }, // Special case to use theme default
    { name: 'Sunset', from: '#F97794', to: '#623AA2' },
    { name: 'Ocean', from: '#2193b0', to: '#6dd5ed' },
    { name: 'Fire', from: '#ff416c', to: '#ff4b2b' },
    { name: 'Emerald', from: '#283c86', to: '#45a247' },
];

export const bodyGradients: TitleGradient[] = [
    { name: 'Default', from: '', to: '' },
    { name: 'Neon Aqua', from: '#00F260', to: '#0575E6' },
    { name: 'Cool Sky', from: '#2980B9', to: '#6DD5FA' },
    { name: 'Mojito', from: '#1D976C', to: '#93F9B9' },
    { name: 'Transparent White', from: 'rgba(255,255,255,0.9)', to: 'rgba(255,255,255,0.6)' },
];

export const buttonGradients: TitleGradient[] = [
    { name: 'Default', from: '', to: '' },
    { name: 'Gold', from: '#F7971E', to: '#FFD200' },
    { name: 'Royal', from: '#536976', to: '#292E49' },
    { name: 'Neon Pink', from: '#E94057', to: '#F27121' },
    { name: 'Transparent Dark', from: 'rgba(0,0,0,0.8)', to: 'rgba(0,0,0,0.6)' },
];


export const titleGradientsMap: { [key: string]: TitleGradient } = titleGradients.reduce((acc, grad) => {
    acc[grad.name] = grad;
    return acc;
}, {} as { [key: string]: TitleGradient });

export const bodyGradientsMap: { [key: string]: TitleGradient } = bodyGradients.reduce((acc, grad) => {
    acc[grad.name] = grad;
    return acc;
}, {} as { [key: string]: TitleGradient });

export const buttonGradientsMap: { [key: string]: TitleGradient } = buttonGradients.reduce((acc, grad) => {
    acc[grad.name] = grad;
    return acc;
}, {} as { [key: string]: TitleGradient });