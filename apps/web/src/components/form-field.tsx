import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormFieldProperties extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly success?: string;
  readonly requiredLabel?: string;
}

/**
 * Shared accessible input contract. Server validation can map a field error to
 * this component without losing the label, hint, or announcement relationship.
 */
export function FormField({
  id,
  label,
  hint,
  error,
  success,
  required,
  requiredLabel,
  ...inputProperties
}: FormFieldProperties) {
  const hintId = hint === undefined ? undefined : id + '-hint';
  const errorId = error === undefined ? undefined : id + '-error';
  const successId = success === undefined ? undefined : id + '-success';
  const describedBy = [hintId, errorId, successId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <span aria-label={requiredLabel} className="required-indicator">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {hint === undefined ? null : <p id={hintId}>{hint}</p>}
      <input
        {...inputProperties}
        aria-describedby={describedBy}
        aria-invalid={error === undefined ? undefined : true}
        id={id}
        required={required}
      />
      {error === undefined ? null : (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {success === undefined ? null : (
        <p className="field-success" id={successId} role="status">
          {success}
        </p>
      )}
    </div>
  );
}

export function StatusMessage({
  children,
  tone = 'neutral',
}: {
  readonly children: ReactNode;
  readonly tone?: 'neutral' | 'warning' | 'success';
}) {
  return (
    <div className={'status-message status-message-' + tone} role="status">
      {children}
    </div>
  );
}
