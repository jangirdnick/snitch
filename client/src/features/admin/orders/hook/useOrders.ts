import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../service/order.api';
import type { OrderQueryDto, UpdateOrderStatusDto, UpdateOrderTrackingDto } from '@snitch/schemas';
import type { PaginatedOrders } from '@snitch/types';
import { showToast } from '@/lib/toast';
import { AxiosError } from 'axios';

export function useOrders(initialParams?: OrderQueryDto) {
  const [data, setData] = useState<PaginatedOrders | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params?: OrderQueryDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.getAll(params);
      setData(response);
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data?.message || err.response?.data?.error
            : 'Failed to fetch orders';
      setError(errMessage);
      showToast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchOrders(initialParams);
    })();
  }, [fetchOrders, initialParams]);

  const updateOrderStatus = async (id: string, payload: UpdateOrderStatusDto) => {
    try {
      await orderService.updateStatus(id, payload);
      // Refresh the list to reflect changes
      await fetchOrders(initialParams);
      showToast.success('Order status updated successfully');
      return true;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data?.message || err.response?.data?.error
            : 'Failed to update order status';
      setError(errMessage);
      showToast.error(errMessage);
      return false;
    }
  };

  const updateOrderTracking = async (id: string, payload: UpdateOrderTrackingDto) => {
    try {
      await orderService.updateTracking(id, payload);
      // Refresh the list to reflect changes
      await fetchOrders(initialParams);
      showToast.success('Order tracking updated successfully');
      return true;
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : err instanceof AxiosError
            ? err.response?.data?.message || err.response?.data?.error
            : 'Failed to update order tracking';
      setError(errMessage);
      showToast.error(errMessage);
      return false;
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchOrders(initialParams),
    updateOrderStatus,
    updateOrderTracking,
  };
}
