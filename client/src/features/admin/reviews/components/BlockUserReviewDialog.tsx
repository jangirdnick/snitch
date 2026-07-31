import { useState } from 'react';
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionText} from Reviews?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={currentPermission ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              currentPermission
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }
          >
            {isLoading ? 'Processing...' : actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
