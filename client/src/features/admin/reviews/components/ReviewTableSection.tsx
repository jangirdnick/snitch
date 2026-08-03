import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ReviewTable } from './ReviewTable';
import { AdminPagination } from '@/components/admin/AdminPagination';
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
import type { ReviewResponseDto } from '@snitch/types';
import { BlockUserReviewDialog } from './BlockUserReviewDialog';

interface ReviewTableSectionProps {
  items: ReviewResponseDto[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: 'active' | 'blocked' | 'reported') => Promise<boolean>;
  onDeleteConfirm: (id: string) => Promise<boolean>;
  onToggleUserPermission: (userId: string, currentPermission: boolean) => Promise<boolean>;
}

export function ReviewTableSection({
  items,
  loading,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onUpdateStatus,
  onDeleteConfirm,
  onToggleUserPermission,
}: ReviewTableSectionProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userTarget, setUserTarget] = useState<{ id: string; currentPermission: boolean } | null>(
    null,
  );

  const handleDeleteRequest = (id: string) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const success = await onDeleteConfirm(deleteTarget);
    setIsDeleting(false);
    if (success) {
      setDeleteTarget(null);
    }
  };

  const handleToggleUserPermission = (userId: string, currentPermission: boolean) => {
    setUserTarget({ id: userId, currentPermission });
  };

  const handleUserPermissionConfirm = async () => {
    if (!userTarget) return;
    const success = await onToggleUserPermission(userTarget.id, !userTarget.currentPermission);
    if (success) {
      setUserTarget(null);
    }
  };

  return (
    <>
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This review will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={'destructive'}
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BlockUserReviewDialog
        isOpen={!!userTarget}
        onClose={() => setUserTarget(null)}
        currentPermission={userTarget?.currentPermission ?? true}
        onConfirm={handleUserPermissionConfirm}
      />

      <div
        className={cn(
          'group relative rounded-2xl flex-1 flex flex-col justify-between',
          'md:overflow-y-scroll md:min-h-0 md:h-full',
          'bg-linear-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
          'border border-[oklch(1_0_0/0.055)] hover:border-[oklch(1_0_0/0.11)]',
          'transition-all duration-500 ease-in-out',
          'shadow-[0_4px_24px_oklch(0_0_0/0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0/0.5)]',
          'md:mx-6 lg:mx-0',
        )}
      >
        <ReviewTable
          items={items}
          loading={loading}
          onUpdateStatus={onUpdateStatus}
          onDelete={handleDeleteRequest}
          onToggleUserPermission={handleToggleUserPermission}
        />

        {totalPages > 1 && (
          <div className="border-t border-[oklch(1_0_0_/0.055)] px-4 py-3 shrink-0 bg-[oklch(1_0_0_/0.015)]">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
