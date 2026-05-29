import React from 'react';
import { IconChevronDown } from '@tabler/icons-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectTriggerProps {
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

export function SelectTrigger({
  value,
  placeholder,
  onChange,
  options,
  disabled = false,
  className,
  style,
  name,
  id,
  label,
  error,
  required,
}: SelectTriggerProps) {
  const selectId = id ?? name;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        ...style,
      }}
    >
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontFamily: 'var(--font-base)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          style={{
            width: '100%',
            height: '36px',
            padding: '0 var(--space-7) 0 var(--space-3)',
            border: error ? '1px solid var(--state-error-text)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: disabled ? 'var(--page-bg)' : 'var(--surface)',
            fontFamily: 'var(--font-base)',
            fontSize: 'var(--text-base)',
            color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            appearance: 'none',
            outline: 'none',
            opacity: disabled ? 0.6 : 1,
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = 'var(--brand)';
              e.currentTarget.style.boxShadow = '0 0 0 2px color-mix(in srgb, var(--brand) 15%, transparent)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--state-error-text)' : 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {placeholder && (
            <option value="" disabled={!!value}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'var(--space-2)',
            pointerEvents: 'none',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconChevronDown size={14} />
        </span>
      </div>
      {error && (
        <span
          role="alert"
          style={{
            fontFamily: 'var(--font-base)',
            fontSize: 'var(--text-xs)',
            color: 'var(--state-error-text)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default SelectTrigger;
