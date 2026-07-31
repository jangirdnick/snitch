/**
 * SeoSection.tsx
 *
 * Fields: seo.metaTitle, seo.metaDescription, seo.keywords (tags)
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
import { TagsInput } from '../TagsInput';
import { type ProductFormValues } from '../../schema/product.form.schema';

import { formLabelClass, formDescClass, inputClass, textareaClass } from './sharedStyles';

export function SeoSection() {
  const { control } = useFormContext<ProductFormValues>();

  const metaTitle = useWatch({ control, name: 'seo.metaTitle' }) ?? '';
  const metaDesc = useWatch({ control, name: 'seo.metaDescription' }) ?? '';

  return (
    <div className="flex flex-col gap-5">
      {/* Meta Title */}
      <FormField
        control={control}
        name="seo.metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Meta Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                id="seo-meta-title"
                placeholder="Optimized page title for search engines…"
                maxLength={70}
                className={inputClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              {metaTitle.length}/70 characters — recommended 50–60
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Description */}
      <FormField
        control={control}
        name="seo.metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                id="seo-meta-description"
                placeholder="Brief description shown in search engine results…"
                rows={3}
                maxLength={160}
                className={textareaClass}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              {metaDesc.length}/160 characters — recommended 120–160
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Keywords */}
      <FormField
        control={control}
        name="seo.keywords"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>SEO Keywords</FormLabel>
            <FormControl>
              <TagsInput
                id="seo-keywords"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Add keywords and press Enter…"
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Comma-separated keywords for search indexing.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
