import React from 'react';
import styles from './TextField.module.css';

interface TextFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  label?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  required?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function TextField({
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  error,
  label,
  disabled = false,
  type = 'text',
  name,
  required,
  className,
  id,
  style,
}: TextFieldProps) {
  const inputId = id ?? name;

  const wrapClasses = [
    styles.inputWrap,
    error ? styles.error : undefined,
    disabled ? styles.disabled : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} style={style}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={wrapClasses}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <input
          id={inputId}
          type={type}
          name={name}
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {error && <span className={styles.errorMsg} role="alert">{error}</span>}
    </div>
  );
}

export default TextField;
