import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-2">
      <div className="w-full h-1/2 space-y-4">
        <div className="w-full h-16 bg-sidebar/60 flex items-center justify-between p-2 rounded-md">
          <h1 className="text-lg font-semibold tracking-tight">Product Inventory</h1>

          <Button
            id="create-product-btn"
            onClick={() => navigate('/admin/inventory/create')}
            className="text-[12px] font-semibold bg-orange-400 hover:bg-orange-600/80"
          >
            Create Product
          </Button>
        </div>

        <div className="w-full h-[82%] bg-secondary-foreground/10 rounded-md"></div>
      </div>

      <div className="w-full h-1/2 bg-secondary-foreground/10 rounded-md"></div>
    </div>
  );
}
