import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, error, hint, className, id, ...props }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-field-root">
      <Label
        htmlFor={fieldId}
        className={cn('form-field-label', error && 'form-field-label--error')}
      >
        {label}
        {props.required && <span className="form-field-required">*</span>}
      </Label>

      <div className="form-field-input-wrapper">
        <Input
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn('form-field-input', error && 'form-field-input--error', className)}
          {...props}
        />
        {/* Animated focus line */}
        <div className="form-field-focus-line" aria-hidden="true" />
      </div>

      {hint && !error && (
        <p id={`${fieldId}-hint`} className="form-field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${fieldId}-error`} role="alert" className="form-field-error">
          {error}
        </p>
      )}
    </div>
  );
}
