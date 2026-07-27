/**
 * ProductFormLayout.tsx
 *
 * Shared 3-column bento-grid layout for Create and Edit product forms.
 * Extracted from CreateProductForm to eliminate duplication.
 *
 * ────────────────────────────────────────────────────────────────────
 * 12-column logical grid (5 | 4 | 3)
 *
 *  Col A [5/12]  Basic Info → Color Variants & Media (hero)
 *  Col B [4/12]  Classification → Pricing → Attributes
 *  Col C [3/12]  Status/Save (sticky) → Publishing → SEO
 *
 * Breakpoints:
 *  < md  : single column stack
 *  md    : 2-col (A+B | C)
 *  xl    : full 3-col  [5fr 4fr 3fr]
 *
 * Design principles applied (frontend-design skill):
 *  • Color Variants is the hero — widest column, accent styling
 *  • Status sidebar is always in reach — sticky top
 *  • Small sections (Publishing, SEO) grouped in the lean col C
 *
 * Performance applied (vercel-react-best-practices skill):
 *  • Static JSX nodes hoisted to module scope (rendering-hoist-jsx)
 *  • StatusActionCard extracted & memoized (rerender-memo)
 *  • animDelay prop removed — CSS handles stagger via nth-child
 */

import { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Loader2,
  ArrowLeft,
  SendHorizonal,
  Package,
  Layers,
  Palette,
  Tag,
  Shirt,
  Megaphone,
  SearchCode,
} from 'lucide-react';
import { showToast } from '@/lib/toast';
import { Form } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { Skeleton } from '@components/ui/skeleton';
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
import type { ProductFormValues } from '../schema/product.form.schema';

import { BasicInfoSection } from './sections/BasicInfoSection';
import { ClassificationSection } from './sections/ClassificationSection';
import { ColorVariantsSection } from './sections/ColorVariantsSection';
import { PricingSection } from './sections/PricingSection';
import { AttributesSection } from './sections/AttributesSection';
import { PublishingSection } from './sections/PublishingSection';
import { SeoSection } from './sections/SeoSection';

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; badge: string }> = {
  draft: {
    label: 'Draft',
    dot: 'bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]',
    text: 'text-[oklch(0.65_0_0)]',
    badge: 'bg-[oklch(0.55_0_0_/_0.10)] text-[oklch(0.65_0_0)] border-[oklch(0.55_0_0_/_0.20)]',
  },
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
  out_of_stock: {
    label: 'Out of Stock',
    dot: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
    text: 'text-[oklch(0.75_0.20_22)]',
    badge:
      'bg-[oklch(0.65_0.20_22_/_0.10)] text-[oklch(0.75_0.20_22)] border-[oklch(0.65_0.20_22_/_0.25)]',
  },
};

// ─── BentoCard ────────────────────────────────────────────────────────────────

interface BentoCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Blue accent border + icon tint — use for the hero section */
  accent?: boolean;
  /** Compact variant: reduced header padding for lightweight sections */
  compact?: boolean;
}

// Module-scope static nodes — never re-allocated on re-render (rendering-hoist-jsx)
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
        // Base
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
        'border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        // Shadow + lift on hover
        'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_12px_40px_oklch(0_0_0_/_0.55)]',
        'hover:-translate-y-px',
        // Border
        accent
          ? 'border-[oklch(0.65_0.15_250_/_0.22)] hover:border-[oklch(0.65_0.15_250_/_0.40)]'
          : 'border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
      )}
    >
      {/* Top edge line */}
      {accent ? ACCENT_LINE : TOP_GLOW}

      {/* ── Card Header ── */}
      <div
        className={cn('flex items-start gap-3.5 px-4 md:px-6', compact ? 'py-4' : 'py-4 md:py-5')}
      >
        {/* Icon badge */}
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

        {/* Title + description */}
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

      {/* ── Card Body ── */}
      <div className={cn('px-4 md:px-6', compact ? 'py-4 md:py-5' : 'py-5 md:py-6')}>
        {children}
      </div>
    </section>
  );
}

// ─── Status + Actions Card ────────────────────────────────────────────────────
// Memoized: re-renders only when status/dirty/submitting changes (rerender-memo)

interface StatusActionCardProps {
  formId: string;
  submitLabel: string;
}

const StatusActionCard = memo(function StatusActionCard({
  formId,
  submitLabel,
}: StatusActionCardProps) {
  const { control, formState } = useFormContext<ProductFormValues>();
  const { isDirty, isSubmitting } = formState;

  const status = useWatch({ control, name: 'status' }) ?? 'draft';
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.105_0.005_260)]',
        'border-[oklch(1_0_0_/_0.08)] shadow-[0_8px_32px_oklch(0_0_0_/_0.45)]',
      )}
    >
      {/* Status row */}
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

      {/* Submit area */}
      <div className="px-5 pt-4 pb-4 flex flex-col gap-2.5">
        <Button
          type="submit"
          form={formId}
          id="save-product-btn"
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

// ─── Skeleton for loading state (edit mode only) ──────────────────────────────

function ProductFormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[5fr_4fr_3fr] gap-5 xl:gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-5">
          {[...Array(i === 0 ? 2 : i === 1 ? 3 : 2)].map((__, j) => (
            <div
              key={j}
              className="rounded-2xl border border-[oklch(1_0_0_/_0.055)] bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)] overflow-hidden"
            >
              <div className="px-6 py-5 flex items-start gap-3.5 border-b border-[oklch(1_0_0_/_0.04)]">
                <Skeleton className="size-10 rounded-xl bg-[oklch(1_0_0_/_0.06)]" />
                <div className="flex flex-col gap-2 pt-0.5">
                  <Skeleton className="h-3.5 w-32 bg-[oklch(1_0_0_/_0.06)]" />
                  <Skeleton className="h-2.5 w-48 bg-[oklch(1_0_0_/_0.04)]" />
                </div>
              </div>
              <div className="px-6 py-6 flex flex-col gap-4">
                {[...Array(3)].map((___, k) => (
                  <Skeleton key={k} className="h-11 w-full rounded-xl bg-[oklch(1_0_0_/_0.04)]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── ProductFormLayout (shared root) ─────────────────────────────────────────

export interface ProductFormLayoutProps {
  /** 'create' | 'edit' — controls header copy and form ID */
  mode: 'create' | 'edit';
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  handleCancel: () => void;
  confirmDiscard: () => void;
  cancelDiscard: () => void;
  isBlocked: boolean;
  /** Edit mode only: true while the existing product is being fetched */
  isLoadingProduct?: boolean;
}

const FORM_ID = {
  create: 'create-product-form',
  edit: 'edit-product-form',
} as const;

const HEADER_COPY = {
  create: {
    title: 'Create Product',
    subtitle: 'Define details, colors, sizing, and pricing for a new catalog entry.',
    submitLabel: 'Save Product',
  },
  edit: {
    title: 'Edit Product',
    subtitle: 'Update details, colors, sizing, and pricing for this catalog entry.',
    submitLabel: 'Update Product',
  },
} as const;

export const ProductFormLayout = memo(function ProductFormLayout({
  mode,
  form,
  onSubmit,
  handleCancel,
  confirmDiscard,
  cancelDiscard,
  isBlocked,
  isLoadingProduct = false,
}: ProductFormLayoutProps) {
  const formId = FORM_ID[mode];
  const copy = HEADER_COPY[mode];

  return (
    <div className="flex flex-col gap-2 lg:gap-4 h-full bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)]">
      {/* ── Discard Confirmation Dialog ──────────────────────────────────────── */}
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

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-40 shrink-0 px-4 md:px-6 mx-0 lg:-mx-6 lg:px-6 -mt-6 lg:-mt-6 mb-2 max-md:py-3 md:pb-4',
          'border-b border-[oklch(1_0_0_/_0.05)]',
          'bg-[oklch(0.08_0.005_260_/_0.88)] backdrop-blur-2xl',
        )}
      >
        {/* Title row */}
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

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32 md:pb-0">
        {isLoadingProduct ? (
          <ProductFormSkeleton />
        ) : (
          <Form {...form}>
            <form
              id={formId}
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                showToast.error('Please fix the errors in the form before saving.');
                console.error('Form validation failed:', errors);
              })}
              noValidate
            >
              {/*
               * 3-column bento grid (12-column logical)
               * ─────────────────────────────────────────────────────────────
               *  [A: 5fr]  Basic Info + Color Variants (hero, largest section)
               *  [B: 4fr]  Classification + Pricing + Attributes
               *  [C: 3fr]  Status/Save (sticky) + Publishing + SEO
               * ─────────────────────────────────────────────────────────────
               *  <md   → 1 col   (natural stack)
               *  md–xl → 2 col   (A spans full, B+C side by side)
               *  ≥xl   → 3 col   (5fr | 4fr | 3fr)
               */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[5fr_4fr_3fr] gap-5 xl:gap-6 items-start">
                {/* ── Col A: Core content + hero ───────────────────────────── */}
                <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-1 lg:sticky lg:top-0">
                  <BentoCard
                    id="basic-info"
                    icon={Package}
                    title="Basic Information"
                    description="Name, SKU, brand, and detailed description."
                  >
                    <BasicInfoSection />
                  </BentoCard>

                  {/* Hero card — the most content-dense section gets the widest column */}
                  <BentoCard
                    id="colors"
                    icon={Palette}
                    title="Color Variants & Media"
                    description="Each color carries its own images and size/stock matrix."
                    accent
                  >
                    <ColorVariantsSection />
                  </BentoCard>
                </div>

                {/* ── Col B: Classification + Commerce ────────────────────── */}
                <div className="flex flex-col gap-5 lg:sticky lg:top-0">
                  <BentoCard
                    id="classification"
                    icon={Layers}
                    title="Classification"
                    description="Category, gender, age group, and tags."
                  >
                    <ClassificationSection />
                  </BentoCard>

                  <BentoCard
                    id="pricing"
                    icon={Tag}
                    title="Pricing"
                    description="Selling price, compare-at, discount, and stock alert."
                  >
                    <PricingSection />
                  </BentoCard>

                  <BentoCard
                    id="attributes"
                    icon={Shirt}
                    title="Clothing Attributes"
                    description="Fit, fabric, pattern, occasion, and seasonal details."
                  >
                    <AttributesSection />
                  </BentoCard>
                </div>

                {/* ── Col C: Actions + Lightweight metadata ────────────────── */}
                {/*
                 * The status card is sticky so Save is always reachable.
                 * Publishing + SEO are intentionally compact — they're short
                 * forms that don't need the same visual weight as content sections.
                 */}
                <div className="flex flex-col gap-5 lg:sticky lg:top-0">
                  {/* Sticky bottom on mobile, regular flow on md+ */}
                  <div className="fixed bottom-4 inset-x-4 z-50 md:static md:inset-auto md:z-auto">
                    <StatusActionCard formId={formId} submitLabel={copy.submitLabel} />
                  </div>

                  <BentoCard
                    id="publishing"
                    icon={Megaphone}
                    title="Publishing"
                    description="Visibility status and scheduled publish date."
                    compact
                  >
                    <PublishingSection />
                  </BentoCard>

                  <BentoCard
                    id="seo"
                    icon={SearchCode}
                    title="SEO"
                    description="Meta title, description, and keywords."
                    compact
                  >
                    <SeoSection />
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
