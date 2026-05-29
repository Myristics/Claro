import React from 'react';

type ProgressColor = 'brand' | 'warning' | 'error';

interface ProgressProps {
  value: number;
  label?: string;
  showValue?: boolean;
  color?: ProgressColor;
  className?: string;
  style?: React.CSSProperties;
}

const colorMap: Record<ProgressColor, { bar: string; text: string }> = {
  brand:   { bar: 'var(--score-good-bar)',  text: 'var(--score-good-text)' },
  warning: { bar: 'var(--score-low-bar)',   text: 'var(--score-low-text)' },
  error:   { bar: 'var(--state-error-text)', text: 'var(--state-error-text)' },
};

function resolveColor(value: number, explicit?: ProgressColor): ProgressColor {
  if (explicit) return explicit;
  return value >= 75 ? 'brand' : 'warning';
}

export function Progress({ value, label, showValue = false, color, className, style }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const resolved = resolveColor(clamped, color);
  const { bar, text } = colorMap[resolved];

  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...style }}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <span style={{
              fontFamily: 'var(--font-base)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{
              fontFamily: 'var(--font-base)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: text,
              marginLeft: 'auto',
            }}>
              {clamped}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--border-light)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${clamped}%`,
            backgroundColor: bar,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

export default Progress;
