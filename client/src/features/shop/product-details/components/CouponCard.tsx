import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, CheckCircle2, XCircle } from 'lucide-react';
import { validateCouponCode } from '../service/coupon.api';

interface CouponCardProps {
  orderAmount: number;
}

export default function CouponCard({ orderAmount }: CouponCardProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [discountValue, setDiscountValue] = useState<number | null>(null);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED' | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await validateCouponCode(code, orderAmount);
      if (res.success && res.data) {
        setStatus('success');
        setMessage(`Coupon applied successfully!`);
        setDiscountValue(res.data.value);
        setDiscountType(res.data.type as 'PERCENTAGE' | 'FIXED');
      } else {
        setStatus('error');
        setMessage(res.error?.message || 'Invalid coupon code');
      }
    } catch (err: unknown) {
      setStatus('error');
      const errorObj = err as { response?: { data?: { error?: { message?: string } } } };
      setMessage(errorObj?.response?.data?.error?.message || 'Invalid coupon code');
    }
  };

  const handleRemove = () => {
    setCode('');
    setStatus('idle');
    setMessage('');
    setDiscountValue(null);
    setDiscountType(null);
  };

  return (
    <div className="mt-8 p-4 rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Have a coupon code?</h3>
      </div>

      {status === 'success' ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-300 uppercase">
                  {code}
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  {discountType === 'PERCENTAGE'
                    ? `${discountValue}% OFF`
                    : `₹${discountValue} OFF`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={status === 'loading'}
              className="uppercase"
            />
            <Button
              onClick={handleApply}
              disabled={status === 'loading' || !code.trim()}
              variant="secondary"
            >
              {status === 'loading' ? 'Applying...' : 'Apply'}
            </Button>
          </div>
          {status === 'error' && (
            <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
              <XCircle className="w-3 h-3" />
              <span>{message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
