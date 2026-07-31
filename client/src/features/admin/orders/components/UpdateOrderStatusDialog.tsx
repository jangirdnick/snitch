import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrderQueryDto } from '@snitch/schemas';
import { orderStatusEnum } from '@snitch/schemas';

interface UpdateOrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { status: OrderQueryDto['status']; note?: string }) => Promise<void>;
  currentStatus: OrderQueryDto['status'];
  orderNumber: string;
}

export function UpdateOrderStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  orderNumber,
}: UpdateOrderStatusDialogProps) {
  const [status, setStatus] = useState<OrderQueryDto['status']>(currentStatus || 'new');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) return;

    setIsLoading(true);
    await onConfirm({ status, note });
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[oklch(0.12_0.01_260)] border-[oklch(0.2_0.02_260)] text-[oklch(0.95_0_0)]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription className="text-[oklch(0.7_0_0)]">
            Change the status for {orderNumber}. This will be added to the order timeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-[oklch(0.8_0_0)]">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as OrderQueryDto['status'])}
              >
                <SelectTrigger className="w-full bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)]">
                  {orderStatusEnum.options.map((opt) => (
                    <SelectItem key={opt} value={opt} className="capitalize">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note" className="text-[oklch(0.8_0_0)]">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)] min-h-[80px]"
                placeholder="e.g. Package was left at the front door..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-transparent border-[oklch(0.25_0.02_260)] text-[oklch(0.8_0_0)] hover:bg-[oklch(0.2_0.02_260)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || status === currentStatus}
              className="bg-[oklch(0.95_0_0)] text-[oklch(0.1_0_0)] hover:bg-[oklch(0.85_0_0)]"
            >
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
