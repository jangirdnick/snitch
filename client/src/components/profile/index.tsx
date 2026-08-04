import { lazy, Suspense } from 'react';
import type { UserProfileModalProps } from './UserProfileModal';

// Code-split lazy loaded component
const LazyUserProfileModal = lazy(() => import('./UserProfileModal'));

/**
 * LazyUserProfileModal — Wrapper component that automatically handles Suspense loading.
 */
export function UserProfileModal(props: UserProfileModalProps) {
  if (!props.open) return null;

  return (
    <Suspense fallback={null}>
      <LazyUserProfileModal {...props} />
    </Suspense>
  );
}

export type { UserProfileModalProps };
export default UserProfileModal;
