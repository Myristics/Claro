import React from 'react';
import styles from './Callout.module.css';

type CalloutVariant = 'info' | 'warning' | 'error' | 'success';

interface CalloutProps {
  variant: CalloutVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Callout({ variant, icon, children, className }: CalloutProps) {
  const classes = [
    styles.callout,
    styles[`variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="note">
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default Callout;
