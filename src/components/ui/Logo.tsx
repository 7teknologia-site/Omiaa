import React from 'react';
import { useLogoSettings } from '../../utils/logoSettings';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'stacked' | 'horizontal' | 'icon' | 'badge';
  colorScheme?: 'default' | 'light' | 'dark' | 'blue' | 'gold';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  colorScheme = 'default',
  className = '',
  onClick,
}) => {
  const logoSettings = useLogoSettings();

  // Size height calculation
  const sizeScales = {
    sm: 0.75,
    md: 1,
    lg: 1.35,
    xl: 1.8,
  };

  const scale = sizeScales[size] || 1;
  const targetHeightMd = Math.round(logoSettings.heightMd * scale);
  const targetHeightSm = Math.round(logoSettings.heightSm * scale);

  const isDarkContainer = colorScheme === 'light'; // Light scheme parameter means container is dark (e.g. footer)

  // Determine effective blend mode: ensure background always merges seamlessly with store background
  const activeBlendMode =
    logoSettings.blendMode && logoSettings.blendMode !== 'normal'
      ? logoSettings.blendMode
      : isDarkContainer
      ? 'screen'
      : 'multiply';

  // Construct inline styles for exact blend mode, contrast, brightness & scale
  const imgStyle: React.CSSProperties = {
    height: `${targetHeightMd}px`,
    maxHeight: '100%',
    mixBlendMode: activeBlendMode as any,
    opacity: logoSettings.opacity / 100,
    filter: `contrast(${logoSettings.contrast}%) brightness(${logoSettings.brightness}%) ${
      isDarkContainer && logoSettings.invertInDarkTheme ? 'invert(1) hue-rotate(180deg)' : ''
    }`.trim(),
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center group select-none transition-transform duration-200 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${className}`}
    >
      <img
        src={logoSettings.logoUrl || '/logo.svg'}
        alt="Omiaá - Alquimia Ancestral"
        style={imgStyle}
        className={`w-auto object-contain transition-all duration-300`}
        loading="eager"
        onError={(e) => {
          // Fallback if custom base64 or URL fails
          const target = e.target as HTMLImageElement;
          if (target.src !== '/logo.svg') {
            target.src = '/logo.svg';
          }
        }}
      />
    </div>
  );
};
