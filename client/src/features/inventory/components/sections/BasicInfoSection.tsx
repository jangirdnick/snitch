/**
 * BasicInfoSection.tsx
 *
 * Fields: title, sku, brand, description, shortDescription, countryOfOrigin
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
import { Textarea } from '@components/ui/textarea';
import { type ProductFormValues } from '../../schema/product.form.schema';
import { formLabelClass, formDescClass, inputClass, textareaClass } from './sharedStyles';

export function BasicInfoSection() {
  const { control } = useFormContext<ProductFormValues>();

  const title = useWatch({ control, name: 'title' }) ?? '';
  const description = useWatch({ control, name: 'description' }) ?? '';
  const shortDescription = useWatch({ control, name: 'shortDescription' }) ?? '';

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>
              Product Title{' '}
              <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                *
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                id="product-title"
                placeholder="e.g. Oversized Washed Cotton Tee"
                autoFocus
                maxLength={200}
                className={inputClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              <span>Appears in listings, search results, and browser tabs.</span>
              <span className={title.length > 160 ? 'text-[oklch(0.65_0.22_22)]' : ''}>
                {title.length}/200
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SKU + Brand in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>
                Master SKU{' '}
                <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="product-sku"
                  placeholder="e.g. SNT-TEE-BLK"
                  className={`${inputClass} font-mono`}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription className={formDescClass}>
                Unique product-level identifier.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Brand</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="product-brand"
                  placeholder="e.g. Snitch"
                  className={inputClass}
                />
              </FormControl>
              <FormDescription className={formDescClass}>Brand name shown on product page.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Country of Origin */}
        <FormField
          control={control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Country of Origin</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="product-country-of-origin"
                  placeholder="e.g. India"
                  className={inputClass}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription className={formDescClass}>
                Shown for compliance and customs labelling.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>
              Description{' '}
              <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                *
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id="product-description"
                placeholder="Describe the product in detail — material, fit, styling notes, care…"
                rows={5}
                maxLength={5000}
                className={textareaClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              <span>Shown on the product detail page.</span>
              <span className={description.length > 4000 ? 'text-[oklch(0.65_0.22_22)]' : ''}>
                {description.length}/5000
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Short Description */}
      <FormField
        control={control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Short Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id="product-short-description"
                placeholder="One-liner shown in product cards and listing thumbnails…"
                rows={2}
                maxLength={300}
                className={textareaClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              <span>Max 300 characters — used in product cards.</span>
              <span className={shortDescription.length > 240 ? 'text-[oklch(0.65_0.22_22)]' : ''}>
                {shortDescription.length}/300
              </span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
