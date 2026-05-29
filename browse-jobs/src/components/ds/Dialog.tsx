import React, { useEffect, useRef } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const widthMap = { sm: '400px', md: '560px', lg: '720px' };

export function Dialog({ open, onClose, title, description, children, footer, size = 'md' }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: widthMap[size],
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - var(--space-8))',
          overflow: 'hidden',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: 'var(--space-5) var(--space-5) 0',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
              <span
                id="dialog-title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {title}
              </span>
              {description && (
                <p style={{
                  margin: 0,
                  fontFamily: 'var(--font-base)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-overlay-60)',
                  lineHeight: 'var(--leading-relaxed)',
                }}>
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-lg)',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--space-5)',
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '0 var(--space-5) var(--space-5)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dialog;
