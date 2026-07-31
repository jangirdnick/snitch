/**
 * AttributesSection.tsx
 *
 * Clothing-specific attributes:
 *   fit, fabric, pattern, neckType, sleeveType, clothingLength (selects)
 *   occasion[], season[] (multi-select checkbox groups)
 *   careInstructions[] (dynamic list)
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
import { CheckboxGroup } from '../CheckboxGroup';
import { CareInstructionsInput } from '../CareInstructionsInput';
import {
  type ProductFormValues,
  FIT_TYPE,
  PATTERN,
  NECK_TYPE,
  SLEEVE_TYPE,
  CLOTHING_LENGTH,
  OCCASION,
  SEASON,
} from '../../schema/product.form.schema';

import {
  formLabelClass,
  formDescClass,
  inputClass,
  selectTriggerClass,
  selectContentClass,
  selectItemClass,
} from './sharedStyles';

function formatLabel(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AttributesSection() {
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="flex flex-col gap-5">
      {/* Fit + Fabric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="fit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Fit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-fit" className={selectTriggerClass}>
                    <SelectValue placeholder="Select fit type…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {FIT_TYPE.map((f) => (
                    <SelectItem key={f} value={f} className={selectItemClass}>
                      {formatLabel(f)}
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
          name="fabric"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Fabric</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="product-fabric"
                  placeholder="e.g. 100% Organic Cotton"
                  className={inputClass}
                />
              </FormControl>
              <FormDescription className={formDescClass}>Material composition.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Pattern + Neck Type + Sleeve + Length */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="pattern"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Pattern</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-pattern" className={selectTriggerClass}>
                    <SelectValue placeholder="Select pattern…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {PATTERN.map((p) => (
                    <SelectItem key={p} value={p} className={selectItemClass}>
                      {formatLabel(p)}
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
          name="clothingLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Clothing Length</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-clothing-length" className={selectTriggerClass}>
                    <SelectValue placeholder="Select length…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {CLOTHING_LENGTH.map((l) => (
                    <SelectItem key={l} value={l} className={selectItemClass}>
                      {formatLabel(l)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="neckType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Neck Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-neck-type" className={selectTriggerClass}>
                    <SelectValue placeholder="Select neck type…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {NECK_TYPE.map((n) => (
                    <SelectItem key={n} value={n} className={selectItemClass}>
                      {formatLabel(n)}
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
          name="sleeveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={formLabelClass}>Sleeve Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger id="product-sleeve-type" className={selectTriggerClass}>
                    <SelectValue placeholder="Select sleeve type…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentClass}>
                  {SLEEVE_TYPE.map((s) => (
                    <SelectItem key={s} value={s} className={selectItemClass}>
                      {formatLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Occasion */}
      <FormField
        control={control}
        name="occasion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Occasion</FormLabel>
            <FormControl>
              <CheckboxGroup
                id="product-occasion"
                options={OCCASION}
                value={field.value ?? []}
                onChange={field.onChange}
                columns={3}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Select all occasions this garment suits.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Season */}
      <FormField
        control={control}
        name="season"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Season</FormLabel>
            <FormControl>
              <CheckboxGroup
                id="product-season"
                options={SEASON}
                value={field.value ?? []}
                onChange={field.onChange}
                columns={4}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Seasons this product is suited for.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Care Instructions */}
      <FormField
        control={control}
        name="careInstructions"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Care Instructions</FormLabel>
            <FormControl>
              <CareInstructionsInput
                id="product-care-instructions"
                value={field.value ?? []}
                onChange={field.onChange}
                aria-invalid={!!fieldState.error}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Washing and care guidance (e.g. Machine wash cold, Tumble dry low).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
