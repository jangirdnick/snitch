/**
 * CareInstructionsInput.tsx
 *
 * Dynamic list input for careInstructions[].
 * Each instruction is a single text line. Press Enter or click + to add.
 * Click × to remove. Reorders via natural DOM order (no drag needed).
 *
 * Usage:
 *   <CareInstructionsInput
 *     value={field.value ?? []}
 *     onChange={field.onChange}
 *     id="care-instructions"
 *   />
 */

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareInstructionsInputProps {
  value: string[];
  onChange: (instructions: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  maxItems?: number;
}

export function CareInstructionsInput({
  value,
  onChange,
  placeholder = 'e.g. Machine wash cold, Do not bleach…',
  disabled,
  id,
  'aria-invalid': ariaInvalid,
  maxItems = 10,
}: CareInstructionsInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addInstruction = React.useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxItems) return;
    onChange([...value, trimmed]);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, value, onChange, maxItems]);

  const removeInstruction = React.useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInstruction();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeInstruction(value.length - 1);
    }
  };

  const canAdd = value.length < maxItems;

  return (
    <div className="flex flex-col gap-2">
      {/* Existing instructions list */}
      {value.length > 0 && (
        <ul className="flex flex-col gap-1.5" role="list" aria-label="Care instructions">
          {value.map((instruction, index) => (
            <li
              key={`${instruction}-${index}`}
              className={cn(
                'flex items-center gap-2 rounded-lg border border-[oklch(1_0_0_/_0.08)]',
                'bg-[oklch(1_0_0_/_0.03)] px-3 py-2',
                'group transition-colors duration-100 hover:border-[oklch(1_0_0_/_0.14)]',
              )}
            >
              <span className="text-[oklch(0.42_0_0)] text-[11px] font-mono shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-[12px] text-[oklch(0.78_0_0)] leading-relaxed">
                {instruction}
              </span>
              <button
                type="button"
                aria-label={`Remove "${instruction}"`}
                onClick={() => removeInstruction(index)}
                disabled={disabled}
                className={cn(
                  'shrink-0 rounded p-0.5',
                  'text-[oklch(0.38_0_0)] hover:text-[oklch(0.65_0.18_22)] hover:bg-[oklch(0.65_0.18_22_/_0.10)]',
                  'opacity-0 group-hover:opacity-100 transition-all duration-100',
                )}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new instruction */}
      {canAdd && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border',
            'transition-colors duration-150',
            'focus-within:border-[oklch(1_0_0_/_0.25)] focus-within:ring-2 focus-within:ring-[oklch(1_0_0_/_0.08)]',
            ariaInvalid && !value.length
              ? 'border-[oklch(0.65_0.22_22_/_0.6)]'
              : 'border-[oklch(1_0_0_/_0.10)]',
          )}
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : 'Add another instruction…'}
            aria-invalid={ariaInvalid}
            className={cn(
              'flex-1 bg-transparent px-3 py-2 text-sm text-[oklch(0.85_0_0)]',
              'outline-none placeholder:text-[oklch(0.35_0_0)]',
            )}
          />
          <button
            type="button"
            onClick={addInstruction}
            disabled={disabled || !inputValue.trim()}
            aria-label="Add care instruction"
            className={cn(
              'mr-1.5 flex size-6 items-center justify-center rounded-md',
              'text-[oklch(0.42_0_0)] hover:text-[oklch(0.70_0_0)] hover:bg-[oklch(1_0_0_/_0.07)]',
              'transition-all duration-100 disabled:opacity-30 disabled:pointer-events-none',
            )}
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {value.length > 0 && (
        <p className="text-[11px] text-[oklch(0.38_0_0)]">
          {value.length}/{maxItems} instructions
        </p>
      )}
    </div>
  );
}
