import React from 'react';
import styles from './Chip.module.css';

type ChipSize = 'sm' | 'md';

interface ChipProps {
  label: string;
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: ChipSize;
  className?: string;
}

export function Chip({
  label,
  active = false,
  icon,
  onClick,
  size = 'md',
  className,
}: ChipProps) {
  const classes = [
    styles.chip,
    styles[`size-${size}`],
    active ? styles.active : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </button>
  );
}

export default Chip;
