import { useEffect, useCallback } from 'react';
import { useForm, type Resolver, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Coupon } from '@snitch/types';
import { createCoupon, updateCoupon } from '../service/coupons.api';
import { showToast } from '@/lib/toast';
import { setFormErrors } from '@/utils/form-errors.util';
import {
  couponFormSchema,
  getDefaultCouponValues,
  toLocalISOString,
  type CouponFormValues,
} from '../schema/coupon.form.schema';
import { AxiosError } from 'axios';

interface UseCouponFormProps {
  open: boolean;
  coupon: Coupon | null;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

interface UseCouponFormReturn {
  form: UseFormReturn<CouponFormValues>;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  isEditing: boolean;
  handleCancel: () => void;
}

export function useCouponForm({
  open,
  coupon,
  onSuccess,
  onOpenChange,
}: UseCouponFormProps): UseCouponFormReturn {
  const isEditing = !!coupon;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema) as Resolver<CouponFormValues>,
    defaultValues: getDefaultCouponValues() as CouponFormValues,
  });

  useEffect(() => {
    if (open) {
      if (coupon) {
        form.reset({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrder: coupon.minOrder ?? undefined,
          maxDiscount: coupon.maxDiscount ?? undefined,
          validFrom: toLocalISOString(new Date(coupon.validFrom)),
          validUntil: toLocalISOString(new Date(coupon.validUntil)),
          usageLimit: coupon.usageLimit ?? undefined,
          isActive: coupon.isActive,
          productsString: (coupon.applicableProducts || []).join(', '),
        });
      } else {
        form.reset(getDefaultCouponValues());
      }
    } else {
      form.clearErrors();
    }
  }, [open, coupon, form]);

  const onSubmit = useCallback(
    async (values: CouponFormValues) => {
      try {
        const payload = {
          code: values.code,
          type: values.type,
          value: values.value,
          isActive: values.isActive,
          validFrom: new Date(values.validFrom).toISOString(),
          validUntil: new Date(values.validUntil).toISOString(),
          applicableProducts: values.productsString
            ? values.productsString
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          minOrder: values.minOrder ?? undefined,
          maxDiscount: values.maxDiscount ?? undefined,
          usageLimit: values.usageLimit ?? undefined,
        };

        const res =
          isEditing && coupon
            ? await updateCoupon(
                coupon.id,
                payload as unknown as Parameters<typeof updateCoupon>[1],
              )
            : await createCoupon(payload as unknown as Parameters<typeof createCoupon>[0]);

        if (res.success) {
          showToast.success(`Coupon ${isEditing ? 'updated' : 'created'} successfully!`);
          onSuccess();
          onOpenChange(false);
        } else {
          showToast.error(res.error?.message || 'Failed to save coupon');
          // if (res.error?.fields) {
          //   setFormErrors(res.error.fields as Record<string, string>, form.setError);
          // }
        }
      } catch (err: unknown) {
        const error =
          err instanceof Error
            ? err.message
            : err instanceof AxiosError
              ? err.response?.data.error.message
              : 'An error occurred';
        showToast.error(error);
        if (err instanceof AxiosError && err.response?.data?.error?.fields) {
          setFormErrors(err.response.data.error.fields, form.setError);
        }
      }
    },
    [isEditing, coupon, onSuccess, onOpenChange, form.setError],
  );

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return {
    form,
    onSubmit,
    isEditing,
    handleCancel,
  };
}
