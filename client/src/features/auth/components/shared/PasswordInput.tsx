import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

export function PasswordInput({
  label = 'Password',
  error,
  hint,
  className,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className=" relative password-input-root">
      <FormField
        label={label}
        error={error}
        hint={hint}
        type={show ? 'text' : 'password'}
        className={cn('password-input-field', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className={`password-input-toggle ${hint && 'bottom-1/2! translate-y-1/2! '}`}
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
