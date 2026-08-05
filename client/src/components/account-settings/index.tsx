import { lazy, Suspense } from 'react';
import type { AccountSettingsModalProps } from './AccountSettingsModal';

// Code-split lazy loaded component
const LazyAccountSettingsModal = lazy(() => import('./AccountSettingsModal'));

/**
 * AccountSettingsModal — Wrapper component that automatically handles Suspense loading.
 */
export function AccountSettingsModal(props: AccountSettingsModalProps) {
  if (!props.open) return null;

  return (
    <Suspense fallback={null}>
      <LazyAccountSettingsModal {...props} />
    </Suspense>
  );
}

export type { AccountSettingsModalProps };
export default AccountSettingsModal;
