import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  length?: number;
}

export function OTPInput({ value, onChange, error, disabled = false, length = 6 }: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  function handleChange(index: number, char: string) {
    const cleaned = char.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, i) => (i === index ? cleaned : d)).join('');
    onChange(next);
    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d)).join('');
        onChange(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = digits.map((d, i) => (i === index - 1 ? '' : d)).join('');
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIdx]?.focus();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="flex gap-1/75 sm:gap-2.5 justify-center"
        role="group"
        aria-label="One-time password"
        animate={error ? { x: [-4, 4, -3, 3, 0] } : {}}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {digits.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            initial={false}
            animate={digit && !error ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className={cn(
              'w-12 h-14 sm:w-14 sm:h-16 text-center text-[24px] sm:text-[28px] font-light tracking-normal text-white',
              'bg-white/20',
              'border rounded-[14px] outline-none caret-transparent transition-all duration-300',
              error
                ? 'border-red-500/50 text-red-400'
                : digit
                  ? 'border-white/60 bg-white/50'
                  : 'border-white/10 hover:border-white/20 focus-visible:border-white/40 focus-visible:bg-white/40 focus-visible:ring-4 focus-visible:ring-white/40',
            )}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
          />
        ))}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="text-[12px] text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
