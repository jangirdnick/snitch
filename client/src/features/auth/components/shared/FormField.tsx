import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { motion } from 'motion/react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2 w-full">
        <Label
          htmlFor={fieldId}
          className={cn(
            'text-[11px] font-medium tracking-[0.06em] uppercase',
            error ? 'text-red-400' : 'text-white/60',
          )}
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </Label>

        <div className="relative">
          <motion.div
            animate={error ? { x: [-4, 4, -3, 3, 0] } : {}}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Input
              ref={ref}
              id={fieldId}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
              className={cn(
                'w-full h-12 px-4 text-[14px] font-light rounded-xl outline-none transition-all duration-300',
                'bg-white/2 text-white placeholder:text-white/30',
                'border',
                error
                  ? 'border-red-500/50 focus-visible:border-red-500 focus-visible:ring-4 focus-visible:ring-red-500/10'
                  : 'border-white/10 hover:border-white/20 focus-visible:border-white/40 focus-visible:bg-white/4 focus-visible:ring-4 focus-visible:ring-white/4',
                className,
              )}
              {...props}
            />
          </motion.div>
        </div>

        {hint && !error && (
          <p
            id={`${fieldId}-hint`}
            className="text-[12px] text-white/40 leading-relaxed font-light"
          >
            {hint}
          </p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            id={`${fieldId}-error`}
            role="alert"
            className="text-[12px] font-medium text-red-400 leading-[1.4]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
