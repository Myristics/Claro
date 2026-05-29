import React, { useId } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  value?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  style,
  name,
  value,
}: CheckboxProps) {
  const uid = useId();

  return (
    <label
      htmlFor={uid}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        fontFamily: 'var(--font-base)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: 'var(--radius-sm)',
          border: checked ? '2px solid var(--brand)' : '2px solid var(--border)',
          backgroundColor: checked ? 'var(--brand)' : 'var(--surface)',
          transition: 'border-color 0.15s, background-color 0.15s',
          flexShrink: 0,
        }}
      >
        <input
          id={uid}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            margin: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
        {checked && (
          <svg
            aria-hidden="true"
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            style={{ pointerEvents: 'none' }}
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}

export default Checkbox;
