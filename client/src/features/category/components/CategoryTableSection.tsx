import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CategoryTable } from './CategoryTable';
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
import type { Category } from '../service/category.api';

interface CategoryTableSectionProps {
  items: Category[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDeleteConfirm: (id: string) => Promise<boolean>;
}

export function CategoryTableSection({
  items,
  loading,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onEdit,
  onDeleteConfirm,
}: CategoryTableSectionProps) {
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (category: Category) => {
    setDeleteTarget(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const success = await onDeleteConfirm(deleteTarget._id);
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
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{deleteTarget?.name}</span> will be
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
        <CategoryTable
          items={items}
          loading={loading}
          onEdit={onEdit}
          onDelete={handleDeleteRequest}
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
