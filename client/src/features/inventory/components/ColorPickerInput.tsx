/**
 * ColorPickerInput.tsx
 *
 * Combined hex color picker:
 *   - Native <input type="color"> for visual color wheel
 *   - Text input for manual hex entry
 *   - Syncs both ways — typing "#FF0000" updates the wheel; wheel updates text
 *
 * Usage:
 *   <ColorPickerInput
 *     value={field.value}
 *     onChange={field.onChange}
 *     id="color-hex"
 *   />
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerInputProps {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
}

const HEX_REGEX = /^#([A-Fa-f0-9]{6})$/;

export function ColorPickerInput({
  value,
  onChange,
  disabled,
  id,
  'aria-invalid': ariaInvalid,
}: ColorPickerInputProps) {
  // Local text state — allows typing partial hex before committing to the parent.
  // `committedValue` tracks the last value we synced from the parent so we can
  // detect external resets (e.g. form.reset()) without an effect or a ref-during-render.
  const [text, setText] = React.useState(value ?? '#000000');
  const [committedValue, setCommittedValue] = React.useState(value);

  // When the controlled value changes externally, update local text to match.
  // This is the React-approved "setState during render" derived-state pattern:
  // compare two pieces of state and reconcile synchronously in the render phase.
  if (committedValue !== value) {
    setCommittedValue(value);
    setText(value ?? '#000000');
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    // Commit only if valid full hex
    if (HEX_REGEX.test(raw)) {
      onChange(raw.toUpperCase());
    }
  };

  const handleTextBlur = () => {
    // Auto-correct: ensure leading # and pad to 6 chars
    let normalized = text.trim();
    if (!normalized.startsWith('#')) normalized = '#' + normalized;
    normalized = normalized.toUpperCase();
    if (HEX_REGEX.test(normalized)) {
      setText(normalized);
      onChange(normalized);
    } else {
      // Revert to last valid value
      setText(value ?? '#000000');
    }
  };

  const handleColorWheel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setText(hex);
    onChange(hex);
  };

  const displayColor = HEX_REGEX.test(value) ? value : '#000000';

  return (
    <div className="flex items-center gap-2">
      {/* Color wheel trigger */}
      <label
        className={cn(
          'relative flex size-9 shrink-0 cursor-pointer items-center justify-center',
          'rounded-lg border border-[oklch(1_0_0_/_0.12)] overflow-hidden',
          'transition-all duration-150 hover:scale-105 hover:border-[oklch(1_0_0_/_0.28)]',
          'focus-within:ring-2 focus-within:ring-[oklch(1_0_0_/_0.30)]',
          disabled && 'pointer-events-none opacity-50',
        )}
        style={{ backgroundColor: displayColor }}
      >
        <input
          type="color"
          value={displayColor}
          onChange={handleColorWheel}
          disabled={disabled}
          aria-label="Pick color from wheel"
          className="absolute inset-0 opacity-0 cursor-pointer size-full"
        />
      </label>

      {/* Hex text input */}
      <input
        id={id}
        type="text"
        value={text}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        disabled={disabled}
        placeholder="#000000"
        maxLength={7}
        aria-invalid={ariaInvalid}
        className={cn(
          'flex-1 h-9 rounded-lg border px-3 font-mono text-sm',
          'bg-[oklch(1_0_0_/_0.03)] text-[oklch(0.88_0_0)] placeholder:text-[oklch(0.35_0_0)]',
          'outline-none transition-colors duration-150',
          'focus-visible:border-[oklch(1_0_0_/_0.25)] focus-visible:ring-2 focus-visible:ring-[oklch(1_0_0_/_0.08)]',
          ariaInvalid ? 'border-[oklch(0.65_0.22_22_/_0.7)]' : 'border-[oklch(1_0_0_/_0.10)]',
          disabled && 'opacity-50 pointer-events-none',
        )}
      />
    </div>
  );
}
