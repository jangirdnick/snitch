import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AuthErrorBannerProps {
  message: string | null;
  type?: 'error' | 'success';
  onDismiss?: () => void;
}

export function AuthErrorBanner({ message, type = 'error', onDismiss }: AuthErrorBannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.05, 0.7, 0.1, 1] }}
          role="alert"
          aria-live="polite"
          className={cn(
            'flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-[13px] font-medium leading-[1.4]',
            type === 'error' &&
              'bg-red-600/10 text-red-600 border border-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
            type === 'success' &&
              'bg-green-600/10 text-green-700 border border-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
          )}
        >
          <span className="shrink-0 flex mt-px">
            {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          </span>
          <span className="flex-1">{message}</span>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center p-0.5 opacity-60 hover:opacity-100 transition-opacity rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              aria-label="Dismiss message"
            >
              <X size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
