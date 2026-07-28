/**
 * ClassificationSection.tsx
 *
 * Fields: categoryType, category (text—future select from API), subCategory,
 *         gender, ageGroup, tags
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { TagsInput } from '../TagsInput';
import { CategoryMultiSelect } from '@/features/category/components/CategoryMultiSelect';
import { type ProductFormValues, GENDER, AGE_GROUP } from '../../schema/product.form.schema';

import {
  formLabelClass,
  formDescClass,
  selectTriggerClass,
  selectContentClass,
  selectItemClass,
} from './sharedStyles';

const GENDER_LABELS: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  unisex: 'Unisex',
  kids: 'Kids',
};

const AGE_GROUP_LABELS: Record<string, string> = {
  adult: 'Adult',
  teen: 'Teen',
  kids: 'Kids',
};

export function ClassificationSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="flex flex-col gap-5">
      {/* Category ID */}
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="category"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>
                Category ID{' '}
                <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <CategoryMultiSelect
                  id="product-category"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormDescription className={formDescClass}>
                Select one or more categories for this product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Gender + Age Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>
                Gender{' '}
                <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                  *
                </span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-gender" className={selectTriggerClass}>
                    <SelectValue placeholder="Select gender…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {GENDER.map((g) => (
                    <SelectItem key={g} value={g} className={selectItemClass}>
                      {GENDER_LABELS[g] ?? g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ageGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Age Group</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-age-group" className={selectTriggerClass}>
                    <SelectValue placeholder="Select age group…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {AGE_GROUP.map((ag) => (
                    <SelectItem key={ag} value={ag} className={selectItemClass}>
                      {AGE_GROUP_LABELS[ag] ?? ag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tags */}
      <FormField
        control={control}
        name="tags"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Tags</FormLabel>
            <FormControl>
              <TagsInput
                id="product-tags"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Type a tag and press Enter…"
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Tags help customers find this product (e.g. oversized, cotton, summer).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
