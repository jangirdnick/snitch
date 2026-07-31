import { Navigate, useParams } from 'react-router';
import { EditCategoryForm } from '@/features/admin/category/components/EditCategoryForm';

export default function EditCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId?.trim()) {
    return <Navigate to="/admin/categories" replace />;
  }

  return (
    <div className="flex flex-col gap-2 lg:gap-4 h-full bg-[oklch(0.08_0.005_260)] selection:bg-[oklch(0.95_0_0)] selection:text-[oklch(0.1_0_0)]">
      <EditCategoryForm categoryId={categoryId} />
    </div>
  );
}
