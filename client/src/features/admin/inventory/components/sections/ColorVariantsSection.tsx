/**
 * ColorVariantsSection.tsx
 *
 * The core of the new schema — each product has one or more color variants,
 * and each color has:
 *   - name (string)
 *   - hex (color code)
 *   - images (File[] — uploaded per-color)
 *   - sizes (array of { size, stock, sku })
 *   - isDefault (boolean)
 *
 * Uses useFieldArray for dynamic color rows.
 * Each ColorVariantCard uses a nested useFieldArray for sizes.
 */

import * as React from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Switch } from '@components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Palette,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImageUpload } from '../ProductImageUpload';
import { ColorPickerInput } from '../ColorPickerInput';
import { type ProductFormValues, CLOTHING_SIZE } from '../../schema/product.form.schema';

import {
  formLabelClass,
  inputClass,
  selectTriggerClass,
  selectContentClass,
  selectItemClass,
} from './sharedStyles';

// ─── SizeRow — individual size/stock/SKU entry ───────────────────────────────

interface SizeRowProps {
  colorIndex: number;
  sizeIndex: number;
  onRemove: () => void;
  isOnly: boolean;
}

function SizeRow({ colorIndex, sizeIndex, onRemove, isOnly }: SizeRowProps) {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="grid grid-cols-[1fr_80px_1fr_auto] gap-2 items-start">
      {/* Size */}
      <FormField
        control={control}
        name={`colors.${colorIndex}.sizes.${sizeIndex}.size`}
        render={({ field }) => (
          <FormItem>
            {sizeIndex === 0 && <FormLabel className={formLabelClass}>Size</FormLabel>}
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <FormControl>
                <SelectTrigger
                  id={`color-${colorIndex}-size-${sizeIndex}`}
                  className={`${selectTriggerClass} !h-9 !py-1 !px-3 text-xs`}
                >
                  <SelectValue placeholder="Size…" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={selectContentClass}>
                {CLOTHING_SIZE.map((s) => (
                  <SelectItem key={s} value={s} className={`${selectItemClass} text-xs`}>
                    {s === 'FREE_SIZE' ? 'Free' : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stock */}
      <FormField
        control={control}
        name={`colors.${colorIndex}.sizes.${sizeIndex}.stock`}
        render={({ field }) => (
          <FormItem>
            {sizeIndex === 0 && <FormLabel className={formLabelClass}>Stock</FormLabel>}
            <FormControl>
              <Input
                {...field}
                id={`color-${colorIndex}-stock-${sizeIndex}`}
                type="number"
                min={0}
                step={1}
                placeholder="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={`${inputClass} !h-9 !py-1 !px-3 text-xs`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SKU */}
      <FormField
        control={control}
        name={`colors.${colorIndex}.sizes.${sizeIndex}.sku`}
        render={({ field }) => (
          <FormItem>
            {sizeIndex === 0 && <FormLabel className={formLabelClass}>Variant SKU</FormLabel>}
            <FormControl>
              <Input
                {...field}
                id={`color-${colorIndex}-sku-${sizeIndex}`}
                placeholder="e.g. SNT-TEE-BLK-M"
                className={`${inputClass} !h-9 !py-1 !px-3 text-xs font-mono`}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Remove size button */}
      <div className={sizeIndex === 0 ? 'mt-6' : ''}>
        <button
          type="button"
          onClick={onRemove}
          disabled={isOnly}
          aria-label="Remove size"
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            'text-[oklch(0.38_0_0)] hover:text-[oklch(0.65_0.18_22)] hover:bg-[oklch(0.65_0.18_22_/_0.10)]',
            'transition-all duration-100 border border-transparent hover:border-[oklch(0.65_0.18_22_/_0.20)]',
            isOnly && 'opacity-30 pointer-events-none',
          )}
        >
          <Trash2 size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ─── ColorVariantCard ─────────────────────────────────────────────────────────

interface ColorVariantCardProps {
  colorIndex: number;
  onRemove: () => void;
  isOnly: boolean;
  totalColors: number;
}

function ColorVariantCard({ colorIndex, onRemove, isOnly, totalColors }: ColorVariantCardProps) {
  const { control, setValue } = useFormContext<ProductFormValues>();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `colors.${colorIndex}.sizes`,
  });

  // Watch color name and hex for the collapsed header preview
  const colorName = useWatch({ control, name: `colors.${colorIndex}.name` });
  const colorHex = useWatch({ control, name: `colors.${colorIndex}.hex` });
  const isDefault = useWatch({ control, name: `colors.${colorIndex}.isDefault` });
  const imageCount = useWatch({ control, name: `colors.${colorIndex}.images` })?.length ?? 0;

  const handleAddSize = () => {
    appendSize({ size: 'M', stock: 0, sku: '' });
  };

  const displayHex = colorHex && /^#([A-Fa-f0-9]{6})$/.test(colorHex) ? colorHex : '#888888';

  return (
    <div
      className={cn(
        'rounded-xl border transition-colors duration-150',
        isDefault
          ? 'border-[oklch(0.65_0.15_250_/_0.30)] bg-[oklch(0.65_0.15_250_/_0.04)]'
          : 'border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)]',
      )}
    >
      {/* ── Card Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Color swatch */}
        <div
          className="shrink-0 size-6 rounded-md border border-[oklch(1_0_0_/_0.15)] shadow-[inset_0_1px_2px_oklch(0_0_0_/_0.25)]"
          style={{ backgroundColor: displayHex }}
          aria-hidden
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-[oklch(0.82_0_0)] truncate">
              {colorName || <span className="text-[oklch(0.35_0_0)] italic">Unnamed color</span>}
            </span>
            <span className="text-[10px] font-mono text-[oklch(0.42_0_0)]">{displayHex}</span>
            {isDefault && (
              <Badge
                variant="secondary"
                className="text-[9px] font-semibold px-1.5 py-0 bg-[oklch(0.65_0.15_250_/_0.15)] text-[oklch(0.72_0.12_250)] border-[oklch(0.65_0.15_250_/_0.25)]"
              >
                Default
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-[oklch(0.40_0_0)]">
              {sizeFields.length} size{sizeFields.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[oklch(0.25_0_0)]">·</span>
            <span className="text-[10px] text-[oklch(0.40_0_0)]">
              {imageCount} image{imageCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Remove color */}
          <button
            type="button"
            onClick={onRemove}
            disabled={isOnly}
            aria-label={`Remove ${colorName || 'color'} variant`}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg',
              'text-[oklch(0.38_0_0)] hover:text-[oklch(0.65_0.18_22)] hover:bg-[oklch(0.65_0.18_22_/_0.10)]',
              'transition-all duration-100',
              isOnly && 'opacity-30 pointer-events-none',
            )}
          >
            <Trash2 size={13} strokeWidth={1.8} />
          </button>

          {/* Expand/collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? 'Collapse color variant' : 'Expand color variant'}
            className={cn(
              'flex size-7 items-center justify-center rounded-lg',
              'text-[oklch(0.45_0_0)] hover:text-[oklch(0.70_0_0)] hover:bg-[oklch(1_0_0_/_0.07)]',
              'transition-all duration-100',
            )}
          >
            {isExpanded ? (
              <ChevronUp size={13} strokeWidth={2} />
            ) : (
              <ChevronDown size={13} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* ── Card Body ───────────────────────────────────────────────────────── */}
      {isExpanded && (
        <>
          <Separator className="bg-[oklch(1_0_0_/_0.06)]" />

          <div className="px-4 py-4 flex flex-col gap-5">
            {/* Color Name + Hex */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`colors.${colorIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={formLabelClass}>
                      Color Name{' '}
                      <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id={`color-${colorIndex}-name`}
                        placeholder="e.g. Midnight Black"
                        className={inputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`colors.${colorIndex}.hex`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className={formLabelClass}>
                      Hex Color{' '}
                      <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <ColorPickerInput
                        id={`color-${colorIndex}-hex`}
                        value={field.value}
                        onChange={field.onChange}
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Default Color Toggle */}
            <FormField
              control={control}
              name={`colors.${colorIndex}.isDefault`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[oklch(1_0_0_/_0.07)] bg-[oklch(1_0_0_/_0.02)] px-4 py-3">
                  <div className="space-y-0.5">
                    <FormLabel className={`${formLabelClass} !mb-0 cursor-pointer`}>
                      Default Color
                    </FormLabel>
                    <p className="text-[11px] text-[oklch(0.42_0_0)]">
                      Shown first when customers view this product.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      id={`color-${colorIndex}-is-default`}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        // If setting this as default, unset others
                        if (checked) {
                          for (let i = 0; i < totalColors; i++) {
                            if (i !== colorIndex) {
                              setValue(`colors.${i}.isDefault`, false);
                            }
                          }
                        }
                      }}
                      className="data-[state=checked]:bg-[oklch(0.65_0.15_250)]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Images for this color */}
            <FormField
              control={control}
              name={`colors.${colorIndex}.images`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={13} strokeWidth={1.8} className="text-[oklch(0.48_0_0)]" />
                    <FormLabel className={formLabelClass}>
                      Color Images{' '}
                      <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                        *
                      </span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <ProductImageUpload
                      id={`color-${colorIndex}-images`}
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={!!fieldState.error}
                      maxFiles={7}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sizes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] font-medium text-[oklch(0.70_0_0)]">
                  Sizes &amp; Stock
                </span>
                <span className="text-[oklch(0.65_0.22_22)] text-[12px]">*</span>
              </div>

              <div className="flex flex-col gap-2">
                {sizeFields.map((sizeField, sizeIndex) => (
                  <SizeRow
                    key={sizeField.id}
                    colorIndex={colorIndex}
                    sizeIndex={sizeIndex}
                    onRemove={() => removeSize(sizeIndex)}
                    isOnly={sizeFields.length === 1}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddSize}
                className={cn(
                  'mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2',
                  'text-[11px] font-medium text-[oklch(0.48_0_0)] border border-dashed border-[oklch(1_0_0_/_0.10)]',
                  'hover:border-[oklch(1_0_0_/_0.20)] hover:text-[oklch(0.68_0_0)] hover:bg-[oklch(1_0_0_/_0.03)]',
                  'transition-all duration-150 w-full justify-center',
                )}
              >
                <Plus size={12} strokeWidth={2.5} />
                Add Size
              </button>

              {/* Array-level error (min 1 size) */}
              <FormField
                control={control}
                name={`colors.${colorIndex}.sizes`}
                render={({ fieldState }) =>
                  fieldState.error?.root ? (
                    <p
                      role="alert"
                      className="mt-2 flex items-center gap-1 text-[11px] text-[oklch(0.65_0.22_22)] font-medium"
                    >
                      <AlertCircle size={11} strokeWidth={2} />
                      {fieldState.error.root.message}
                    </p>
                  ) : (
                    <></>
                  )
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── ColorVariantsSection ─────────────────────────────────────────────────────

export function ColorVariantsSection() {
  const { control, formState } = useFormContext<ProductFormValues>();

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: 'colors',
  });

  const handleAddColor = () => {
    appendColor({
      name: '',
      hex: '#000000',
      images: [],
      sizes: [{ size: 'M', stock: 0, sku: '' }],
      isDefault: colorFields.length === 0,
    });
  };

  const colorsError = formState.errors.colors;

  return (
    <div className="flex flex-col gap-4">
      {/* Empty state */}
      {colorFields.length === 0 && (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10',
            colorsError
              ? 'border-[oklch(0.65_0.22_22_/_0.5)] bg-[oklch(0.65_0.22_22_/_0.03)]'
              : 'border-[oklch(1_0_0_/_0.10)]',
          )}
        >
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              colorsError
                ? 'bg-[oklch(0.65_0.22_22_/_0.12)] text-[oklch(0.65_0.22_22)]'
                : 'bg-[oklch(1_0_0_/_0.06)] text-[oklch(0.38_0_0)]',
            )}
          >
            <Palette size={18} strokeWidth={1.6} />
          </div>
          <div className="text-center">
            <p
              className={cn(
                'text-sm font-medium',
                colorsError ? 'text-[oklch(0.65_0.22_22)]' : 'text-[oklch(0.55_0_0)]',
              )}
            >
              {colorsError ? 'At least one color variant is required' : 'No color variants yet'}
            </p>
            <p className="text-[11px] text-[oklch(0.38_0_0)] mt-1">
              Each color has its own images and size/stock matrix.
            </p>
          </div>
        </div>
      )}

      {/* Color cards */}
      {colorFields.map((colorField, colorIndex) => (
        <ColorVariantCard
          key={colorField.id}
          colorIndex={colorIndex}
          onRemove={() => removeColor(colorIndex)}
          isOnly={colorFields.length === 1}
          totalColors={colorFields.length}
        />
      ))}

      {/* Array-level error */}
      {colorsError && typeof colorsError.message === 'string' && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[11px] text-[oklch(0.65_0.22_22)] font-medium"
        >
          <AlertCircle size={12} strokeWidth={2} />
          {colorsError.message}
        </p>
      )}

      {/* Add Color button */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleAddColor}
        id="add-color-variant-btn"
        className={cn(
          'flex items-center gap-2 border border-dashed border-[oklch(1_0_0_/_0.12)]',
          'text-[12px] font-medium text-[oklch(0.50_0_0)]',
          'hover:border-[oklch(1_0_0_/_0.22)] hover:text-[oklch(0.72_0_0)] hover:bg-[oklch(1_0_0_/_0.04)]',
          'transition-all duration-150 h-10 w-full',
        )}
      >
        <Plus size={14} strokeWidth={2} />
        Add Color Variant
      </Button>
    </div>
  );
}
