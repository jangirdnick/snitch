import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  ImageIcon,
  Hash,
  Tag,
  Folder,
  Palette,
  DollarSign,
  AlertTriangle,
  Calendar,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Product } from '@snitch/types';
import type { Category } from '../types/inventory';

interface InventoryTableProps {
  items: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; badge: string }> = {
  draft: {
    label: 'Draft',
    dot: 'bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]',
    text: 'text-[oklch(0.65_0_0)]',
    badge: 'bg-[oklch(0.55_0_0_/_0.10)] text-[oklch(0.65_0_0)] border-[oklch(0.55_0_0_/_0.20)]',
  },
  active: {
    label: 'Active',
    dot: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
    text: 'text-[oklch(0.82_0.15_160)]',
    badge:
      'bg-[oklch(0.70_0.15_160_/_0.10)] text-[oklch(0.82_0.15_160)] border-[oklch(0.70_0.15_160_/_0.25)]',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]',
    text: 'text-[oklch(0.50_0_0)]',
    badge: 'bg-[oklch(0.42_0_0_/_0.08)] text-[oklch(0.50_0_0)] border-[oklch(0.42_0_0_/_0.18)]',
  },
  out_of_stock: {
    label: 'Out of Stock',
    dot: 'bg-[oklch(0.65_0.20_22)] shadow-[0_0_6px_oklch(0.65_0.20_22_/_0.6)]',
    text: 'text-[oklch(0.75_0.20_22)]',
    badge:
      'bg-[oklch(0.65_0.20_22_/_0.10)] text-[oklch(0.75_0.20_22)] border-[oklch(0.65_0.20_22_/_0.25)]',
  },
};

const formatDate = (dateString?: Date | string | undefined) => {
  if (!dateString) return '-';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return '-';
  }
};

const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

export function InventoryTable({ items, loading, onEdit, onView, onDelete }: InventoryTableProps) {
  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10.5px] font-semibold tracking-wide whitespace-nowrap',
          cfg.badge,
        )}
      >
        <span className={cn('size-1.5 rounded-full shrink-0', cfg.dot)} />
        {cfg.label}
      </span>
    );
  };

  const getPrimaryImage = (product: Product) => {
    if (!product.colors || product.colors.length === 0) return null;
    const defaultColor = product.colors.find((c) => c.isDefault) || product.colors[0];
    if (!defaultColor || !defaultColor.images || defaultColor.images.length === 0) return null;
    const primaryImg = defaultColor.images.find((img) => img.isPrimary) || defaultColor.images[0];
    return primaryImg.url;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-transparent">
        <div className="hidden md:block w-full h-full p-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent">
                {Array.from({ length: 14 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20 bg-[oklch(1_0_0_/_0.05)]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent"
                >
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-md bg-[oklch(1_0_0_/_0.05)]" />
                  </TableCell>
                  {Array.from({ length: 13 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-24 bg-[oklch(1_0_0_/_0.05)]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden flex flex-col gap-4 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[240px] w-full rounded-2xl bg-[oklch(1_0_0_/_0.03)]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-transparent">
        <div className="text-[oklch(0.55_0_0)] text-[13px] font-medium tracking-wide">
          No products found.
        </div>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.03)]';

  return (
    <>
      <div className="hidden md:block w-full h-full bg-transparent overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0_/_0.055)]">
              <TableHead className={cn(thClass, 'w-[60px]')}>Image</TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Hash className="size-3.5" /> ID
                </div>
              </TableHead>
              <TableHead className={cn(thClass, 'min-w-[200px]')}>Title</TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="size-3.5" /> Slug
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Tag className="size-3.5" /> SKU
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Folder className="size-3.5" /> Category
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Palette className="size-3.5" /> Variants
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="size-3.5" /> Price
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" /> Low Stock
                </div>
              </TableHead>
              <TableHead className={thClass}>Status</TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> Published
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Created
                </div>
              </TableHead>
              <TableHead className={thClass}>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Updated
                </div>
              </TableHead>
              <TableHead className={cn(thClass, 'w-[80px] text-right')}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((product) => {
              const imgUrl = getPrimaryImage(product);
              const idToUse = product._id;
              let categoryName = 'Unknown';
              if (Array.isArray(product.category)) {
                categoryName = (product.category as Array<Category | string>)
                  .map((c) => {
                    if (c == null) return '';
                    return typeof c === 'object' && c !== null && 'name' in c && c.name
                      ? String(c.name)
                      : String(c);
                  })
                  .join(', ');
              } else if (typeof product.category === 'object' && product.category !== null) {
                categoryName = (product.category as Category).name || 'Unknown';
              } else if (product.category) {
                categoryName = String(product.category);
              }

              return (
                <TableRow key={idToUse} className={rowClass}>
                  <TableCell className="px-4 py-2">
                    {imgUrl ? (
                      <div className="h-10 w-10 rounded-md border border-[oklch(1_0_0_/_0.1)] overflow-hidden bg-[oklch(1_0_0_/_0.02)] shrink-0">
                        <img
                          src={imgUrl}
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center shrink-0">
                        <ImageIcon className="text-[oklch(0.4_0_0)] size-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={tdClass}>
                    <span
                      className="text-[oklch(0.6_0_0)] font-mono text-[11px] truncate max-w-[100px] block"
                      title={idToUse}
                    >
                      {idToUse}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 min-w-[200px]">
                    <div
                      className="truncate max-w-[250px] font-medium text-[oklch(0.95_0_0)]"
                      title={product.title}
                    >
                      {product.title}
                    </div>
                  </TableCell>
                  <TableCell className={tdClass}>
                    <span className="text-[oklch(0.7_0_0)] text-[12px]">{product.slug || '-'}</span>
                  </TableCell>
                  <TableCell className={tdClass}>
                    <span className="text-[oklch(0.6_0_0)] font-mono text-[11px]">
                      {product.sku}
                    </span>
                  </TableCell>
                  <TableCell className={tdClass}>{categoryName}</TableCell>
                  <TableCell className={tdClass}>{product.colors?.length || 0}</TableCell>
                  <TableCell className={tdClass}>
                    {formatPrice(product.price?.amount || 0, product.price?.currency || 'INR')}
                  </TableCell>
                  <TableCell className={tdClass}>{product.lowStockThreshold ?? '-'}</TableCell>
                  <TableCell className="px-4 py-3">{getStatusBadge(product.status)}</TableCell>
                  <TableCell className={tdClass}>
                    <span className="text-[oklch(0.65_0_0)]">
                      {formatDate(product.publishedAt)}
                    </span>
                  </TableCell>
                  <TableCell className={tdClass}>
                    <span className="text-[oklch(0.65_0_0)]">{formatDate(product.createdAt)}</span>
                  </TableCell>
                  <TableCell className={tdClass}>
                    <span className="text-[oklch(0.65_0_0)]">
                      {formatDate(product.updatedAt || product.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-[oklch(1_0_0_/_0.08)] text-[oklch(0.7_0_0)]"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] shadow-[0_8px_32px_oklch(0_0_0_/_0.6)] rounded-xl min-w-[160px]"
                      >
                        <DropdownMenuLabel className="text-[10px] uppercase text-[oklch(0.55_0_0)] font-bold tracking-wider">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onView(product)}
                          className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[40px] md:min-h-[32px]"
                        >
                          <Eye className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(product)}
                          className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[40px] md:min-h-[32px]"
                        >
                          <Edit className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(product)}
                          className="cursor-pointer text-[oklch(0.65_0.20_22)] focus:bg-[oklch(0.65_0.20_22_/_0.15)] focus:text-[oklch(0.75_0.20_22)] rounded-lg mx-1 my-0.5 min-h-[40px] md:min-h-[32px]"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden flex flex-col md:p-4 gap-4">
        {items.map((product) => {
          const imgUrl = getPrimaryImage(product);
          let categoryName = 'Unknown';
          if (Array.isArray(product.category)) {
            categoryName = (product.category as Array<Category | string>)
              .map((c) => {
                if (c == null) return '';
                return typeof c === 'object' && c !== null && 'name' in c && c.name
                  ? String(c.name)
                  : String(c);
              })
              .join(', ');
          } else if (typeof product.category === 'object' && product.category !== null) {
            categoryName = (product.category as Category).name || 'Unknown';
          } else if (product.category) {
            categoryName = String(product.category);
          }

          return (
            <div
              key={product._id}
              className="relative rounded-2xl bg-[oklch(1_0_0_/_0.02)] border border-[oklch(1_0_0_/_0.05)] p-4 flex flex-col gap-3 shadow-[0_2px_12px_oklch(0_0_0_/_0.2)]"
            >
              {/* Header: Image, Title, Dropdown */}
              <div className="flex gap-3 items-start">
                {imgUrl ? (
                  <div className="h-16 w-16 rounded-xl border border-[oklch(1_0_0_/_0.1)] overflow-hidden bg-[oklch(1_0_0_/_0.02)] shrink-0">
                    <img src={imgUrl} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center shrink-0">
                    <ImageIcon className="text-[oklch(0.4_0_0)] size-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0 pr-8">
                  <div className="truncate max-w-[200px] font-semibold text-[14px] text-[oklch(0.95_0_0)]">
                    {product.title}
                  </div>
                  <div className="text-[oklch(0.6_0_0)] font-mono text-[11px] mt-0.5">
                    {product.sku}
                  </div>
                  <div className="mt-2">{getStatusBadge(product.status)}</div>
                </div>

                <div className="absolute top-3 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 p-0 text-[oklch(0.7_0_0)]">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] rounded-xl min-w-[180px]"
                    >
                      <DropdownMenuItem
                        onClick={() => onView(product)}
                        className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[44px]"
                      >
                        <Eye className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(product)}
                        className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[44px]"
                      >
                        <Edit className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" /> Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="cursor-pointer text-[oklch(0.65_0.20_22)] focus:bg-[oklch(0.65_0.20_22_/_0.15)] focus:text-[oklch(0.75_0.20_22)] rounded-lg mx-1 my-0.5 min-h-[44px]"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 mt-1 pt-3 border-t border-[oklch(1_0_0_/_0.05)] text-[12px]">
                <div>
                  <span className="text-[oklch(0.45_0_0)] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Price
                  </span>
                  <span className="text-[oklch(0.95_0_0)] font-medium">
                    {formatPrice(product.price?.amount || 0, product.price?.currency || 'INR')}
                  </span>
                </div>
                <div>
                  <span className="text-[oklch(0.45_0_0)] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Category
                  </span>
                  <span className="text-[oklch(0.85_0_0)]">{categoryName}</span>
                </div>
                <div>
                  <span className="text-[oklch(0.45_0_0)] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Variants
                  </span>
                  <span className="text-[oklch(0.85_0_0)]">
                    {product.colors?.length || 0} Colors
                  </span>
                </div>
                <div>
                  <span className="text-[oklch(0.45_0_0)] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Updated
                  </span>
                  <span className="text-[oklch(0.65_0_0)]">
                    {formatDate(product.updatedAt || product.createdAt)}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  className="flex-1 h-[44px] bg-[oklch(1_0_0_/_0.05)] text-[oklch(0.8_0_0)] hover:bg-[oklch(1_0_0_/_0.1)] border-none"
                  onClick={() => onView(product)}
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 h-[44px] bg-[oklch(1_0_0_/_0.05)] text-[oklch(0.8_0_0)] hover:bg-[oklch(1_0_0_/_0.1)] border-none"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
