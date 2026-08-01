import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@snitch/types';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PackageOpen } from 'lucide-react';

interface Props {
  products: Product[];
}

export function LowStockProductsWidget({ products }: Props) {
  return (
    <Card className="col-span-1 lg:col-span-2 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products nearing out of stock status</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/inventory">View Inventory</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <PackageOpen className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No low stock items</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-muted overflow-hidden flex-shrink-0">
                        {product.colors?.[0]?.images?.[0]?.url ? (
                          <img
                            src={product.colors[0].images[0].url}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span
                        className="font-medium text-sm truncate max-w-[120px]"
                        title={product.title}
                      >
                        {product.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={product.totalStock === 0 ? 'destructive' : 'secondary'}
                      className={
                        product.totalStock > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 hover:bg-amber-100'
                          : ''
                      }
                    >
                      {product.totalStock} left
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
