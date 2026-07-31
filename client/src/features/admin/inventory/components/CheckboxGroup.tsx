/**
 * CheckboxGroup.tsx
 *
 * Multi-select checkbox grid for enum arrays like `occasion[]` and `season[]`.
 * Renders a styled pill-checkbox grid. Press to toggle — no checkmark boxes.
 *
 * Usage:
 *   <CheckboxGroup
 *     options={['casual', 'formal', 'party']}
 *     value={field.value ?? []}
 *     onChange={field.onChange}
 *     labelMap={{ casual: 'Casual', formal: 'Formal', party: 'Party' }}
 *   />
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxGroupProps<T extends string> {
  options: readonly T[];
  value: T[];
  onChange: (value: T[]) => void;
  labelMap?: Partial<Record<T, string>>;
  disabled?: boolean;
  id?: string;
  columns?: 2 | 3 | 4;
}

function formatLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CheckboxGroup<T extends string>({
  options,
  value,
  onChange,
  labelMap,
  disabled,
  id,
  columns = 3,
}: CheckboxGroupProps<T>) {
  const toggle = React.useCallback(
    (option: T) => {
      if (value.includes(option)) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    },
    [value, onChange],
  );

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[columns];

  return (
    <div id={id} role="group" className={cn('grid gap-2', gridClass)}>
      {options.map((option) => {
        const isSelected = value.includes(option);
        const label = labelMap?.[option] ?? formatLabel(option);

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => toggle(option)}
            aria-pressed={isSelected}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg px-3 py-2',
              'text-[12px] font-medium border transition-all duration-150 select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(1_0_0_/_0.30)]',
              isSelected
                ? 'bg-[oklch(0.65_0.15_250_/_0.18)] border-[oklch(0.65_0.15_250_/_0.45)] text-[oklch(0.78_0.12_250)]'
                : 'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.10)] text-[oklch(0.55_0_0)] hover:border-[oklch(1_0_0_/_0.20)] hover:text-[oklch(0.75_0_0)] hover:bg-[oklch(1_0_0_/_0.05)]',
              disabled && 'pointer-events-none opacity-50',
            )}
          >
            {isSelected && (
              <span className="text-[oklch(0.65_0.15_250)] leading-none" aria-hidden>
                ✓
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
