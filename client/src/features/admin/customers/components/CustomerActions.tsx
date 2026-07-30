import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import type { UserResponseDto } from '@snitch/types';
import { toast } from 'sonner';
import { blockCustomer, deleteCustomer } from '../service/customers.api';
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
import { AxiosError } from 'axios';

interface CustomerActionsProps {
  customer: UserResponseDto;
  onUpdate: () => void;
}

export default function CustomerActions({ customer, onUpdate }: CustomerActionsProps) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleBlockToggle = async () => {
    try {
      setIsBlocking(true);
      await blockCustomer(customer.id, !customer.isBlocked);
      toast.success(
        `User ${customer.firstName} has been ${!customer.isBlocked ? 'blocked' : 'unblocked'}`,
      );
      onUpdate();
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data?.message
            : 'Failed to update block status';
      toast.error(errMessage);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCustomer(customer.id);
      toast.success('User deleted successfully');
      setShowDeleteAlert(false);
      onUpdate();
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data?.message
            : 'Failed to delete user';
      toast.error(errMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleBlockToggle}
            disabled={isBlocking || customer.role === 'ADMIN'}
            className={customer.isBlocked ? 'text-green-600' : 'text-orange-600'}
          >
            {customer.isBlocked ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <Ban className="mr-2 h-4 w-4" />
            )}
            {customer.isBlocked ? 'Unblock User' : 'Block User'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            disabled={isDeleting || customer.role === 'ADMIN'}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account for{' '}
              {customer.firstName} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 focus:ring-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
