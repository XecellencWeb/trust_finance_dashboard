import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function usePaginationQuery(defaultLimit: number = 10) {
  const [params, setParams] = useSearchParams();

  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || String(defaultLimit), 10);

  const setPage = (newPage: number) => {
    const next = Math.max(newPage, 1);
    params.set("page", String(next));
    params.set("limit", String(limit));
    setParams(params, { replace: true });
  };

  const setLimit = (newLimit: number) => {
    params.set("limit", String(newLimit));
    params.set("page", "1"); // reset to first page
    setParams(params, { replace: true });
  };

  return { page, limit, setPage, setLimit };
}

function getPaginationRange(
  current: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] {
  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  range.push(1); // always show first

  if (left > 2) {
    range.push("…"); // gap before current window
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push("…"); // gap after current window
  }

  if (totalPages > 1) {
    range.push(totalPages); // always show last
  }

  return range;
}

type PaginationControlProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function PaginationControl({
  page,
  total,
  limit,
  onPageChange,
}: PaginationControlProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pages = getPaginationRange(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          typeof p === "string" ? (
            <PaginationItem key={idx}>
              <span className="px-3 py-1 text-sm text-muted-foreground">…</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
