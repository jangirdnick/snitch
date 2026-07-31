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
      <DialogContent className="sm:max-w-[425px] bg-[oklch(0.12_0.01_260)] border-[oklch(0.2_0.02_260)] text-[oklch(0.95_0_0)]">
        <DialogHeader>
          <DialogTitle>Update Tracking Info</DialogTitle>
          <DialogDescription className="text-[oklch(0.7_0_0)]">
            Add or update shipping tracking information for {orderNumber}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrier" className="text-right text-[oklch(0.8_0_0)]">
                Carrier
              </Label>
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="col-span-3 bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)]"
                placeholder="e.g. FedEx, UPS, DHL"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingId" className="text-right text-[oklch(0.8_0_0)]">
                Tracking ID
              </Label>
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="col-span-3 bg-[oklch(0.15_0.01_260)] border-[oklch(0.25_0.02_260)] text-[oklch(0.9_0_0)]"
                placeholder="e.g. 1Z9999999999999999"
                required
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
              disabled={isLoading || !trackingId || !carrier}
              className="bg-[oklch(0.95_0_0)] text-[oklch(0.1_0_0)] hover:bg-[oklch(0.85_0_0)]"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
