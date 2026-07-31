/**
 * ProductImageUpload.tsx
 *
 * File input for product images — supports both Create and Edit modes.
 *
 * In Create mode: value is File[] (all new uploads).
 * In Edit mode:   value is (File | ExistingImage)[] — existing cloud images
 *                 are displayed as locked previews; new files are appended.
 *
 * UI only — no upload logic. Upload happens in the API layer.
 * Integrates with React Hook Form via Controller.
 */

import * as React from 'react';
import { ImagePlus, X, AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isExistingImage,
  type ExistingImage,
  type ImageValue,
} from '../schema/product.form.schema';

interface ProductImageUploadProps {
  value: ImageValue[];
  onChange: (images: ImageValue[]) => void;
  disabled?: boolean;
  id?: string;
  'aria-invalid'?: boolean;
  maxFiles?: number;
}

export function ProductImageUpload({
  value,
  onChange,
  disabled,
  id,
  'aria-invalid': ariaInvalid,
  maxFiles = 7,
}: ProductImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Object URLs for File previews — revoke on unmount / change to avoid leaks
  const previews = React.useMemo(() => {
    return value.map((img) => {
      if (isExistingImage(img)) {
        return (img as ExistingImage).url;
      }
      return URL.createObjectURL(img as File);
    });
  }, [value]);

  // Only revoke object URLs created for File entries (not server URLs)
  React.useEffect(() => {
    return () => {
      value.forEach((img, i) => {
        if (!isExistingImage(img)) {
          URL.revokeObjectURL(previews[i]);
        }
      });
    };
  }, [previews, value]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const combined = [...value, ...newFiles].slice(0, maxFiles);
    onChange(combined);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Drop Zone ─────────────────────────────────────────────────────────── */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          aria-label="Upload product images"
          aria-disabled={disabled}
          className={cn(
            'flex flex-col items-center justify-center gap-2',
            'rounded-xl border-2 border-dashed',
            'min-h-[120px] cursor-pointer select-none transition-all duration-200',
            ariaInvalid
              ? 'border-[oklch(0.65_0.22_22_/_0.6)] bg-[oklch(0.65_0.22_22_/_0.04)]'
              : 'border-[oklch(1_0_0_/_0.10)] bg-[oklch(1_0_0_/_0.02)] hover:border-[oklch(1_0_0_/_0.22)] hover:bg-[oklch(1_0_0_/_0.04)]',
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          {ariaInvalid ? (
            <AlertCircle size={22} className="text-[oklch(0.65_0.22_22)]" strokeWidth={1.8} />
          ) : (
            <ImagePlus size={22} className="text-[oklch(0.40_0_0)]" strokeWidth={1.6} />
          )}
          <div className="text-center">
            <p className="text-sm text-[oklch(0.60_0_0)] font-medium">
              {ariaInvalid ? 'Image required' : 'Drop images here or click to browse'}
            </p>
            <p className="text-[11px] text-[oklch(0.38_0_0)] mt-0.5">
              PNG, JPG, WEBP up to 5MB · max {maxFiles} images
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* ── Previews Grid ─────────────────────────────────────────────────────── */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {value.map((img, index) => {
            const saved = isExistingImage(img);
            const isPrimary = index === 0;

            return (
              <div
                key={`${saved ? (img as ExistingImage).url : (img as File).name}-${index}`}
                className="relative aspect-square group"
              >
                <img
                  src={previews[index]}
                  alt={
                    saved
                      ? (img as ExistingImage).alt || `Image ${index + 1}`
                      : `Preview ${index + 1}`
                  }
                  className={cn(
                    'h-full w-full rounded-lg object-cover',
                    'border border-[oklch(1_0_0_/_0.08)]',
                    isPrimary && 'ring-2 ring-[oklch(0.65_0.15_250)]',
                  )}
                />

                {/* Primary badge */}
                {isPrimary && (
                  <span className="absolute bottom-1 left-1 rounded text-[9px] font-semibold px-1 py-0.5 bg-[oklch(0.65_0.15_250)] text-white leading-none">
                    Primary
                  </span>
                )}

                {/* Saved indicator — existing cloud images */}
                {saved && !isPrimary && (
                  <span
                    className="absolute bottom-1 left-1 flex items-center justify-center rounded size-4 bg-[oklch(0.20_0_0_/_0.7)]"
                    aria-label="Saved image"
                    title="Already saved to cloud"
                  >
                    <Lock size={7} strokeWidth={2.5} className="text-[oklch(0.65_0_0)]" />
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => removeImage(index)}
                  className={cn(
                    'absolute -top-1.5 -right-1.5 flex items-center justify-center',
                    'size-5 rounded-full',
                    'bg-[oklch(0.20_0_0)] border border-[oklch(1_0_0_/_0.12)]',
                    'text-[oklch(0.55_0_0)] hover:text-[oklch(0.85_0_0)] hover:bg-[oklch(0.28_0_0)]',
                    'transition-all duration-150',
                    'opacity-0 group-hover:opacity-100',
                  )}
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}

          {/* Add more slot */}
          {canAddMore && value.length > 0 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              aria-label="Add more images"
              className={cn(
                'aspect-square rounded-lg border border-dashed border-[oklch(1_0_0_/_0.10)]',
                'flex items-center justify-center',
                'text-[oklch(0.35_0_0)] hover:text-[oklch(0.55_0_0)] hover:border-[oklch(1_0_0_/_0.18)]',
                'transition-colors duration-150',
              )}
            >
              <ImagePlus size={16} strokeWidth={1.6} />
            </button>
          )}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-[11px] text-[oklch(0.38_0_0)]">
          {value.length}/{maxFiles} images · First image is used as primary
          {value.some(isExistingImage) && (
            <span className="ml-1.5 text-[oklch(0.42_0_0)]">
              · <Lock size={9} strokeWidth={2} className="inline-block -mt-0.5" /> = saved to cloud
            </span>
          )}
        </p>
      )}
    </div>
  );
}
