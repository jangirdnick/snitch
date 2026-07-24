import React from 'react';
import { ShoppingBag, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconAccent: string;
  loading?: boolean;
}

const TOP_GLOW = (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(1_0_0_/_0.16)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
  />
);

function StatCard({ icon: Icon, label, value, sub, iconAccent, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-[oklch(0.145_0.005_260)] border border-[oklch(1_0_0_/_0.055)] rounded-2xl p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 animate-pulse">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[oklch(1_0_0_/_0.04)]" />
        <div className="flex-1 space-y-2 mt-1">
          <div className="h-3 w-20 bg-[oklch(1_0_0_/_0.04)] rounded" />
          <div className="h-6 w-12 bg-[oklch(1_0_0_/_0.04)] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
        'border border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
        'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0_/_0.5)]',
        'hover:-translate-y-px p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4',
      )}
    >
      {TOP_GLOW}

      <div
        className={cn(
          'flex-shrink-0 flex items-center justify-center rounded-xl size-8 sm:size-10',
          'transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105',
          'bg-[oklch(1_0_0_/_0.045)] shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08)]',
          iconAccent,
        )}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="pt-0.5 min-w-0 flex-1">
        <p className="text-[9.5px] sm:text-[10px] text-[oklch(0.55_0_0)] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.15em] mb-1 truncate">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-semibold text-[oklch(0.95_0_0)] leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] sm:text-[11px] text-[oklch(0.42_0_0)] mt-1 sm:mt-1.5 font-light leading-tight truncate">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

interface InventoryStatsProps {
  totalItems: number;
  activeCount: number;
  outOfStockCount: number;
  draftCount: number;
  loading: boolean;
}

export function InventoryStats({
  totalItems,
  activeCount,
  outOfStockCount,
  draftCount,
  loading,
}: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0 px-4 md:px-6 lg:px-0">
      <StatCard
        loading={loading}
        icon={ShoppingBag}
        iconAccent="text-[oklch(0.75_0.15_280)]"
        label="Total Products"
        value={totalItems}
        sub="across all categories"
      />
      <StatCard
        loading={loading}
        icon={TrendingUp}
        iconAccent="text-[oklch(0.82_0.15_160)]"
        label="Active"
        value={activeCount}
        sub="live on store"
      />
      <StatCard
        loading={loading}
        icon={AlertTriangle}
        iconAccent="text-[oklch(0.75_0.20_50)]"
        label="Out of Stock"
        value={outOfStockCount}
        sub="needs restocking"
      />
      <StatCard
        loading={loading}
        icon={Package}
        iconAccent="text-[oklch(0.65_0_0)]"
        label="Drafts"
        value={draftCount}
        sub="not published yet"
      />
    </div>
  );
}
