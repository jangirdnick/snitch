import { useState, useEffect } from 'react';
import { fetchDashboardAnalytics, fetchRecentDeliveredOrders } from '../service/analytics.api';
import type { AnalyticsDashboardResponse, PaginatedOrders } from '@snitch/types';
import { showToast } from '@/lib/toast';

export function useDashboardAnalytics() {
  const [data, setData] = useState<AnalyticsDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const result = await fetchDashboardAnalytics();
        if (isMounted) setData(result);
      } catch {
        if (isMounted) {
          showToast.error('Failed to load dashboard data');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Defer state update to avoid synchronous setState inside effect
    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
      load();
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}

export function useRecentDeliveredOrders() {
  const [data, setData] = useState<PaginatedOrders | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    let isMounted = true;

    const loadPage = async (currentPage: number) => {
      try {
        const result = await fetchRecentDeliveredOrders(currentPage, limit);
        if (isMounted) setData(result);
      } catch {
        if (isMounted) showToast.error('Failed to load recent orders');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
      loadPage(page);
    });

    return () => {
      isMounted = false;
    };
  }, [page]);

  return { data, isLoading, page, setPage };
}
