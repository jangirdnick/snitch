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
import { MoreHorizontal, Edit, Trash, FolderTree, Link2, Clock, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Category } from '../service/category.api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface CategoryTableProps {
  items: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  active: {
    label: 'Active',
    dot: 'bg-[oklch(0.70_0.15_160)] shadow-[0_0_6px_oklch(0.70_0.15_160_/_0.7)]',
    badge:
      'bg-[oklch(0.70_0.15_160_/_0.10)] text-[oklch(0.82_0.15_160)] border-[oklch(0.70_0.15_160_/_0.25)]',
  },
  inactive: {
    label: 'Inactive',
    dot: 'bg-[oklch(0.42_0_0)] shadow-[0_0_6px_oklch(0.42_0_0_/_0.4)]',
    badge: 'bg-[oklch(0.42_0_0_/_0.08)] text-[oklch(0.50_0_0)] border-[oklch(0.42_0_0_/_0.18)]',
  },
  archived: {
    label: 'Archived',
    dot: 'bg-[oklch(0.55_0_0)] shadow-[0_0_6px_oklch(0.55_0_0_/_0.6)]',
    badge: 'bg-[oklch(0.55_0_0_/_0.10)] text-[oklch(0.65_0_0)] border-[oklch(0.55_0_0_/_0.20)]',
  },
};

export function CategoryTable({ items, loading, onEdit, onDelete }: CategoryTableProps) {
  const getStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
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

  if (loading) {
    return (
      <div className="w-full h-full p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[oklch(1_0_0_/_0.055)] hover:bg-transparent">
              {Array.from({ length: 5 }).map((_, i) => (
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-4 w-24 bg-[oklch(1_0_0_/_0.05)]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-transparent">
        <div className="text-[oklch(0.55_0_0)] text-[13px] font-medium tracking-wide">
          No categories found.
        </div>
      </div>
    );
  }

  const thClass =
    'text-[oklch(0.55_0_0)] uppercase tracking-wider text-[10px] font-semibold h-10 border-b-[oklch(1_0_0_/_0.055)] px-4 whitespace-nowrap';
  const tdClass = 'py-3 px-4 text-[13px] text-[oklch(0.85_0_0)] font-medium whitespace-nowrap';
  const rowClass =
    'group transition-colors border-b-[oklch(1_0_0_/_0.055)] hover:bg-[oklch(1_0_0_/_0.04)]';

  return (
    <div className="w-full h-full bg-transparent overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-[oklch(1_0_0_/_0.055)]">
            <TableHead className={cn(thClass, 'min-w-[240px]')}>
              <div className="flex items-center gap-1.5">
                <FolderTree className="size-3.5" /> Category
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Link2 className="size-3.5" /> Slug
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Tag className="size-3.5" /> Status
              </div>
            </TableHead>
            <TableHead className={thClass}>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> Created
              </div>
            </TableHead>
            <TableHead className={cn(thClass, 'w-[80px] text-right')}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((cat) => (
            <TableRow key={cat._id} className={rowClass}>
              {/* CATEGORY INFO */}
              <TableCell className={tdClass}>
                <div className="flex items-center gap-3">
                  {cat.image?.url ? (
                    <img
                      src={cat.image.url}
                      alt={cat.image.alt || cat.name}
                      className="size-9 rounded-lg object-cover border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.03)] shrink-0"
                    />
                  ) : (
                    <div className="size-9 rounded-lg bg-[oklch(1_0_0_/_0.04)] border border-[oklch(1_0_0_/_0.08)] flex items-center justify-center text-[oklch(0.45_0_0)] shrink-0">
                      <FolderTree className="size-4" />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 max-w-[280px]">
                    <span className="font-semibold text-[oklch(0.95_0_0)] truncate text-[13.5px]">
                      {cat.name}
                    </span>
                    {cat.description ? (
                      <span
                        className="text-[11.5px] text-[oklch(0.6_0_0)] truncate"
                        title={cat.description}
                      >
                        {cat.description}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[oklch(0.5_0_0)] truncate">
                        ID: {cat._id}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* SLUG */}
              <TableCell className={tdClass}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[oklch(1_0_0_/_0.04)] border border-[oklch(1_0_0_/_0.08)]">
                  <span className="text-[oklch(0.55_0_0)] text-[10px]">/</span>
                  <span className="text-[oklch(0.85_0_0)] font-mono text-[11.5px] tracking-tight">
                    {cat.slug}
                  </span>
                </div>
              </TableCell>

              {/* STATUS */}
              <TableCell className="px-4 py-3">{getStatusBadge(cat.status)}</TableCell>

              {/* CREATED AT */}
              <TableCell className={tdClass}>
                <span className="text-[oklch(0.65_0_0)] text-[12px]">
                  {dayjs(cat.createdAt).fromNow(true)}
                </span>
              </TableCell>

              {/* ACTIONS */}
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
                    className="bg-[oklch(0.13_0.005_260)] border-[oklch(1_0_0_/_0.08)] text-[oklch(0.95_0_0)] shadow-[0_8px_32px_oklch(0_0_0_/_0.6)] rounded-xl min-w-[160px] w-full"
                  >
                    <DropdownMenuLabel className="text-[10px] uppercase text-[oklch(0.55_0_0)] font-bold tracking-wider">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onEdit(cat)}
                      className="cursor-pointer focus:bg-[oklch(1_0_0_/_0.06)] focus:text-[oklch(0.95_0_0)] rounded-lg mx-1 my-0.5 min-h-[32px]"
                    >
                      <Edit className="mr-2 h-4 w-4 text-[oklch(0.6_0_0)]" /> Edit Category
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(cat)}
                      className="cursor-pointer text-[oklch(0.65_0.20_22)] focus:bg-[oklch(0.65_0.20_22_/_0.15)] focus:text-[oklch(0.75_0.20_22)] rounded-lg mx-1 my-0.5 min-h-[32px]"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
