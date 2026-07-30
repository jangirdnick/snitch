import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { Coupon } from '@snitch/types';
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

interface CouponActionsProps {
  coupon: Coupon;
  onEdit: (coupon: Coupon) => void;
  onDeleteConfirm: (id: string) => Promise<boolean>;
}

export function CouponActions({ coupon, onEdit, onDeleteConfirm }: CouponActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onDeleteConfirm(coupon.id);
    setIsDeleting(false);
    if (success) {
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-[oklch(0.55_0_0)] hover:bg-[oklch(1_0_0_/_0.06)] hover:text-[oklch(0.95_0_0)] rounded-lg"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 bg-[oklch(0.15_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.85_0_0)] rounded-xl shadow-xl p-1.5"
        >
          <DropdownMenuItem
            onClick={() => onEdit(coupon)}
            className="rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[oklch(1_0_0_/_0.06)] hover:text-[oklch(0.95_0_0)] focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] gap-2 py-2"
          >
            <Edit className="size-3.5" />
            Edit Coupon
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[oklch(1_0_0_/_0.06)] my-1" />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="rounded-lg text-[13px] font-medium cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 gap-2 py-2"
          >
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
            <AlertDialogDescription className="text-[oklch(0.6_0_0)]">
              This will permanently delete the coupon{' '}
              <span className="font-semibold text-[oklch(0.95_0_0)]">{coupon.code}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-transparent border-[oklch(1_0_0_/_0.1)] text-[oklch(0.8_0_0)] hover:bg-[oklch(1_0_0_/_0.05)] hover:text-white rounded-lg h-9"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white border-transparent rounded-lg h-9"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
