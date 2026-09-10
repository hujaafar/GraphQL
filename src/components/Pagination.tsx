"use client";
import { ArrowRight } from "lucide-react";

export function Pagination({
  count,
  page,
  size,
  onPage,
  noun,
}: {
  count: number;
  page: number;
  size: number;
  onPage: (page: number) => void;
  noun: string;
}) {
  return (
    <nav className="pagination" aria-label={`${noun} pagination`}>
      <span role="status" aria-atomic="true">
        {count ? `${page * size + 1}–${Math.min(count, (page + 1) * size)} of ${count}` : "0"}{" "}
        {noun}
      </span>
      <div>
        <button
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          aria-label={`Previous ${noun} page`}
        >
          Previous
        </button>
        <button
          disabled={(page + 1) * size >= count}
          onClick={() => onPage(page + 1)}
          aria-label={`Next ${noun} page`}
        >
          Next <ArrowRight size={14} />
        </button>
      </div>
    </nav>
  );
}
