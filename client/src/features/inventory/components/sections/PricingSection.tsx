/**
 * PricingSection.tsx
 *
 * Fields: price.amount, price.compareAtAmount, price.currency,
 *         price.discount.type, price.discount.value, price.discount.expiresAt,
 *         lowStockThreshold
 */

import { useFormContext, useWatch } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import { type ProductFormValues } from '../../schema/product.form.schema';

const CURRENCY_OPTIONS = [
  { value: 'INR', label: '₹ INR' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
] as const;

import {
  formLabelClass,
  formDescClass,
  inputClass,
  selectTriggerClass,
  selectContentClass,
  selectItemClass,
} from './sharedStyles';

export function PricingSection() {
  const { control, setValue } = useFormContext<ProductFormValues>();

  const discount = useWatch({ control, name: 'price.discount' });
  const hasDiscount = discount !== undefined;
  const discountType = discount?.type;

  const toggleDiscount = (enabled: boolean) => {
    if (enabled) {
      setValue('price.discount', { type: 'percentage', value: 0 }, { shouldDirty: true });
    } else {
      setValue('price.discount', undefined, { shouldDirty: true });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Price Amount + Currency */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <FormField
            control={control}
            name="price.amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  Selling Price{' '}
                  <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="price-amount"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="price.currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Currency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="price-currency" className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {CURRENCY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className={selectItemClass}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Compare-at Price */}
      <FormField
        control={control}
        name="price.compareAtAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Compare-at Price</FormLabel>
            <FormControl>
              <Input
                {...field}
                id="price-compare-at"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className={inputClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Original price before discount — shown strikethrough. Must be higher than selling
              price.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Low Stock Threshold */}
      <FormField
        control={control}
        name="lowStockThreshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Low Stock Alert</FormLabel>
            <FormControl>
              <Input
                {...field}
                id="product-low-stock-threshold"
                type="number"
                min={0}
                step={1}
                placeholder="5"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Trigger a low-stock alert when total stock across all variants falls below this
              number.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Discount Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border border-[oklch(1_0_0_/_0.07)] bg-[oklch(1_0_0_/_0.02)] px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[oklch(0.75_0_0)]">Apply Discount</p>
          <p className="text-[11px] text-[oklch(0.42_0_0)]">
            Add a time-limited percentage or flat discount.
          </p>
        </div>
        <Switch
          id="price-has-discount"
          checked={hasDiscount}
          onCheckedChange={toggleDiscount}
          className="data-[state=checked]:bg-[oklch(0.65_0.15_250)]"
        />
      </div>

      {/* Discount Fields */}
      {hasDiscount && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-[oklch(1_0_0_/_0.07)] p-4">
          <FormField
            control={control}
            name="price.discount.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger id="discount-type" className={selectTriggerClass}>
                      <SelectValue placeholder="Select type…" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="percentage" className={selectItemClass}>
                      Percentage (%)
                    </SelectItem>
                    <SelectItem value="flat" className={selectItemClass}>
                      Flat Amount
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="price.discount.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={formLabelClass}>
                  Discount Value {discountType === 'percentage' ? '(%)' : '(amount)'}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="discount-value"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className={inputClass}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="price.discount.expiresAt"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className={formLabelClass}>Discount Expires At</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="discount-expires-at"
                    type="datetime-local"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </FormControl>
                <FormDescription className={formDescClass}>
                  Leave blank for no expiry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
