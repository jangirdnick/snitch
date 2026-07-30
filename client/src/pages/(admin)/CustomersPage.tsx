import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CustomersTableSection } from '@/features/admin/customers/components/CustomersTableSection';
import { fetchCustomers } from '@/features/admin/customers/service/customers.api';
import type { PaginatedUsers } from '@snitch/types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function CustomersPage() {
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchCustomers({
        page,
        limit: 10,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      setData(result);
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data?.message
            : 'Failed to load customers';
      toast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void (async () => {
      await loadCustomers();
    })();
  }, [loadCustomers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <PageHeader title="Customers" description="Manage your platform users and their access.">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[oklch(0.42_0_0)]" />
          <Input
            placeholder="Search name or email..."
            className="pl-9 bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] placeholder:text-[oklch(0.42_0_0)] focus-visible:ring-1 focus-visible:ring-[oklch(0.95_0_0)] h-9 text-sm w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </PageHeader>

      <CustomersTableSection
        items={data?.items || []}
        loading={isLoading}
        currentPage={data?.pagination.currentPage || 1}
        totalPages={data?.pagination.totalPages || 0}
        hasNextPage={data?.pagination.hasNextPage || false}
        hasPreviousPage={data?.pagination.hasPreviousPage || false}
        onPageChange={handlePageChange}
        onUpdate={loadCustomers}
      />
    </div>
  );
}
