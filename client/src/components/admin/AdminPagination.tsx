import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const linkClass =
    'cursor-pointer text-[oklch(0.85_0_0)]/50 hover:bg-[oklch(1_0_0_/_0.06)] hover:text-[oklch(0.95_0_0)] border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.03)] h-11 md:h-9 min-w-[44px] md:min-w-[36px] px-3';
  const activeClass =
    'cursor-pointer bg-[oklch(0.95_0_0)] text-[oklch(0.85_0_0)] hover:bg-white hover:text-[oklch(0.1_0_0)] border-transparent h-11 md:h-9 min-w-[44px] md:min-w-[36px] px-3';
  const disabledClass =
    'pointer-events-none opacity-40 text-[oklch(0.85_0_0)] bg-[oklch(1_0_0_/_0.02)] border-[oklch(1_0_0_/_0.04)] h-11 md:h-9 min-w-[44px] md:min-w-[36px] px-3';

  return (
    <Pagination className="justify-center md:justify-end">
      <PaginationContent className="gap-1.5 flex-wrap justify-center md:justify-end">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={!hasPreviousPage ? disabledClass : linkClass}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-[oklch(0.6_0_0)]" />
              </PaginationItem>
            );
          }

          const pageNum = page as number;
          const isActive = currentPage === pageNum;

          return (
            <PaginationItem key={`page-${pageNum}`}>
              <PaginationLink
                href="#"
                isActive={isActive}
                onClick={(e) => handlePageClick(e, pageNum)}
                className={isActive ? activeClass : linkClass}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={!hasNextPage ? disabledClass : linkClass}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
