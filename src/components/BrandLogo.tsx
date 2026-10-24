import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandMark: React.FC<{ size?: number }> = ({ size = 22 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-label="HackList Mark"
    >
      {/* Two adjacent circular shapes in deep burgundy */}
      <circle cx="7.5" cy="12" r="5.5" fill="#7B112D" />
      <circle cx="16.5" cy="12" r="4.5" fill="#7B112D" fillOpacity="0.85" />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showText = true }) => {
  const markSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  const textSize = size === 'sm' ? '1.1rem' : size === 'lg' ? '1.4rem' : '1.25rem';

  return (
    <div className="brand-link" tabIndex={0} role="button" aria-label="HackList Home">
      <BrandMark size={markSize} />
      {showText && (
        <span className="brand-text" style={{ fontSize: textSize }}>
          HackList
        </span>
      )}
    </div>
  );
};
