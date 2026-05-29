import React from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4';
type HeadingSize = '2xl' | '3xl' | '4xl' | '5xl';
type HeadingWeight = 'medium' | 'semibold' | 'bold';

interface HeadingProps {
  as?: HeadingTag;
  size?: HeadingSize;
  weight?: HeadingWeight;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<HeadingSize, string> = {
  '2xl': 'var(--text-2xl)',
  '3xl': 'var(--text-3xl)',
  '4xl': 'var(--text-4xl)',
  '5xl': 'var(--text-5xl)',
};

const weightMap: Record<HeadingWeight, number> = {
  medium: 500,
  semibold: 600,
  bold: 700,
};

export function Heading({
  as: Tag = 'h2',
  size = '2xl',
  weight = 'semibold',
  children,
  className,
  style,
}: HeadingProps) {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: sizeMap[size],
        fontWeight: weightMap[weight],
        color: 'var(--text-primary)',
        lineHeight: 'var(--leading-snug)',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export default Heading;
