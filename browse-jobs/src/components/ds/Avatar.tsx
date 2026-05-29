import React from 'react';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarColor = 'brand' | 'secondary';

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  color?: AvatarColor;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<AvatarSize, { px: number; fontSize: string }> = {
  sm: { px: 24, fontSize: 'var(--text-xs)' },
  md: { px: 32, fontSize: 'var(--text-sm)' },
  lg: { px: 40, fontSize: 'var(--text-base)' },
};

const colorMap: Record<AvatarColor, { bg: string; text: string }> = {
  brand:     { bg: 'var(--nav-active-bg)', text: 'var(--brand)' },
  secondary: { bg: 'var(--page-bg)',       text: 'var(--text-secondary)' },
};

export function Avatar({ initials, size = 'md', color = 'brand', className, style }: AvatarProps) {
  const { px, fontSize } = sizeMap[size];
  const { bg, text } = colorMap[color];
  const display = initials.slice(0, 2).toUpperCase();

  return (
    <span
      className={className}
      aria-label={initials}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: bg,
        color: text,
        fontFamily: 'var(--font-base)',
        fontSize,
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {display}
    </span>
  );
}

export default Avatar;
