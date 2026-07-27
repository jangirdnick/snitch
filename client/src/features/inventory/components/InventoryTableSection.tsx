import { useState } from 'react';
import { cn } from '@/lib/utils';
import { InventoryTable } from './InventoryTable';
import { InventoryPagination } from './InventoryPagination';
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
import type { Product } from '@snitch/types';

interface InventoryTableSectionProps {
  items: Product[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onDeleteConfirm: (id: string) => Promise<boolean>;
}

export function InventoryTableSection({
  items,
  loading,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onEdit,
  onView,
  onDeleteConfirm,
}: InventoryTableSectionProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (product: Product) => {
    setDeleteTarget(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const idToUse = deleteTarget._id;
    const success = await onDeleteConfirm(idToUse);
    setIsDeleting(false);
    if (success) {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{deleteTarget?.title}</span> will be
              permanently deleted. This action cannot be undone.
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

      <div
        className={cn(
          'group relative rounded-2xl flex-1 flex flex-col justify-between',
          'md:overflow-y-scroll md:min-h-0 md:h-full',
          'bg-gradient-to-b from-[oklch(0.145_0.005_260)] to-[oklch(0.115_0.005_260)]',
          'border border-[oklch(1_0_0_/_0.055)] hover:border-[oklch(1_0_0_/_0.11)]',
          'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'shadow-[0_4px_24px_oklch(0_0_0_/_0.35)] hover:shadow-[0_8px_32px_oklch(0_0_0_/_0.5)]',
          'mx-4 md:mx-6 lg:mx-0',
        )}
      >
        <InventoryTable
          items={items}
          loading={loading}
          onEdit={onEdit}
          onView={onView}
          onDelete={handleDeleteRequest}
        />

        {totalPages > 1 && (
          <div className="border-t border-[oklch(1_0_0_/0.055)] px-4 py-3 shrink-0 bg-[oklch(1_0_0_/0.015)]">
            <InventoryPagination
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
