/**
 * PublishingSection.tsx
 *
 * Fields: status, isFeatured, isNewArrival, isBestSeller, publishedAt
 */

import { useFormContext } from 'react-hook-form';
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
import { type ProductFormValues } from '../../schema/product.form.schema';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', description: 'Not visible to customers.' },
  { value: 'active', label: 'Active', description: 'Live and visible in the store.' },
  { value: 'inactive', label: 'Inactive', description: 'Temporarily hidden from the store.' },
  { value: 'out_of_stock', label: 'Out of Stock', description: 'Visible but not purchasable.' },
] as const;

import {
  formLabelClass,
  formDescClass,
  inputClass,
  selectTriggerClass,
  selectContentClass,
  selectItemClass,
} from './sharedStyles';

export function PublishingSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="flex flex-col gap-5">
      {/* Status */}
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger id="product-status" className={selectTriggerClass}>
                  <SelectValue placeholder="Select status…" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={selectContentClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={selectItemClass}>
                    <div>
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-[10px] text-[oklch(0.48_0_0)]">{opt.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Publish Date */}
      <FormField
        control={control}
        name="publishedAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Scheduled Publish Date</FormLabel>
            <FormControl>
              <Input
                id="product-published-at"
                type="datetime-local"
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().slice(0, 16)
                    : ((field.value as string | undefined) ?? '')
                }
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
                className={`${inputClass} [color-scheme:dark]`}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Leave blank to publish immediately when status is set to Active.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
