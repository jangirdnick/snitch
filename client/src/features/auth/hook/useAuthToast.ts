import { useEffect } from 'react';
import { showToast } from '@/lib/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, clearMessage } from '../state/auth.slice';

/**
 * useAuthToast
 *
 * Watches the Redux auth slice for `error` and `message` changes.
 * - error   → toast.error   (red)  — clears error from Redux after showing
 * - message → toast.success (green) — does NOT clear message, so components
 *             that depend on message for redirect logic (e.g. RegisterForm)
 *             continue to work correctly.
 *
 * Mount this hook once at the app root (App.tsx) so it is always active.
 */
export function useAuthToast() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.auth.error);
  const message = useAppSelector((state) => state.auth.message);

  useEffect(() => {
    if (error) {
      showToast.error(error, { duration: 5000 });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      showToast.success(message, { duration: 4000 });
      dispatch(clearMessage());
    }
  }, [message, dispatch]);
}
