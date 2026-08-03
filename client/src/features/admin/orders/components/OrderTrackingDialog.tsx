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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderTrackingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { trackingId: string; carrier: string }) => Promise<void>;
  defaultTrackingId?: string;
  defaultCarrier?: string;
  orderNumber: string;
}

export function OrderTrackingDialog({
  isOpen,
  onClose,
  onConfirm,
  defaultTrackingId = '',
  defaultCarrier = '',
  orderNumber,
}: OrderTrackingDialogProps) {
  const [trackingId, setTrackingId] = useState(defaultTrackingId);
  const [carrier, setCarrier] = useState(defaultCarrier);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId || !carrier) return;

    setIsLoading(true);
    await onConfirm({ trackingId, carrier });
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] rounded-2xl bg-[oklch(0.12_0.01_260)] border-[oklch(0.2_0.02_260)] text-[oklch(0.95_0_0)] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">Update Tracking Info</DialogTitle>
          <DialogDescription className="text-[oklch(0.7_0_0)] text-xs sm:text-sm">
            Add or update shipping tracking information for {orderNumber}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1.5 sm:gap-4">
              <Label
                htmlFor="carrier"
                className="sm:text-right text-[oklch(0.8_0_0)] text-xs sm:text-sm"
              >
                Carrier
              </Label>
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="col-span-1 sm:col-span-3 bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)] h-11 sm:h-10 text-xs sm:text-sm rounded-xl"
                placeholder="e.g. FedEx, UPS, DHL"
                required
              />
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-4 sm:items-center gap-1.5 sm:gap-4">
              <Label
                htmlFor="trackingId"
                className="sm:text-right text-[oklch(0.8_0_0)] text-xs sm:text-sm"
              >
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="col-span-1 sm:col-span-3 bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)] h-11 sm:h-10 text-xs sm:text-sm rounded-xl"
                placeholder="e.g. 1Z9999999999999999"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 bg-transparent border-[oklch(0.25_0.02_260)] text-[oklch(0.8_0_0)] hover:bg-[oklch(0.2_0.02_260)] text-xs sm:text-sm rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !trackingId || !carrier}
              className="h-10 bg-[oklch(0.95_0_0)] text-[oklch(0.1_0_0)] hover:bg-[oklch(0.85_0_0)] text-xs sm:text-sm font-semibold rounded-xl"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
