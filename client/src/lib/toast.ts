/**
 * ─── Toast Utility ────────────────────────────────────────────────────────────
 *
 * Centralized wrapper around `sonner` toast library.
 *
 * Why use this instead of calling `sonner` directly?
 * - Consistent default duration, styling, and options across the whole app.
 * - Easy to swap the underlying library in the future from one place.
 * - Typed helpers make intent clear at the call-site.
 *
 * Usage:
 *
 *   import { showToast } from '@/lib/toast';
 *
 *   showToast.success('Profile updated!');
 *   showToast.error('Something went wrong', { description: err.message });
 *   showToast.info('New feature available');
 *   showToast.warning('Session expires soon');
 *   showToast.loading('Saving…');
 *   showToast.dismiss(id);        // dismiss a specific toast
 *   showToast.dismissAll();       // dismiss every active toast
 */

import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const DEFAULT_DURATION = {
  success: 4000,
  error: 5000,
  info: 4000,
  warning: 5000,
  loading: Infinity,
} as const;

export const showToast = {
  success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      duration: DEFAULT_DURATION.success,
      ...options,
    });
  },

  error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      duration: DEFAULT_DURATION.error,
      ...options,
    });
  },

  info(message: string, options?: ToastOptions) {
    return toast.info(message, {
      duration: DEFAULT_DURATION.info,
      ...options,
    });
  },

  warning(message: string, options?: ToastOptions) {
    return toast.warning(message, {
      duration: DEFAULT_DURATION.warning,
      ...options,
    });
  },

  loading(message: string, options?: Omit<ToastOptions, 'duration'>) {
    return toast.loading(message, {
      duration: DEFAULT_DURATION.loading,
      ...options,
    });
  },

  /** Dismiss a specific toast by the ID returned from the other methods. */
  dismiss(id: string | number) {
    toast.dismiss(id);
  },

  /** Dismiss all currently visible toasts. */
  dismissAll() {
    toast.dismiss();
  },
};
