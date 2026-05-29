import React from 'react';
import styles from './Text.module.css';

type TextSize = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'brand' | 'error';

interface TextProps {
  as?: 'p' | 'span' | 'label' | 'div';
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  htmlFor?: string;
}

export function Text({
  as: Tag = 'span',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  className,
  style,
  children,
  htmlFor,
}: TextProps) {
  const classes = [
    styles.text,
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    styles[`color-${color}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} style={style} {...(Tag === 'label' && htmlFor ? { htmlFor } : {})}>
      {children}
    </Tag>
  );
}

export default Text;
