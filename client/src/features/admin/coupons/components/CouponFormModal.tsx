import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Coupon } from '@snitch/types';
import { useCouponForm } from '../hook/useCouponForm';

interface CouponFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}

export function CouponFormModal({ open, onOpenChange, coupon, onSuccess }: CouponFormModalProps) {
  const { form, onSubmit, isEditing, handleCancel } = useCouponForm({
    open,
    coupon,
    onSuccess,
    onOpenChange,
  });

  const inputClass =
    'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] focus-visible:ring-[oklch(1_0_0_/_0.2)] focus-visible:border-[oklch(1_0_0_/_0.15)] rounded-xl';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Code</FormLabel>
                    <FormControl>
                      <Input placeholder="SUMMER20" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[oklch(0.15_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-white">
                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 20"
                        className={inputClass}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseFloat(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Usage Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        className={inputClass}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseInt(val, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Valid From</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Valid Until</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className={inputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Min Order (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="No minimum"
                        className={inputClass}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseFloat(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Max Discount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="No maximum"
                        className={inputClass}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? undefined : parseFloat(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productsString"
              render={({ field }) => {
                const tags = field.value
                  ? field.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                  : [];

                const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value && !tags.includes(value)) {
                      field.onChange([...tags, value].join(', '));
                      e.currentTarget.value = '';
                    }
                  } else if (
                    e.key === 'Backspace' &&
                    e.currentTarget.value === '' &&
                    tags.length > 0
                  ) {
                    const newTags = [...tags];
                    newTags.pop();
                    field.onChange(newTags.join(', '));
                  }
                };

                const removeTag = (indexToRemove: number) => {
                  const newTags = tags.filter((_, index) => index !== indexToRemove);
                  field.onChange(newTags.join(', '));
                };

                return (
                  <FormItem>
                    <FormLabel className="text-[oklch(0.7_0_0)]">Applicable Products</FormLabel>
                    <FormControl>
                      <div
                        className={cn(
                          'flex flex-wrap gap-2 p-2 min-h-[44px] items-center bg-[oklch(1_0_0_/_0.03)] border border-[oklch(1_0_0_/_0.08)] focus-within:ring-2 focus-within:ring-[oklch(1_0_0_/_0.2)] focus-within:border-[oklch(1_0_0_/_0.15)] rounded-xl transition-all',
                        )}
                      >
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(0.95_0_0)] text-[oklch(0.1_0_0)] text-[11px] font-bold tracking-wide"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="text-[oklch(0.1_0_0_/_0.5)] hover:text-[oklch(0.1_0_0)] focus:outline-none transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder={
                            tags.length === 0
                              ? 'Paste Product IDs (press Space to add)...'
                              : 'Add more IDs...'
                          }
                          className="flex-1 min-w-[150px] bg-transparent outline-none text-[oklch(0.95_0_0)] text-sm placeholder:text-[oklch(0.42_0_0)]"
                          onKeyDown={handleKeyDown}
                          onBlur={(e) => {
                            const value = e.currentTarget.value.trim();
                            if (value && !tags.includes(value)) {
                              field.onChange([...tags, value].join(', '));
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <p className="text-[10.5px] text-[oklch(0.55_0_0)] mt-1">
                      Leave empty for store-wide applicability. Press Space or Enter to add a
                      product ID.
                    </p>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[oklch(0.85_0_0)]">Active Status</FormLabel>
                    <p className="text-[11px] text-[oklch(0.55_0_0)]">
                      Turn off to immediately disable this coupon.
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={form.formState.isSubmitting}
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
                  'bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.85_0_0)]',
                  'hover:bg-[oklch(1_0_0_/_0.08)] hover:text-[oklch(0.95_0_0)]',
                  'font-medium text-[12px] sm:text-[12.5px] tracking-wide',
                  'transition-all duration-300 ease-in-out active:scale-[0.98]',
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={cn(
                  'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
                  'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
                  'font-semibold text-[12px] sm:text-[12.5px] tracking-wide',
                  'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
                  'transition-all duration-300 ease-in-out active:scale-[0.98]',
                  'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                )}
              >
                <Save
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:rotate-30"
                />
                {form.formState.isSubmitting ? 'Saving...' : 'Save Coupon'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
