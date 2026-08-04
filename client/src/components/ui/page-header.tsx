import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 shrink-0 w-full  max-md:pb-2',
        'border-b border-[oklch(1_0_0_/_0.05)]',
        'bg-[oklch(0.08_0.005_260_/0.88)] backdrop-blur-2xl',
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4',
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-[20px] font-semibold text-[oklch(0.97_0_0)] tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[11px] sm:text-[12px] text-[oklch(0.42_0_0)] mt-0.5 sm:mt-1 font-light truncate">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center md:justify-end gap-2 sm:gap-3 shrink-0 w-full sm:w-fit">
          {children}
        </div>
      )}
    </header>
  );
}
