import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { TitleGradient } from '../styles/gradients';

interface FontSettingsGroupProps {
    title: string;
    sizeConfig: { name: string; value: string }[];
    currentSize: string;
    onSizeChange: (value: string) => void;
    currentColor: string;
    onColorChange: (value: string) => void;
    gradientConfig: TitleGradient[];
    currentGradient: string;
    onGradientChange: (name: string) => void;
}

const FontSettingsGroup: React.FC<FontSettingsGroupProps> = ({
    title,
    sizeConfig,
    currentSize,
    onSizeChange,
    currentColor,
    onColorChange,
    gradientConfig,
    currentGradient,
    onGradientChange,
}) => {
    const { t } = useTranslation();

    const effectiveSize = currentSize || sizeConfig[1].value;

    return (
        <div>
            <h4 className="app-title font-semibold mb-2 text-center">{title}</h4>
            <div className="space-y-3">
                {/* Size Selector */}
                <div>
                    <h5 className="text-sm font-medium mb-1 text-[var(--text-secondary-color)]">{t('settingsFontSize')}</h5>
                    <div className="flex justify-center bg-[var(--progress-bg)] rounded-lg p-1">
                        {sizeConfig.map((size) => (
                            <button
                                key={size.name}
                                onClick={() => onSizeChange(size.value)}
                                className={`w-full text-center px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                                    effectiveSize === size.value
                                    ? 'bg-[var(--accent-color)] text-[var(--accent-text)] shadow'
                                    : 'text-[var(--text-color)] hover:bg-white/20'
                                }`}
                            >
                            {size.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Picker */}
                 <div>
                    <h5 className="text-sm font-medium mb-1 text-[var(--text-secondary-color)]">{t('settingsFontColor')}</h5>
                    <div className="flex items-center justify-between bg-[var(--progress-bg)] rounded-lg p-1">
                         <span className="text-xs pl-2" style={{ color: 'var(--text-color)' }}>
                            {t('colorPickerLabel')}
                        </span>
                        <input
                            type="color"
                            value={currentColor || '#000000'}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer bg-transparent"
                             style={{
                                backgroundColor: currentColor,
                            }}
                            title={t('colorPickerTitle')}
                        />
                    </div>
                </div>

                {/* Gradient Selector */}
                <div>
                     <h5 className="text-sm font-medium mb-1 text-[var(--text-secondary-color)]">{t('settingsFontGradient')}</h5>
                     <div className="flex items-center justify-center gap-2 flex-wrap bg-[var(--progress-bg)] rounded-lg p-2">
                        {gradientConfig.map((gradient) => (
                            <button
                            key={gradient.name}
                            title={gradient.name}
                            onClick={() => onGradientChange(gradient.name)}
                            className={`w-7 h-7 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none border-2 border-white/30 ${
                                currentGradient === gradient.name ? 'ring-2 ring-offset-1 ring-[var(--accent-color)] ring-offset-[var(--progress-bg)]' : ''
                            }`}
                            style={{
                                background: gradient.name === 'Default' 
                                ? 'conic-gradient(from 180deg at 50% 50%, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
                                : `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
                            }}
                            >
                            {gradient.name === 'Default' && <span className="text-white text-[10px] font-bold">A</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FontSettingsGroup;
