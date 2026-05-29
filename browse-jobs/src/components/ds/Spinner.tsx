import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'brand' | 'white' | 'secondary';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 14,
  md: 20,
  lg: 28,
};

const colorMap: Record<SpinnerColor, string> = {
  brand: 'var(--brand)',
  white: '#ffffff',
  secondary: 'var(--text-secondary)',
};

const keyframesInjected = { current: false };
function injectKeyframes() {
  if (keyframesInjected.current || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = `@keyframes ds-spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
  keyframesInjected.current = true;
}

export function Spinner({ size = 'md', color = 'brand', className, style }: SpinnerProps) {
  injectKeyframes();
  const px = sizeMap[size];
  const borderColor = colorMap[color];

  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        borderRadius: '50%',
        border: `2px solid ${borderColor}`,
        borderTopColor: 'transparent',
        animation: 'ds-spin 0.65s linear infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export default Spinner;
