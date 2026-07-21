/**
 * FormFieldWrapper.tsx
 *
 * Shared wrapper used by all form field compositions.
 * Combines label, the field slot, optional description, and inline error.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormFieldWrapper({
  label,
  htmlFor,
  required,
  description,
  error,
  className,
  children,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'text-xs font-medium tracking-wide text-[oklch(0.65_0_0)] uppercase',
          error && 'text-[oklch(0.65_0.18_22)]',
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-[oklch(0.65_0.22_22)]">
            *
          </span>
        )}
      </label>

      {children}

      {description && !error && (
        <p className="text-[11px] text-[oklch(0.45_0_0)] leading-relaxed">{description}</p>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-[11px] text-[oklch(0.65_0.22_22)] font-medium"
        >
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      )}
    </div>
  );
}
