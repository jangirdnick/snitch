/**
 * TagsInput.tsx
 *
 * A controlled tag/chip input component.
 * Press Enter or comma to add a tag. Click × to remove.
 * Integrates with React Hook Form via `Controller`.
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@components/ui/badge';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
}

export function TagsInput({
  value,
  onChange,
  placeholder = 'Type and press Enter…',
  disabled,
  id,
  'aria-invalid': ariaInvalid,
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = React.useCallback(
    (raw: string) => {
      const tag = raw.trim().toLowerCase();
      if (!tag || value.includes(tag)) return;
      onChange([...value, tag]);
      setInputValue('');
    },
    [value, onChange],
  );

  const removeTag = React.useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-[oklch(1_0_0_/_0.10)]',
        'bg-[oklch(1_0_0_/_0.03)] px-2.5 py-1.5 cursor-text',
        'transition-colors duration-150',
        'focus-within:border-[oklch(1_0_0_/_0.25)] focus-within:ring-2 focus-within:ring-[oklch(1_0_0_/_0.08)]',
        ariaInvalid && 'border-[oklch(0.65_0.22_22)] focus-within:ring-[oklch(0.65_0.22_22_/_0.2)]',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn(
            'flex items-center gap-1 rounded-md py-0.5 px-2',
            'bg-[oklch(1_0_0_/_0.08)] text-[oklch(0.75_0_0)] border-transparent',
            'text-[11px] font-medium',
          )}
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove tag "${tag}"`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="ml-0.5 rounded-sm text-[oklch(0.45_0_0)] hover:text-[oklch(0.75_0_0)] transition-colors"
          >
            <X size={10} strokeWidth={2.5} />
          </button>
        </Badge>
      ))}

      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addTag(inputValue);
        }}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          'flex-1 min-w-[120px] bg-transparent text-sm text-[oklch(0.85_0_0)]',
          'outline-none placeholder:text-[oklch(0.35_0_0)]',
        )}
      />
    </div>
  );
}
