import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', error, hint, className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative w-full">
        <FormField
          ref={ref}
          label={label}
          error={error}
          hint={hint}
          type={show ? 'text' : 'password'}
          className={cn('pr-11', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className={cn(
            'absolute right-4 flex items-center justify-center w-6 h-6 rounded border-none bg-transparent',
            'text-white/40 hover:text-white',
            'transition-colors duration-200 z-10',
            // Base bottom position
            'bottom-3',
            // Adjust up if error or hint is present to align with input field
            error ? 'mb-7' : hint ? 'mb-8' : '',
          )}
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
