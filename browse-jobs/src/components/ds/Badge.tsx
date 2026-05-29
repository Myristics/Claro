import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'active' | 'draft' | 'inactive' | 'urgent' | 'resolved' | 'passive' | 'error' | 'brand';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'passive',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}

export default Badge;
