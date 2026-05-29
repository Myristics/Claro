import React, { useEffect } from 'react';
import { IconX, IconInfoCircle, IconCircleCheck, IconAlertCircle } from '@tabler/icons-react';
import styles from './Toast.module.css';

type ToastVariant = 'info' | 'success' | 'error';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss: () => void;
  duration?: number;
}

const iconMap: Record<ToastVariant, React.ReactNode> = {
  info:    <IconInfoCircle size={16} style={{ color: 'var(--brand-mid)' }} />,
  success: <IconCircleCheck size={16} style={{ color: 'var(--brand)' }} />,
  error:   <IconAlertCircle size={16} style={{ color: 'var(--state-error-text)' }} />,
};

export function Toast({ message, variant = 'info', onDismiss, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  const classes = [styles.toast, styles[`variant-${variant}`]].join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className={styles.icon}>{iconMap[variant]}</span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.dismiss}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}

export default Toast;
