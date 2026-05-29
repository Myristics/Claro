import React from 'react';

interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  error?: string;
  label?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  className?: string;
  id?: string;
  rows?: number;
  style?: React.CSSProperties;
}

export function TextArea({
  placeholder,
  value,
  onChange,
  error,
  label,
  disabled = false,
  name,
  required,
  className,
  id,
  rows = 4,
  style,
}: TextAreaProps) {
  const inputId = id ?? name;

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-base)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '80px',
    border: error ? '1px solid var(--state-error-text)' : '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: disabled ? 'var(--page-bg)' : 'var(--surface)',
    fontFamily: 'var(--font-base)',
    fontSize: 'var(--text-base)',
    color: 'var(--text-primary)',
    padding: 'var(--space-2) var(--space-3)',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'auto',
    boxSizing: 'border-box',
    ...style,
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-base)',
    fontSize: 'var(--text-xs)',
    color: 'var(--state-error-text)',
  };

  return (
    <div style={wrapperStyle} className={className}>
      {label && (
        <label style={labelStyle} htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <textarea
        id={inputId}
        name={name}
        style={textareaStyle}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={!!error}
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
      />
      {error && <span style={errorStyle} role="alert">{error}</span>}
    </div>
  );
}

export default TextArea;
