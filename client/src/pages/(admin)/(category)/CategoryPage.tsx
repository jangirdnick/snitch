import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCategoryList } from '@/features/admin/category/hook/useCategoryList';
import { CategoryHeader } from '@/features/admin/category/components/CategoryHeader';
import { CategoryTableSection } from '@/features/admin/category/components/CategoryTableSection';
import { showToast } from '@/lib/toast';
import { categoryService } from '@/features/admin/category/service/category.api';
import type { Category } from '@/features/admin/category/service/category.api';
import { AxiosError } from 'axios';

export default function CategoryPage() {
  const navigate = useNavigate();
  const {
    categories,
    loading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    fetchCategories,
  } = useCategoryList();

  const handleCreateClick = useCallback(() => {
    navigate('/admin/categories/create');
  }, [navigate]);

  const handleEditClick = useCallback(
    (category: Category) => {
      navigate(`/admin/categories/edit/${category._id}`);
    },
    [navigate],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      try {
        await categoryService.delete(id);
        showToast.success('Category deleted successfully');
        fetchCategories();
        return true;
      } catch (error) {
        const errMessage =
          error instanceof Error
            ? error.message
            : error instanceof AxiosError
              ? error.response?.data.message
              : 'Unknown error';
        showToast.error(errMessage);
        return false;
      }
    },
    [fetchCategories],
  );

  return (
    <div className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6 h-screen bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-1 overflow-y-scroll">
      <CategoryHeader onCreateClick={handleCreateClick} />

      <CategoryTableSection
        items={categories}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={fetchCategories}
        onEdit={handleEditClick}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
