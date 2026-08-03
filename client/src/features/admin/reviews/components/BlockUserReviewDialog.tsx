import { useState } from 'react';
import { cn } from '@/lib/utils';
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

interface BlockUserReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPermission: boolean;
  onConfirm: () => Promise<void>;
}

export function BlockUserReviewDialog({
  isOpen,
  onClose,
  currentPermission,
  onConfirm,
}: BlockUserReviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  const actionText = currentPermission ? 'Block User' : 'Allow User';
  const description = currentPermission
    ? 'This user will no longer be able to submit new reviews on any product. Existing reviews will remain unless manually deleted or blocked.'
    : 'This user will regain the ability to submit new reviews.';

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="w-[95vw] max-w-[425px] rounded-2xl bg-[oklch(0.12_0.01_260)] border-[oklch(0.2_0.02_260)] text-[oklch(0.95_0_0)] p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl font-bold">
            {actionText} from Reviews?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-[oklch(0.7_0_0)]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end gap-2 pt-2">
          <AlertDialogCancel disabled={isLoading} className="h-10 text-xs sm:text-sm rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={currentPermission ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'h-10 text-xs sm:text-sm font-semibold rounded-xl',
              currentPermission
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground',
            )}
          >
            {isLoading ? 'Processing...' : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
