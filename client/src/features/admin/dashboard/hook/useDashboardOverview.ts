import { useState, useEffect } from 'react';
import type { DashboardOverviewResponse } from '@snitch/types';
import { fetchDashboardOverview } from '../service/dashboard.api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchDashboardOverview();
        if (isMounted) {
          Promise.resolve().then(() => setData(result));
        }
      } catch (err: unknown) {
        const errMessage =
          err instanceof Error
            ? err.message
            : err instanceof AxiosError
              ? err.response?.data.error || err.response?.data.message
              : 'Failed to load dashboard overview';
        if (isMounted) {
          setError(errMessage);
          toast.error(errMessage);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
