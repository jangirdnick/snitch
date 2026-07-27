import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      gap={8}
      icons={{
        success: <CircleCheckIcon className="size-[16px] text-emerald-500" />,
        info: <InfoIcon className="size-[16px] text-blue-500" />,
        warning: <TriangleAlertIcon className="size-[16px] text-amber-500" />,
        error: <OctagonXIcon className="size-[16px] text-red-800" />,
        loading: <Loader2Icon className="size-[16px] animate-spin text-orange-500" />,
      }}
      toastOptions={{
        duration: 4000,
        classNames: {
          // ─── Base — Vercel style + Orange/Black aesthetic ──────────
          toast: [
            'group toast',
            // Orange/Black minimalist background
            'group-[.toaster]:bg-[#0a0a0a]',
            'group-[.toaster]:bg-gradient-to-tr',
            'group-[.toaster]:from-[#0a0a0a]',
            'group-[.toaster]:to-orange-950/10',
            // Subtle crisp border
            'group-[.toaster]:border',
            'group-[.toaster]:border-white/[0.08]',
            // Deep shadow for floating effect
            'group-[.toaster]:shadow-[0_8px_30px_rgb(0,0,0,0.8)]',
            // Crisp shape
            'group-[.toaster]:rounded-3xl',
            'group-[.toaster]:px-4',
            'group-[.toaster]:py-3.5',
            'group-[.toaster]:text-zinc-100',
            'group-[.toaster]:min-w-[320px]',
          ].join(' '),

          // ─── Type Variants ────────
          success: [
            '!border-emerald-900/25',
            '!bg-emerald-950/30 !backdrop-blur-md',
            '!shadow-[0px_0px_0px_1px_#ffffff1d,inset_0px_0px_5px_30px_#0000002d]',
            '!to-black/70 !text-white/80 ',
          ].join(' '),

          error: [
            '!border-red-900/20',
            '!bg-red-950/30 !backdrop-blur-md',
            '!shadow-[0px_0px_0px_1px_#ffffff1d,inset_0px_0px_5px_30px_#0000002d]',
            '!to-black/70 !text-white/80',
          ].join(' '),

          warning: [
            '!border-amber-900/20',
            '!bg-amber-950/30 !backdrop-blur-md',
            '!shadow-[0px_0px_0px_1px_#ffffff1d,inset_0px_0px_5px_30px_#0000002d]',
            '!to-black/70 !text-white/80',
          ].join(' '),

          info: [
            '!border-blue-900/20',
            '!bg-blue-950/10 !backdrop-blur-md',
            '!shadow-[0px_0px_0px_1px_#ffffff1d,inset_0px_0px_5px_30px_#0000002d]',
            '!to-black/70 !text-white/80',
          ].join(' '),

          // ─── Typography ────────
          title: ['text-[13px]', 'font-medium', 'text-zinc-100', 'tracking-tight'].join(' '),

          description: ['text-[12px]', 'text-zinc-400', 'mt-0.5', 'leading-relaxed'].join(' '),

          // ─── Icon ─────────────────────────────────────────
          icon: 'mt-px',

          // ─── Action Button — Orange accent ───
          actionButton: [
            'group-[.toast]:rounded-md',
            'group-[.toast]:px-3',
            'group-[.toast]:py-1.5',
            'group-[.toast]:text-[11px]',
            'group-[.toast]:font-medium',
            'group-[.toast]:transition-all',
            'group-[.toast]:bg-orange-600',
            'group-[.toast]:text-white',
            'group-[.toast]:hover:bg-orange-500',
            'group-[.toast]:active:scale-95',
          ].join(' '),

          // ─── Cancel Button ───
          cancelButton: [
            'group-[.toast]:rounded-md',
            'group-[.toast]:px-3',
            'group-[.toast]:py-1.5',
            'group-[.toast]:text-[11px]',
            'group-[.toast]:font-medium',
            'group-[.toast]:transition-all',
            'group-[.toast]:bg-transparent',
            'group-[.toast]:text-zinc-400',
            'group-[.toast]:hover:text-zinc-200',
            'group-[.toast]:hover:bg-white/5',
          ].join(' '),

          // ─── Close Button ─────────────────────────────────
          closeButton: [
            '!bg-transparent',
            '!border-white/[0.08]',
            '!text-zinc-500',
            'hover:!bg-white/[0.08]',
            'hover:!text-zinc-200',
            'transition-colors',
            'backdrop-blur-md',
          ].join(' '),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
