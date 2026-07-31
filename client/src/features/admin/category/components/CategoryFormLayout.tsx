import { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Loader2, ArrowLeft, SendHorizonal, Layers, Megaphone } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import { type CategoryFormValues, CATEGORY_STATUS } from '../schema/category.form.schema';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; badge: string }> = {
  active: {
    label: 'Active',
    dot: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
    text: 'text-[oklch(0.82_0.15_160)]',
    badge:
      'bg-[oklch(0.70_0.15_160_/_0.10)] text-[oklch(0.82_0.15_160)] border-[oklch(0.70_0.15_160_/_0.25)]',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]',
    text: 'text-[oklch(0.50_0_0)]',
    badge: 'bg-[oklch(0.42_0_0_/_0.08)] text-[oklch(0.50_0_0)] border-[oklch(0.42_0_0_/_0.18)]',
  },
  archived: {
    label: 'Archived',
    dot: 'bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]',
    text: 'text-[oklch(0.65_0_0)]',
    badge: 'bg-[oklch(0.55_0_0_/_0.10)] text-[oklch(0.65_0_0)] border-[oklch(0.55_0_0_/_0.20)]',
  },
};

// ─── BentoCard ────────────────────────────────────────────────────────────────

interface BentoCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: boolean;
  compact?: boolean;
}

const TOP_GLOW = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0_/_0.16)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
  />
);

const ACCENT_LINE = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[oklch(0.65_0.15_250_/_0.55)] to-transparent"
  />
);

function BentoCard({
  id,
  icon: Icon,
  title,
  description,
  children,
  accent = false,
  compact = false,
}: BentoCardProps) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
        'border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_12px_40px_oklch(0_0_0_/_0.55)]',
        'hover:-translate-y-px',
        accent
          ? 'border-[oklch(0.65_0.15_250_/_0.22)] hover:border-[oklch(0.65_0.15_250_/_0.40)]'
          : 'border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
      )}
    >
      {accent ? ACCENT_LINE : TOP_GLOW}
      <div
        className={cn('flex items-start gap-3.5 px-4 md:px-6', compact ? 'py-4' : 'py-4 md:py-5')}
      >
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-xl',
            'transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105',
            compact ? 'size-9' : 'size-10',
            accent
              ? 'bg-[oklch(0.65_0.15_250_/_0.14)] text-[oklch(0.72_0.15_250)] shadow-[inset_0_1px_0_oklch(1_0_0_/_0.2),0_0_16px_oklch(0.65_0.15_250_/_0.10)]'
              : 'bg-[oklch(1_0_0_/_0.045)] text-[oklch(0.62_0_0)] shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08)]',
          )}
        >
          <Icon size={compact ? 15 : 17} strokeWidth={1.6} />
        </div>
        <div className="pt-0.5 min-w-0">
          <h2
            id={`${id}-heading`}
            className={cn(
              'font-medium text-[oklch(0.94_0_0)] tracking-wide leading-tight',
              compact ? 'text-[12.5px]' : 'text-[13.5px]',
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-[11px] text-[oklch(0.46_0_0)] leading-relaxed font-light">
              {description}
            </p>
          )}
        </div>
      </div>
      <Separator className="bg-[oklch(1_0_0_/_0.04)]" />
      <div className={cn('px-4 md:px-6', compact ? 'py-4 md:py-5' : 'py-5 md:py-6')}>
        {children}
      </div>
    </section>
  );
}

// ─── Status + Actions Card ────────────────────────────────────────────────────

interface StatusActionCardProps {
  formId: string;
  submitLabel: string;
}

const StatusActionCard = memo(function StatusActionCard({
  formId,
  submitLabel,
}: StatusActionCardProps) {
  const { control, formState } = useFormContext<CategoryFormValues>();
  const { isDirty, isSubmitting } = formState;

  const status = useWatch({ control, name: 'status' }) ?? 'active';
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.105_0.005_260)]',
        'border-[oklch(1_0_0_/_0.08)] shadow-[0_8px_32px_oklch(0_0_0_/_0.45)]',
      )}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[oklch(1_0_0_/_0.045)] bg-[oklch(1_0_0_/_0.018)]">
        <span className="text-[9.5px] font-bold tracking-[0.24em] uppercase text-[oklch(0.40_0_0)]">
          Status
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold tracking-wide',
            cfg.badge,
          )}
        >
          <span className={cn('size-1.5 rounded-full', cfg.dot)} />
          {cfg.label}
        </span>
      </div>
      <div className="px-5 pt-4 pb-4 flex flex-col gap-2.5">
        <Button
          type="submit"
          form={formId}
          disabled={isSubmitting}
          className={cn(
            'group relative shrink-0 overflow-hidden rounded-xl h-10 px-3.5 sm:px-4',
            'bg-orange-800 text-[oklch(0.98_0_0)] hover:bg-orange-700',
            'font-semibold text-[12px] sm:text-[12.5px] tracking-wide',
            'shadow-[0_2px_12px_oklch(1_0_0_/0.12)] hover:shadow-[0_6px_20px_oklch(1_0_0_/0.22)]',
            'transition-all duration-300 ease-in-out active:scale-[0.98]',
            'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <SendHorizonal
                  size={14}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                {submitLabel}
              </>
            )}
          </span>
        </Button>
        {isDirty && (
          <p className="text-center text-[10px] font-medium text-[oklch(0.42_0_0)]" role="status">
            Unsaved changes
          </p>
        )}
      </div>
    </div>
  );
});

// ─── Shared Form Styles ───────────────────────────────────────────────────────

const formLabelClass = 'text-[12.5px] font-medium text-[oklch(0.85_0_0)] mb-2 inline-block';
const formDescClass = 'text-[11px] text-[oklch(0.45_0_0)] mt-1.5 leading-relaxed font-light';
const inputClass = cn(
  'h-11 px-3.5 rounded-lg bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.10)]',
  'text-[13px] text-[oklch(0.90_0_0)] placeholder:text-[oklch(0.35_0_0)]',
  'hover:bg-[oklch(1_0_0_/_0.05)] hover:border-[oklch(1_0_0_/_0.15)]',
  'focus-visible:border-[oklch(0.65_0.15_250_/_0.4)] focus-visible:ring-[oklch(0.65_0.15_250_/_0.2)] focus-visible:ring-4',
  'transition-all duration-300',
);

// ─── Basic Details Section ───────────────────────────────────────────────────

function BasicDetailsSection() {
  const { control } = useFormContext<CategoryFormValues>();
  return (
    <div className="flex flex-col gap-5">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>
              Category Name{' '}
              <span aria-hidden className="text-[oklch(0.65_0.22_22)]">
                *
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., T-Shirts" className={inputClass} />
            </FormControl>
            <FormDescription className={formDescClass}>
              The customer-facing name of the category.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Optional description of the category..."
                className={cn(inputClass, 'min-h-[100px] py-3 resize-none')}
              />
            </FormControl>
            <FormDescription className={formDescClass}>
              Helps customers understand what this category is about.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PublishingSection() {
  const { control } = useFormContext<CategoryFormValues>();
  return (
    <div className="flex flex-col gap-5">
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={formLabelClass}>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? 'active'}>
              <FormControl>
                <SelectTrigger className={cn(inputClass, 'h-10')}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-[oklch(0.12_0.005_260)] border-[oklch(1_0_0_/_0.08)]">
                {CATEGORY_STATUS.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-[oklch(0.85_0_0)] focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)]"
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className={formDescClass}>
              Inactive categories will be hidden from the store.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// ─── CategoryFormLayout (shared root) ────────────────────────────────────────

export interface CategoryFormLayoutProps {
  mode: 'create' | 'edit';
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  handleCancel: () => void;
  confirmDiscard: () => void;
  cancelDiscard: () => void;
  isBlocked: boolean;
  isLoadingCategory?: boolean;
}

const FORM_ID = {
  create: 'create-category-form',
  edit: 'edit-category-form',
} as const;

const HEADER_COPY = {
  create: {
    title: 'Create Category',
    subtitle: 'Define a new product classification grouping.',
    submitLabel: 'Save Category',
  },
  edit: {
    title: 'Edit Category',
    subtitle: 'Update details for this classification group.',
    submitLabel: 'Update Category',
  },
} as const;

export const CategoryFormLayout = memo(function CategoryFormLayout({
  mode,
  form,
  onSubmit,
  handleCancel,
  confirmDiscard,
  cancelDiscard,
  isBlocked,
  isLoadingCategory = false,
}: CategoryFormLayoutProps) {
  const formId = FORM_ID[mode];
  const copy = HEADER_COPY[mode];

  return (
    <div className="flex flex-col gap-2 lg:gap-4 h-full bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)]">
      <AlertDialog open={isBlocked} onOpenChange={(open) => !open && cancelDiscard()}>
        <AlertDialogContent className="bg-[oklch(0.12_0.005_260)] border border-[oklch(1_0_0_/_0.08)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[oklch(0.95_0_0)]">Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription className="text-[oklch(0.55_0_0)]">
              You have unsaved changes. Are you sure you want to discard them? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={cancelDiscard}
              className="bg-transparent text-[oklch(0.85_0_0)] hover:bg-[oklch(1_0_0_/_0.05)] border-[oklch(1_0_0_/_0.15)]"
            >
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-[oklch(0.65_0.22_22)]! text-white hover:bg-[oklch(0.55_0.22_22)]!"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header
        className={cn(
          'sticky top-0 z-40 shrink-0 px-4 md:px-6 mx-0 lg:-mx-6 lg:px-6 -mt-6 lg:-mt-6 mb-2 max-md:py-3 md:pb-4',
          'border-b border-[oklch(1_0_0_/_0.05)]',
          'bg-[oklch(0.08_0.005_260_/_0.88)] backdrop-blur-2xl',
        )}
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[20px] font-semibold text-[oklch(0.97_0_0)] tracking-tight leading-none">
              {copy.title}
            </h1>
            <p className="text-[12px] text-[oklch(0.42_0_0)] mt-1.5 font-light">{copy.subtitle}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className={cn(
              'group flex items-center gap-1.5 min-h-[44px] md:min-h-0 md:h-8 px-3.5 rounded-lg',
              'text-[11.5px] font-medium text-[oklch(0.50_0_0)]',
              'hover:text-[oklch(0.92_0_0)] hover:bg-[oklch(1_0_0_/_0.055)]',
              'transition-all duration-300',
              'focus-visible:ring-2 focus-visible:ring-[oklch(1_0_0_/_0.3)] focus-visible:outline-none',
            )}
          >
            <ArrowLeft
              size={13}
              strokeWidth={2}
              className="group-hover:-translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
            Discard
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 md:pb-0">
        {isLoadingCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-5 xl:gap-6">
            <Skeleton className="h-64 rounded-2xl bg-[oklch(1_0_0_/_0.04)]" />
            <Skeleton className="h-64 rounded-2xl bg-[oklch(1_0_0_/_0.04)]" />
          </div>
        ) : (
          <Form {...form}>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-5 xl:gap-6 items-start">
                <div className="flex flex-col gap-5">
                  <BentoCard
                    id="basic-info"
                    icon={Layers}
                    title="Category Details"
                    description="Core information for this classification."
                    accent
                  >
                    <BasicDetailsSection />
                  </BentoCard>
                </div>

                <div className="flex flex-col gap-5 lg:sticky lg:top-0">
                  <div className="fixed bottom-4 inset-x-4 z-50 md:static md:inset-auto md:z-auto">
                    <StatusActionCard formId={formId} submitLabel={copy.submitLabel} />
                  </div>
                  <BentoCard
                    id="publishing"
                    icon={Megaphone}
                    title="Publishing"
                    description="Visibility status on the storefront."
                    compact
                  >
                    <PublishingSection />
                  </BentoCard>
                </div>
              </div>
            </form>
          </Form>
        )}
      </main>
    </div>
  );
});
